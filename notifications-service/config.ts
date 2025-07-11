import z from 'zod';
import { config } from 'dotenv';

config({ path: '.env' });

const ConfigSchema = z.object({
  RESEND_API_KEY: z.string(),
  KAFKA_BROKER: z.string().default('kafka:9093'),
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
