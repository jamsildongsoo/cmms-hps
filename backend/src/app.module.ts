import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { FileStorageModule } from './common/file-storage/file-storage.module'
import { NumberingModule } from './common/numbering/numbering.module'
import { environment } from './config/env'
import { AuthModule } from './modules/auth/auth.module'
import { CodeModule } from './modules/code/code.module'
import { OrgModule } from './modules/org/org.module'
import { EquipmentModule } from './modules/equipment/equipment.module'
import { AttachmentModule } from './modules/attachment/attachment.module'
import { ApprovalModule } from './modules/approval/approval.module'
import { MaterialModule } from './modules/material/material.module'
import { PmRecordModule } from './modules/pm-record/pm-record.module'
import { WorkOrderModule } from './modules/work-order/work-order.module'
import { WorkPermitModule } from './modules/work-permit/work-permit.module'
import { PurchaseRequestModule } from './modules/purchase-request/purchase-request.module'
import { PurchaseOrderModule } from './modules/purchase-order/purchase-order.module'
import { InventoryModule } from './modules/inventory/inventory.module'
import { CMMS_ENTITIES } from './persistence/entities'

const database = environment.database()

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      ...database,
      entities: CMMS_ENTITIES,
      synchronize: false,
      migrationsRun: false,
    }),
    AuthModule,
    CodeModule,
    OrgModule,
    EquipmentModule,
    AttachmentModule,
    ApprovalModule,
    MaterialModule,
    PmRecordModule,
    WorkOrderModule,
    WorkPermitModule,
    PurchaseRequestModule,
    PurchaseOrderModule,
    InventoryModule,
    NumberingModule,
    FileStorageModule,
  ],
})
export class AppModule {}
