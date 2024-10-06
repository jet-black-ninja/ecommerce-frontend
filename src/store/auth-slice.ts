import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const initialState ={
    isAuthenticated: false,
    isLoading: false,
    user: null,
}
const serverURL = import.meta.env.VITE_SERVER_URL ||  'http://localhost:5000' ;
export const registerUser = createAsyncThunk(
    'auth/register',
    async (formData) => {
        const response = await axios.post(
            `${serverURL}/api/auth/register`,
            formData,
            {
                withCredentials: true,
            }
        )
        return response.data;
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (formData) => {
        const response = await axios.post(
            `${serverURL}/api/auth/login`,
            formData,
            {
                withCredentials: true,
            }
        );
        return response.data;
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        const response = await axios.post(
            `${serverURL}/api/auth/logout`,
            {},
            {
                withCredentials: true,
            }
        )
        return response.data;
    }
)

export const CheckAuth = createAsyncThunk (
    'auth/checkAuth',
    async () => {
        const response = await axios.get(
            `${serverURL}/api/auth/check-auth`,
            {
                withCredentials: true,
                headers:{
                    "Cache-Control":
                    "no-store, no-cache, must-revalidate, proxy-revalidate"
                },
            }
        );
        return response.data;
    }
)
const authSlice = createSlice({
    name:'auth',
    initialState,
    reducers:{
        setUser: () => {}
    },
    extraReducers:(builder)=> {
        builder
        .addCase(registerUser.pending, (state) =>{
            state.isLoading = true;
        })
        .addCase(registerUser.fulfilled , (state) => {
            state.isLoading =false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(registerUser.rejected, ( state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(loginUser.pending, (state)=> {
            state.isLoading = true;
        })
        .addCase(loginUser.fulfilled , (state, action) => {
            console.log(action);

            state.isLoading = false;
            state.user = action.payload.success ? action.payload.user : null;
            state.isAuthenticated = action.payload.success;
        })
        .addCase(loginUser.rejected , (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(CheckAuth.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(CheckAuth.fulfilled , (state,action) => {
            state.isLoading = false;
            state.user = action.payload.success? action.payload.user : null;
            state.isAuthenticated = action.payload.success;
        })
        .addCase(CheckAuth.rejected, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        })
        .addCase(logoutUser.fulfilled, (state) => {
            state.isLoading = false;
            state.user = null;
            state.isAuthenticated = false;
        });
    },
});

export const {setUser} = authSlice.actions;
export default authSlice.reducer;