import { Injectable } from '@nestjs/common'
import type { EntityManager } from 'typeorm'
import { PmRecordEntity, PmRecordItemEntity } from '../entities/pm-record.entity'
@Injectable()
export class PmRecordRepository {
  findList(m: EntityManager, companyId: string, page: number, size: number, q: { searchType?: 'id'|'name'; searchValue?: string }) { const b=m.getRepository(PmRecordEntity).createQueryBuilder('pm').leftJoinAndSelect('pm.items','item').leftJoinAndSelect('pm.equipment','equipment').leftJoinAndSelect('pm.typeItem','typeItem').where('pm.companyId=:companyId',{companyId}).andWhere('pm.deleteYN=:deleteYN',{deleteYN:'N'}).orderBy('pm.date','DESC').addOrderBy('pm.id','DESC').skip((page-1)*size).take(size); if(q.searchType&&q.searchValue)b.andWhere(`pm.${q.searchType==='id'?'id':'name'} ILIKE :value`,{value:`%${q.searchValue}%`}); return b.getManyAndCount() }
  findOne(m: EntityManager, companyId: string, id: string) { return m.getRepository(PmRecordEntity).createQueryBuilder('pm').leftJoinAndSelect('pm.items','item').leftJoinAndSelect('pm.equipment','equipment').leftJoinAndSelect('pm.typeItem','typeItem').where('pm.companyId=:companyId',{companyId}).andWhere('pm.id=:id',{id}).andWhere('pm.deleteYN=:deleteYN',{deleteYN:'N'}).getOne() }
  save(m: EntityManager,e: PmRecordEntity){return m.save(e)}
  saveItem(m: EntityManager,e: PmRecordItemEntity){return m.save(e)}
  removeItems(m: EntityManager,companyId:string,id:string){return m.delete(PmRecordItemEntity,{companyId,pmRecordId:id})}
}
