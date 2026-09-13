import { randomUUID } from 'node:crypto'

type RequestWithId = {
  requestId?: string
  header: (name: string) => string | undefined
}
type ResponseWithHeader = { setHeader: (name: string, value: string) => void }
type NextFunction = () => void

export function requestIdMiddleware(request: RequestWithId, response: ResponseWithHeader, next: NextFunction): void {
  request.requestId = request.header('x-request-id') || randomUUID()
  response.setHeader('x-request-id', request.requestId)
  next()
}
