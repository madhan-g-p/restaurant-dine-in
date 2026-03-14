import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { HeatmapService } from './heatmap.service';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('DineIn - Heatmap')
@Controller('dinein/heatmap')
export class HeatmapController {
  constructor(private readonly heatmapService: HeatmapService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get restaurant busyness level' })
  async getHeatmap() {
    return this.heatmapService.getHeatmap();
  }
}
