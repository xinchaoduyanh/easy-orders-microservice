import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({
  path: '.env',
});


const ConfigSchema = z.object({
  DATABASE_URL: z.string(),
  KAFKA_BROKER: z.string().default('localhost:9092'),
  HTTP_PORT: z.string().default('3000'),
});

const configServer = ConfigSchema.safeParse(process.env);
if (!configServer.success) {
  console.log(
    'Giá trị khai báo trong file .env sai',
    configServer.error.format(),
  );
  process.exit(1);
}

const envConfig = configServer.data;

export default envConfig;
