"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '.env' });
const ConfigSchema = zod_1.default.object({
    DATABASE_URL: zod_1.default.string(),
    JWT_SECRET: zod_1.default.string(),
    JWT_REFRESH_SECRET: zod_1.default.string(),
    GOOGLE_CLIENT_ID: zod_1.default.string(),
    GOOGLE_CLIENT_SECRET: zod_1.default.string(),
    GOOGLE_CALLBACK_URL: zod_1.default.string(),
    GITHUB_CLIENT_ID: zod_1.default.string(),
    GITHUB_CLIENT_SECRET: zod_1.default.string(),
    GITHUB_CALLBACK_URL: zod_1.default.string(),
    HTTP_PORT: zod_1.default.string().default('3004'),
});
const configServer = ConfigSchema.safeParse(process.env);
if (!configServer.success) {
    console.log('Giá trị khai báo trong file .env sai', configServer.error.format());
    process.exit(1);
}
const envConfig = configServer.data;
exports.default = envConfig;
//# sourceMappingURL=config.js.map