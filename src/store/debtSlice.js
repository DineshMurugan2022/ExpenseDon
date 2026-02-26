import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const API_URL = '/debts';

// Get all debts
export const getDebts = createAsyncThunk('debts/getAll', async (_, thunkAPI) => {
    try {
        const response = await api.get(API_URL);
        return response.data.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Add new debt
export const addDebt = createAsyncThunk('debts/add', async (debtData, thunkAPI) => {
    try {
        const response = await api.post(API_URL, debtData);
        return response.data.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update debt
export const updateDebt = createAsyncThunk('debts/update', async ({ id, debtData }, thunkAPI) => {
    try {
        const response = await api.patch(`${API_URL}/${id}`, debtData);
        return response.data.data;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete debt
export const deleteDebt = createAsyncThunk('debts/delete', async (id, thunkAPI) => {
    try {
        await api.delete(`${API_URL}/${id}`);
        return id;
    } catch (error) {
        const message = (error.response && error.response.data && error.response.data.error) || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

const initialState = {
    debts: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const debtSlice = createSlice({
    name: 'debts',
    initialState,
    reducers: {
        reset: () => initialState,
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDebts.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDebts.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.debts = action.payload;
            })
            .addCase(getDebts.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(addDebt.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addDebt.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.debts.unshift(action.payload);
            })
            .addCase(addDebt.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(updateDebt.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.debts = state.debts.map((debt) =>
                    debt.id === action.payload.id ? action.payload : debt
                );
            })
            .addCase(deleteDebt.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.debts = state.debts.filter(
                    (debt) => debt.id !== action.payload
                );
            });
    },
});

export const { reset } = debtSlice.actions;
export default debtSlice.reducer;
