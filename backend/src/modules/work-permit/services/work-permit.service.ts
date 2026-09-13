import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { NumberingService } from '../../../common/numbering/numbering.service'
import { WorkPermitEntity } from '../entities/work-permit.entity'
import type { CreateWorkPermitDto, UpdateWorkPermitDto, WorkPermitListQuery } from '../dto/work-permit.dto'
import { WorkPermitRepository } from '../repositories/work-permit.repository'
@Injectable()
export class WorkPermitService {
  constructor(private readonly ds: DataSource, private readonly repo: WorkPermitRepository, private readonly numbering: NumberingService) {}
  async findAll(a: ActorContext, q: WorkPermitListQuery) { const page=Math.max(Number(q.page)||1,1),pageSize=Math.min(Math.max(Number(q.pageSize)||20,1),100);const [items,total]=await this.repo.findList(this.ds.manager,a.companyId,page,pageSize,q);return{items,page,pageSize,total,totalPages:Math.ceil(total/pageSize)} }
  findOne(a:ActorContext,id:string){return this.repo.findOne(this.ds.manager,a.companyId,id)}
  async create(a:ActorContext,d:CreateWorkPermitDto){return this.ds.transaction(async m=>{const e=m.create(WorkPermitEntity,{...d,permitRequired:d.permitRequired as any,id:await this.numbering.nextInTransaction(m,{companyId:a.companyId,module:'WP'}),companyId:a.companyId,createdBy:a.userId,updatedBy:a.userId} as any);return this.repo.save(m,e)})}
  async update(a:ActorContext,id:string,d:UpdateWorkPermitDto){const e=await this.repo.findOne(this.ds.manager,a.companyId,id);if(!e)return null;Object.assign(e,d);e.updatedBy=a.userId;return this.repo.save(this.ds.manager,e)}
  async remove(a:ActorContext,id:string){const e=await this.repo.findOne(this.ds.manager,a.companyId,id);if(!e)return{id};e.status='deleted';e.updatedBy=a.userId;await this.repo.save(this.ds.manager,e);return{id}}
}
