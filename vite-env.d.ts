/// <reference types="vite/client" />

interface ImportMeta {
    readonly env: {
      VITE_REACT_APP_GOOGLE_VISION_API_KEY: string;
      // Add other environment variables here if needed
    };
  }
  
  
  // If you're using Vite <2.6.0, use the following:
  // interface ImportMeta {
  //   readonly env: ImportMetaEnv;
  // }
  
