import z from 'zod';

import { config } from 'dotenv';

config({ path: '.env' });

const ConfigSchema = z.object({
  KAFKA_BROKER: z.string(),
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
