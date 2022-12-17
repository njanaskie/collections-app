declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL: string;
      REDIS_URL: string;
      PORT: string;
      SESSION_SECRET: string;
      CORS_ORIGIN: string;
      API_URL: string;
      EMAIL_HOST: string;
      EMAIL_USER: string;
      EMAIL_PASSWORD: string;
      EMAIL_SENDER: string;
      TMDB_BASE_URL: string;
      TMDB_API_KEY: string;
      API_USERNAME: string;
      API_PASSWORD: string;
    }
  }
}

export {}
