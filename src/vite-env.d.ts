/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ZOOM_APP_CLIENT_ID: string
  readonly VITE_ZOOM_APP_CLIENT_SECRET: string
  readonly VITE_ZOOM_REDIRECT_URI: string
  readonly VITE_API_URL: string
  readonly VITE_ENV: 'development' | 'production'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
