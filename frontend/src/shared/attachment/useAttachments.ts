import { useCallback, useEffect, useState } from 'react'
import type { AttachmentItem, AttachmentResponse } from '../../entities/attachment/types'
import { deleteAttachmentItem, getAttachment, getAttachments, uploadAttachment } from './attachmentApi'

export function useAttachments(module: string, recordId?: string | null, siteId?: string | null) {
  const [attachment, setAttachment] = useState<AttachmentResponse | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const reload = useCallback(async (attachmentId?: string) => {
    if (!recordId && !attachmentId) {
      setAttachment(null)
      return
    }
    setIsLoading(true)
    try {
      setAttachment(await (attachmentId ? getAttachment(attachmentId) : getAttachments(module, recordId as string)))
    } finally {
      setIsLoading(false)
    }
  }, [module, recordId])

  useEffect(() => { void reload() }, [reload])

  const upload = async (file: File) => {
    const result = await uploadAttachment({ module, recordId, siteId, attachmentId: attachment?.id, file })
    setAttachment(result)
    return result
  }

  const remove = async (itemNo: number) => {
    if (!attachment) return
    await deleteAttachmentItem(attachment.id, itemNo)
    await reload(attachment.id)
  }

  return {
    attachment,
    items: attachment?.items ?? ([] as AttachmentItem[]),
    isLoading,
    upload,
    remove,
    reload,
  }
}
