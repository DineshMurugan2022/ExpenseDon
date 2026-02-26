import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const API_URL = '/recurring';

// Get all recurring transactions
export const getRecurring = createAsyncThunk('recurring/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Add recurring transaction
export const addRecurring = createAsyncThunk('recurring/add', async (recurringData, thunkAPI) => {
    try {
        const response = await api.post(API_URL, recurringData);
        return response.data.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete recurring transaction
export const deleteRecurring = createAsyncThunk('recurring/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Toggle recurring status
export const toggleRecurring = createAsyncThunk('recurring/toggle', async (id, thunkAPI) => {
    try {
        const response = await api.patch(`${API_URL}/${id}/toggle`, {});
        return { id, is_active: response.data.data.is_active };
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    recurring: [],
    isLoading: false,
    isSuccess: false,
    isError: false,
    message: '',
};

export const recurringSlice = createSlice({
    name: 'recurring',
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
            .addCase(getRecurring.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getRecurring.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.recurring = action.payload;
            })
            .addCase(getRecurring.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addRecurring.fulfilled, (state, action) => {
                state.isLoading = false;
                state.recurring.unshift(action.payload);
            })
            .addCase(deleteRecurring.fulfilled, (state, action) => {
                state.recurring = state.recurring.filter(r => r.id !== action.payload);
            })
            .addCase(toggleRecurring.fulfilled, (state, action) => {
                const item = state.recurring.find(r => r.id === action.payload.id);
                if (item) item.is_active = action.payload.is_active;
            });
    },
});

export const { reset } = recurringSlice.actions;
export default recurringSlice.reducer;
