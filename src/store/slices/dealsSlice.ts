import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Deal, DealFilters } from "@/types/deal";
import { fetchDeals, PaginatedResult } from "@/services/dealService";

interface DealsState {
  items: Deal[];
  total: number;
  totalPages: number;
  filters: DealFilters;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
  cache: Record<string, PaginatedResult<Deal>>;
}

export const defaultFilters: DealFilters = {
  search: "",
  industries: [],
  riskLevels: [],
  minRoi: 0,
  maxRoi: 50,
  investmentRange: [0, 25],
  stage: "All",
  sortBy: "newest",
  sortDir: "desc",
  page: 1,
  pageSize: 9,
};

const initialState: DealsState = {
  items: [],
  total: 0,
  totalPages: 1,
  filters: defaultFilters,
  status: "idle",
  error: null,
  cache: {},
};

function cacheKey(filters: DealFilters): string {
  return JSON.stringify(filters);
}

export const loadDeals = createAsyncThunk<
  PaginatedResult<Deal>,
  DealFilters,
  { rejectValue: string }
>("deals/load", async (filters, { rejectWithValue }) => {
  try {
    return await fetchDeals(filters);
  } catch (err) {
    return rejectWithValue((err as { message: string }).message ?? "Failed to load deals");
  }
});

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    setFilters(state, action: PayloadAction<Partial<DealFilters>>) {
      state.filters = { ...state.filters, ...action.payload, page: action.payload.page ?? 1 };
    },
    setPage(state, action: PayloadAction<number>) {
      state.filters.page = action.payload;
    },
    resetFilters(state) {
      state.filters = defaultFilters;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadDeals.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loadDeals.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.total = action.payload.total;
        state.totalPages = action.payload.totalPages;
        state.cache[cacheKey(action.meta.arg)] = action.payload;
      })
      .addCase(loadDeals.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Something went wrong";
      });
  },
});

export const { setFilters, setPage, resetFilters } = dealsSlice.actions;
export default dealsSlice.reducer;
