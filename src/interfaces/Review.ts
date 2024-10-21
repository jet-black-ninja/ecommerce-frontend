export type Review = {
  productId: string;
  userId: string | undefined;
  userName: string | undefined;
  reviewMessage: string;
  reviewValue: number;
};
