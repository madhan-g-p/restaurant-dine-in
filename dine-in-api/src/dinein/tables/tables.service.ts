import { ConflictException, Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';
import { DineInTable, TableStatus } from './schemas/dinein-table.schema';
import { TablesRepository } from './tables.repository';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TablesService {
  constructor(
    private readonly tablesRepo: TablesRepository,
    private readonly config: ConfigService,
  ) {}

  async listTables(floorNumber?: number): Promise<DineInTable[]> {
    return this.tablesRepo.findAll(floorNumber);
  }

  async getTable(id: string): Promise<DineInTable> {
    return this.tablesRepo.findById(id);
  }

  async getTableByNumber(tableNumber: string): Promise<DineInTable> {
    const table = await this.tablesRepo.findByTableNumber(tableNumber);
    if (!table) throw new ConflictException(`Table '${tableNumber}' not found`);
    return table;
  }

  async createTable(dto: CreateTableDto): Promise<DineInTable> {
    const existing = await this.tablesRepo.findByTableNumber(dto.tableNumber);
    if (existing) {
      throw new ConflictException(`Table number '${dto.tableNumber}' already exists`);
    }
    return this.tablesRepo.create(dto);
  }

  async updateTable(id: string, dto: UpdateTableDto): Promise<DineInTable> {
    // If tableNumber is being changed, check uniqueness
    if (dto.tableNumber) {
      const existing = await this.tablesRepo.findByTableNumber(dto.tableNumber);
      if (existing && (existing as any)._id.toString() !== id) {
        throw new ConflictException(`Table number '${dto.tableNumber}' already exists`);
      }
    }
    return this.tablesRepo.update(id, dto);
  }

  async deleteTable(id: string): Promise<void> {
    return this.tablesRepo.delete(id);
  }

  async setTableStatus(id: string, status: TableStatus): Promise<DineInTable> {
    return this.tablesRepo.setStatus(id, status);
  }

  async generateQrBuffer(tableId: string): Promise<Buffer> {
    const table = await this.tablesRepo.findById(tableId);
    const baseUrl =
      this.config.get<string>('FRONTEND_URL') || 'http://localhost:5173';
    const url = `${baseUrl}/dinein?table=${table.tableNumber}`;
    // Returns PNG buffer
    return QRCode.toBuffer(url, { type: 'png', width: 400, margin: 2 });
  }
}
