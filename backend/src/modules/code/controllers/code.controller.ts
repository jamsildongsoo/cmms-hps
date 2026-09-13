import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { CurrentActor } from '../../../common/context/current-actor.decorator'
import type { ActorContext } from '../../../common/context/actor-context'
import { CommandResponse } from '../../../common/response/command-response.decorator'
import { AuthGuard } from '../../auth/guards/auth.guard'
import type { CreateCodeDto, CreateCodeItemDto, UpdateCodeDto, UpdateCodeItemDto } from '../dto/code.dto'
import { CodeService } from '../services/code.service'

@Controller('codes')
@UseGuards(AuthGuard)
export class CodeController {
  constructor(private readonly service: CodeService) {}

  @Get()
  findCodes(@CurrentActor() actor: ActorContext) {
    return this.service.findCodes(actor)
  }

  @Get(':codeId')
  findCode(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string) {
    return this.service.findCode(actor, codeId)
  }

  @Post()
  @CommandResponse('코드가 등록되었습니다.')
  createCode(@CurrentActor() actor: ActorContext, @Body() dto: CreateCodeDto) {
    return this.service.createCode(actor, dto)
  }

  @Patch(':codeId')
  @CommandResponse('코드가 수정되었습니다.')
  updateCode(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string, @Body() dto: UpdateCodeDto) {
    return this.service.updateCode(actor, codeId, dto)
  }

  @Delete(':codeId')
  @CommandResponse('코드가 삭제되었습니다.')
  deleteCode(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string) {
    return this.service.deleteCode(actor, codeId)
  }

  @Get(':codeId/items')
  findItems(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string) {
    return this.service.findItems(actor, codeId)
  }

  @Get(':codeId/items/:itemId')
  findItem(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string, @Param('itemId') itemId: string) {
    return this.service.findItem(actor, codeId, itemId)
  }

  @Post(':codeId/items')
  @CommandResponse('코드 항목이 등록되었습니다.')
  createItem(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string, @Body() dto: CreateCodeItemDto) {
    return this.service.createItem(actor, codeId, dto)
  }

  @Patch(':codeId/items/:itemId')
  @CommandResponse('코드 항목이 수정되었습니다.')
  updateItem(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string, @Param('itemId') itemId: string, @Body() dto: UpdateCodeItemDto) {
    return this.service.updateItem(actor, codeId, itemId, dto)
  }

  @Delete(':codeId/items/:itemId')
  @CommandResponse('코드 항목이 삭제되었습니다.')
  deleteItem(@CurrentActor() actor: ActorContext, @Param('codeId') codeId: string, @Param('itemId') itemId: string) {
    return this.service.deleteItem(actor, codeId, itemId)
  }
}
