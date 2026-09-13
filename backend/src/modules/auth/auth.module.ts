import { Module } from '@nestjs/common'
import { AuthController } from './controllers/auth.controller'
import { AuthGuard } from './guards/auth.guard'
import { AuthRepository } from './repositories/auth.repository'
import { AuthService } from './services/auth.service'
import { AuthTokenService } from './services/auth-token.service'
import { PasswordService } from './services/password.service'

@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthTokenService, PasswordService, AuthRepository, AuthGuard],
  exports: [AuthService, AuthGuard],
})
export class AuthModule {}
