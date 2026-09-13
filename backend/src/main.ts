import { NestFactory, Reflector } from '@nestjs/core'
import { requestIdMiddleware } from './common/context/request-id.middleware'
import { GlobalExceptionFilter } from './common/exception/global-exception.filter'
import { CommandResponseInterceptor } from './common/response/command-response.interceptor'
import { AppModule } from './app.module'
import { environment } from './config/env'

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule)
  app.use(requestIdMiddleware)
  app.useGlobalFilters(new GlobalExceptionFilter())
  app.useGlobalInterceptors(new CommandResponseInterceptor(app.get(Reflector)))
  await app.listen(environment.port())
}

void bootstrap()
