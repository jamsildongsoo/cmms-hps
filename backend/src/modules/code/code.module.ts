import { Module } from '@nestjs/common'
import { CodeController } from './controllers/code.controller'
import { CodeRepository } from './repositories/code.repository'
import { CodeService } from './services/code.service'

@Module({
  controllers: [CodeController],
  providers: [CodeRepository, CodeService],
  exports: [CodeService],
})
export class CodeModule {}
