import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionGuard } from './guards/session.guard';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [AuthController],
  providers: [AuthService, SessionGuard],
  // Export both so other feature modules can protect routes
  // without importing UsersModule again.
  exports: [AuthService, SessionGuard],
})
export class AuthModule {}
