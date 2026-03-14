import { Injectable, NotFoundException, ForbiddenException, Logger, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Order, OrderStatus } from './schemas/order.schema';
import { MenuItem } from '../menu/schemas/menu-item.schema';
import { CreateOrderDto } from './dto/create-order.dto';
import { Subject } from 'rxjs';
import { Types } from 'mongoose';

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name);
  private orderUpdates = new Subject<{ orderId: string; status: string }>();

  constructor(
    @InjectModel(Order.name) private orderModel: Model<Order>,
    @InjectModel(MenuItem.name) private menuItemModel: Model<MenuItem>,
  ) {}

  async create(createOrderDto: CreateOrderDto, userId: string) {
    let totalAmount = 0;
    const itemsWithDetails: {menuItem: Types.ObjectId, name: string, price: number, quantity: number}[] = [];

    for (const item of createOrderDto.items) {
      if (!Types.ObjectId.isValid(item.menuItem)) {
        throw new BadRequestException(`Invalid Menu Item ID: ${item.menuItem}`);
      }
      const menuItem = await this.menuItemModel.findById(item.menuItem).exec();
      if (!menuItem) {
        throw new NotFoundException(`Menu item ${item.menuItem} not found`);
      }
      totalAmount += menuItem.price * item.quantity;
      itemsWithDetails.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
      });
    }

    // Add fixed delivery fee from env or default
    const deliveryFee = Number(process.env.DELIVERY_FEE || 5);
    totalAmount += deliveryFee;

    const estimatedDelivery = new Date();
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + 30);
    const existingCount = await this.orderModel.countDocuments();
    const order = new this.orderModel({
      user: userId,
      items: itemsWithDetails,
      totalAmount,
      deliveryDetails: createOrderDto.deliveryDetails,
      status: OrderStatus.RECEIVED,
      estimatedDelivery,
      id: "ORD-" + (existingCount + 1).toString().padStart(3, '0'),
    });

    const savedOrder = await order.save();
    this.logger.log(`Order created: ${savedOrder._id}`);

    // Schedule status updates (not in test)
    if (process.env.NODE_ENV !== 'test') {
      this.scheduleStatusUpdates(savedOrder._id.toString());
    }
    
    return savedOrder;
  }

  private scheduleStatusUpdates(orderId: string) {
    // 10s -> Preparing
    setTimeout(async () => {
      await this.updateStatus(orderId, OrderStatus.PREPARING);
    }, 10000);

    // 20s -> Out for Delivery
    setTimeout(async () => {
      await this.updateStatus(orderId, OrderStatus.OUT_FOR_DELIVERY);
    }, 20000);

    // 30s -> Delivered
    setTimeout(async () => {
      await this.updateStatus(orderId, OrderStatus.DELIVERED);
    }, 30000);
  }

  private async updateStatus(orderId: string, status: OrderStatus) {
    const order = await this.orderModel.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    ).exec();

    if (order) {
      this.logger.log(`Order ${orderId} status updated to: ${status}`);
      this.orderUpdates.next({ orderId, status });
    }
  }

  async findAll(userId: string, page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;
    const items = await this.orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
    const total = await this.orderModel.countDocuments({ user: userId });

    return {
      items,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string, userId: string) {
    const isObjectId = Types.ObjectId.isValid(id);
    const query = isObjectId ? { _id: id } : { id: id };
    
    const order = await this.orderModel.findOne(query).populate({
      path: 'items.menuItem',
      model: 'MenuItem',
      select: 'name price image',
    }).exec();
    
    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.user.toString() !== userId) {
      throw new ForbiddenException('You do not have permission to access this order');
    }
    
    return order;
  }

  getStatusUpdates() {
    return this.orderUpdates.asObservable();
  }
}
