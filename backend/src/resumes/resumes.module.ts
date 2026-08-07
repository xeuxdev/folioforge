import { Module } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { ResumesController } from './resumes.controller';
import { StorageModule } from '../storage/storage.module';
import { ParserModule } from '../parser/parser.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [StorageModule, ParserModule, AuthModule],
  controllers: [ResumesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
