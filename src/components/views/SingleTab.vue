<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner' // <-- Importar toast
import { DocumentService } from '@/api/documentService'
import { UploadCloud, FileCheck, Loader2, Sparkles, Calendar, Eye, Copy } from 'lucide-vue-next'
import type { ResolutionResult } from '@/types'

const props = defineProps<{ mockMode: boolean }>()

const selectedFile = ref<File | null>(null)
const singleResult = ref<ResolutionResult | null>(null)
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    selectedFile.value = target.files[0]
    singleResult.value = null
  }
}

const handleDrop = (event: DragEvent) => {
  const file = event.dataTransfer?.files[0]
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
    singleResult.value = null
  } else {
    // Uso de Sonner Error
    toast.error('Archivo inválido', {
      description: 'Por favor sube solo archivos PDF.',
    })
  }
}

const processSingle = async () => {
  if (!selectedFile.value) return
  loading.value = true
  singleResult.value = null

  try {
    let data: ResolutionResult
    if (props.mockMode) {
      // Modo mock local
      await new Promise((r) => setTimeout(r, 1500))
      data = {
        titulo: 'RESOLUCIÓN DE ALCALDÍA Nº 123-2025-MPH',
        nombre_norma: 'APROBACIÓN DE PRESUPUESTO',
        descripcion: 'Se resuelve aprobar el presupuesto participativo...',
        fecha_publicacion: '15/04/2025',
        publication_type_id: 1,
        category_id: 54,
        ocr_usado: true,
        nombre_archivo_original: selectedFile.value.name,
        url_acceso_pdf: '#',
      }
    } else {
      // Llamada real al servicio
      const result = await DocumentService.processSingle(selectedFile.value)
      data = result
    }

    singleResult.value = data
    toast.success('Análisis Completado', {
      description: 'Se han extraído los datos exitosamente.',
    })
  } catch (error) {
    toast.error('Error de Procesamiento', {
      description: 'No se pudo analizar el documento.',
    })
  } finally {
    loading.value = false
  }
}

const copyJSON = () => {
  if (singleResult.value) {
    navigator.clipboard.writeText(JSON.stringify(singleResult.value, null, 2))
    toast.info('Copiado', { description: 'JSON copiado al portapapeles' })
  }
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
    <div class="lg:col-span-2 space-y-6">
      <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
        <div class="flex flex-col space-y-1.5 p-6">
          <h3 class="font-semibold leading-none tracking-tight">Subir Documento</h3>
          <p class="text-sm text-slate-500">Analiza un PDF individual.</p>
        </div>
        <div class="p-6 pt-0">
          <div
            class="relative flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors"
            :class="selectedFile ? 'border-blue-200 bg-blue-50/30' : 'border-slate-200'"
            @dragover.prevent
            @drop.prevent="handleDrop"
            @click="fileInput?.click()"
          >
            <input
              type="file"
              ref="fileInput"
              class="hidden"
              accept=".pdf"
              @change="handleFileSelect"
            />

            <div class="flex flex-col items-center justify-center pt-5 pb-6 text-center px-4">
              <div class="p-3 bg-slate-100 rounded-full mb-3" v-if="!selectedFile">
                <UploadCloud class="w-6 h-6 text-slate-500" />
              </div>
              <div class="p-3 bg-blue-100 rounded-full mb-3" v-else>
                <FileCheck class="w-6 h-6 text-blue-600" />
              </div>

              <div v-if="!selectedFile">
                <p class="mb-1 text-sm font-medium">Click para subir o arrastrar</p>
                <p class="text-xs text-slate-500">PDF (MAX. 10MB)</p>
              </div>
              <div v-else class="space-y-1">
                <p class="text-sm font-medium text-blue-700 break-all">{{ selectedFile.name }}</p>
                <button
                  @click.stop="selectedFile = null"
                  class="cursor-pointer text-xs text-red-500 hover:underline mt-2"
                >
                  Remover
                </button>
              </div>
            </div>
          </div>

          <button
            @click="processSingle"
            :disabled="!selectedFile || loading"
            class="cursor-pointer mt-4 w-full inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 h-10 px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Loader2 v-if="loading" class="mr-2 h-4 w-4 animate-spin" />
            {{ loading ? 'Analizando...' : 'Procesar Documento' }}
          </button>
        </div>
      </div>
    </div>

    <div class="lg:col-span-3 space-y-4">
      <div
        v-if="!singleResult && !loading"
        class="h-full min-h-[300px] flex flex-col items-center justify-center text-center p-8 rounded-xl border border-dashed border-slate-300 bg-slate-50/50"
      >
        <div class="bg-white p-4 rounded-full shadow-sm mb-4">
          <Sparkles class="w-6 h-6 text-slate-400" />
        </div>
        <h3 class="text-lg font-semibold">Esperando análisis</h3>
        <p class="text-sm text-slate-500 max-w-sm mt-2">
          Sube un documento y la IA extraerá automáticamente la resolución.
        </p>
      </div>

      <div
        v-else-if="loading"
        class="h-full min-h-[300px] flex flex-col items-center justify-center p-8 space-y-4"
      >
        <Loader2 class="w-10 h-10 text-slate-900 animate-spin" />
        <p class="text-sm font-medium text-slate-500 animate-pulse">Analizando estructura...</p>
      </div>

      <div
        v-else-if="singleResult"
        class="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4"
      >
        <div class="h-1.5 w-full bg-linear-to-r from-blue-500 to-indigo-600"></div>
        <div class="flex flex-col space-y-1.5 p-6 pb-4">
          <div class="flex items-start justify-between gap-4">
            <div class="space-y-1">
              <h3 class="font-semibold text-xl leading-tight text-slate-900">
                {{ singleResult.titulo }}
              </h3>
              <p class="text-sm text-slate-500 flex items-center gap-2">
                <Calendar class="w-3.5 h-3.5" />
                {{ singleResult.fecha_publicacion }}
              </p>
            </div>
            <div
              :class="[
                'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold',
                singleResult.ocr_usado
                  ? 'border-amber-200 bg-amber-50 text-amber-700'
                  : 'border-slate-200 bg-slate-100 text-slate-700',
              ]"
            >
              {{ singleResult.ocr_usado ? 'OCR Forzado' : 'Texto Nativo' }}
            </div>
          </div>
        </div>

        <div class="p-6 pt-0 space-y-6">
          <div class="space-y-2">
            <label class="text-xs font-medium uppercase tracking-wider text-slate-500"
              >Norma Identificada</label
            >
            <div class="rounded-md border border-slate-100 bg-slate-50 p-3">
              <p class="text-sm font-medium">{{ singleResult.nombre_norma }}</p>
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-xs font-medium uppercase tracking-wider text-slate-500"
              >Descripción Resumida</label
            >
            <p class="text-sm text-slate-600 leading-relaxed">{{ singleResult.descripcion }}</p>
          </div>
        </div>

        <div class="flex items-center p-6 pt-0 gap-2">
          <a
            :href="singleResult.url_acceso_pdf"
            target="_blank"
            class="inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 bg-white hover:bg-slate-50 h-9 px-4 py-2 flex-1 gap-2 cursor-pointer transition-colors"
          >
            <Eye class="w-4 h-4" /> Ver PDF
          </a>
          <button
            @click="copyJSON"
            class="cursor-pointer inline-flex items-center justify-center rounded-md border border-slate-200 hover:bg-slate-50 h-9 w-9 transition-colors"
          >
            <Copy class="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
