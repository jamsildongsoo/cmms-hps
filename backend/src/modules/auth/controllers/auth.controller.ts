import { Body, Controller, Get, Headers, Ip, Post, UseGuards } from '@nestjs/common'
import type { ActorContext } from '../../../common/context/actor-context'
import { CurrentActor } from '../../../common/context/current-actor.decorator'
import { AuthGuard } from '../guards/auth.guard'
import type { LoginDto, RefreshTokenDto } from '../dto/login.dto'
import { AuthService } from '../services/auth.service'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto, @Ip() ipAddress: string, @Headers('user-agent') userAgent?: string) {
    return this.authService.login(dto, { ipAddress, userAgent })
  }

  @Post('refresh')
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto)
  }

  @Get('me')
  @UseGuards(AuthGuard)
  me(@CurrentActor() actor: ActorContext) {
    return actor
  }
}
