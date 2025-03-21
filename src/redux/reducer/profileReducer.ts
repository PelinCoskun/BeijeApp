import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ProfileState {
  data: any; 
}

const initialState: ProfileState = {
  data: {}, 
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<any>) => {
      state.data = action.payload; 
      console.log("Profile verisi Redux'a eklendi:", action.payload); 
    },
  },
});

export const { setProfileData } = profileSlice.actions;
export default profileSlice.reducer;

