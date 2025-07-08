import z from 'zod';
import { config } from 'dotenv';

config({ path: '.env' });

const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),
  GOOGLE_CALLBACK_URL: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GITHUB_CALLBACK_URL: z.string(),
  HTTP_PORT: z.string().default('3004'),
});

const configServer = ConfigSchema.safeParse(process.env);
if (!configServer.success) {
  console.log('Giá trị khai báo trong file .env sai', configServer.error.format());
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
