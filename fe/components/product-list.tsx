'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';
import { getProducts } from '@/lib/api';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';
import { useProduct } from '@/queries';

export default function ProductList() {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const { data: products, isLoading, isError } = useProduct();

  const handleAddToCart = (product: Product) => {
    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: 1,
    });

    toast({
      title: 'Đã thêm vào giỏ hàng',
      description: `${product.name} đã được thêm vào giỏ hàng`,
    });
  };

  if (isLoading) {
    return <div>Đang tải...</div>;
  }

  if (isError) {
    return <div>Lỗi khi tải sản phẩm.</div>;
  }

  return (
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
  );
}
