import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InsightsState {
  data: any; 
}

const initialState: InsightsState = {
  data: {}, 
};

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setInsightsData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload; 
      console.log("Insights verisi Redux'a eklendi:", action.payload);
    },
  },
});


export const { setInsightsData } = insightsSlice.actions;
export default insightsSlice.reducer;
