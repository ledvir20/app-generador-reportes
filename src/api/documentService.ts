import type { BatchResult, ResolutionResult } from '@/types'
import { apiClient } from './apiClient'

export class DocumentService {
  /**
   * Procesa un único PDF
   */
  static async processSingle(file: File): Promise<ResolutionResult> {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await apiClient.post<ResolutionResult>('/procesar-resolucion/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  }

  /**
   * Procesa múltiples PDFs
   */
  static async processBatch(files: File[]): Promise<BatchResult> {
    const formData = new FormData()
    files.forEach((file) => {
      formData.append('files', file)
    })

    const { data } = await apiClient.post<BatchResult>('/procesar-lote/', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      // Puedes añadir onUploadProgress aquí
    })
    return data
  }

  /**
   * Health check
   */
  static async healthCheck(): Promise<boolean> {
    try {
      await apiClient.get('/health')
      return true
    } catch {
      return false
    }
  }
}
