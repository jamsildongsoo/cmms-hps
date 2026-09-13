import { Module } from '@nestjs/common'
import { AuthModule } from '../auth/auth.module'
import { NumberingModule } from '../../common/numbering/numbering.module'
import { MaterialController } from './controllers/material.controller'
import { MaterialRepository } from './repositories/material.repository'
import { MaterialService } from './services/material.service'
@Module({ imports: [AuthModule, NumberingModule], controllers: [MaterialController], providers: [MaterialRepository, MaterialService] })
export class MaterialModule {}
