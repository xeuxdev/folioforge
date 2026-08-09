import 'multer';
import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Query,
  Redirect,
  Res,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
  HttpCode,
  HttpStatus,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { SessionGuard } from './guards/session.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import type { User } from '../users/users.service';
import { UsersService } from '../users/users.service';
import { StorageService } from '../storage/storage.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly storageService: StorageService,
  ) {}

  /**
   * GET /api/v1/auth/google
   * Redirects browser to Google's OAuth consent screen.
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
   * PATCH /api/v1/auth/me
   * Updates current user profile details (e.g. name, avatarUrl).
   * Requires: Authorization: Bearer <token>
   */
  @Patch('me')
  @UseGuards(SessionGuard)
  async updateMe(
    @CurrentUser() user: User,
    @Body()
    body: { name?: string; username?: string; avatarUrl?: string | null },
  ): Promise<User> {
    return this.usersService.updateUserProfile(user.id, body);
  }

  /**
   * POST /api/v1/auth/photo
   * Uploads profile photo to Cloudflare R2 under `photos/` folder and updates user avatarUrl.
   */
  @Post('photo')
  @UseGuards(SessionGuard)
  @UseInterceptors(
    FileInterceptor('file', {
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB limit
      },
      fileFilter: (_req, file, callback) => {
        const allowedMimetypes = [
          'image/jpeg',
          'image/png',
          'image/webp',
          'image/gif',
        ];
        if (allowedMimetypes.includes(file.mimetype)) {
          callback(null, true);
        } else {
          callback(
            new BadRequestException(
              'Invalid image format. Only JPEG, PNG, WEBP, and GIF up to 5MB are permitted.',
            ),
            false,
          );
        }
      },
    }),
  )
  async uploadPhoto(
    @CurrentUser() user: User,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<User> {
    if (!file) {
      throw new BadRequestException('No photo file provided.');
    }

    const { publicUrl } = await this.storageService.uploadPhoto({
      buffer: file.buffer,
      originalFilename: file.originalname,
      mimeType: file.mimetype,
      userId: user.id,
    });

    return this.usersService.updateUserProfile(user.id, {
      avatarUrl: publicUrl,
    });
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
