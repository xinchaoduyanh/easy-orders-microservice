'use client';

import { useCart } from '@/lib/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus, Minus } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { createOrder } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getTotalAmount } = useCart();
  const [userEmail, setUserEmail] = useState('');
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleCreateOrder = async () => {
    if (!userEmail.trim()) {
      toast({
        title: 'Lỗi',
        description: 'Vui lòng nhập Emall của bạn',
        variant: 'destructive',
      });
      return;
    }

    if (cart.length === 0) {
      toast({
        title: 'Lỗi',
        description: 'Giỏ hàng trống',
        variant: 'destructive',
      });
      return;
    }

    setIsCreatingOrder(true);
    try {
      const orderItems = cart.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));
      console.log(orderItems);
      const order = await createOrder(userEmail, orderItems);
      console.log(order);
      toast({
        title: 'Thành công',
        description: `Đơn hàng #${order.id} đã được tạo thành công!`,
      });

      clearCart();
      router.push(`/dashboard/${order.id}`);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tạo đơn hàng. Vui lòng thử lại.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Giỏ hàng trống</h1>
        <p className="text-muted-foreground mb-6">Thêm sản phẩm vào giỏ hàng để tiếp tục</p>
        <Button onClick={() => router.push('/products')}>Xem sản phẩm</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Giỏ hàng</h1>

      <Card>
        <CardHeader>
          <CardTitle>Sản phẩm trong giỏ hàng</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sản phẩm</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Tổng phụ</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {cart.map((item) => (
                <TableRow key={item.productId}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.productName}</div>
                      <div className="text-sm text-muted-foreground">ID: {item.productId}</div>
                    </div>
                  </TableCell>
                  <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          updateQuantity(item.productId, Math.max(1, item.quantity - 1))
                        }
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>${(Number(item.price) * item.quantity).toFixed(2)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeFromCart(item.productId)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-xl font-bold">Tổng cộng: ${getTotalAmount().toFixed(2)}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Thông tin đặt hàng</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="userEmail">User Email</Label>
            <Input
              id="userEmail"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Nhập Eamil của bạn"
            />
          </div>
          <Button onClick={handleCreateOrder} disabled={isCreatingOrder} className="w-full">
            {isCreatingOrder ? 'Đang tạo đơn hàng...' : 'Tạo đơn hàng'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
