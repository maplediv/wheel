interface ImportMetaEnv {
    VITE_REACT_APP_GOOGLE_VISION_API_KEY: string;
    VITE_REACT_APP_API_URL_LOCAL: string;
    VITE_REACT_APP_API_URL_PRODUCTION: string;
    VITE_REACT_APP_BACKEND_URL: string;
  }
  
  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
  