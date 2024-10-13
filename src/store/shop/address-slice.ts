import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface IFormData{

}
const initialState = {
  isLoading: false,
  addressList: [],
};

const serverURL = import.meta.env.VITE_SERVER_URL;

export const addNewAddress = createAsyncThunk(
    "/addresses/addNewAddress",
    async (formData) => {
      const response = await axios.post(
        `${serverURL}/api/shop/address/add`,
        formData
      );
  
      return response.data;
    }
);

export const fetchAllAddresses = createAsyncThunk(
    "/addresses/fetchAllAddresses",
    async (userId) => {
      const response = await axios.get(
        `${serverURL}/api/shop/address/get/${userId}`
      );
  
      return response.data;
    }
);

export const editAddress = createAsyncThunk(
    "/addresses/editAddress",
    async ({ userId, addressId, formData }:{userId:string, addressId:string, formData:IFormData}) => {
      const response = await axios.put(
        `${serverURL}/api/shop/address/update/${userId}/${addressId}`,
        formData
      );
  
      return response.data;
    }
);

export const deleteAddress = createAsyncThunk(
    "/addresses/deleteAddress",
    async ({ userId, addressId }:{userId: string, addressId:string}) => {
      const response = await axios.delete(
        `${serverURL}/api/shop/address/delete/${userId}/${addressId}`
      );
  
      return response.data;
    }
);

const addressSlice = createSlice({
    name:'address',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
        .addCase(addNewAddress.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addNewAddress.fulfilled, (state) => {
            state.isLoading = false;
        })
        .addCase(addNewAddress.rejected, (state) => {
            state.isLoading  = false;
        })
        .addCase(fetchAllAddresses.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchAllAddresses.fulfilled, (state, action) => {
            state.isLoading = false;
            state.addressList = action.payload.data;
        })
        .addCase(fetchAllAddresses.rejected, (state) => {
            state.isLoading = false;
            state.addressList = [];
        });
    }
});

export default addressSlice.reducer;