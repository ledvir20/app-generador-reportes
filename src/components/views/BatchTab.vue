<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue-sonner' // <-- Usamos Sonner
import { Plus, Loader2, File as FileIcon, Trash2, Files, Download } from 'lucide-vue-next'
import type { BatchResult } from '@/types'

// Recibimos el modo simulación
defineProps<{ mockMode: boolean }>()

// Estado
const batchFiles = ref<File[]>([])
const batchResult = ref<BatchResult | null>(null)
const loading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

// Manejadores
const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])

  // Filtramos solo PDFs
  const validFiles = files.filter((f) => f.type === 'application/pdf')

  if (validFiles.length < files.length) {
    // Notificación de error con Sonner
    toast.warning('Archivos ignorados', {
      description: 'Algunos archivos no eran PDF y fueron descartados.',
    })
  }

  // Agregamos a la lista existente
  batchFiles.value = [...batchFiles.value, ...validFiles]

  // Limpiamos el input para permitir seleccionar los mismos archivos de nuevo si se borran
  target.value = ''
}

const removeFile = (index: number) => {
  batchFiles.value.splice(index, 1)
}

const processBatch = async () => {
  if (batchFiles.value.length === 0) return
  loading.value = true
  batchResult.value = null

  try {
    // Simulación de latencia de red
    await new Promise((r) => setTimeout(r, 3000))

    // Mock Data (Datos simulados)
    batchResult.value = {
      total_procesados: batchFiles.value.length,
      url_excel_consolidado: '#',
      resultados: batchFiles.value.map((f, i) => ({
        titulo: `RESOLUCIÓN Nº ${400 + i}-2025-MPH`,
        nombre_norma: i % 2 === 0 ? 'DESIGNACIÓN DE FUNCIONARIO' : 'LICENCIA DE FUNCIONAMIENTO',
        descripcion: 'Descripción autogenerada del documento procesado en lote...',
        fecha_publicacion: '10/04/2025',
        publication_type_id: 1,
        category_id: 54,
        ocr_usado: false,
        nombre_archivo_original: f.name,
        url_acceso_pdf: '#',
      })),
    }

    // Limpiamos la cola de subida
    batchFiles.value = []

    // Notificación de éxito con Sonner
    toast.success('Lote Procesado', {
      description: 'Se ha generado el reporte Excel correctamente.',
    })
  } catch (error) {
    toast.error('Error en Lote', {
      description: 'Hubo un problema procesando los archivos.',
    })
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="space-y-6 max-w-5xl mx-auto">
    <div class="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div class="flex flex-col space-y-1.5 p-6">
        <h3 class="font-semibold leading-none tracking-tight text-slate-900">Carga Masiva</h3>
        <p class="text-sm text-slate-500">Sube múltiples archivos para generar un reporte Excel.</p>
      </div>

      <div class="p-6 pt-0">
        <div class="flex items-center justify-between gap-4 mb-4">
          <button
            @click="fileInput?.click()"
            class="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium border border-slate-200 hover:bg-slate-50 h-9 px-4 py-2 gap-2 transition-colors"
          >
            <Plus class="w-4 h-4" /> Seleccionar Archivos
          </button>

          <button
            @click="processBatch"
            :disabled="batchFiles.length === 0 || loading"
            class="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 h-9 px-4 py-2 gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Loader2 v-if="loading" class="w-4 h-4 animate-spin" />
            {{ loading ? 'Procesando Lote...' : 'Iniciar Proceso' }}
          </button>
        </div>

        <input
          type="file"
          ref="fileInput"
          class="hidden"
          multiple
          accept=".pdf"
          @change="handleFileSelect"
        />

        <div
          v-if="batchFiles.length > 0 && !batchResult"
          class="rounded-md border border-slate-200 max-h-[300px] overflow-auto"
        >
          <table class="w-full text-sm">
            <thead class="bg-slate-50 sticky top-0">
              <tr class="border-b border-slate-200">
                <th class="h-10 px-4 text-left font-medium text-slate-500">Archivo</th>
                <th class="h-10 px-4 text-right font-medium text-slate-500">Tamaño</th>
                <th class="h-10 px-4 text-right font-medium text-slate-500">Acción</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(file, index) in batchFiles"
                :key="index"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="p-4 font-medium flex items-center gap-2 text-slate-700">
                  <FileIcon class="w-4 h-4 text-slate-400" /> {{ file.name }}
                </td>
                <td class="p-4 text-right text-slate-500">
                  {{ (file.size / 1024 / 1024).toFixed(2) }} MB
                </td>
                <td class="p-4 text-right">
                  <button
                    @click="removeFile(index)"
                    class="cursor-pointer text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div v-if="batchResult" class="space-y-6 animate-in fade-in slide-in-from-bottom-4">
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div
          class="rounded-xl border border-slate-200 bg-white shadow-sm p-6 flex flex-row items-center justify-between"
        >
          <div class="space-y-1">
            <p class="text-sm font-medium text-slate-500">Total Procesados</p>
            <div class="text-2xl font-bold text-slate-900">{{ batchResult.total_procesados }}</div>
          </div>
          <Files class="h-4 w-4 text-slate-400" />
        </div>

        <div
          class="col-span-1 lg:col-span-3 rounded-xl border border-slate-900 bg-slate-900 text-white shadow-sm p-6 flex items-center justify-between"
        >
          <div>
            <p class="font-bold text-lg">Reporte Excel Generado</p>
            <p class="text-slate-400 text-sm">
              Contiene toda la metadata estructurada lista para su uso.
            </p>
          </div>
          <a
            :href="batchResult.url_excel_consolidado"
            class="cursor-pointer inline-flex items-center justify-center rounded-md text-sm font-medium bg-white text-slate-900 hover:bg-slate-100 h-10 px-4 py-2 gap-2 transition-colors"
          >
            <Download class="w-4 h-4" /> Descargar
          </a>
        </div>
      </div>

      <div class="rounded-xl border border-slate-200 bg-white shadow-sm p-6">
        <h3 class="font-semibold mb-4 text-slate-900">Detalle de Extracción</h3>
        <div class="rounded-md border border-slate-200 overflow-hidden">
          <table class="w-full text-sm text-left">
            <thead class="bg-slate-50 border-b border-slate-200">
              <tr>
                <th class="h-12 px-4 font-medium text-slate-500">Resolución</th>
                <th class="h-12 px-4 font-medium text-slate-500">Fecha</th>
                <th class="h-12 px-4 font-medium text-slate-500">Norma Detectada</th>
                <th class="h-12 px-4 font-medium text-slate-500 text-right">PDF</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr
                v-for="(item, idx) in batchResult.resultados"
                :key="idx"
                class="hover:bg-slate-50 transition-colors"
              >
                <td class="p-4 font-medium text-slate-900">{{ item.titulo }}</td>
                <td class="p-4 text-slate-500">{{ item.fecha_publicacion }}</td>
                <td class="p-4 text-slate-600 max-w-[200px] truncate" :title="item.nombre_norma">
                  {{ item.nombre_norma || 'N/A' }}
                </td>
                <td class="p-4 text-right">
                  <a :href="item.url_acceso_pdf" class="font-medium text-blue-600 hover:underline"
                    >Ver</a
                  >
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
