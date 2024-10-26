import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Airplay,
  BabyIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CloudLightning,
  Heater,
  Images,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  fetchAllFilteredProducts,
  fetchProductDetails,
} from '@/store/shop/products-slice';
import { addToCart, fetchCartItems } from '@/store/shop/cart-slice';
import { useToast } from '@/hooks/use-toast';
import { getFeatureImages } from '@/store/common-slice';
import ShoppingProductTile from '@/components/shop-view/productTile';
import ProductDetailsDialog from '@/components/shop-view/productDetailsDialog';
import { AppDispatch, RootState } from '@/store/store';

const categoriesWithIcon = [
  { id: 'men', label: 'Men', icon: ShirtIcon },
  { id: 'women', label: 'Women', icon: CloudLightning },
  { id: 'kids', label: 'Kids', icon: BabyIcon },
  { id: 'accessories', label: 'Accessories', icon: WatchIcon },
  { id: 'footwear', label: 'Footwear', icon: UmbrellaIcon },
];

const brandsWithIcon = [
  { id: 'nike', label: 'Nike', icon: Shirt },
  { id: 'adidas', label: 'Adidas', icon: WashingMachine },
  { id: 'puma', label: 'Puma', icon: ShoppingBasket },
  { id: 'levi', label: "Levi's", icon: Airplay },
  { id: 'zara', label: 'Zara', icon: Images },
  { id: 'h&m', label: 'H&M', icon: Heater },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState<number>(0);
  const { productList, productDetails } = useSelector(
    (state: RootState) => state.shopProduct
  );
  const { featureImageList } = useSelector((state: RootState) => state.common);
  const [openDetailsDialog, setOpenDetailsDialog] = useState<boolean>(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { toast } = useToast();

  function handleNavigationToListingPage(getCurrentItem: any, section: any) {
    sessionStorage.removeItem('filters');
    const currentFilter = {
      [section]: [getCurrentItem.id],
    };
    sessionStorage.setItem('filters', JSON.stringify(currentFilter));
    navigate('/shop/listing');
  }

  function handleGetProductDetails(getCurrentProductId: string) {
    dispatch(fetchProductDetails(getCurrentProductId));
  }

  function handleAddToCart(getCurrentProductId: string) {
    dispatch(
      addToCart({
        userId: user?.id,
        productId: getCurrentProductId,
        quantity: 1,
      })
    ).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchCartItems(user?.id));
        toast({
          title: 'Product Added To Cart',
        });
      }
    });
  }
  useEffect(() => {
    if (productDetails !== null) setOpenDetailsDialog(true);
  }, [productDetails]);
  useEffect(() => {
    dispatch(
      fetchAllFilteredProducts({
        filterParams: {},
        sortParams: 'price-lowtohigh',
      })
    );
  }, [dispatch]);

  useEffect(() => {
    dispatch(getFeatureImages());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % featureImageList.length);
    }, 15000);
    return () => clearInterval(timer);
  }, [featureImageList]);
  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative w-full h-[600px] overflow-hidden">
        {featureImageList && featureImageList.length > 0
          ? featureImageList.map((slide, index) => (
              <img
                src={slide?.image}
                key={index}
                className={`${index === currentSlide ? 'opacity-100' : 'opacity-0'}
            absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000`}
              />
            ))
          : null}
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) =>
                (prevSlide - 1 + featureImageList.length) %
                featureImageList.length
            )
          }
          className="absolute top-1/2 left-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={() =>
            setCurrentSlide(
              (prevSlide) => (prevSlide + 1) % featureImageList.length
            )
          }
          className="absolute top-1/2 right-4 transform -translate-y-1/2 bg-white/80"
        >
          <ChevronRightIcon className="w-4 h-4" />
        </Button>
      </div>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Shop By Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow "
                onClick={() =>
                  handleNavigationToListingPage(categoryItem, 'category')
                }
              >
                <CardContent className="flex flex-col items-center justify-center p-6 min-h-[170px]">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop By Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
            {brandsWithIcon.map((brandItem) => (
              <Card
                className="cursor-pointer hover:shadow-lg transition-shadow "
                onClick={() =>
                  handleNavigationToListingPage(brandItem, 'brand')
                }
              >
                <CardContent className="flex flex-col items-center justify-center p-6 min-h-[170px]">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            Feature Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {productList && productList.length > 0
              ? productList.map((productItem) => (
                  <ShoppingProductTile
                    handleGetProductDetails={handleGetProductDetails}
                    product={productItem}
                    handleAddToCart={handleAddToCart}
                  />
                ))
              : null}
          </div>
        </div>
      </section>
      <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      />
    </div>
  );
}

export default ShoppingHome;
