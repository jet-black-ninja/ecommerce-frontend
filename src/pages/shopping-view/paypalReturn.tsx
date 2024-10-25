import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { AppDispatch } from '@/store/store';
import { capturePayment } from '@/store/shop/order-slice';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

function PaypalReturnPage() {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const paymentId = params.get('paymentId');
  const payerId = params.get('PayerId');

  useEffect(() => {
    if (paymentId && payerId) {
      //@ts-ignore
      const orderId = JSON.parse(sessionStorage.getItem('currentOrderId'));
      // console.log(payerId, 'payerId', paymentId, 'paymentId', orderId, 'orderId');
      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem('currentOrderId');
          window.location.href = '/shop/payment-success';
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment ... Please Wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
