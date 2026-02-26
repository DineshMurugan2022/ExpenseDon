import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';

const API_URL = '/auth';

// Register user
export const register = createAsyncThunk('auth/register', async (userData, thunkAPI) => {
    try {
        const response = await api.post(`${API_URL}/register`, userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Login user
export const login = createAsyncThunk('auth/login', async (userData, thunkAPI) => {
    try {
        const response = await api.post(`${API_URL}/login`, userData);
        if (response.data) {
            localStorage.setItem('user', JSON.stringify(response.data));
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Logout user
export const logout = createAsyncThunk('auth/logout', async () => {
    localStorage.removeItem('user');
});

// Update user profile
export const updateProfile = createAsyncThunk('auth/updateProfile', async (userData, thunkAPI) => {
    try {
        const response = await api.put(`${API_URL}/updateprofile`, userData);
        if (response.data) {
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const updatedUser = { ...currentUser, user: response.data.user };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            return updatedUser;
        }
        return response.data;
    } catch (error) {
        const message = error.response?.data?.error || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    user: user ? user : null,
    currency: user?.user?.currency || 'INR',
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

export const authSlice = createSlice({
    name: 'auth',
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
            .addCase(register.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            .addCase(login.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
                state.currency = action.payload.user.currency || 'INR'; // Update currency on login
            })
            .addCase(login.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
                state.user = null;
            })
            // Assuming getMe is an existing or new async thunk for fetching user details
            // If getMe is not defined, this will cause an error.
            // For now, I'm adding it as per instruction.
            // If getMe is not intended to be added, please clarify.
            // .addCase(getMe.fulfilled, (state, action) => {
            //     state.isLoading = false;
            //     state.isSuccess = true;
            //     state.user = { ...state.user, user: action.payload };
            //     state.currency = action.payload.currency || 'INR';
            // })
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.currency = 'INR'; // Reset currency on logout
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.user = action.payload;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = authSlice.actions;
export default authSlice.reducer;
