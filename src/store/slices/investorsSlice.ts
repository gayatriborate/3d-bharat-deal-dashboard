import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { InvestorProfile } from "@/types/deal";
import { fetchInvestors } from "@/services/investorService";

interface InvestorsState {
  list: InvestorProfile[];
  activeInvestorId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: InvestorsState = {
  list: [],
  activeInvestorId: null,
  status: "idle",
  error: null,
};

export const loadInvestors = createAsyncThunk<InvestorProfile[], void, { rejectValue: string }>(
  "investors/load",
  async (_, { rejectWithValue }) => {
    try {
      return await fetchInvestors();
    } catch (err) {
      return rejectWithValue((err as { message: string }).message ?? "Failed to load investors");
    }
  }
);

const investorsSlice = createSlice({
  name: "investors",
  initialState,
  reducers: {
    setActiveInvestor(state, action: PayloadAction<string>) {
      state.activeInvestorId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadInvestors.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadInvestors.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
        if (!state.activeInvestorId && action.payload.length > 0) {
          state.activeInvestorId = action.payload[0].id;
        }
      })
      .addCase(loadInvestors.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { setActiveInvestor } = investorsSlice.actions;
export default investorsSlice.reducer;
