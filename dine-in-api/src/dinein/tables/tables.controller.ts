import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Res,
  UseGuards,
  ParseIntPipe,
  Optional,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { TablesService } from './tables.service';
import { CreateTableDto } from './dto/create-table.dto';
import { UpdateTableDto } from './dto/update-table.dto';
import { TableStatus } from './schemas/dinein-table.schema';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';

@ApiTags('Admin - Tables')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('admin/tables')
export class TablesController {
  constructor(private readonly tablesService: TablesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new table' })
  create(@Body() dto: CreateTableDto) {
    return this.tablesService.createTable(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all tables (optionally filter by floor)' })
  @ApiQuery({ name: 'floor', required: false, type: Number })
  findAll(@Query('floor', new ParseIntPipe({ optional: true })) floor?: number) {
    return this.tablesService.listTables(floor);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a table by ID' })
  findOne(@Param('id') id: string) {
    return this.tablesService.getTable(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update table details' })
  update(@Param('id') id: string, @Body() dto: UpdateTableDto) {
    return this.tablesService.updateTable(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a table' })
  remove(@Param('id') id: string) {
    return this.tablesService.deleteTable(id);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Manually override table status' })
  setStatus(
    @Param('id') id: string,
    @Body('status') status: TableStatus,
  ) {
    return this.tablesService.setTableStatus(id, status);
  }

  @Get(':id/qr')
  @ApiOperation({ summary: 'Download QR code PNG for a table' })
  async downloadQr(@Param('id') id: string, @Res() res: Response) {
    const buffer = await this.tablesService.generateQrBuffer(id);
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': `attachment; filename="table-qr-${id}.png"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
