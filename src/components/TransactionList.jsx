import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, ShoppingCart, Home, Car, Utensils, Heart, Plus, Briefcase, HelpCircle } from 'lucide-react';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../utils/currencyUtils';

const categoryIcons = {
    'Income': { icon: Briefcase, color: '#00f2ff' },
    'Food': { icon: Utensils, color: '#f59e0b' },
    'Rent': { icon: Home, color: '#10b981' },
    'Transport': { icon: Car, color: '#3b82f6' },
    'Entertainment': { icon: Heart, color: '#ec4899' },
    'Shopping': { icon: ShoppingCart, color: '#8b5cf6' },
    'Health': { icon: Heart, color: '#ef4444' },
    'Other': { icon: HelpCircle, color: '#6b7280' },
};

const TransactionItem = ({ transaction, onDelete }) => {
    const { currency } = useSelector((state) => state.auth);
    const { icon: Icon, color } = categoryIcons[transaction.category] || categoryIcons['Other'];

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ backgroundColor: 'rgba(255, 255, 255, 0.02)' }}
            className="flex items-center justify-between p-4 rounded-xl border border-white/5 transition-colors group"
        >
            <div className="flex items-center gap-4">
                <div
                    className="p-3 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}15`, color }}
                >
                    <Icon size={20} />
                </div>
                <div>
                    <h4 className="font-semibold">{transaction.text}</h4>
                    <p className="text-xs text-gray-500">{new Date(transaction.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="flex items-center gap-6">
                <p className={`font-bold ${transaction.amount > 0 ? 'text-primary' : 'text-gray-300'}`}>
                    {transaction.amount > 0 ? '+' : ''}{formatCurrency(transaction.amount, currency)}
                </p>
                <button
                    onClick={() => onDelete(transaction.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </motion.div>
    );
};

const TransactionList = ({ transactions, onDelete }) => {
    return (
        <div className="glass p-6 border-white/5 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">Recent Transactions</h3>
                <button className="text-xs text-primary font-medium hover:underline">View All</button>
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                    {transactions.length === 0 ? (
                        <p className="text-gray-500 text-center py-8">No transactions found</p>
                    ) : (
                        transactions.map((transaction) => (
                            <TransactionItem
                                key={transaction.id}
                                transaction={transaction}
                                onDelete={onDelete}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TransactionList;
