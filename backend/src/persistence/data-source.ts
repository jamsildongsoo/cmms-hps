import 'reflect-metadata'
import { DataSource } from 'typeorm'
import { environment } from '../config/env'
import { CMMS_ENTITIES } from './entities'

const database = environment.database()

/** 접속/스키마 변경은 명시적으로 실행할 때만 발생합니다. */
export const dataSource = new DataSource({
  type: 'postgres',
  ...database,
  entities: CMMS_ENTITIES,
  synchronize: false,
  migrationsRun: false,
})
