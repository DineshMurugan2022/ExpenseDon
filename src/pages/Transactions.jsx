import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions, deleteTransaction } from '../store/transactionSlice';
import TransactionList from '../components/TransactionList';
import { Receipt } from 'lucide-react';
import { motion } from 'framer-motion';

const Transactions = () => {
    const dispatch = useDispatch();
    const { transactions, isLoading } = useSelector((state) => state.transactions);

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    const handleDelete = (id) => {
        dispatch(deleteTransaction(id));
    };

    return (
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold neon-text">All Transactions</h2>
                    <p className="text-gray-400">View and manage your entire financial history.</p>
                </div>
                <div className="p-3 bg-white/5 rounded-xl">
                    <Receipt size={24} className="text-primary" />
                </div>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass p-8 border-white/5"
            >
                {isLoading ? (
                    <div className="text-center py-20 text-gray-500">Loading your transactions...</div>
                ) : (
                    <TransactionList
                        transactions={transactions}
                        onDelete={handleDelete}
                    />
                )}
            </motion.div>
        </div>
    );
};

export default Transactions;
