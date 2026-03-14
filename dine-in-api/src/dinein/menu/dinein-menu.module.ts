import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DineInMenuCategory, DineInMenuCategorySchema } from './schemas/dinein-menu-category.schema';
import { DineInMenuItem, DineInMenuItemSchema } from './schemas/dinein-menu-item.schema';
import { DineInMenuRepository } from './dinein-menu.repository';
import { DineInMenuService } from './dinein-menu.service';
import { DineInMenuGuestController, DineInMenuAdminController } from './dinein-menu.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: DineInMenuCategory.name, schema: DineInMenuCategorySchema },
      { name: DineInMenuItem.name, schema: DineInMenuItemSchema },
    ]),
  ],
  providers: [DineInMenuRepository, DineInMenuService],
  controllers: [DineInMenuGuestController, DineInMenuAdminController],
  exports: [DineInMenuRepository, DineInMenuService],
})
export class DineInMenuModule {}
