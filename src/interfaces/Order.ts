import { Address } from './Address';
import { CartItem } from './Cart';

export type Order = {
  _id: string;
  userId: string | undefined;
  cartId: string;
  cartItems: CartItem[];
  addressInfo: Address;
  orderStatus: string;
  paymentMethod: string;
  paymentStatus: string;
  totalAmount: number;
  orderDate: Date;
  orderUpdateDate: Date;
  paymentId: string;
  payerId: string;
};
