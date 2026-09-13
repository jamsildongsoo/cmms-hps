import { randomUUID } from 'node:crypto'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import { basename, extname, resolve, sep } from 'node:path'
import { Injectable } from '@nestjs/common'
import { environment } from '../../config/env'
import { AppException } from '../exception/app.exception'
import { ERROR_CODE } from '../exception/error-code'
import type { FileStorage, StoreFileRequest, StoredFile } from './file-storage.types'

@Injectable()
/**
 * 파일 저장의 공통 진입점입니다.
 * 현재 구현은 local 파일 시스템이며, S3 전환 시 이 서비스의 내부 구현만 교체합니다.
 */
export class FileStorageService implements FileStorage {
  async store(request: StoreFileRequest): Promise<StoredFile> {
    const config = this.localConfig()
    if (request.content.length > config.maxSizeBytes) {
      throw new AppException(ERROR_CODE.FILE_TOO_LARGE, 400, '파일 크기가 허용 범위를 초과했습니다.', { maxSizeBytes: config.maxSizeBytes })
    }
    if (!Number.isInteger(request.itemNo) || request.itemNo <= 0) throw new Error('itemNo must be a positive integer')

    const companyId = this.safeSegment(request.companyId, 'companyId')
    const attachmentId = this.safeSegment(request.attachmentId, 'attachmentId')
    const fileName = basename(request.fileName).replace(/[\u0000/\\]/g, '_') || 'file'
    const contentType = request.contentType.trim().toLowerCase()
    const extension = extname(fileName).slice(1).toLowerCase()
    if (!config.allowedContentTypes.includes(contentType)) {
      throw new AppException(ERROR_CODE.FILE_TYPE_NOT_ALLOWED, 400, '허용되지 않는 파일 형식입니다.', { contentType, allowedContentTypes: config.allowedContentTypes })
    }
    if (!extension || !config.allowedExtensions.includes(extension)) {
      throw new AppException(ERROR_CODE.FILE_TYPE_NOT_ALLOWED, 400, '허용되지 않는 파일 확장자입니다.', { extension, allowedExtensions: config.allowedExtensions })
    }
    const storagePath = `${companyId}/${attachmentId}/${request.itemNo}-${randomUUID()}`
    const absolutePath = this.absolutePath(storagePath)

    await mkdir(resolve(absolutePath, '..'), { recursive: true })
    await writeFile(absolutePath, request.content, { flag: 'wx' })
    return { storagePath, fileName, contentType, fileSize: request.content.length }
  }

  async read(storagePath: string): Promise<Buffer> {
    try {
      return await readFile(this.absolutePath(storagePath))
    } catch (error: unknown) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
        throw new AppException(ERROR_CODE.FILE_NOT_FOUND, 404, '파일을 찾을 수 없습니다.')
      }
      throw error
    }
  }

  async remove(storagePath: string): Promise<void> {
    await rm(this.absolutePath(storagePath), { force: true })
  }

  private absolutePath(storagePath: string): string {
    const rootPath = resolve(this.localConfig().rootPath)
    const absolutePath = resolve(rootPath, storagePath)
    if (!absolutePath.startsWith(`${rootPath}${sep}`)) throw new Error('invalid storage path')
    return absolutePath
  }

  private safeSegment(value: string, name: string): string {
    const trimmed = value.trim()
    if (!trimmed || trimmed.includes('/') || trimmed.includes('\\') || trimmed.includes('..')) {
      throw new Error(`${name} contains an invalid path segment`)
    }
    return trimmed
  }

  private localConfig() {
    const config = environment.fileStorage()
    if (config.driver !== 'local') {
      throw new Error(`FILE_STORAGE_DRIVER=${config.driver} is not implemented`)
    }
    return config
  }
}
