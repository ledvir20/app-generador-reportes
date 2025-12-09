<script setup lang="ts">
import { FileText } from 'lucide-vue-next'
defineProps<{ mockMode: boolean }>()
</script>

<template>
  <header
    class="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-slate-200 bg-white/95 backdrop-blur px-6 shadow-sm"
  >
    <div class="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-900">
      <div class="p-1.5 bg-slate-900 rounded-md text-white">
        <FileText class="w-5 h-5" />
      </div>
      <span>Inteligencia Documental</span>
    </div>
    <div class="ml-auto flex items-center gap-4">
      <span
        class="text-xs font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200"
      >
        v2.0.0
      </span>
      <div class="flex items-center gap-2 text-sm text-slate-500">
        <span class="relative flex h-2 w-2">
          <span
            v-if="mockMode"
            class="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"
          ></span>
          <span
            :class="[
              'relative inline-flex rounded-full h-2 w-2',
              mockMode ? 'bg-amber-500' : 'bg-green-500',
            ]"
          ></span>
        </span>
        {{ mockMode ? 'Simulación' : 'API Conectada' }}
      </div>
    </div>
  </header>
</template>
