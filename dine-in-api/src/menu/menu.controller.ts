import { Controller, Get, Query, Param, ParseIntPipe } from '@nestjs/common';
import { MenuService } from './menu.service';
import { Public } from '../common/decorators/public.decorator';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('Menu')
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all menu items (Paginated)' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.menuService.findAll(
      page ? Number(page) : 1,
      limit ? Number(limit) : 10,
    );
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single menu item' })
  async findOne(@Param('id') id: string) {
    return this.menuService.findOne(id);
  }
}
