import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import transactionReducer from './transactionSlice';
import budgetReducer from './budgetSlice';
import recurringReducer from './recurringSlice';
import debtReducer from './debtSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        transactions: transactionReducer,
        budgets: budgetReducer,
        recurring: recurringReducer,
        debts: debtReducer,
    },
});
