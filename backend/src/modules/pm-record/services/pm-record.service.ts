import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import type { ActorContext } from '../../../common/context/actor-context'
import { AppException } from '../../../common/exception/app.exception'
import { ERROR_CODE } from '../../../common/exception/error-code'
import { NumberingService } from '../../../common/numbering/numbering.service'
import { PmRecordEntity, PmRecordItemEntity } from '../entities/pm-record.entity'
import type { CreatePmRecordDto, PmRecordListQuery, UpdatePmRecordDto } from '../dto/pm-record.dto'
import { PmRecordRepository } from '../repositories/pm-record.repository'
@Injectable()
export class PmRecordService {
 constructor(private ds:DataSource,private repo:PmRecordRepository,private numbering:NumberingService){}
 async findAll(a:ActorContext,q:PmRecordListQuery){if(q.searchType&&q.searchType!=='id'&&q.searchType!=='name')throw new AppException(ERROR_CODE.VALIDATION_FAILED,400,'유효하지 않은 검색구분입니다.');const page=this.pos(q.page,1),pageSize=Math.min(this.pos(q.pageSize,20),100);const [items,total]=await this.repo.findList(this.ds.manager,a.companyId,page,pageSize,{...q,searchValue:q.searchValue?.trim()});return{items,page,pageSize,total,totalPages:Math.ceil(total/pageSize)}}
 async findOne(a:ActorContext,id:string){const x=await this.repo.findOne(this.ds.manager,a.companyId,this.req(id));if(!x)throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND,404,'예방점검 기록을 찾을 수 없습니다.');return x}
 async create(a:ActorContext,d:CreatePmRecordDto){return this.ds.transaction(async m=>{const id=await this.numbering.nextInTransaction(m,{companyId:a.companyId,module:'PM'});const e=m.create(PmRecordEntity,{...d,id,companyId:a.companyId,createdBy:a.userId,updatedBy:a.userId,deleteYN:'N'});await this.repo.save(m,e);for(const [i,item] of d.items.entries())await this.repo.saveItem(m,m.create(PmRecordItemEntity,{...item,id:item.id||String(i+1),pmRecordId:id,companyId:a.companyId}));return this.repo.findOne(m,a.companyId,id)})}
 async update(a:ActorContext,id:string,d:UpdatePmRecordDto){return this.ds.transaction(async m=>{const e=await this.require(m,a.companyId,id);const {items,...header}=d;Object.assign(e,header);e.updatedBy=a.userId;await this.repo.save(m,e);if(items){await this.repo.removeItems(m,a.companyId,e.id);for(const [i,item] of items.entries())await this.repo.saveItem(m,m.create(PmRecordItemEntity,{...item,id:item.id||String(i+1),pmRecordId:e.id,companyId:a.companyId}))}return this.repo.findOne(m,a.companyId,e.id)})}
 async remove(a:ActorContext,id:string){return this.ds.transaction(async m=>{const e=await this.require(m,a.companyId,id);e.deleteYN='Y';e.updatedBy=a.userId;await this.repo.save(m,e);return{id:e.id,deleteYN:'Y' as const}})}
 private async require(m:EntityManagerLike,c:string,id:string){const e=await this.repo.findOne(m,c,this.req(id));if(!e)throw new AppException(ERROR_CODE.RESOURCE_NOT_FOUND,404,'예방점검 기록을 찾을 수 없습니다.');return e}
 private req(v:string){if(!v?.trim())throw new AppException(ERROR_CODE.VALIDATION_FAILED,400,'pmRecordId가 필요합니다.');return v.trim()}
 private pos(v:string|undefined,f:number){const n=Number(v);return Number.isInteger(n)&&n>0?n:f}
}
type EntityManagerLike=Parameters<PmRecordRepository['findOne']>[0]
