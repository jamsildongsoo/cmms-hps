import { Module } from '@nestjs/common'
import { NumberingModule } from '../../common/numbering/numbering.module'
import { AuthModule } from '../auth/auth.module'
import { EquipmentController } from './controllers/equipment.controller'
import { EquipmentRepository } from './repositories/equipment.repository'
import { EquipmentService } from './services/equipment.service'

@Module({
  imports: [AuthModule, NumberingModule],
  controllers: [EquipmentController],
  providers: [EquipmentRepository, EquipmentService],
})
export class EquipmentModule {}
