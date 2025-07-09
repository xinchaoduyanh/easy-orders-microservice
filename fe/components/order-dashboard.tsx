'use client';

import { useState } from 'react';
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
import { useOrder } from '@/queries';
import type { Order } from '@/lib/types';
import { Eye, X, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  } from '@/components/ui/pagination';

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sử dụng useOrder hook
  const { ordersQuery, cancelOrder, cancelOrderStatus } = useOrder();

  const filteredOrders = ordersQuery.data?.filter((order: Order) =>
    statusFilter === 'all' ? true : order.status === statusFilter
  ) || [];

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCancelOrder = (orderId: string) => {
    cancelOrder(orderId, {
      onSuccess: (data) => {
        toast({
          title: 'Thành công',
          description: data?.message || 'Đơn hàng đã được hủy',
        });
      },
      onError: (error: any) => {
        toast({
          title: 'Lỗi',
          description: error?.message || 'Không thể hủy đơn hàng',
          variant: 'destructive',
        });
      },
    });
  };

  const handleManualRefresh = () => {
    ordersQuery.refetch();
    toast({
      title: 'Đang tải lại',
      description: 'Đang tải lại danh sách đơn hàng...',
    });
  };

  if (ordersQuery.isLoading) {
    return <div>Đang tải...</div>;
  }

  if (ordersQuery.isError) {
    return <div>Lỗi khi tải danh sách đơn hàng.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleManualRefresh}
          disabled={ordersQuery.isFetching}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${ordersQuery.isFetching ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

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
                <TableHead>Email</TableHead>
                <TableHead>Tổng tiền</TableHead>
                <TableHead>Trạng thái</TableHead>
                <TableHead>Ngày tạo</TableHead>
                <TableHead>Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order: Order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.userEmail}</TableCell>
                  <TableCell>${Number(order.totalAmount).toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge className={statusColors[order.status as keyof typeof statusColors]}>
                      {statusLabels[order.status as keyof typeof statusLabels]}
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
                                Bạn có chắc chắn muốn hủy đơn hàng #{order.id}? Hành động này không thể hoàn tác.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Hủy bỏ</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleCancelOrder(order.id)}
                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                disabled={cancelOrderStatus === 'loading'}
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
          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-6">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={e => { e.preventDefault(); setCurrentPage(p => Math.max(1, p - 1)); }}
                    aria-disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <PaginationItem key={idx}>
                    <PaginationLink
                      href="#"
                      isActive={currentPage === idx + 1}
                      onClick={e => { e.preventDefault(); setCurrentPage(idx + 1); }}
                    >
                      {idx + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={e => { e.preventDefault(); setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                    aria-disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
