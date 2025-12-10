# app-generador-reportes

Proyecto front-end en Vue 3 + Vite para procesar PDFs y extraer metadata (resoluciones). Está organizado para desarrollo rápido con un modo "mock" y llamadas reales al backend.

Resumen rápido

- UI para un único PDF: [src/components/views/SingleTab.vue](src/components/views/SingleTab.vue) — componente [`SingleTab`](src/components/views/SingleTab.vue)
- UI para procesamiento en lote: [src/components/views/BatchTab.vue](src/components/views/BatchTab.vue) — componente [`BatchTab`](src/components/views/BatchTab.vue)
- Barra y health-check: [src/components/layout/NavbarApp.vue](src/components/layout/NavbarApp.vue) — componente [`NavbarApp`](src/components/layout/NavbarApp.vue)
- Cliente HTTP compartido: [`apiClient`](src/api/apiClient.ts) — [src/api/apiClient.ts](src/api/apiClient.ts)
- Servicio de API: [`DocumentService`](src/api/documentService.ts) y sus métodos [`DocumentService.processSingle`](src/api/documentService.ts), [`DocumentService.processBatch`](src/api/documentService.ts), [`DocumentService.healthCheck`](src/api/documentservice.ts)
- Tipos principales: [`ResolutionResult`](src/types/index.ts) y [`BatchResult`](src/types/index.ts) — [src/types/index.ts](src/types/index.ts)

Requisitos

- Node.js según [package.json](package.json) (engines)
- pnpm

Instalación

```pwsh
pnpm install
```

Scripts útiles (desde [package.json](package.json))

```pwsh
pnpm dev        # desarrollo con Vite
pnpm build      # compilar para producción
pnpm preview    # ver build local
pnpm lint       # eslint
pnpm type-check # vue-tsc --build
```

API usada (endpoints esperados)

- POST /procesar-resolucion/ — multipart form-data campo `file` → devuelve [`ResolutionResult`](src/types/index.ts)
  - Llamada desde [`DocumentService.processSingle`](src/api/documentService.ts)
- POST /procesar-lote/ — multipart form-data con múltiples campos `files` → devuelve [`BatchResult`](src/types/index.ts) con `url_excel_consolidado`
  - Llamada desde [`DocumentService.processBatch`](src/api/documentService.ts)
- GET /health — health check simple usado por [`NavbarApp`](src/components/layout/NavbarApp.vue) y [`DocumentService.healthCheck`](src/api/documentService.ts)

Modo Mock
El proyecto soporta `mockMode`:

- Cambiar la prop `:mockMode="true"` en el componente raíz (ver [src/App.vue](src/App.vue)) o cambiar el estado en tiempo de ejecución.
- `SingleTab` y `BatchTab` simulan respuestas cuando `mockMode` es true; `NavbarApp` evita checks reales.

Mejoras y recomendaciones (rápidas)

- Mostrar progreso por archivo en subidas grandes: agregar `onUploadProgress` en [`DocumentService.processBatch`](src/api/documentService.ts) y/o en el interceptor de subida de [`apiClient`](src/api/apiClient.ts).
- Validación de tamaño y número máximo en `BatchTab` (antes de enviar).
- Polling opcional para health en [`NavbarApp`](src/components/layout/NavbarApp.vue) (ej. cada 30s) y notificaciones al cambiar estado.
- Manejo de errores enriquecido: centralizar mensajes en [`apiClient`](src/api/apiClient.ts) y mapear a textos de UI.
- Integrar tests E2E (Cypress/Playwright) para flujos Single/Batch y health.

Estructura de tipos

- [`ResolutionResult`](src/types/index.ts): campos como `titulo`, `nombre_norma`, `descripcion?`, `fecha_publicacion`, `ocr_usado`, `url_acceso_pdf`.
- [`BatchResult`](src/types/index.ts): `total_procesados`, `url_excel_consolidado`, `resultados: ResolutionResult[]`.

Notas de integración rápida

1. Asegúrate de que el backend esté corriendo en la URL definida en `.env` (`VITE_API_BASE_URL`) o en el entorno. Archivo: [.env](.env)
2. Verifica timeouts en [`apiClient`](src/api/apiClient.ts) si el backend realiza OCR/processing pesado (ya está en 5 minutos por defecto).
3. Si necesitas progreso por archivo, modifica [`DocumentService.processBatch`](src/api/documentService.ts) para aceptar callbacks y pasar `onUploadProgress` a axios.
