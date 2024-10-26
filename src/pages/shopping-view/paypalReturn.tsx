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
  const payerId = params.get('PayerID');

  useEffect(() => {
    
    if (paymentId && payerId) {
      // console.log('working')
      const orderId = sessionStorage.getItem('currentOrderId') || 'null';
      console.log('i was here', payerId, paymentId,"order", orderId)
      
      if (!orderId) {
        console.error('No order ID found in session storage');
        return;
      }
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
