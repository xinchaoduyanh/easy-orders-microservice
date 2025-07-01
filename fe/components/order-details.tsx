'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { getOrderById } from '@/lib/api';
import type { Order } from '@/lib/types';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const statusColors = {
  CREATED: 'bg-blue-100 text-blue-800',
  CONFIRMED: 'bg-yellow-100 text-yellow-800',
  DELIVERED: 'bg-green-100 text-green-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

const statusLabels = {
  CREATED: 'Đã tạo',
  CONFIRMED: 'Đã xác nhận',
  DELIVERED: 'Đã giao',
  CANCELLED: 'Đã hủy',
};

const getStatusProgress = (status: string) => {
  switch (status) {
    case 'CREATED':
      return 25;
    case 'CONFIRMED':
      return 50;
    case 'DELIVERED':
      return 100;
    case 'CANCELLED':
      return 0;
    default:
      return 0;
  }
};

export default function OrderDetails({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    let interval: NodeJS.Timeout;
    const fetchOrder = async () => {
      try {
        const data = await getOrderById(orderId);
        setOrder(data);
      } catch (error) {
        toast({
          title: 'Lỗi',
          description: 'Không thể tải thông tin đơn hàng',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
    interval = setInterval(fetchOrder, 3000);
    return () => clearInterval(interval);
  }, [orderId, toast]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!order) {
    return <div>Không tìm thấy đơn hàng</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Chi tiết Đơn hàng #{order.id}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Thông tin Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span className="font-medium">ID Đơn hàng:</span>
              <span>{order.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">User ID:</span>
              <span>{order.userId}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Tổng tiền:</span>
              <span className="font-bold">${Number(order.totalAmount).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Trạng thái:</span>
              <Badge className={statusColors[order.status]}>{statusLabels[order.status]}</Badge>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Ngày tạo:</span>
              <span>{new Date(order.createdAt).toLocaleString('vi-VN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Cập nhật lần cuối:</span>
              <span>{new Date(order.updatedAt).toLocaleString('vi-VN')}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tiến trình Đơn hàng</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Tiến độ</span>
                <span>{getStatusProgress(order.status)}%</span>
              </div>
              <Progress value={getStatusProgress(order.status)} className="h-2" />
            </div>

            <div className="space-y-3">
              <div
                className={`flex items-center space-x-2 ${order.status === 'CREATED' || order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${order.status === 'CREATED' || order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'}`}
                />
                <span>Đơn hàng đã được tạo</span>
              </div>

              <div
                className={`flex items-center space-x-2 ${order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${order.status === 'CONFIRMED' || order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'}`}
                />
                <span>Đơn hàng đã được xác nhận</span>
              </div>

              <div
                className={`flex items-center space-x-2 ${order.status === 'DELIVERED' ? 'text-green-600' : 'text-gray-400'}`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'}`}
                />
                <span>Đơn hàng đã được giao</span>
              </div>

              {order.status === 'CANCELLED' && (
                <div className="flex items-center space-x-2 text-red-600">
                  <div className="w-3 h-3 rounded-full bg-red-600" />
                  <span>Đơn hàng đã bị hủy</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Chi tiết Sản phẩm</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product ID</TableHead>
                <TableHead>Số lượng</TableHead>
                <TableHead>Giá</TableHead>
                <TableHead>Tổng phụ</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.orderItems.map((item, index) => (
                <TableRow key={index}>
                  <TableCell>{item.productId}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
                  <TableCell>${Number(item.price).toFixed(2)}</TableCell>
                  <TableCell>${(item.quantity * Number(item.price)).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
