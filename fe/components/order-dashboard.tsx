'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { getOrders, cancelOrder } from '@/lib/api';
import type { Order } from '@/lib/types';
import { Eye, X, RefreshCw } from 'lucide-react';
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

export default function OrderDashboard() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchOrders = async () => {
    try {
      const data = await getOrders();
      setOrders(data);
      setFilteredOrders(data);
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể tải danh sách đơn hàng',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();

    // Polling every 5 seconds for real-time updates
    const interval = setInterval(fetchOrders, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter((order) => order.status === statusFilter));
    }
  }, [orders, statusFilter]);

  const handleCancelOrder = async (orderId: string) => {
    try {
      await cancelOrder(orderId);
      toast({
        title: 'Thành công',
        description: 'Đơn hàng đã được hủy',
      });
      fetchOrders(); // Refresh the list
    } catch (error) {
      toast({
        title: 'Lỗi',
        description: 'Không thể hủy đơn hàng',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Lọc theo trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="CREATED">Đã tạo</SelectItem>
              <SelectItem value="CONFIRMED">Đã xác nhận</SelectItem>
              <SelectItem value="DELIVERED">Đã giao</SelectItem>
              <SelectItem value="CANCELLED">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button onClick={fetchOrders} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Làm mới
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Danh sách Đơn hàng ({filteredOrders.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID Đơn hàng</TableHead>
                <TableHead>User ID</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.userId}</TableCell>
                  <TableCell>${Number(order.totalAmount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status]}>
                      {statusLabels[order.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/dashboard/${order.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>

                      {order.status !== 'CANCELLED' && order.status !== 'DELIVERED' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <X className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Xác nhận hủy đơn hàng</AlertDialogTitle>
                              <AlertDialogDescription>
                                Bạn có chắc chắn muốn hủy đơn hàng #{order.id}? Hành động này không
                                thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelOrder(order.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                              >
                                Xác nhận hủy
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
