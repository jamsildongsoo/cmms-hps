import { Injectable } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { randomUUID } from 'node:crypto'
import type { ActorContext } from '../../../common/context/actor-context'
import { InventoryBalanceEntity, InventoryLedgerEntryEntity } from '../entities/inventory.entity'
import type { CreateInventoryTransactionDto, InventoryListQuery } from '../dto/inventory.dto'
import { InventoryRepository } from '../repositories/inventory.repository'
@Injectable()
export class InventoryService {
  constructor(private readonly ds: DataSource, private readonly repo: InventoryRepository) {}
  async findLedger(a: ActorContext, q: InventoryListQuery) { const page=Math.max(Number(q.page)||1,1),pageSize=Math.min(Math.max(Number(q.pageSize)||20,1),100);const[items,total]=await this.repo.findLedger(this.ds.manager,a.companyId,page,pageSize,q);return{items,page,pageSize,total,totalPages:Math.ceil(total/pageSize)} }
  async create(a:ActorContext,d:CreateInventoryTransactionDto){return this.ds.transaction(async m=>{const now=new Date();let balance=await this.repo.findBalance(m,a.companyId,d.warehouseId,d.materialId,true);if(!balance){balance=m.create(InventoryBalanceEntity,{companyId:a.companyId,warehouseId:d.warehouseId,materialId:d.materialId,quantity:'0',amount:'0',reservedQuantity:'0',availableQuantity:'0',updatedAt:now});await this.repo.saveBalance(m,balance);balance=await this.repo.findBalance(m,a.companyId,d.warehouseId,d.materialId,true)}const old=Number(balance?.quantity??0),delta=d.transactionType==='receipt'?Number(d.quantity):-Number(d.quantity);if(old+delta<0)throw new Error('재고가 부족합니다.');balance!.quantity=String(old+delta);balance!.amount=String(Number(balance!.amount)+Number(d.amount));balance!.availableQuantity=String(Number(balance!.availableQuantity)+delta);balance!.updatedAt=now;await this.repo.saveBalance(m,balance!);return this.repo.saveLedger(m,m.create(InventoryLedgerEntryEntity,{...d,id:randomUUID(),companyId:a.companyId,quantity:d.quantity,amount:d.amount,occurredAt:new Date(d.occurredAt),createdBy:a.userId,createdAt:now}))})}
}
