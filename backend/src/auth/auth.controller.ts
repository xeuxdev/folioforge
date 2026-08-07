import {
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
  UnauthorizedException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SessionGuard } from './guards/session.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   * GET /api/v1/auth/google
   * Redirects the browser to Google's OAuth consent screen.
   */
  @Get('google')
  @Redirect()
  initiateGoogleAuth() {
    const url = this.authService.getGoogleAuthUrl();
    return { url, statusCode: 302 };
  }

  /**
   * GET /api/v1/auth/google/callback
   * Google redirects here with a one-time code. We exchange it for tokens,
   * upsert the user, create a session, then redirect to the frontend with
   * the Bearer token in the URL hash (never hits the server, not in logs).
   *
   * Frontend reads: window.location.hash → strips "#token=" → stores token
   * in memory or sessionStorage → removes hash from URL.
   */
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    if (error || !code) {
      throw new UnauthorizedException(
        error ?? 'Missing authorization code from Google',
      );
    }

    const user = await this.authService.exchangeCodeForUser(code);
    const token = await this.authService.createSession(user.id);

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

    // Token delivered via hash fragment — never sent to any server in the redirect
    res.redirect(`${frontendUrl}/auth/callback#token=${token}`);
  }

  /**
   * GET /api/v1/auth/me
   * Returns the currently authenticated user.
   * Requires: Authorization: Bearer <token>
   */
  @Get('me')
  @UseGuards(SessionGuard)
  getMe(@CurrentUser() user: User): User {
    return user;
  }

  /**
   * POST /api/v1/auth/logout
   * Invalidates the session server-side.
   * Requires: Authorization: Bearer <token>
   */
  @Post('logout')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async logout(@Req() req: Request): Promise<void> {
    // sessionToken is attached by SessionGuard — no need to re-parse header
    await this.authService.deleteSession(req.sessionToken!);
  }
}
