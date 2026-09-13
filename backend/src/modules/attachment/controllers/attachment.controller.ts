import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { StreamableFile } from '@nestjs/common'
import { AuthGuard } from '../../auth/guards/auth.guard'
import type { ActorContext } from '../../../common/context/actor-context'
import { CurrentActor } from '../../../common/context/current-actor.decorator'
import { CommandResponse } from '../../../common/response/command-response.decorator'
import { environment } from '../../../config/env'
import type { CreateAttachmentDto } from '../dto/attachment.dto'
import { AttachmentService } from '../services/attachment.service'

type UploadedFile = { originalname: string; mimetype: string; buffer: Buffer }

@Controller('attachments')
@UseGuards(AuthGuard)
export class AttachmentController {
  constructor(private readonly service: AttachmentService) {}

  @Get('record/:module/:recordId')
  findByRecord(@CurrentActor() actor: ActorContext, @Param('module') module: string, @Param('recordId') recordId: string) {
    return this.service.findByRecord(actor, module, recordId)
  }

  @Get(':attachmentId')
  findById(@CurrentActor() actor: ActorContext, @Param('attachmentId') attachmentId: string) {
    return this.service.findById(actor, attachmentId)
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', { limits: { fileSize: environment.fileStorage().maxSizeBytes } }))
  @CommandResponse('첨부파일이 등록되었습니다.')
  upload(@CurrentActor() actor: ActorContext, @Body() dto: CreateAttachmentDto, @UploadedFile() file: UploadedFile) {
    return this.service.upload(actor, dto, file)
  }

  @Get(':attachmentId/items/:itemNo/download')
  async download(@CurrentActor() actor: ActorContext, @Param('attachmentId') attachmentId: string, @Param('itemNo') itemNo: string) {
    const { item, content } = await this.service.readItem(actor, attachmentId, itemNo)
    return new StreamableFile(content, { type: item.contentType, disposition: `attachment; filename*=UTF-8''${encodeURIComponent(item.fileName)}` })
  }

  @Delete(':attachmentId/items/:itemNo')
  @CommandResponse('첨부파일이 삭제되었습니다.')
  removeItem(@CurrentActor() actor: ActorContext, @Param('attachmentId') attachmentId: string, @Param('itemNo') itemNo: string) {
    return this.service.removeItem(actor, attachmentId, itemNo)
  }
}
