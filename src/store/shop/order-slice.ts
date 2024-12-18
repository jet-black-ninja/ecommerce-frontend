import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

import { Order } from '@/interfaces/Order';

interface OrderDetails {}
interface OrderState {
  approvalURL: string | null;
  isLoading: boolean;
  orderId: string | null;
  orderList: Order[];
  orderDetails: OrderDetails | null;
}
const initialState: OrderState = {
  approvalURL: null,
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
};
const serverURL = import.meta.env.VITE_SERVER_URL;

export const createNewOrder = createAsyncThunk(
  '/order/createNewOrder',
  async (orderData: Order) => {
    const response = await axios.post(
      `${serverURL}/api/shop/order/create`,
      orderData
    );

    return response.data;
  }
);

export const capturePayment = createAsyncThunk(
  'order/capturePayment',
  async ({
    paymentId,
    payerId,
    orderId,
  }: {
    paymentId: string;
    payerId: string;
    orderId: string;
  }) => {
    const response = await axios.post(`${serverURL}/api/shop/order/capture`, {
      paymentId,
      payerId,
      orderId,
    });
    return response.data;
  }
);

export const getAllOrdersByUser = createAsyncThunk(
  'order/getAllOrdersByUser',
  async (userId) => {
    const response = await axios.get(
      `${serverURL}/api/shop/order/list/${userId}`
    );
    return response.data;
  }
);

export const getOrderDetails = createAsyncThunk(
  '/order/getOrderDetails',
  async (orderId) => {
    const response = await axios.get(
      `${serverURL}/api/shop/order/details/${orderId}`
    );
    return response.data;
  }
);

const shoppingOrderSlice = createSlice({
  name: 'shoppingOrderSlice',
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.approvalURL = action.payload.approvalURL;
        state.orderId = action.payload.orderId;
        sessionStorage.setItem('currentOrderId', action.payload.orderId);
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.approvalURL = null;
        state.orderId = null;
      })
      .addCase(getAllOrdersByUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUser.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

export const { resetOrderDetails } = shoppingOrderSlice.actions;

export default shoppingOrderSlice.reducer;
