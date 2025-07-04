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
  // Thêm các biến môi trường cần thiết cho payments-service ở đây
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
