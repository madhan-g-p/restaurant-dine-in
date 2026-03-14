import {
  Body, Controller, Get, Param, Patch, Post, Req, Res,
  Sse, UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth, ApiOperation, ApiTags,
} from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { DineInOrdersService } from './dinein-orders.service';
import { PlaceOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
import { SessionsService } from '../sessions/sessions.service';

const SESSION_COOKIE = 'dinein_session_id';

// ── Guest Order Routes ────────────────────────────────────────────
@ApiTags('DineIn - Orders')
@Public()
@Controller('dinein/orders')
export class DineInOrdersGuestController {
  constructor(
    private readonly ordersService: DineInOrdersService,
    private readonly sessionsService: SessionsService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Place a new dine-in order' })
  async placeOrder(@Body() dto: PlaceOrderDto, @Req() req: Request) {
    const sessionId: string = (req.cookies as any)?.[SESSION_COOKIE];
    if (!sessionId) {
      return { error: 'No active session. Please scan table QR.' };
    }
    const session = await this.sessionsService.validateSession(sessionId);
    return this.ordersService.placeOrder(
      sessionId,
      session.tableId.toString(),
      dto.items,
    );
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Get order details' })
  getOrder(@Param('orderId') id: string) {
    return this.ordersService.getOrder(id);
  }

  @Sse(':orderId/sse')
  @ApiOperation({ summary: 'SSE stream for live order status updates' })
  streamOrderStatus(@Param('orderId') id: string) {
    return this.ordersService.streamOrderStatus(id);
  }
}

// ── Admin Order Routes ────────────────────────────────────────────
@ApiTags('Admin - Orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/orders')
export class DineInOrdersAdminController {
  constructor(private readonly ordersService: DineInOrdersService) {}

  @Get()
  @ApiOperation({ summary: 'List all active orders (with table info)' })
  getAllActive() {
    return this.ordersService.getAllActiveOrders();
  }

  @Get('table/:tableId')
  @ApiOperation({ summary: 'Get active order for a specific table' })
  getByTable(@Param('tableId') tableId: string) {
    return this.ordersService.getActiveOrderForTable(tableId);
  }

  @Patch(':orderId/status')
  @ApiOperation({ summary: 'Update order status (PREPARING | READY | COMPLETED | CANCELLED)' })
  updateStatus(
    @Param('orderId') id: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(id, dto.status);
  }
}
