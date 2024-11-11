declare namespace NodeJS {
    interface ProcessEnv {
        MONGO_URI: string;
        CORS_ORIGIN: string;
        PORT: string;
        JWT_SECRET: string;
    }
}