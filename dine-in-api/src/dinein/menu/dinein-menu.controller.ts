import {
  Controller, Get, Post, Patch, Delete, Param, Body, UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DineInMenuService } from './dinein-menu.service';
import {
  CreateCategoryDto, UpdateCategoryDto,
  CreateMenuItemDto, UpdateMenuItemDto,
} from './dto/menu.dto';
import { Public } from '../../common/decorators/public.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

// ── Guest routes (public) ─────────────────────────────────────────
@ApiTags('DineIn - Menu')
@Controller('dinein/menu')
export class DineInMenuGuestController {
  constructor(private readonly menuService: DineInMenuService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get full menu grouped by category (time-filtered)' })
  getMenu() {
    return this.menuService.getMenuForGuest();
  }

  @Public()
  @Get('categories')
  @ApiOperation({ summary: 'List active categories' })
  getCategories() {
    return this.menuService.getCategories();
  }

  @Public()
  @Get('items/:id')
  @ApiOperation({ summary: 'Get a single menu item' })
  getItem(@Param('id') id: string) {
    return this.menuService.getItem(id);
  }
}

// ── Admin routes (JWT + ADMIN role) ───────────────────────────────
@ApiTags('Admin - Menu')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/menu')
export class DineInMenuAdminController {
  constructor(private readonly menuService: DineInMenuService) {}

  // Categories
  @Post('categories')
  @ApiOperation({ summary: 'Create a category' })
  createCategory(@Body() dto: CreateCategoryDto) {
    return this.menuService.createCategory(dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'List active categories for admin' })
  getCategories() {
    return this.menuService.getCategories();
  }

  @Get('categories/:id')
  @ApiOperation({ summary: 'Get a single category' })
  getCategory(@Param('id') id: string) {
    return this.menuService.getItemsByCategoryId(id);
  }

  @Patch('categories/:id')
  @ApiOperation({ summary: 'Update a category' })
  updateCategory(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.menuService.updateCategory(id, dto);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete a category' })
  deleteCategory(@Param('id') id: string) {
    return this.menuService.deleteCategory(id);
  }

  // Items
  @Post('items')
  @ApiOperation({ summary: 'Create a menu item' })
  createItem(@Body() dto: CreateMenuItemDto) {
    return this.menuService.createItem(dto);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update a menu item' })
  updateItem(@Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.updateItem(id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete a menu item' })
  deleteItem(@Param('id') id: string) {
    return this.menuService.deleteItem(id);
  }
}
