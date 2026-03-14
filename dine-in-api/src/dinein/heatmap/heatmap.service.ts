import { Injectable } from '@nestjs/common';
import { TablesRepository } from '../tables/tables.repository';
import { TableStatus } from '../tables/schemas/dinein-table.schema';

@Injectable()
export class HeatmapService {
  constructor(private readonly tablesRepo: TablesRepository) {}

  async getHeatmap() {
    const total = await this.tablesRepo.countAll();
    const occupied = await this.tablesRepo.countByStatus(TableStatus.OCCUPIED);
    
    const rate = total === 0 ? 0 : occupied / total;
    let level: 'LOW' | 'MEDIUM' | 'HIGH';

    if (rate < 0.4) {
      level = 'LOW';
    } else if (rate < 0.7) {
      level = 'MEDIUM';
    } else {
      level = 'HIGH';
    }

    return {
      level,
      occupancyRate: Math.round(rate * 100),
    };
  }
}
