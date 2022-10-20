declare global {
  namespace NodeJS {
    interface ProcessEnv {
      TMDB_BASE_URL: string;
      TMDB_API_KEY: string;
      COLLECTIONS_BASE_POINTS: string;
    }
  }
}

export {}
