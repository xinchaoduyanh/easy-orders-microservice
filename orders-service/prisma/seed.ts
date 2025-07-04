// orders-app/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

async function main() {
  // Xóa dữ liệu cũ
  await prisma.orderItem.deleteMany({});
  await prisma.order.deleteMany({});
  await prisma.product.deleteMany({});

  console.log('Start seeding products...');

  // Định nghĩa các categories và dữ liệu mẫu cho từng category
  const categoryData = [
    {
      category: 'ELECTRONICS',
      products: [
        {
          name: 'Smartphone X',
          description: 'Powerful smartphone with amazing camera',
          price: 799.99,
        },
        {
          name: 'Laptop Pro 15',
          description: 'High-performance laptop for professionals',
          price: 1499.99,
        },
        {
          name: 'Wireless Earbuds Z',
          description: 'Premium sound, comfortable fit',
          price: 129.99,
        },
        {
          name: 'Smartwatch Lite',
          description: 'Track your fitness and stay connected',
          price: 199.5,
        },
        {
          name: 'Mechanical Keyboard RGB',
          description: 'Tactile switches, customizable RGB lighting',
          price: 89.99,
        },
        {
          name: 'Gaming Mouse Pro',
          description: 'High DPI gaming mouse with RGB',
          price: 79.99,
        },
        {
          name: '4K Monitor Ultra',
          description: '27-inch 4K display for professionals',
          price: 399.99,
        },
        {
          name: 'Bluetooth Speaker',
          description: 'Portable speaker with deep bass',
          price: 59.99,
        },
      ],
    },
    {
      category: 'CLOTHING',
      products: [
        {
          name: 'Cotton T-Shirt',
          description: 'Comfortable cotton t-shirt',
          price: 24.99,
        },
        {
          name: 'Denim Jeans',
          description: 'Classic blue denim jeans',
          price: 49.99,
        },
        {
          name: 'Hoodie Sweatshirt',
          description: 'Warm and cozy hoodie',
          price: 39.99,
        },
        {
          name: 'Running Shoes',
          description: 'Lightweight running shoes',
          price: 89.99,
        },
        {
          name: 'Winter Jacket',
          description: 'Warm winter jacket',
          price: 129.99,
        },
        {
          name: 'Summer Dress',
          description: 'Elegant summer dress',
          price: 69.99,
        },
        {
          name: 'Formal Shirt',
          description: 'Professional formal shirt',
          price: 34.99,
        },
        {
          name: 'Athletic Shorts',
          description: 'Comfortable athletic shorts',
          price: 29.99,
        },
      ],
    },
    {
      category: 'BOOKS',
      products: [
        {
          name: 'The Great Gatsby',
          description: 'Classic American novel',
          price: 12.99,
        },
        {
          name: 'Programming Fundamentals',
          description: 'Learn programming basics',
          price: 29.99,
        },
        {
          name: 'Cookbook Collection',
          description: 'Delicious recipes from around the world',
          price: 24.99,
        },
        {
          name: 'Science Fiction Anthology',
          description: 'Collection of sci-fi stories',
          price: 19.99,
        },
        {
          name: 'Business Strategy Guide',
          description: 'Modern business strategies',
          price: 34.99,
        },
        {
          name: "Children's Storybook",
          description: 'Beautiful illustrated stories',
          price: 14.99,
        },
        {
          name: 'History of Art',
          description: 'Comprehensive art history',
          price: 44.99,
        },
        {
          name: 'Self-Help Guide',
          description: 'Personal development strategies',
          price: 16.99,
        },
      ],
    },
    {
      category: 'HOME_GARDEN',
      products: [
        {
          name: 'Coffee Maker',
          description: 'Automatic coffee maker',
          price: 89.99,
        },
        {
          name: 'Garden Tool Set',
          description: 'Complete garden maintenance kit',
          price: 49.99,
        },
        {
          name: 'Kitchen Blender',
          description: 'High-speed kitchen blender',
          price: 69.99,
        },
        {
          name: 'Indoor Plant Pot',
          description: 'Beautiful ceramic plant pot',
          price: 19.99,
        },
        {
          name: 'LED Desk Lamp',
          description: 'Adjustable LED desk lamp',
          price: 34.99,
        },
        {
          name: 'Storage Cabinet',
          description: 'Multi-purpose storage cabinet',
          price: 129.99,
        },
        {
          name: 'Garden Seeds Pack',
          description: 'Assorted vegetable seeds',
          price: 9.99,
        },
        {
          name: 'Kitchen Knife Set',
          description: 'Professional knife set',
          price: 79.99,
        },
      ],
    },
    {
      category: 'SPORTS',
      products: [
        {
          name: 'Basketball',
          description: 'Official size basketball',
          price: 29.99,
        },
        { name: 'Yoga Mat', description: 'Non-slip yoga mat', price: 24.99 },
        {
          name: 'Tennis Racket',
          description: 'Professional tennis racket',
          price: 89.99,
        },
        {
          name: 'Dumbbell Set',
          description: 'Adjustable weight dumbbells',
          price: 149.99,
        },
        {
          name: 'Soccer Ball',
          description: 'Professional soccer ball',
          price: 34.99,
        },
        {
          name: 'Cycling Helmet',
          description: 'Safety cycling helmet',
          price: 44.99,
        },
        {
          name: 'Swimming Goggles',
          description: 'Anti-fog swimming goggles',
          price: 19.99,
        },
        {
          name: 'Fitness Tracker',
          description: 'Heart rate and activity tracker',
          price: 79.99,
        },
      ],
    },
    {
      category: 'BEAUTY',
      products: [
        {
          name: 'Facial Cleanser',
          description: 'Gentle facial cleanser',
          price: 19.99,
        },
        {
          name: 'Hair Dryer',
          description: 'Professional hair dryer',
          price: 69.99,
        },
        {
          name: 'Makeup Brush Set',
          description: 'Complete makeup brush collection',
          price: 34.99,
        },
        {
          name: 'Perfume Collection',
          description: 'Luxury perfume set',
          price: 89.99,
        },
        {
          name: 'Nail Polish Set',
          description: 'Assorted nail polish colors',
          price: 14.99,
        },
        {
          name: 'Electric Razor',
          description: 'Precision electric razor',
          price: 59.99,
        },
        {
          name: 'Face Mask Pack',
          description: 'Hydrating face masks',
          price: 12.99,
        },
        {
          name: 'Hair Straightener',
          description: 'Ceramic hair straightener',
          price: 49.99,
        },
      ],
    },
    {
      category: 'FOOD_BEVERAGE',
      products: [
        {
          name: 'Organic Coffee Beans',
          description: 'Premium organic coffee',
          price: 24.99,
        },
        {
          name: 'Gourmet Chocolate Box',
          description: 'Assorted fine chocolates',
          price: 19.99,
        },
        {
          name: 'Herbal Tea Collection',
          description: 'Assorted herbal teas',
          price: 14.99,
        },
        {
          name: 'Olive Oil Premium',
          description: 'Extra virgin olive oil',
          price: 29.99,
        },
        {
          name: 'Organic Honey',
          description: 'Pure organic honey',
          price: 16.99,
        },
        {
          name: 'Dried Fruits Mix',
          description: 'Healthy dried fruits',
          price: 12.99,
        },
        {
          name: 'Gourmet Cheese Set',
          description: 'Assorted fine cheeses',
          price: 34.99,
        },
        {
          name: 'Craft Beer Pack',
          description: 'Selection of craft beers',
          price: 39.99,
        },
      ],
    },
    {
      category: 'OTHER',
      products: [
        { name: 'Gift Card', description: 'Universal gift card', price: 50.0 },
        {
          name: 'Phone Case',
          description: 'Protective phone case',
          price: 19.99,
        },
        {
          name: 'USB Cable Set',
          description: 'Assorted USB cables',
          price: 9.99,
        },
        {
          name: 'Desk Organizer',
          description: 'Desktop organization tool',
          price: 24.99,
        },
        {
          name: 'Travel Pillow',
          description: 'Comfortable travel pillow',
          price: 16.99,
        },
        { name: 'Wall Clock', description: 'Modern wall clock', price: 34.99 },
        {
          name: 'Photo Frame',
          description: 'Elegant photo frame',
          price: 14.99,
        },
        {
          name: 'Notebook Set',
          description: 'Premium notebooks',
          price: 12.99,
        },
      ],
    },
  ];

  // Tạo products với faker data
  for (const categoryGroup of categoryData) {
    for (const product of categoryGroup.products) {
      const fakeProduct = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
        imageUrl: faker.image.urlLoremFlickr({ category: 'product' }),
        category: categoryGroup.category as any,
      };

      await prisma.product.upsert({
        where: { name: fakeProduct.name },
        update: {},
        create: fakeProduct,
      });
      console.log(
        `Seeded product: ${fakeProduct.name} (${categoryGroup.category})`,
      );
    }
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
