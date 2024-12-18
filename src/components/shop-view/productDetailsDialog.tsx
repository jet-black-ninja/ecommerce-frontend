import { useEffect, useState, Dispatch, SetStateAction } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { AppDispatch, RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { setProductDetails } from '@/store/shop/products-slice';
import { addReview, getReviews } from '@/store/shop/review-slice';
import { Dialog, DialogContent } from '../ui/dialog';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Label } from '../ui/label';
import StarRatingComponent from './StarRatingComponent.tsx';
import { Input } from '../ui/input.tsx';
import { Product } from '@/interfaces/Product.ts';
function productDetailsDialog({
  open,
  setOpen,
  productDetails,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  productDetails: Product | null;
}) {
  const [reviewMessage, setReviewMessage] = useState<string>('');
  const [rating, setRating] = useState<number>(0);
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { cartItems } = useSelector((state: RootState) => state.shopCart);
  const { reviews } = useSelector((state: RootState) => state.shopReview);
  const { toast } = useToast();

  function handleRatingChange(getRating: number) {
    setRating(getRating);
  } /* @ts-ignore */
  function handleAddToCart(getCurrentProductId, getTotalStock) {
    /* @ts-ignore */
    let getCartItems = cartItems.items || [];

    if (getCartItems.length) {
      const indexOfCurrentItem = getCartItems.findIndex(
        (item: any) => item.productId === getCurrentProductId
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
        /* @ts-ignore */
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        /* @ts-ignore */
        dispatch(fetchCartItems(user?.id));
        toast({
          title: 'Product is added to cart',
        });
      }
    });
  }

  function handleDialogClose() {
    setOpen(false);
    dispatch(setProductDetails());
    setRating(0);
    setReviewMessage('');
  }

  function handleAddReview() {
    dispatch(
      addReview({
        /* @ts-ignore */
        productId: productDetails?._id,
        userId: user?.id,
        userName: user?.userName,
        reviewMessage: reviewMessage,
        reviewValue: rating,
      })
    ).then((data) => {
      if (data.payload?.success) {
        setRating(0);
        setReviewMessage(''); /* @ts-ignore */
        dispatch(getReviews(productDetails?._id));
        toast({
          title: 'Review Added SuccessFully',
        });
      }
    });
  }

  useEffect(() => {
    /* @ts-ignore */
    if (productDetails !== null) dispatch(getReviews(productDetails?._id));
  }, [productDetails]);

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, reviewItem) => sum + reviewItem.reviewValue, 0) /
        reviews.length
      : 0;

  return (
    <Dialog open={open} onOpenChange={handleDialogClose}>
      <DialogContent className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]">
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails?.image}
            alt={productDetails?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div className="">
          <div className="">
            <h1 className="text-3xl font-extrabold">{productDetails?.title}</h1>
            <p className="text-muted-foreground text-2xl mt-4 mb-5">
              {productDetails?.description}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${productDetails?.salePrice ? 'line-through' : ''}`}
            >
              {productDetails?.price}
            </p>
            {/*@ts-ignore*/}
            {productDetails?.salePrice > 0 ? (
              <p className="text-2xl font-bold text-muted-foreground">
                {productDetails?.salePrice}
              </p>
            ) : null}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div className="flex items-center gap-0.5">
              {/* @ts-ignore */}
              <StarRatingComponent rating={averageRating} />
            </div>
            <span className="text-muted-foreground">
              ({averageRating.toFixed(2)})
            </span>
            <div className=""></div>
          </div>
          <div className="mt-5 mb-5">
            {productDetails?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={() =>
                  handleAddToCart(
                    /* @ts-ignore */
                    productDetails?._id,
                    productDetails?.totalStock
                  )
                }
              >
                Add to Cart
              </Button>
            )}
          </div>
          <Separator />
          <div className="max-h-[300px] overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid grid-gap-6">
              {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4">
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {/* @ts-ignore */}
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {/* @ts-ignore */}
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>
            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMessage}
                onChange={(event) => setReviewMessage(event.target.value)}
                placeholder="Write Your Review"
              />
              <Button
                onClick={handleAddReview}
                disabled={reviewMessage.trim() === ''}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default productDetailsDialog;
