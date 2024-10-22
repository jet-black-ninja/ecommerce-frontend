import { configureStore } from '@reduxjs/toolkit';

import authReducer from './auth-slice';
import adminProductSlice from './admin/products-slice';
import adminOrderSlice from './admin/order-slice';
import shopProductSlice from './shop/products-slice';
import shopCartSlice from './shop/cart-slice';
import shopAddressSlice from './shop/address-slice';
import shopOrderSlice from './shop/order-slice';
import shopReviewSlice from './shop/review-slice';
import commonFeatureSlice from './common-slice';
import shopSearchSlice from './shop/search-slice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    adminProduct: adminProductSlice,
    adminOrder: adminOrderSlice,
    shopProduct: shopProductSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    common: commonFeatureSlice,
  },
});
// Define RootState type based on the store's reducer
export type RootState = ReturnType<typeof store.getState>;
// Define AppDispatch type
export type AppDispatch = typeof store.dispatch;

export default store;
