import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const API_URL = '/budgets';

// Get all budgets
export const getBudgets = createAsyncThunk('budgets/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Upsert budget (Create or Update)
export const upsertBudget = createAsyncThunk('budgets/upsert', async (budgetData, thunkAPI) => {
    try {
        const response = await api.post(API_URL, budgetData);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    budgets: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const budgetSlice = createSlice({
    name: 'budgets',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getBudgets.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getBudgets.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.budgets = action.payload;
            })
            .addCase(getBudgets.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(upsertBudget.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(upsertBudget.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                const index = state.budgets.findIndex(b => b.category === action.payload.category);
                if (index !== -1) {
                    state.budgets[index] = action.payload;
                } else {
                    state.budgets.push(action.payload);
                }
            })
            .addCase(upsertBudget.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = budgetSlice.actions;
export default budgetSlice.reducer;
