import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from 'node:crypto'
import { promisify } from 'node:util'
import { Injectable } from '@nestjs/common'

const scrypt = promisify(scryptCallback)

@Injectable()
export class PasswordService {
  /** 신규 비밀번호 저장 형식: scrypt$<salt-base64url>$<hash-base64url> */
  async hash(password: string): Promise<string> {
    const salt = randomBytes(16).toString('base64url')
    const hash = await scrypt(password, salt, 64) as Buffer
    return `scrypt$${salt}$${hash.toString('base64url')}`
  }

  async verify(password: string, storedHash: string | null): Promise<boolean> {
    if (!storedHash) return false
    const [algorithm, salt, encodedHash] = storedHash.split('$')
    if (algorithm !== 'scrypt' || !salt || !encodedHash) return false
    const expected = Buffer.from(encodedHash, 'base64url')
    const actual = await scrypt(password, salt, expected.length) as Buffer
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  }
}
