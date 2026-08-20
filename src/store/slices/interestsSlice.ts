import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const STORAGE_KEY = "3dbharat.myInterests";

function loadFromStorage(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // ignore storage errors (e.g. private browsing quota)
  }
}

interface InterestsState {
  dealIds: string[];
}

const initialState: InterestsState = {
  dealIds: [],
};

const interestsSlice = createSlice({
  name: "interests",
  initialState,
  reducers: {
    hydrateInterests(state) {
      state.dealIds = loadFromStorage();
    },
    toggleInterest(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.dealIds.includes(id)) {
        state.dealIds = state.dealIds.filter((d) => d !== id);
      } else {
        state.dealIds = [...state.dealIds, id];
      }
      persist(state.dealIds);
    },
    clearInterests(state) {
      state.dealIds = [];
      persist([]);
    },
  },
});

export const { hydrateInterests, toggleInterest, clearInterests } = interestsSlice.actions;
export default interestsSlice.reducer;
