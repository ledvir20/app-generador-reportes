// src/types/index.ts

export interface ResolutionResult {
  titulo: string
  // En tu openapi, nombre_norma puede ser null
  nombre_norma: string | null
  // descripcion no está en la lista de required, así que la hacemos opcional
  descripcion?: string
  fecha_publicacion: string
  publication_type_id: number
  category_id: number
  ocr_usado: boolean
  nombre_archivo_original: string
  url_acceso_pdf: string
}

export interface BatchResult {
  total_procesados: number
  url_excel_consolidado: string
  resultados: ResolutionResult[]
}

// Tipo para el estado de carga
export type UploadStatus = 'idle' | 'uploading' | 'success' | 'error'
