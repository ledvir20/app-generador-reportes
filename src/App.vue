<script setup lang="ts">
import { ref } from 'vue'
import { Toaster } from 'vue-sonner'

import SingleTab from '@/components/views/SingleTab.vue'
import BatchTab from '@/components/views/BatchTab.vue'
import NavbarApp from './components/layout/NavbarApp.vue'

const currentTab = ref<'single' | 'batch'>('single')
const mockMode = ref(false) // Cambiar a false cuando conectes tu backend Python/NestJS
</script>

<template>
  <div class="relative min-h-screen flex flex-col bg-slate-50 font-sans text-slate-900">
    <NavbarApp :mock-mode="mockMode" />

    <main class="flex-1 p-6 md:p-10 max-w-7xl mx-auto w-full space-y-8">
      <div class="space-y-2">
        <h2 class="text-3xl font-bold tracking-tight">Panel de Extracción MPH</h2>
        <p class="text-slate-500 text-lg">
          Gestión inteligente de resoluciones y documentos municipales.
        </p>
      </div>

      <div class="space-y-6">
        <div
          class="inline-flex h-10 items-center justify-center rounded-md bg-slate-200/50 p-1 text-slate-500 w-full md:w-auto"
        >
          <button
            @click="currentTab = 'single'"
            :class="[
              'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-sm px-8 py-1.5 text-sm font-medium transition-all',
              currentTab === 'single'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'hover:bg-slate-200/50',
            ]"
          >
            Procesar Resolución
          </button>
          <button
            @click="currentTab = 'batch'"
            :class="[
              'cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-sm px-8 py-1.5 text-sm font-medium transition-all',
              currentTab === 'batch'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'hover:bg-slate-200/50',
            ]"
          >
            Procesar Lote
          </button>
        </div>

        <transition name="fade" mode="out-in">
          <SingleTab v-if="currentTab === 'single'" :mock-mode="mockMode" />
          <BatchTab v-else :mock-mode="mockMode" />
        </transition>
      </div>
    </main>

    <Toaster position="bottom-right" rich-colors close-button />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
