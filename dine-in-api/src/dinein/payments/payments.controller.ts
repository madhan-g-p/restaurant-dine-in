import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto } from './dto/payment.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('DineIn - Payments')
@Controller('dinein/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Get(':orderId/bill')
  @ApiOperation({ summary: 'Get itemized bill for an order' })
  async getBill(@Param('orderId') orderId: string) {
    return this.paymentsService.getBill(orderId);
  }

  @Public()
  @Post('pay')
  @ApiOperation({ summary: 'Initiate payment (PhonePe stub)' })
  async pay(@Body() dto: InitiatePaymentDto) {
    return this.paymentsService.initiatePhonePePay(dto.orderId, dto.amount);
  }
}

@ApiTags('Admin - Payments')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/payments')
export class AdminPaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Patch(':orderId/verify')
  @ApiOperation({ summary: 'Mark an order as PAID manually' })
  async verify(@Param('orderId') orderId: string) {
    return this.paymentsService.verifyPaymentManually(orderId);
  }
}
