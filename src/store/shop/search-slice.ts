import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  isLoading: false,
  searchResults: [],
};
const serverURl = import.meta.env.VITE_SERVER_URL;

export const getSearchResult = createAsyncThunk(
  'order/getSearchResults',
  async (keyword) => {
    const response = await axios.get(`${serverURl}/api/shop/search/${keyword}`);
    return response.data;
  }
);

const searchSlice = createSlice({
  name: 'searchSlice',
  initialState,
  reducers: {
    resetSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSearchResult.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getSearchResult.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload.data;
      })
      .addCase(getSearchResult.rejected, (state) => {
        state.isLoading = false;
        state.searchResults = [];
      });
  },
});

export const { resetSearchResults } = searchSlice.actions;

export default searchSlice.reducer;
