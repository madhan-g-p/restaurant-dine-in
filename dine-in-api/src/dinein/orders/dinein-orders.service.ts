import {
  BadRequestException, Injectable, Logger, NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Observable } from 'rxjs';
import { DineInOrder, DineInOrderStatus } from './schemas/dinein-order.schema';
import { DineInOrderItem } from './schemas/dinein-order-item.schema';
import { DineInMenuRepository } from '../menu/dinein-menu.repository';
import { TablesRepository } from '../tables/tables.repository';
import { TableStatus } from '../tables/schemas/dinein-table.schema';

export interface OrderItemInput {
  menuItemId: string;
  quantity: number;
}

export interface PopulatedOrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  priceSnapshot: number;
  status: string;
}

@Injectable()
export class DineInOrdersRepository {
  constructor(
    @InjectModel(DineInOrder.name) private readonly orderModel: Model<DineInOrder>,
    @InjectModel(DineInOrderItem.name) private readonly itemModel: Model<DineInOrderItem>,
  ) {}

  async create(tableId: string, sessionId: string): Promise<DineInOrder> {
    return this.orderModel.create({
      tableId: new Types.ObjectId(tableId),
      sessionId: new Types.ObjectId(sessionId),
    });
  }

  async findById(orderId: string): Promise<DineInOrder | null> {
    return this.orderModel.findById(orderId).exec();
  }

  async findActiveByTable(tableId: string): Promise<DineInOrder | null> {
    return this.orderModel
      .findOne({
        tableId: new Types.ObjectId(tableId),
        status: { $in: [DineInOrderStatus.ACTIVE, DineInOrderStatus.PREPARING, DineInOrderStatus.READY] },
      })
      .sort({ createdAt: -1 })
      .exec();
  }

  async findAllActive(): Promise<DineInOrder[]> {
    return this.orderModel
      .find({ status: { $in: [DineInOrderStatus.ACTIVE, DineInOrderStatus.PREPARING, DineInOrderStatus.READY] } })
      .populate('tableId', 'tableNumber floorNumber seatCount status')
      .sort({ createdAt: 1 })
      .exec();
  }

  async updateStatus(orderId: string, status: DineInOrderStatus): Promise<DineInOrder> {
    const update: any = { status };
    if ([DineInOrderStatus.COMPLETED, DineInOrderStatus.CANCELLED].includes(status)) {
      update.closedAt = new Date();
    }
    const order = await this.orderModel
      .findByIdAndUpdate(orderId, update, { new: true })
      .exec();
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    return order;
  }

  async createItems(items: DineInOrderItem[]): Promise<DineInOrderItem[]> {
    return this.itemModel.insertMany(items) as any;
  }

  async findItemsByOrderId(orderId: string): Promise<DineInOrderItem[]> {
    return this.itemModel
      .find({ orderId: new Types.ObjectId(orderId) })
      .populate('menuItemId', 'name imageUrl foodType')
      .exec();
  }
}

@Injectable()
export class DineInOrdersService {
  private readonly logger = new Logger(DineInOrdersService.name);

  constructor(
    private readonly ordersRepo: DineInOrdersRepository,
    private readonly menuRepo: DineInMenuRepository,
    private readonly tablesRepo: TablesRepository,
  ) {}

  async placeOrder(
    sessionId: string,
    tableId: string,
    items: OrderItemInput[],
  ) {
    if (!items || items.length === 0) {
      throw new BadRequestException('Order must contain at least one item');
    }

    // Create the order record
    const order = await this.ordersRepo.create(tableId, sessionId);

    // Resolve menu items and create snapshots
    const orderItems = await Promise.all(
      items.map(async (i) => {
        const menuItem = await this.menuRepo.findItemById(i.menuItemId);
        return {
          orderId: order._id,
          menuItemId: new Types.ObjectId(i.menuItemId),
          quantity: i.quantity,
          priceSnapshot: menuItem.price,
          status: 'PENDING',
        } as any;
      }),
    );

    await this.ordersRepo.createItems(orderItems);

    // Mark table as occupied
    await this.tablesRepo.setStatus(tableId, TableStatus.OCCUPIED);

    const populatedItems = await this.ordersRepo.findItemsByOrderId((order as any)._id.toString());
    this.logger.log(`Order ${(order as any)._id.toString()} placed for table ${tableId}`);
    return { order, items: populatedItems };
  }

  async getOrder(orderId: string) {
    const order = await this.ordersRepo.findById(orderId);
    if (!order) throw new NotFoundException(`Order ${orderId} not found`);
    const items = await this.ordersRepo.findItemsByOrderId(orderId);
    return { order, items };
  }

  async getActiveOrderForTable(tableId: string) {
    return this.ordersRepo.findActiveByTable(tableId);
  }

  async getAllActiveOrders() {
    const orders = await this.ordersRepo.findAllActive();
    // Attach items to each order
    return Promise.all(
      orders.map(async (o) => {
        const items = await this.ordersRepo.findItemsByOrderId((o as any)._id.toString());
        return { order: o, items };
      }),
    );
  }

  async updateOrderStatus(orderId: string, status: DineInOrderStatus) {
    const order = await this.ordersRepo.updateStatus(orderId, status);
    // Free table when order is closed
    if ([DineInOrderStatus.COMPLETED, DineInOrderStatus.CANCELLED].includes(status)) {
      await this.tablesRepo.setStatus(order.tableId.toString(), TableStatus.AVAILABLE);
      this.logger.log(`Table ${order.tableId} freed — order ${orderId} ${status}`);
    }
    return order;
  }

  /** SSE stream — polls every 3s, completes when order is terminal */
  streamOrderStatus(orderId: string): Observable<MessageEvent> {
    return new Observable((observer) => {
      let active = true;

      const poll = async () => {
        try {
          const { order, items } = await this.getOrder(orderId);
          observer.next({ data: { status: order.status, items } } as any);
          if ([DineInOrderStatus.COMPLETED, DineInOrderStatus.CANCELLED].includes(order.status)) {
            observer.complete();
            active = false;
          }
        } catch (err) {
          observer.error(err);
          active = false;
        }
      };

      // Emit immediately
      void poll();
      const timer = setInterval(() => { if (active) void poll(); }, 3000);
      return () => { active = false; clearInterval(timer); };
    });
  }
}
