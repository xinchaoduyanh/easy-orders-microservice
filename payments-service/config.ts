import z from 'zod';
import { config } from 'dotenv';

config({ path: '.env' });

const ConfigSchema = z.object({
  // Database
  DATABASE_URL: z.string(),

  // Kafka
  KAFKA_BROKER: z.string().default('localhost:9092'),

  // Server
  HTTP_PORT: z.string().default('3003'),

  // Environment
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  // Payment specific
  PAYMENT_SERVICE_NAME: z.string().default('payments-service'),
  PAYMENT_CONSUMER_GROUP: z.string().default('payments-consumer-group'),

  // Frontend URL for CORS
  FRONTEND_URL: z.string().default('http://localhost:4000'),

  // JWT Configuration
  JWT_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  JWT_EXPIRES_IN: z.string(),
  JWT_REFRESH_EXPIRES_IN: z.string(),
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
