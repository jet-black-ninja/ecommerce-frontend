import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { Product } from '@/interfaces/Product';
interface IState {
  isLoading: boolean;
  productList: Product[];
  productDetails: Product | null;
}
const initialState: IState = {
  isLoading: false,
  productList: [],
  productDetails: null,
};
const serverURL = import.meta.env.VITE_SERVER_URL;
export const fetchAllFilteredProducts = createAsyncThunk(
  '/products/fetchAllProducts',
  async ({
    filterParams,
    sortParams,
  }: {
    filterParams: any;
    sortParams: any;
  }) => {
    const query = new URLSearchParams({
      ...filterParams,
      sortBy: sortParams,
    });

    const result = await axios.get(
      `${serverURL}/api/shop/products/get?${query}`
    );
    return result?.data;
  }
);

export const fetchProductDetails = createAsyncThunk(
  '/products/fetchProductDetails',
  async (id: string) => {
    const result = await axios.get(`${serverURL}/api/shop/products/get/${id}`);

    return result?.data;
  }
);

const shoppingProductSlice = createSlice({
  name: 'shoppingProducts',
  initialState,
  reducers: {
    setProductDetails: (state) => {
      state.productDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllFilteredProducts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchAllFilteredProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productList = action.payload.data;
      })
      .addCase(fetchAllFilteredProducts.rejected, (state) => {
        state.isLoading = false;
        state.productList = [];
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.productDetails = action.payload.data;
      })
      .addCase(fetchProductDetails.rejected, (state) => {
        state.isLoading = false;
        state.productDetails = null;
      });
  },
});

export const { setProductDetails } = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;
