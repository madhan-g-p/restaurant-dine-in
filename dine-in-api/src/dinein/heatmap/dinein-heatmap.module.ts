import { Module } from '@nestjs/common';
import { HeatmapService } from './heatmap.service';
import { HeatmapController } from './heatmap.controller';
import { DineInTablesModule } from '../tables/dinein-tables.module';

@Module({
  imports: [DineInTablesModule],
  providers: [HeatmapService],
  controllers: [HeatmapController],
  exports: [HeatmapService],
})
export class DineInHeatmapModule {}
