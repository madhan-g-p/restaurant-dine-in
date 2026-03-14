import { Body, Controller, Post, Headers, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { PaymentsService } from './payments.service';

@ApiTags('Webhooks')
@Controller('webhook')
export class WebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('phonepe')
  @ApiOperation({ summary: 'PhonePe payment callback' })
  async phonePeCallback(
    @Body() body: any,
    @Headers('x-verify') signature: string,
  ) {
    const isValid = this.paymentsService.validatePhonePeSignature(body, signature);
    if (!isValid) {
      throw new BadRequestException('Invalid signature');
    }

    // Logic to update payment record status based on body.code
    // if (body.code === 'PAYMENT_SUCCESS') { ... }

    return { success: true };
  }
}
