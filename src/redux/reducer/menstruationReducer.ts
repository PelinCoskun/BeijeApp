import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MenstruationState {
  menstruationDays: {
    date: string;
    type?: string;
    note?: string;
  }[];
  cycleInfo?: {
    cycleStartDate: string;
    cycleEndDate: string;
  };
}

const initialState: MenstruationState = {
  menstruationDays: [],
  cycleInfo: undefined,
};

const menstruationSlice = createSlice({
  name: 'menstruationDays',
  initialState,
  reducers: {
    setMenstruationData: (
      state,
      action: PayloadAction<{ menstruationDays: MenstruationState['menstruationDays']; cycleInfo?: MenstruationState['cycleInfo'] }>
    ) => {
      state.menstruationDays = action.payload.menstruationDays;
      state.cycleInfo = action.payload.cycleInfo;
      console.log("Menstruation verisi Redux'a eklendi:", action.payload);
    },
  },
});

export const { setMenstruationData } = menstruationSlice.actions;
export default menstruationSlice.reducer;
