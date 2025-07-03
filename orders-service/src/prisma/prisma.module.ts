// orders-app/src/prisma/prisma.module.ts
import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Để PrismaService có thể được Inject vào bất cứ đâu
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
