import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CMMS_ENTITIES } from './entities'

/** 상위 AppModule에서 TypeOrmModule.forRoot(...)로 연결을 구성한 뒤 import합니다. */
@Module({
  imports: [TypeOrmModule.forFeature(CMMS_ENTITIES)],
  exports: [TypeOrmModule],
})
export class PersistenceModule {}
