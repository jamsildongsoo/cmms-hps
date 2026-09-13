import { Module } from '@nestjs/common'
import { FileStorageModule } from '../../common/file-storage/file-storage.module'
import { AuthModule } from '../auth/auth.module'
import { AttachmentController } from './controllers/attachment.controller'
import { AttachmentRepository } from './repositories/attachment.repository'
import { AttachmentService } from './services/attachment.service'

@Module({
  imports: [AuthModule, FileStorageModule],
  controllers: [AttachmentController],
  providers: [AttachmentRepository, AttachmentService],
})
export class AttachmentModule {}
