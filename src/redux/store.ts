import { configureStore } from '@reduxjs/toolkit';
import profileReducer from '../redux/reducer/profileReducer';
import menstruationReducer from '../redux/reducer/menstruationReducer';
import insightsReducer from '../redux/reducer/insightsReducer';

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    menstruation: menstruationReducer,
    insights: insightsReducer,
  },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
