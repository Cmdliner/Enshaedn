import type EventEmitter from "events";

export declare namespace NodeJS {
    interface Process extends EventEmitter{
        env: {
            CORS_ORIGIN: string;
            JWT_SECRET: string;
            MONGO_URI: string;
        }
    }
    

}
