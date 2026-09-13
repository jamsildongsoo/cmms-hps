import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import type { ActorContext } from '../../../common/context/actor-context'
import { CurrentActor } from '../../../common/context/current-actor.decorator'
import { CommandResponse } from '../../../common/response/command-response.decorator'
import { AuthGuard } from '../../auth/guards/auth.guard'
import type { CreateDeptDto, CreateSiteDto, CreateUserDto, CreateWarehouseDto, UpdateDeptDto, UpdateSiteDto, UpdateUserDto, UpdateWarehouseDto } from '../dto/org.dto'
import { OrgService } from '../services/org.service'

@Controller('org')
@UseGuards(AuthGuard)
export class OrgController {
  constructor(private readonly service: OrgService) {}

  @Get()
  getOrganization(@CurrentActor() actor: ActorContext) { return this.service.getOrganization(actor) }

  @Get('companies')
  findCompanies(@CurrentActor() actor: ActorContext) { return this.service.findCompanies(actor) }

  @Get('sites')
  findSites(@CurrentActor() actor: ActorContext) { return this.service.findSites(actor) }

  @Get('depts')
  findDepts(@CurrentActor() actor: ActorContext) { return this.service.findDepts(actor) }

  @Get('warehouses')
  findWarehouses(@CurrentActor() actor: ActorContext) { return this.service.findWarehouses(actor) }

  @Get('users')
  findUsers(@CurrentActor() actor: ActorContext) { return this.service.findUsers(actor) }

  @Post('sites')
  @CommandResponse('사업장이 등록되었습니다.')
  createSite(@CurrentActor() actor: ActorContext, @Body() dto: CreateSiteDto) { return this.service.createSite(actor, dto) }

  @Patch('sites/:id')
  @CommandResponse('사업장이 수정되었습니다.')
  updateSite(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: UpdateSiteDto) { return this.service.updateSite(actor, id, dto) }

  @Delete('sites/:id')
  @CommandResponse('사업장이 삭제되었습니다.')
  deleteSite(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.deleteSite(actor, id) }

  @Post('depts')
  @CommandResponse('부서가 등록되었습니다.')
  createDept(@CurrentActor() actor: ActorContext, @Body() dto: CreateDeptDto) { return this.service.createDept(actor, dto) }

  @Patch('depts/:id')
  @CommandResponse('부서가 수정되었습니다.')
  updateDept(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: UpdateDeptDto) { return this.service.updateDept(actor, id, dto) }

  @Delete('depts/:id')
  @CommandResponse('부서가 삭제되었습니다.')
  deleteDept(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.deleteDept(actor, id) }

  @Post('warehouses')
  @CommandResponse('창고가 등록되었습니다.')
  createWarehouse(@CurrentActor() actor: ActorContext, @Body() dto: CreateWarehouseDto) { return this.service.createWarehouse(actor, dto) }

  @Patch('warehouses/:id')
  @CommandResponse('창고가 수정되었습니다.')
  updateWarehouse(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: UpdateWarehouseDto) { return this.service.updateWarehouse(actor, id, dto) }

  @Delete('warehouses/:id')
  @CommandResponse('창고가 삭제되었습니다.')
  deleteWarehouse(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.deleteWarehouse(actor, id) }

  @Post('users')
  @CommandResponse('사용자가 등록되었습니다.')
  createUser(@CurrentActor() actor: ActorContext, @Body() dto: CreateUserDto) { return this.service.createUser(actor, dto) }

  @Patch('users/:id')
  @CommandResponse('사용자가 수정되었습니다.')
  updateUser(@CurrentActor() actor: ActorContext, @Param('id') id: string, @Body() dto: UpdateUserDto) { return this.service.updateUser(actor, id, dto) }

  @Delete('users/:id')
  @CommandResponse('사용자가 삭제되었습니다.')
  deleteUser(@CurrentActor() actor: ActorContext, @Param('id') id: string) { return this.service.deleteUser(actor, id) }
}
