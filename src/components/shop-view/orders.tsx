import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  getAllOrdersByUser,
  getOrderDetails,
  resetOrderDetails,
} from '@/store/shop/order-slice';
import { AppDispatch, RootState } from '@/store/store';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog } from '../ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import ShoppingOrderDetailsView from './order-details';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
function Orders() {
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { orderList, orderDetails } = useSelector(
    (state: RootState) => state.shopOrder
  );

  function handleFetchOrderDetails(getId: string) {
    /*@ts-ignore*/
    dispatch(getOrderDetails(getId));
  }

  useEffect(() => {
    /*@ts-ignore*/
    dispatch(getAllOrdersByUser(user?.id));
  }, [dispatch]);

  useEffect(() => {
    if (orderDetails !== null) setOpenDetailsDialog(true);
  }, [orderDetails]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Orders</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Id</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Order Status</TableHead>
              <TableHead>Order Price</TableHead>
              <TableHead>
                <span className="sr-only">Details</span>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderList && orderList.length > 0
              ? orderList.map((orderItem) => (
                  <TableRow>
                    {/*@ts-ignore*/}
                    <TableCell>{orderItem?._id}</TableCell>
                    {/*@ts-ignore*/}
                    <TableCell>{orderItem?.orderDate.split('T')[0]}</TableCell>
                    <TableCell>
                      <Badge
                        className={`py-1 px-3 ${
                          /*@ts-ignore*/
                          orderItem?.orderStatus === 'confirmed'
                            ? 'bg-green-500' /*@ts-ignore*/
                            : orderItem?.orderStatus === 'rejected'
                              ? 'bg-red-600'
                              : 'bg-black'
                        }`}
                      >
                        {/*@ts-ignore*/}
                        {orderItem?.orderStatus}
                      </Badge>
                    </TableCell>
                    {/*@ts-ignore*/}
                    <TableCell>${orderItem?.totalAmount}</TableCell>
                    <TableCell>
                      <Dialog
                        open={openDetailsDialog}
                        onOpenChange={() => {
                          setOpenDetailsDialog(false);
                          dispatch(resetOrderDetails());
                        }}
                      >
                        <Button
                          onClick={() =>
                            /* @ts-ignore */
                            handleFetchOrderDetails(orderItem?._id)
                          }
                        >
                          View Details
                        </Button>
                        {/* @ts-ignore */}
                        <ShoppingOrderDetailsView orderDetails={orderDetails} />
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              : null}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default Orders;
