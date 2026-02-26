import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, DollarSign, Tag, Calendar, MessageSquare } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addTransaction } from '../store/transactionSlice';

const AddTransactionModal = ({ isOpen, onClose }) => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        text: '',
        amount: '',
        category: 'Food',
    });

    const onSubmit = (e) => {
        e.preventDefault();

        // If category is not Income, make the amount negative
        let finalAmount = parseFloat(formData.amount);
        if (formData.category !== 'Income' && finalAmount > 0) {
            finalAmount = -finalAmount;
        }

        dispatch(addTransaction({
            ...formData,
            amount: finalAmount
        }));
        setFormData({ text: '', amount: '', category: 'Food' });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    />
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass neon-border z-[51] p-8"
                    >
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold neon-text">Add Transaction</h2>
                            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={onSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-400">Description</label>
                                <div className="relative">
                                    <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                    <input
                                        type="text"
                                        placeholder="Grocery shopping..."
                                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                                        value={formData.text}
                                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Amount</label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <input
                                            type="number"
                                            placeholder="₹ 0.00"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors"
                                            value={formData.amount}
                                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={18} />
                                        <select
                                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-primary transition-colors appearance-none"
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        >
                                            <option value="Income" style={{ backgroundColor: '#10b981' }}>Income</option>
                                            <option value="Food" style={{ backgroundColor: '#f59e0b' }}>Food</option>
                                            <option value="Rent" style={{ backgroundColor: '#10b981' }}>Rent</option>
                                            <option value="Transport" style={{ backgroundColor: '#3b82f6' }}>Transport</option>
                                            <option value="Entertainment" style={{ backgroundColor: '#ec4899' }}>Entertainment</option>
                                            <option value="Shopping" style={{ backgroundColor: '#8b5cf6' }}>Shopping</option>
                                            <option value="Health" style={{ backgroundColor: '#ef4444' }}>Health</option>
                                            <option value="Other" style={{ backgroundColor: '#6b7280' }}>Other</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0, 242, 255, 0.3)" }}
                                whileTap={{ scale: 0.98 }}
                                className="w-full bg-neon-gradient text-black font-bold py-4 rounded-xl flex items-center justify-center gap-2 mt-4"
                            >
                                <Plus size={20} />
                                Add Transaction
                            </motion.button>
                        </form>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default AddTransactionModal;
