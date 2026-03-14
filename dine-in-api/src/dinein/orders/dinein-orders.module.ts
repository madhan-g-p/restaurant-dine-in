import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DineInOrder, DineInOrderSchema } from './schemas/dinein-order.schema';
import { DineInOrderItem, DineInOrderItemSchema } from './schemas/dinein-order-item.schema';
import { DineInOrdersRepository, DineInOrdersService } from './dinein-orders.service';
import { DineInOrdersGuestController, DineInOrdersAdminController } from './dinein-orders.controller';
import { DineInMenuModule } from '../menu/dinein-menu.module';
import { DineInTablesModule } from '../tables/dinein-tables.module';
import { DineInSessionsModule } from '../sessions/dinein-sessions.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DineInOrder.name, schema: DineInOrderSchema },
      { name: DineInOrderItem.name, schema: DineInOrderItemSchema },
    ]),
    DineInMenuModule,    // for DineInMenuRepository (price snapshot)
    DineInTablesModule,  // for TablesRepository (set table OCCUPIED/AVAILABLE)
    DineInSessionsModule,// for SessionsService (session validation)
  ],
  providers: [DineInOrdersRepository, DineInOrdersService],
  controllers: [DineInOrdersGuestController, DineInOrdersAdminController],
  exports: [DineInOrdersService, DineInOrdersRepository],
})
export class DineInOrdersModule {}
