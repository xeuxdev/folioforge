import {
  Controller,
  Get,
  Post,
  Query,
  Redirect,
  Res,
  UseGuards,
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
   * upsert the user, create a session, then redirect to the frontend.
   *
   * On Success: Redirects to `${frontendUrl}/auth/callback#token=${token}`
   * On Error: Redirects to `${frontendUrl}/auth/callback?error=${code}&message=${message}`
   */
  @Get('google/callback')
  async googleCallback(
    @Query('code') code: string,
    @Query('error') error: string | undefined,
    @Query('error_description') errorDescription: string | undefined,
    @Res() res: Response,
  ): Promise<void> {
    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:5173';

    if (error || !code) {
      const errCode = encodeURIComponent(error ?? 'access_denied');
      const errMsg = encodeURIComponent(
        errorDescription ??
          error ??
          'Google authentication was cancelled or failed.',
      );
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${errCode}&message=${errMsg}`,
      );
    }

    try {
      const user = await this.authService.exchangeCodeForUser(code);
      const token = await this.authService.createSession(user.id);

      return res.redirect(`${frontendUrl}/auth/callback#token=${token}`);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Authentication failed';
      const errCode = encodeURIComponent('auth_failed');
      const errMsg = encodeURIComponent(message);
      return res.redirect(
        `${frontendUrl}/auth/callback?error=${errCode}&message=${errMsg}`,
      );
    }
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
    await this.authService.deleteSession(req.sessionToken!);
  }
}
