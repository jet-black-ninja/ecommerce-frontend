import { useDispatch, useSelector } from 'react-redux';
import { useState } from 'react';

import { AppDispatch, RootState } from '@/store/store';
import img from '../../assets/accImg.png';
import Address from '@/components/shop-view/address';
import { useToast } from '@/hooks/use-toast';
import { createNewOrder } from '@/store/shop/order-slice';
import UserCartItemContent from '@/components/shop-view/cartContent';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/interfaces/Cart';
import { Order } from '@/interfaces/Order';

function CheckoutPage() {
  const { cartItems } = useSelector((state: RootState) => state.shopCart);
  const { user } = useSelector((state: RootState) => state.auth);
  const { approvalURL } = useSelector((state: RootState) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymentStart] = useState<boolean>(false);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();

  const totalCartAmount =
    //@ts-ignore
    cartItems && cartItems.items && cartItems.items.length > 0
      ? //@ts-ignore
        cartItems.items.reduce(
          //@ts-ignore
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleInitialPaypalPayment() {
    if (cartItems.length === 0) {
      toast({
        title: ' Your cart is empty , please add items to process',
        variant: 'destructive',
      });
      return;
    }
    if (currentSelectedAddress === null) {
      toast({
        title: ' Please select a shipping address',
        variant: 'destructive',
      });
      return;
    }

    const orderData: Order = {
      
      userId: user?.id,
      //@ts-ignore
      cartId: cartItems?._id,
      //@ts-ignore
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        //@ts-ignore
        addressId: currentSelectedAddress?._id, //@ts-ignore
        address: currentSelectedAddress?.address, //@ts-ignore
        city: currentSelectedAddress?.city, //@ts-ignore
        pincode: currentSelectedAddress?.pincode, //@ts-ignore
        phone: currentSelectedAddress?.phone, //@ts-ignore
        notes: currentSelectedAddress?.notes, //@ts-ignore
      },
      orderStatus: 'pending',
      paymentMethod: 'paypal',
      paymentStatus: 'pending',
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: '',
      payerId: '',
    };
    
    dispatch(createNewOrder(orderData)).then((data) => {
      // console.log(data, 'order finish data');
      if (data?.payload?.success) {
        setIsPaymentStart(true);
      } else {
        setIsPaymentStart(false);
      }
    });
  }

  if (approvalURL) {
    window.location.href = approvalURL;
  }
  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover origin-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {/*@ts-ignore*/}
          {cartItems && cartItems.items && cartItems.items.length > 0
            /*@ts-ignore*/
            ? cartItems.items.map((item: CartItem) => (
                <UserCartItemContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button className="w-full" onClick={handleInitialPaypalPayment}>
              {isPaymentStart
                ? 'Processing Paypal Payment ...'
                : 'Checkout With Paypal'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
