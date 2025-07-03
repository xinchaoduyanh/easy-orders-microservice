// orders-app/prisma/seed.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});

  console.log('Start seeding products...');

  const products = [
    {
      name: 'Smartphone X',
      description: 'Powerful smartphone with amazing camera.',
      price: 799.99,
      imageUrl: 'https://placehold.co/600x400/FF0000/FFFFFF?text=SmartphoneX',
    },
    {
      name: 'Laptop Pro 15',
      description: 'High-performance laptop for professionals.',
      price: 1499.99,
      imageUrl: 'https://placehold.co/600x400/00FF00/000000?text=LaptopPro15',
    },
    {
      name: 'Wireless Earbuds Z',
      description: 'Premium sound, comfortable fit.',
      price: 129.99,
      imageUrl: 'https://placehold.co/600x400/0000FF/FFFFFF?text=EarbudsZ',
    },
    {
      name: 'Smartwatch Lite',
      description: 'Track your fitness and stay connected.',
      price: 199.5,
      imageUrl:
        'https://placehold.co/600x400/FFFF00/000000?text=SmartwatchLite',
    },
    {
      name: 'Mechanical Keyboard RGB',
      description: 'Tactile switches, customizable RGB lighting.',
      price: 89.99,
      imageUrl: 'https://placehold.co/600x400/FF00FF/FFFFFF?text=KeyboardRGB',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { name: product.name }, // Dùng name làm unique identifier để tránh tạo trùng
      update: {}, // Không update nếu đã tồn tại
      create: product, // Tạo mới nếu chưa tồn tại
    });
    console.log(`Seeded product: ${product.name}`);
  }

  console.log('Product seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
