import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  Req,
  Sse,
  MessageEvent,
} from '@nestjs/common';
import { Observable, from, of, concat } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Orders')
@ApiBearerAuth()
@Controller('order')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({ summary: 'Place a new order' })
  async create(@Body() createOrderDto: CreateOrderDto, @Req() req) {
    return this.ordersService.create(createOrderDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get user order history (Paginated)' })
  async findAll(
    @Req() req,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.ordersService.findAll(
      req.user.userId,
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order details' })
  async findOne(@Param('id') id: string, @Req() req) {
    return this.ordersService.findOne(id, req.user.userId);
  }

  @Get(':id/status')
  @ApiOperation({ summary: 'Get order status' })
  async getStatus(@Param('id') id: string, @Req() req) {
    const order = await this.ordersService.findOne(id, req.user.userId);
    return {
      orderId: order._id,
      status: order.status,
    };
  }

  @Sse(':id/status/stream')
  @ApiOperation({ summary: 'Stream order status updates (SSE)' })
  streamStatus(@Param('id') id: string, @Req() req): Observable<MessageEvent> {
    const userId = req.user.userId;

    return from(this.ordersService.findOne(id, userId)).pipe(
      switchMap((order) => {
        // 1. Initial status event
        const initialEvent: MessageEvent = {
          data: {
            orderId: order._id.toString(),
            status: order.status,
            id: order.id,
            totalAmount: order.totalAmount,
            items: order.items,
            deliveryDetails: order.deliveryDetails,
            estimatedDelivery: order.estimatedDelivery,
            createdAt: order.createdAt,
          },
        };

        // 2. If already delivered, we might just want to send the initial and complete
        // But for consistency, we'll keep the stream open
        return concat(
          of(initialEvent),
          this.ordersService.getStatusUpdates().pipe(
            filter((update) => update.orderId === order._id.toString()),
            map((update) => ({
              data: {
                orderId: update.orderId,
                status: update.status,
              },
            })),
          ),
        );
      }),
    );
  }
}
