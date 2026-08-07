import { Module } from '@nestjs/common';
import { TailorService } from './tailor.service';
import { TailorController } from './tailor.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [TailorController],
  providers: [TailorService],
  exports: [TailorService],
})
export class TailorModule {}
