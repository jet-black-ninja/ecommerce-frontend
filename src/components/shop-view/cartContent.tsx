import { useDispatch, useSelector } from 'react-redux';
import { Minus, Plus, Trash } from 'lucide-react';

import { useToast } from '@/hooks/use-toast';
import { deleteCartItem, updateCartQuantity } from '@/store/shop/cart-slice';
import { AppDispatch, RootState } from '@/store/store';
import { Button } from '../ui/button';
/*@ts-ignore*/
function UserCartItemContent({ cartItem }) {
  const { user } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.shopCart);
  const { productList } = useSelector((state: RootState) => state.shopProduct);
  const dispatch = useDispatch<AppDispatch>();
  const { toast } = useToast();
/*@ts-ignore*/
  function handleUpdateQuantity(getCartItem, typeOfAction) {
    if (typeOfAction === 'plus') {/*@ts-ignore*/
      let getCartItems = cartItems.items || [];

      if (getCartItems.length) {
        const indexOfCurrentCartItem = getCartItems.findIndex(/*@ts-ignore*/
          (item) => item.productId === getCartItem?.productId
        );
        const getCurrentProductIndex = productList.findIndex(/*@ts-ignore*/
          (product) => product._id === getCartItem?.productId
        );/*@ts-ignore*/
        const getTotalStock = productList[getCurrentProductIndex].totalStock;

        if (indexOfCurrentCartItem > -1) {
          const getQuantity = getCartItems[indexOfCurrentCartItem].quantity;
          if (getQuantity + 1 > getTotalStock) {
            toast({
              title: `Only ${getQuantity} quantity can be added for this item`,
              variant: 'destructive',
            });
            return;
          }
        }
      }
    }
    dispatch(
      updateCartQuantity({/*@ts-ignore*/
        userId: user?.id,
        productId: getCartItem?.productId,
        quantity:
          typeOfAction === 'plus'
            ? getCartItem?.quantity + 1
            : getCartItem?.quantity - 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: 'Cart Item updated SuccessFully',
        });
      }
    });
  }
/*@ts-ignore*/
  function handleCartItemDelete(getCartItem) {
    dispatch(/*@ts-ignore*/
      deleteCartItem({ userId: user?.id, productId: getCartItem?.productId })
    ).then((data) => {
      if (data?.payload?.success) {
        toast({
          title: 'Cart Item Deleted Successfully',
        });
      }
    });
  }
  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, 'minus')}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, 'plus')}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  );
}

export default UserCartItemContent;
