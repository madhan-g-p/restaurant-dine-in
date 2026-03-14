import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentRecord, PaymentRecordSchema } from './schemas/payment-record.schema';
import { PaymentsRepository } from './payments.repository';
import { PaymentsService } from './payments.service';
import { PaymentsController, AdminPaymentsController } from './payments.controller';
import { WebhookController } from './webhook.controller';
import { DineInOrdersModule } from '../orders/dinein-orders.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentRecord.name, schema: PaymentRecordSchema },
    ]),
    DineInOrdersModule, // for updating order status
  ],
  providers: [PaymentsRepository, PaymentsService],
  controllers: [PaymentsController, AdminPaymentsController, WebhookController],
  exports: [PaymentsService],
})
export class DineInPaymentsModule {}
