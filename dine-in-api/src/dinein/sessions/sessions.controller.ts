import { Body, Controller, Patch, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { Request, Response } from 'express';
import { Public } from '../../common/decorators/public.decorator';
import { InitSessionDto } from './dto/init-session.dto';
import { SessionsService } from './sessions.service';

const SESSION_COOKIE = 'dinein_session_id';
const COOKIE_MAX_AGE_MS = 6 * 60 * 60 * 1000; // 6 hours

@ApiTags('DineIn - Sessions')
@Public()
@Controller('dinein/sessions')
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post('init')
  @ApiOperation({ summary: 'Initialize or resume a guest dine-in session' })
  async init(
    @Body() dto: InitSessionDto,
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const existingSessionId: string | undefined = (req.cookies as any)?.[SESSION_COOKIE];

    const result = await this.sessionsService.initSession(
      dto.tableNumber,
      dto.fingerprint,
      existingSessionId,
    );

    // Set HttpOnly cookie bound to this session
    res.cookie(SESSION_COOKIE, result.sessionId, {
      httpOnly: true,
      sameSite: 'lax',
      maxAge: COOKIE_MAX_AGE_MS,
    });

    return result;
  }

  @Patch('ping')
  @ApiOperation({ summary: 'Heartbeat — refresh session TTL' })
  async ping(@Req() req: Request) {
    const sessionId: string | undefined = (req.cookies as any)?.[SESSION_COOKIE];
    if (sessionId) await this.sessionsService.ping(sessionId);
    return { ok: true };
  }
}
