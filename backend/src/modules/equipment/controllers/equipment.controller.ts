import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common'
import type { ActorContext } from '../../../common/context/actor-context'
import { CurrentActor } from '../../../common/context/current-actor.decorator'
import { CommandResponse } from '../../../common/response/command-response.decorator'
import { AuthGuard } from '../../auth/guards/auth.guard'
import type { CreateEquipmentDto, EquipmentListQuery, UpdateEquipmentDto } from '../dto/equipment.dto'
import { EquipmentService } from '../services/equipment.service'

@Controller('equipments')
@UseGuards(AuthGuard)
export class EquipmentController {
  constructor(private readonly service: EquipmentService) {}

  @Get()
  findAll(@CurrentActor() actor: ActorContext, @Query() query: EquipmentListQuery) 
  { return this.service.findAll(actor, query) }

  @Get(':id')
  findOne(@CurrentActor() actor: ActorContext, @Param('id') id: string) 
  { return this.service.findOne(actor, id) }

  @Post()
  @CommandResponse('설비가 등록되었습니다.')
  create(@CurrentActor() actor: ActorContext, @Body() dto: CreateEquipmentDto) 
  { return this.service.create(actor, dto) }

  @Patch(':id')
  @CommandResponse('설비가 수정되었습니다.')
  update(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: UpdateEquipmentDto) 
  { return this.service.update(actor, id, dto) }

  @Delete(':id')
  @CommandResponse('설비가 삭제되었습니다.')
  remove(@CurrentActor() actor: ActorContext, @Param('id') id: string) 
  { return this.service.remove(actor, id) }
}
