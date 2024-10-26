import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  getAllOrdersForAdmin,
  getOrderDetailsForAdmin,
  resetOrderDetails,
} from '@/store/admin/order-slice';
import { Badge } from '@/components/ui/badge';
import { AppDispatch, RootState } from '@/store/store';
import AdminOrderDetailsView from '@/components/admin-view/order-details';
import { Order } from '@/interfaces/Order';

//TODO add types as well as check if it works after adding dummy orders

function AdminOrders() {
  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const { orderList, orderDetails } = useSelector(
    (state: RootState) => state.adminOrder
  );
  // console.log(orderDetails , "orders Detail");
  const dispatch = useDispatch<AppDispatch>();

  function handleFetchOrderDetail(getId: string) {
    dispatch(getOrderDetailsForAdmin(getId));
  }
  useEffect(() => {
    dispatch(getAllOrdersForAdmin());
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailDialog(true);
  }, [orderDetails]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>All Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0 ? (
              orderList.map((orderItem:Order) => (
                <TableRow>
                  <TableCell>{orderItem?._id}</TableCell>{/* @ts-ignore*/}
                  <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                  <TableCell>
                    <Badge
                      className={`py-1 px-3 ${
                        orderItem.orderStatus === 'confirmed'
                          ? 'bg-green-500'
                          : orderItem?.orderStatus === 'rejected'
                            ? 'bg-red-600'
                            : 'bg-black'
                      }`}
                    >
                      {orderItem?.orderStatus}
                    </Badge>
                  </TableCell>
                  <TableCell>${orderItem?.totalAmount}</TableCell>
                  <TableCell>
                    <Dialog
                      open={openDetailDialog}
                      onOpenChange={() => {
                        setOpenDetailDialog(false);
                        dispatch(resetOrderDetails());
                      }}
                    >
                      <Button
                        onClick={() => handleFetchOrderDetail(orderItem._id)}
                      >
                        View Details
                      </Button>
                      <AdminOrderDetailsView orderDetails={orderDetails} />
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow key="empty-table">
                <TableCell colSpan={5}>No orders found</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default AdminOrders;
