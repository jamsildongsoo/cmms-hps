import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import type { ActorContext } from '../../../common/context/actor-context'
import { CurrentActor } from '../../../common/context/current-actor.decorator'
import { CommandResponse } from '../../../common/response/command-response.decorator'
import { AuthGuard } from '../../auth/guards/auth.guard'
import type { CreateMaterialDto, MaterialListQuery, UpdateMaterialDto } from '../dto/material.dto'
import { MaterialService } from '../services/material.service'

@Controller('materials')
@UseGuards(AuthGuard)
export class MaterialController {
  constructor(private readonly service: MaterialService) {}
  @Get() findAll(@CurrentActor() actor: ActorContext, @Query() query: MaterialListQuery) { return this.service.findAll(actor, query) }
  @Get(':id') findOne(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.findOne(actor, id) }
  @Post() @CommandResponse('자재가 등록되었습니다.') create(@CurrentActor() actor: ActorContext, @Body() dto: CreateMaterialDto) { return this.service.create(actor, dto) }
  @Patch(':id') @CommandResponse('자재가 수정되었습니다.') update(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: UpdateMaterialDto) { return this.service.update(actor, id, dto) }
  @Delete(':id') @CommandResponse('자재가 삭제되었습니다.') remove(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.remove(actor, id) }
}
