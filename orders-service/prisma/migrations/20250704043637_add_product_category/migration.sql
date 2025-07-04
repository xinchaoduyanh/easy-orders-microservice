-- CreateEnum
CREATE TYPE "ProductCategory" AS ENUM ('ELECTRONICS', 'CLOTHING', 'BOOKS', 'HOME_GARDEN', 'SPORTS', 'BEAUTY', 'FOOD_BEVERAGE', 'OTHER');

-- AlterTable
ALTER TABLE "products" ADD COLUMN     "category" "ProductCategory" NOT NULL DEFAULT 'OTHER';
