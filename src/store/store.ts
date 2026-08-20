import { configureStore } from "@reduxjs/toolkit";
import dealsReducer from "./slices/dealsSlice";
import investorsReducer from "./slices/investorsSlice";
import interestsReducer from "./slices/interestsSlice";

export const store = configureStore({
  reducer: {
    deals: dealsReducer,
    investors: investorsReducer,
    interests: interestsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
