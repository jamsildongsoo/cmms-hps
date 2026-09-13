import { Injectable } from '@nestjs/common'
import { EntityManager } from 'typeorm'
import { AuthLoginHistoryEntity, AuthSessionEntity, UserAuthEntity } from '../entities/auth.entity'

/** 인증 모듈에서 사용하는 조회·잠금·저장 쿼리를 한곳에 둡니다. */
@Injectable()
export class AuthRepository {
  findByLoginIdForUpdate(manager: EntityManager, companyId: string, loginId: string): Promise<UserAuthEntity | null> {
    return manager.getRepository(UserAuthEntity)
      .createQueryBuilder('auth')
      .innerJoinAndSelect('auth.user', 'user')
      .innerJoinAndSelect('user.dept', 'dept')
      .innerJoinAndSelect('dept.site', 'site')
      .innerJoinAndSelect('site.company', 'company')
      .where('auth.companyId = :companyId', { companyId })
      .andWhere('auth.loginId = :loginId', { loginId })
      .setLock('pessimistic_write')
      .getOne()
  }

  findByUserId(manager: EntityManager, companyId: string, userId: string): Promise<UserAuthEntity | null> {
    return manager.getRepository(UserAuthEntity)
      .createQueryBuilder('auth')
      .innerJoinAndSelect('auth.user', 'user')
      .innerJoinAndSelect('user.dept', 'dept')
      .innerJoinAndSelect('dept.site', 'site')
      .innerJoinAndSelect('site.company', 'company')
      .where('auth.companyId = :companyId', { companyId })
      .andWhere('auth.userId = :userId', { userId })
      .getOne()
  }

  findSessionForUpdate(manager: EntityManager, id: string): Promise<AuthSessionEntity | null> {
    return manager.getRepository(AuthSessionEntity)
      .createQueryBuilder('session')
      .where('session.id = :id', { id })
      .setLock('pessimistic_write')
      .getOne()
  }

  findSession(manager: EntityManager, id: string): Promise<AuthSessionEntity | null> {
    return manager.getRepository(AuthSessionEntity).findOneBy({ id })
  }

  saveAuthentication(manager: EntityManager, auth: UserAuthEntity): Promise<UserAuthEntity> {
    return manager.save(auth)
  }

  saveSession(manager: EntityManager, session: AuthSessionEntity): Promise<AuthSessionEntity> {
    return manager.save(session)
  }

  saveLoginHistory(manager: EntityManager, history: AuthLoginHistoryEntity): Promise<AuthLoginHistoryEntity> {
    return manager.save(history)
  }
}
