import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const API_URL = '/transactions';

// Get transactions
export const getTransactions = createAsyncThunk('transactions/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Add transaction
export const addTransaction = createAsyncThunk('transactions/add', async (transactionData, thunkAPI) => {
    try {
        const response = await api.post(API_URL, transactionData);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete transaction
export const deleteTransaction = createAsyncThunk('transactions/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    transactions: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const transactionSlice = createSlice({
    name: 'transactions',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getTransactions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getTransactions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.transactions = action.payload;
            })
            .addCase(getTransactions.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addTransaction.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addTransaction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.transactions.push(action.payload);
            })
            .addCase(addTransaction.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteTransaction.fulfilled, (state, action) => {
                state.transactions = state.transactions.filter(
                    (transaction) => transaction.id !== action.payload
                );
            });
    },
});

export const { reset } = transactionSlice.actions;
export default transactionSlice.reducer;
