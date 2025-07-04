'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/lib/cart-context';
import { useToast } from '@/hooks/use-toast';
import type { Product, ProductCategory } from '@/lib/types';
import { ShoppingCart, Minus, Plus } from 'lucide-react';

const categoryColors: Record<ProductCategory, string> = {
  ELECTRONICS: 'bg-blue-500',
  CLOTHING: 'bg-purple-500',
  BOOKS: 'bg-green-500',
  HOME_GARDEN: 'bg-orange-500',
  SPORTS: 'bg-red-500',
  BEAUTY: 'bg-pink-500',
  FOOD_BEVERAGE: 'bg-yellow-500',
  OTHER: 'bg-gray-400',
};

const categoryLabels: Record<ProductCategory, string> = {
  ELECTRONICS: 'Điện tử',
  CLOTHING: 'Thời trang',
  BOOKS: 'Sách',
  HOME_GARDEN: 'Nhà cửa',
  SPORTS: 'Thể thao',
  BEAUTY: 'Làm đẹp',
  FOOD_BEVERAGE: 'Thực phẩm',
  OTHER: 'Khác',
};

interface AddToCartDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function AddToCartDialog({ product, isOpen, onClose }: AddToCartDialogProps) {
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleQuantityChange = (value: number) => {
    if (value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: quantity,
      imageUrl: product.imageUrl,
    });

    toast({
      title: 'Đã thêm vào giỏ hàng',
      description: `${product.name} (${quantity} cái) đã được thêm vào giỏ hàng`,
    });

    // Reset quantity and close dialog
    setQuantity(1);
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Thêm vào giỏ hàng</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
            )}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold">{product.name}</h3>
                <Badge 
                  variant="secondary" 
                  className={`${categoryColors[product.category]} text-white`}
                >
                  {categoryLabels[product.category]}
                </Badge>
              </div>
              <p className="text-2xl font-bold text-primary">
                ${Number(product.price).toFixed(2)}
              </p>
              {product.description && (
                <p className="text-sm text-gray-500 mt-1">{product.description}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Số lượng</Label>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity - 1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                className="text-center w-20"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(quantity + 1)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <span className="font-medium">Tổng cộng:</span>
              <span className="text-xl font-bold text-primary">
                ${(Number(product.price) * quantity).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2">
          <Button variant="outline" onClick={handleClose}>
            Hủy
          </Button>
          <Button onClick={handleAddToCart} className="flex items-center">
            <ShoppingCart className="h-4 w-4 mr-2" />
            Thêm vào giỏ hàng
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 