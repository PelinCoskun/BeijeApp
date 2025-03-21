import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface ProfileState {
  data: any; // Profil verisini nesne olarak tanımladık
}

const initialState: ProfileState = {
  data: {}, // Başlangıç durumu: boş nesne
};

const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action: PayloadAction<any>) => {
      state.data = action.payload; // Veriyi güncelliyoruz
      console.log("Profile verisi Redux'a eklendi:", action.payload); // Veriyi logla
    },
  },
});

export const { setProfileData } = profileSlice.actions;
export default profileSlice.reducer;

