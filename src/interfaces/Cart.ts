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
  userId: string;
  items: CartItem[];
};
