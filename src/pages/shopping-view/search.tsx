import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';

import ProductDetailsDialog from '@/components/shop-view/productDetailsDialog';
import ShoppingProductTile from '@/components/shop-view/productTile';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { fetchProductDetails } from '@/store/shop/products-slice';
import { getSearchResult, resetSearchResults } from '@/store/shop/search-slice';
import { AppDispatch, RootState } from '@/store/store';
import { CartItem } from '@/interfaces/Cart';
function SearchPage() {
  const [keyword, setKeyword] = useState<string>('');
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const [, setSearchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const { searchResults } = useSelector((state: RootState) => state.shopSearch);
  const { productDetails } = useSelector(
    (state: RootState) => state.shopProduct
  );

  const { user } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.shopCart);
  const { toast } = useToast();

  useEffect(() => {
    if (keyword && keyword.trim() !== '' && keyword.trim().length > 3) {
      setTimeout(() => {
        setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
        //@ts-ignore
        dispatch(getSearchResult(keyword));
      }, 1000);
    } else {
      setSearchParams(new URLSearchParams(`?keyword=${keyword}`));
      dispatch(resetSearchResults());
    }
  }, [keyword]);
  function handleAddToCart(getCurrentProductId: string, getTotalStock: number) {
    //@ts-ignore
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item: CartItem) => item.productId === getCurrentProductId
      );
      if (indexOfCurrentItem > -1) {
        const getQuantity = getCartItems[indexOfCurrentItem].quantity;
        if (getQuantity + 1 > getTotalStock) {
          toast({
            title: `Only ${getQuantity} quantity can be added for this item`,
            variant: 'destructive',
          });

          return;
        }
      }
    }

    dispatch(
      addToCart({
        //@ts-ignore
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        //@ts-ignore
        dispatch(fetchCartItems(user?.id));
        toast({
          title: 'Product is added to cart',
        });
      }
    });
  }

  function handleGetProductDetails(getCurrentProductId: string) {
    //@ts-ignore
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  return (
    <div className="container mx-auto md:py-6 px-4 py-8">
      <div className="flex justify-center mb-8">
        <div className="w-full flex items-center">
          <Input
            value={keyword}
            name={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            className="py-6"
            placeholder="Search Products ..."
          />
        </div>
      </div>
      {!searchResults.length ? (
        <h1 className="text-5xl font-extrabold">No Results Found ...</h1>
      ) : null}
      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {searchResults.map((item) => (
          <ShoppingProductTile
            handleAddToCart={handleAddToCart}
            product={item}
            handleGetProductDetails={handleGetProductDetails}
          />
        ))}
      </div>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}/* @ts-ignore */
        productDetails={productDetails}
      />
    </div>
  );
}

export default SearchPage;
