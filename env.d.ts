/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_REACT_APP_GOOGLE_VISION_API_KEY: string;
  readonly VITE_REACT_APP_API_URL_LOCAL: string;
  readonly VITE_REACT_APP_API_URL_PRODUCTION: string;
  readonly VITE_REACT_APP_BACKEND_URL: string;
  readonly PGUSER: string;
  readonly PGPASSWORD: string;
  readonly PGDATABASE: string;
  readonly PGHOST: string;
  readonly PGPORT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
