import z from 'zod';
import fs from 'fs';
import path from 'path';
import { config } from 'dotenv';

config({ path: '.env' });
if (!fs.existsSync(path.resolve('.env'))) {
  console.log('Không tìm thấy file .env');
  process.exit(1);
}
const ConfigSchema = z.object({
  RESEND_API_KEY: z.string(),
  KAFKA_BROKER: z.string().default('localhost:9092'),
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
