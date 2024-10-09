import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    isLoading : false,
    productList: [],
};
const serverURL = import.meta.env.VITE_SERVER_URL;

export const addNewProduct = createAsyncThunk(
    '/products/addNewProduct',
    async(formData) => {
        const response = await axios.post(
            `${serverURL}/api/admin/products/add`,
            formData,
            {
                headers:{
                    "Content-Type":"application/json"
                },
            }
        );

        return response?.data;
    }
);

export const fetchAllProducts = createAsyncThunk (
    '/products/fetchAllProducts',
    async () => {
        const response = await axios.get(
            `${serverURL}/api/admin/products/get`
        );
        return response?.data;
    }
);
//TODO add correct formData type
export const editProduct = createAsyncThunk (
    '/products/editProduct',
    async({id, formData}:{id:string; formData: any}) => {
        const response = await axios.put(
            `${serverURL}/api/admin/products/edit/${id}`,
            formData,
            {
                headers:{
                    "Content-Type":"application/json"
                },
            }
        );
        return response?.data;
    }
);

export const deleteProduct  = createAsyncThunk(
    '/product/deleteProduct',
    async (id) => {
        const response = await axios.delete(
            `${serverURL}/api/admin/products/delete/${id}`
        )

        return response?.data;
    }
)

const adminProductSlice = createSlice({
    name:'adminProducts',
    initialState,
    reducers:{},
    extraReducers: (builder) => {
        builder
        .addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchAllProducts.fulfilled , (state, action) => {
            state.isLoading = false;
            state.productList = action.payload.data;
        })
        .addCase(addNewProduct.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(addNewProduct.fulfilled, (state) => {
            state.isLoading = false;
        })
        .addCase(addNewProduct.rejected, (state) => {
            state.isLoading = false;
            state.productList = [];
        });
    }
});

export default adminProductSlice.reducer;
