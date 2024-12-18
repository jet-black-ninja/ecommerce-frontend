import { useNavigate } from 'react-router-dom';
import { Dispatch, SetStateAction } from 'react';

import { SheetContent, SheetHeader, SheetTitle } from '../ui/sheet.tsx';
import { Button } from '../ui/button.tsx';
import UserCartItemContent from './cartContent'; /*@ts-ignore*/
import { CartItem } from '@/interfaces/Cart.ts';

function UserCartWrapper({
  cartItems,
  setOpenCartSheet,
}: {
  cartItems: CartItem[];
  setOpenCartSheet: Dispatch<SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const totalCartAmount =
    cartItems && cartItems.length > 0
      ? cartItems.reduce(
          (sum: number, currentItem: CartItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem.salePrice
              : currentItem.price) *
              currentItem?.quantity,
          0
        )
      : 0;
  return (
    <SheetContent className="sm:max-w-md">
      <SheetHeader>
        <SheetTitle>Your Cart</SheetTitle>
      </SheetHeader>
      <div className="mt-8 space-y-4">
        {cartItems.length > 0
          ? cartItems.map((item: CartItem) => (
              <UserCartItemContent cartItem={item} key={item._id} />
            ))
          : null}
      </div>
      <div className="mt-8 space-y-4">
        <div className="flex justify-between">
          <span className="font-bold">Total</span>
          <span className="font-bold">${totalCartAmount}</span>
        </div>
      </div>
      <Button
        onClick={() => {
          navigate('/shop/checkout');
          setOpenCartSheet(false);
        }}
        className="w-full mt-6"
      >
        Checkout
      </Button>
    </SheetContent>
  );
}

export default UserCartWrapper;
