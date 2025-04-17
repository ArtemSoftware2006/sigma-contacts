namespace NodeJS {
    interface ProcessEnv {
      REACT_APP_API_URL: string;
      REACT_APP_MODE: 'development' | 'production';
      REACT_APP_IS_LOGGING: string;
    }
  }