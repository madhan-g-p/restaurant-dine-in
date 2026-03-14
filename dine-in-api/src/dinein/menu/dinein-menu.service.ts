import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { DineInMenuItem } from './schemas/dinein-menu-item.schema';
import { DineInMenuCategory } from './schemas/dinein-menu-category.schema';
import { DineInMenuRepository } from './dinein-menu.repository';
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMenuItemDto,
  UpdateMenuItemDto,
} from './dto/menu.dto';
import { FoodType } from './schemas/dinein-menu-item.schema';

export interface CategoryWithItems {
  category: DineInMenuCategory;
  items: DineInMenuItem[];
}

@Injectable()
export class DineInMenuService implements OnModuleInit {
  private readonly logger = new Logger(DineInMenuService.name);

  constructor(private readonly menuRepo: DineInMenuRepository) {}

  // ── Seeder ────────────────────────────────────────────────────
  async onModuleInit() {
    const count = await this.menuRepo.countCategories();
    if (count > 0) return;

    const categories = await Promise.all([
      this.menuRepo.createCategory({ name: 'Starters', description: 'Light bites to get started', displayOrder: 1 }),
      this.menuRepo.createCategory({ name: 'Main Course', description: 'Hearty main dishes', displayOrder: 2 }),
      this.menuRepo.createCategory({ name: 'Desserts', description: 'Sweet endings', displayOrder: 3 }),
    ]);

    const [starters, main, desserts] = categories;

    const items: CreateMenuItemDto[] = [
      // Starters
      { name: 'Paneer Tikka',       description: 'Grilled cottage cheese with spices',     price: 220, categoryId: (starters as any)._id.toString(), foodType: FoodType.VEG,     imageUrl: '' },
      { name: 'Chicken 65',         description: 'Crispy spiced chicken bites',             price: 260, categoryId: (starters as any)._id.toString(), foodType: FoodType.NON_VEG, imageUrl: '' },
      { name: 'Veg Spring Rolls',   description: 'Crispy rolls with fresh vegetables',      price: 180, categoryId: (starters as any)._id.toString(), foodType: FoodType.VEGAN,   imageUrl: '' },
      // Main Course
      { name: 'Dal Makhani',        description: 'Slow-cooked black lentils in cream',     price: 240, categoryId: (main as any)._id.toString(),     foodType: FoodType.VEG,     imageUrl: '' },
      { name: 'Butter Chicken',     description: 'Tender chicken in buttery tomato gravy', price: 320, categoryId: (main as any)._id.toString(),     foodType: FoodType.NON_VEG, imageUrl: '' },
      { name: 'Tofu Stir Fry',     description: 'Wok-tossed tofu with bok choy',          price: 270, categoryId: (main as any)._id.toString(),     foodType: FoodType.VEGAN,   imageUrl: '' },
      // Desserts
      { name: 'Gulab Jamun',        description: 'Soft milk-solid dumplings in syrup',    price: 120, categoryId: (desserts as any)._id.toString(),  foodType: FoodType.VEG,     imageUrl: '' },
      { name: 'Chocolate Brownie',  description: 'Warm fudge brownie with ice cream',     price: 160, categoryId: (desserts as any)._id.toString(),  foodType: FoodType.VEG,     imageUrl: '' },
      { name: 'Fruit Sorbet',       description: 'Dairy-free mixed berry sorbet',         price: 130, categoryId: (desserts as any)._id.toString(),  foodType: FoodType.VEGAN,   imageUrl: '' },
    ];

    await Promise.all(items.map((item) => this.menuRepo.createItem(item)));
    this.logger.log('🌿 DineIn menu seeded (3 categories, 9 items)');
  }

  // ── Time window check ─────────────────────────────────────────
  private isServedNow(item: DineInMenuItem): boolean {
    if (!item.servingStartTime || !item.servingEndTime) return true;
    const now = new Date();
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const [sh, sm] = item.servingStartTime.split(':').map(Number);
    const [eh, em] = item.servingEndTime.split(':').map(Number);
    return nowMin >= sh * 60 + sm && nowMin <= eh * 60 + em;
  }

  // ── Guest API ─────────────────────────────────────────────────
  async getMenuForGuest(): Promise<CategoryWithItems[]> {
    const categories = await this.menuRepo.findAllCategories(true); // activeOnly
    return Promise.all(
      categories.map(async (cat) => {
        const all = await this.menuRepo.findItemsByCategoryId((cat as any)._id.toString(), true);
        const items = all.filter((i) => this.isServedNow(i));
        return { category: cat, items };
      }),
    );
  }

  async getCategories(): Promise<DineInMenuCategory[]> {
    return this.menuRepo.findAllCategories(true);
  }


  async getItemsByCategoryId(categoryId: string): Promise<DineInMenuItem[]> {
    return this.menuRepo.findItemsByCategoryId(categoryId, true);
  }

  async getItem(id: string): Promise<DineInMenuItem> {
    return this.menuRepo.findItemById(id);
  }

  // ── Admin API ─────────────────────────────────────────────────
  async createCategory(dto: CreateCategoryDto): Promise<DineInMenuCategory> {
    return this.menuRepo.createCategory(dto);
  }

  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<DineInMenuCategory> {
    return this.menuRepo.updateCategory(id, dto);
  }

  async deleteCategory(id: string): Promise<void> {
    return this.menuRepo.deleteCategory(id);
  }

  async createItem(dto: CreateMenuItemDto): Promise<DineInMenuItem> {
    return this.menuRepo.createItem(dto);
  }

  async updateItem(id: string, dto: UpdateMenuItemDto): Promise<DineInMenuItem> {
    return this.menuRepo.updateItem(id, dto);
  }

  async deleteItem(id: string): Promise<void> {
    return this.menuRepo.deleteItem(id);
  }
}
