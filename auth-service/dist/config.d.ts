declare const envConfig: {
    DATABASE_URL?: string;
    JWT_SECRET?: string;
    JWT_REFRESH_SECRET?: string;
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_CALLBACK_URL?: string;
    GITHUB_CLIENT_ID?: string;
    GITHUB_CLIENT_SECRET?: string;
    GITHUB_CALLBACK_URL?: string;
    HTTP_PORT?: string;
    KAFKA_BROKER?: string;
    NODE_ENV?: "development" | "production" | "test";
    AUTH_SERVICE_NAME?: string;
    AUTH_CONSUMER_GROUP?: string;
};
export default envConfig;
