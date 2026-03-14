import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DineInTable, DineInTableSchema } from './schemas/dinein-table.schema';
import { TablesRepository } from './tables.repository';
import { TablesService } from './tables.service';
import { TablesController } from './tables.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DineInTable.name, schema: DineInTableSchema },
    ]),
  ],
  providers: [TablesRepository, TablesService],
  controllers: [TablesController],
  exports: [TablesRepository, TablesService], // exported so Heatmap & Orders can use TablesRepository
})
export class DineInTablesModule {}
