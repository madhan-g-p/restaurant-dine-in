import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { PaymentRecord, PaymentStatus } from './schemas/payment-record.schema';

@Injectable()
export class PaymentsRepository {
  constructor(
    @InjectModel(PaymentRecord.name)
    private readonly paymentModel: Model<PaymentRecord>,
  ) {}

  async create(orderId: string, amount: number): Promise<PaymentRecord> {
    return this.paymentModel.create({
      orderId: new Types.ObjectId(orderId),
      amount,
    });
  }

  async findByOrderId(orderId: string): Promise<PaymentRecord | null> {
    return this.paymentModel
      .findOne({ orderId: new Types.ObjectId(orderId) })
      .exec();
  }

  async findByTransactionId(transactionId: string): Promise<PaymentRecord | null> {
    return this.paymentModel.findOne({ transactionId }).exec();
  }

  async updateStatus(
    id: string,
    status: PaymentStatus,
    verifiedByAdmin = false,
  ): Promise<PaymentRecord> {
    const payment = await this.paymentModel
      .findByIdAndUpdate(
        id,
        { status, verifiedByAdmin },
        { new: true, runValidators: true },
      )
      .exec();
    if (!payment) throw new NotFoundException(`Payment record ${id} not found`);
    return payment;
  }
}
