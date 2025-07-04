'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
import { useProduct } from '@/queries';
import AddToCartDialog from './add-to-cart-dialog';

export default function ProductList() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data: products, isLoading, isError } = useProduct();

  const handleAddToCart = (product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedProduct(null);
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (isError) {
    return <div>Lỗi khi tải sản phẩm.</div>;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products?.map((product: Product) => (
          <Card key={product.id} className="flex flex-col">
            <CardHeader>
              {product.imageUrl && (
                <img
                  src={product.imageUrl}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md mb-2"
                />
              )}
              <CardTitle className="text-lg">{product.name}</CardTitle>
              <div className="text-sm text-muted-foreground">ID: {product.id}</div>
              {product.description && (
                <div className="text-sm text-gray-500 mt-1">{product.description}</div>
              )}
            </CardHeader>
            <CardContent className="flex-1">
              <div className="text-2xl font-bold text-primary">
                ${Number(product.price).toFixed(2)}
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => handleAddToCart(product)} className="w-full">
                <ShoppingCart className="h-4 w-4 mr-2" />
                Thêm vào giỏ hàng
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <AddToCartDialog
        product={selectedProduct}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </>
  );
}
