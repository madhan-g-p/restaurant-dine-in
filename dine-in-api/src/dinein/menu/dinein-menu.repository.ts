import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DineInMenuCategory } from './schemas/dinein-menu-category.schema';
import { DineInMenuItem } from './schemas/dinein-menu-item.schema';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/menu.dto';

@Injectable()
export class DineInMenuRepository {
  constructor(
    @InjectModel(DineInMenuCategory.name)
    private readonly categoryModel: Model<DineInMenuCategory>,
    @InjectModel(DineInMenuItem.name)
    private readonly itemModel: Model<DineInMenuItem>,
  ) {}

  // ── Categories ────────────────────────────────────────────────
  findAllCategories(activeOnly = false): Promise<DineInMenuCategory[]> {
    const filter = activeOnly ? { isActive: true } : {};
    return this.categoryModel.find(filter).sort({ displayOrder: 1, name: 1 }).exec();
  }

  async findCategoryById(id: string): Promise<DineInMenuCategory> {
    const cat = await this.categoryModel.findById(id).exec();
    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    return cat;
  }

  createCategory(dto: CreateCategoryDto): Promise<DineInMenuCategory> {
    return this.categoryModel.create(dto);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<DineInMenuCategory> {
    const cat = await this.categoryModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
    if (!cat) throw new NotFoundException(`Category ${id} not found`);
    return cat;
  }

  async deleteCategory(id: string): Promise<void> {
    const res = await this.categoryModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Category ${id} not found`);
  }

  // ── Items ─────────────────────────────────────────────────────
  findItemsByCategoryId(categoryId: string, availableOnly = false): Promise<DineInMenuItem[]> {
    const filter: any = { categoryId: new Types.ObjectId(categoryId) };
    if (availableOnly) filter.isAvailable = true;
    return this.itemModel.find(filter).exec();
  }

  async findItemById(id: string): Promise<DineInMenuItem> {
    const item = await this.itemModel.findById(id).exec();
    if (!item) throw new NotFoundException(`Menu item ${id} not found`);
    return item;
  }

  createItem(dto: CreateMenuItemDto): Promise<DineInMenuItem> {
    return this.itemModel.create({
      ...dto,
      categoryId: new Types.ObjectId(dto.categoryId),
    });
  }

  async updateItem(id: string, dto: UpdateMenuItemDto): Promise<DineInMenuItem> {
    const update: any = { ...dto };
    if (dto.categoryId) update.categoryId = new Types.ObjectId(dto.categoryId);
    const item = await this.itemModel
      .findByIdAndUpdate(id, update, { new: true, runValidators: true })
      .exec();
    if (!item) throw new NotFoundException(`Menu item ${id} not found`);
    return item;
  }

  async deleteItem(id: string): Promise<void> {
    const res = await this.itemModel.findByIdAndDelete(id).exec();
    if (!res) throw new NotFoundException(`Menu item ${id} not found`);
  }

  countCategories(): Promise<number> {
    return this.categoryModel.countDocuments().exec();
  }
}
