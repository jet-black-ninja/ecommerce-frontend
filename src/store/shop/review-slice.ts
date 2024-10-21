import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { Review } from '@/interfaces/Review';

export interface ReviewStateProp {
  isLoading: boolean;
  reviews: Review[];
}
const initialState: ReviewStateProp = {
  isLoading: false,
  reviews: [],
};
const serverURL = import.meta.env.VITE_SERVER_URL;

export const addReview = createAsyncThunk(
  '/order/addReview',
  async (formData: Review) => {
    const response = await axios.post(
      `${serverURL}/api/shop/review/add`,
      formData
    );
    return response.data;
  }
);

export const getReviews = createAsyncThunk('/order/getReviews', async (id) => {
  const response = await axios.get(`${serverURL}/api/shop/review/${id}`);
  return response.data;
});

const reviewSlice = createSlice({
  name: 'reviewSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getReviews.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getReviews.fulfilled, (state, action) => {
        state.isLoading = false;
        state.reviews = action.payload.data;
      })
      .addCase(getReviews.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export default reviewSlice.reducer;
