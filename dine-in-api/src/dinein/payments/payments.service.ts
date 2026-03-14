import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as crypto from 'crypto';
import { PaymentsRepository } from './payments.repository';
import { DineInOrdersService } from '../orders/dinein-orders.service';
import { PaymentStatus } from './schemas/payment-record.schema';
import { DineInOrderStatus } from '../orders/schemas/dinein-order.schema';

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name);

  constructor(
    private readonly paymentsRepo: PaymentsRepository,
    private readonly ordersService: DineInOrdersService,
    private readonly config: ConfigService,
  ) {}

  async getBill(orderId: string) {
    const { order, items } = await this.ordersService.getOrder(orderId);
    
    const itemized = items.map(i => ({
      name: (i.menuItemId as any).name,
      quantity: i.quantity,
      price: i.priceSnapshot,
      subtotal: i.priceSnapshot * i.quantity,
    }));

    const totalAmount = itemized.reduce((sum, i) => sum + i.subtotal, 0);
    const upiQrUrl = this.config.get<string>('RESTAURANT_UPI_QR_URL') || '';

    return {
      orderId,
      tableId: order.tableId,
      items: itemized,
      totalAmount,
      upiQrUrl,
    };
  }

  async initiatePhonePePay(orderId: string, amount: number) {
    // 1. Create/Update payment record
    let payment = await this.paymentsRepo.findByOrderId(orderId);
    if (!payment) {
      payment = await this.paymentsRepo.create(orderId, amount);
    }

    // 2. Build PhonePe payload (Stub)
    const merchantId = this.config.get<string>('PHONEPE_MERCHANT_ID');
    const secretKey = this.config.get<string>('PHONEPE_SECRET_KEY');

    if (!merchantId || !secretKey) {
      this.logger.warn('PhonePe keys missing. Falling back to manual-only mode.');
      return { 
        transactionId: (payment as any)._id.toString(), 
        status: 'PENDING_MANUAL',
        message: 'Please pay via UPI QR and inform staff.' 
      };
    }

    // Logic for actual PhonePe API call would go here
    const transactionId = `TXN_${Date.now()}`;
    await this.paymentsRepo.updateStatus((payment as any)._id.toString(), PaymentStatus.PENDING);
    // Update with txId
    // In real app: payment.transactionId = transactionId; await payment.save();

    return { 
      transactionId, 
      status: PaymentStatus.PENDING,
      redirectUrl: 'https://merchants.phonepe.com/pay/stub' 
    };
  }

  async verifyPaymentManually(orderId: string) {
    const payment = await this.paymentsRepo.findByOrderId(orderId);
    if (!payment) throw new NotFoundException('No payment record for this order');

    await this.paymentsRepo.updateStatus((payment as any)._id.toString(), PaymentStatus.PAID, true);
    
    // Mark order as COMPLETED
    await this.ordersService.updateOrderStatus(orderId, DineInOrderStatus.COMPLETED);

    this.logger.log(`Order ${orderId} verified as PAID manually.`);
    return { success: true };
  }

  validatePhonePeSignature(body: any, signature: string): boolean {
    const secretKey = this.config.get<string>('PHONEPE_SECRET_KEY');
    if (!secretKey) return false;

    const expected = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(body))
      .digest('base64');
    
    return expected === signature;
  }
}
