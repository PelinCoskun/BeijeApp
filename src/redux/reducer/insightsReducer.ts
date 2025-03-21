import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface InsightsState {
  data: any; // Veriyi dizi olarak tanımladık
}

const initialState: InsightsState = {
  data: {}, // Başlangıç durumu: boş dizi
};

const insightsSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    setInsightsData: (state, action: PayloadAction<any[]>) => {
      state.data = action.payload; // Veriyi güncelliyoruz
      console.log("Insights verisi Redux'a eklendi:", action.payload);
    },
  },
});


export const { setInsightsData } = insightsSlice.actions;
export default insightsSlice.reducer;
