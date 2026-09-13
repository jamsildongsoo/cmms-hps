import { Module } from '@nestjs/common'
import { OrgController } from './controllers/org.controller'
import { OrgRepository } from './repositories/org.repository'
import { OrgService } from './services/org.service'

@Module({
  controllers: [OrgController],
  providers: [OrgRepository, OrgService],
  exports: [OrgService],
})
export class OrgModule {}
