import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DineInTable, TableStatus } from './schemas/dinein-table.schema';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';

/**
 * All DB access for DineInTable goes through this repository.
 * Services must NOT use Mongoose models directly.
 */
@Injectable()
export class TablesRepository {
  constructor(
    @InjectModel(DineInTable.name) private readonly tableModel: Model<DineInTable>,
  ) {}

  async findAll(floorNumber?: number): Promise<DineInTable[]> {
    const filter = floorNumber ? { floorNumber } : {};
    return this.tableModel.find(filter).sort({ floorNumber: 1, tableNumber: 1 }).exec();
  }

  async findById(id: string): Promise<DineInTable> {
    const table = await this.tableModel.findById(id).exec();
    if (!table) throw new NotFoundException(`Table ${id} not found`);
    return table;
  }

  async findByTableNumber(tableNumber: string): Promise<DineInTable | null> {
    return this.tableModel.findOne({ tableNumber }).exec();
  }

  async create(dto: CreateTableDto): Promise<DineInTable> {
    return this.tableModel.create(dto);
  }

  async update(id: string, dto: UpdateTableDto): Promise<DineInTable> {
    const table = await this.tableModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!table) throw new NotFoundException(`Table ${id} not found`);
    return table;
  }

  async delete(id: string): Promise<void> {
    const result = await this.tableModel.findByIdAndDelete(id).exec();
    if (!result) throw new NotFoundException(`Table ${id} not found`);
  }

  async setStatus(id: string, status: TableStatus): Promise<DineInTable> {
    const table = await this.tableModel
      .findByIdAndUpdate(id, { status }, { new: true })
      .exec();
    if (!table) throw new NotFoundException(`Table ${id} not found`);
    return table;
  }

  async countAll(): Promise<number> {
    return this.tableModel.countDocuments({ status: { $ne: TableStatus.INACTIVE } }).exec();
  }

  async countByStatus(status: TableStatus): Promise<number> {
    return this.tableModel.countDocuments({ status }).exec();
  }
}
