/*
  Warnings:

  - You are about to drop the column `price` on the `order_items` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order_items" DROP COLUMN "price";

-- AddForeignKey
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("_id") ON DELETE RESTRICT ON UPDATE CASCADE;
