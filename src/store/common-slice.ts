import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface FeatureImage {
  _id: string;
  image: string;
}

interface CommonState {
  isLoading: boolean;
  featureImageList: FeatureImage[];
}
const initialState: CommonState = {
  isLoading: false,
  featureImageList: [],
};

const serverURL = import.meta.env.VITE_SERVER_URL;

export const getFeatureImages = createAsyncThunk(
  'order/getFeatureImages',
  async () => {
    const response = await axios.get<{ data: FeatureImage[] }>(
      `${serverURL}/api/common/feature/get`
    );
    return response.data;
  }
);

export const addFeatureImage = createAsyncThunk(
  'order/addFeatureImage',
  async (image: string | null) => {
    const response = await axios.post<{ data: FeatureImage }>(
      `${serverURL}/api/common/feature/add`,
      { image }
    );

    return response.data;
  }
);

const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(
        getFeatureImages.fulfilled,
        (state, action: PayloadAction<{ data: FeatureImage[] }>) => {
          state.isLoading = false;
          state.featureImageList = action.payload.data;
        }
      )
      .addCase(getFeatureImages.rejected, (state) => {
        state.isLoading = false;
        state.featureImageList = [];
      })
      .addCase(
        addFeatureImage.fulfilled,
        (state, action: PayloadAction<{ data: FeatureImage }>) => {
          state.featureImageList.push(action.payload.data);
        }
      );
  },
});

export default commonSlice.reducer;
