import { Module } from '@nestjs/common'
import { NumberingModule } from '../../common/numbering/numbering.module'
import { AuthModule } from '../auth/auth.module'
import { ApprovalController } from './controllers/approval.controller'
import { ApprovalRepository } from './repositories/approval.repository'
import { ApprovalService } from './services/approval.service'

@Module({
  imports: [AuthModule, NumberingModule],
  controllers: [ApprovalController],
  providers: [ApprovalRepository, ApprovalService],
})
export class ApprovalModule {}
