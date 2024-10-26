
export type CartItem = {
  _id: string;
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
  salePrice: number;
};
export type Cart = {
  _id: string;
  userId: string;
  items: CartItem[];
};
