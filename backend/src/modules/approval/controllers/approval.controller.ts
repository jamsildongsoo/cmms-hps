import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import { AuthGuard } from '../../auth/guards/auth.guard'
import type { ActorContext } from '../../../common/context/actor-context'
import { CurrentActor } from '../../../common/context/current-actor.decorator'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { CommandResponse } from '../../../common/response/command-response.decorator'
import type { ApprovalFolder, CreateApprovalDto, ProcessApprovalDto, UpdateApprovalDto } from '../dto/approval.dto'
import { ApprovalService } from '../services/approval.service'

@Controller('approvals')
@UseGuards(AuthGuard)
export class ApprovalController {
  constructor(private readonly service: ApprovalService) {}

  @Get()
  findAll(@CurrentActor() actor: ActorContext, @Query('folder') folder?: ApprovalFolder) {
    const validFolders: ApprovalFolder[] = ['submitted', 'pending', 'completed', 'reference']
    if (folder !== undefined && !validFolders.includes(folder)) {
      throw new AppException(ERROR_CODE.VALIDATION_FAILED, 400, '유효하지 않은 결재함입니다.')
    }
    return this.service.findAll(actor, folder)
  }

  @Get(':id')
  findOne(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.findOne(actor, id) }

  @Post()
  @CommandResponse('결재문이 저장되었습니다.')
  create(@CurrentActor() actor: ActorContext, @Body() dto: CreateApprovalDto) { return this.service.create(actor, dto) }

  @Patch(':id')
  @CommandResponse('결재문이 수정되었습니다.')
  update(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: UpdateApprovalDto) { return this.service.update(actor, id, dto) }

  @Post(':id/submit')
  @CommandResponse('결재가 상신되었습니다.')
  submit(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.submit(actor, id) }

  @Post(':id/process')
  @CommandResponse('결재 처리가 완료되었습니다.')
  process(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: ProcessApprovalDto) { return this.service.process(actor, id, dto) }

  @Delete(':id')
  @CommandResponse('결재문이 삭제되었습니다.')
  remove(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.remove(actor, id) }
}
