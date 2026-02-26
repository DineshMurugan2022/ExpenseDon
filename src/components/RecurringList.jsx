import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRecurring, deleteRecurring, toggleRecurring } from '../store/recurringSlice';
import { Plus, Trash2, Calendar, Power, PowerOff, ShieldCheck, CreditCard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const categories = ['Food', 'Rent', 'Transport', 'Entertainment', 'Shopping', 'Health', 'Other'];

const RecurringList = ({ recurring }) => {
    const dispatch = useDispatch();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({
        text: '',
        amount: '',
        category: 'Entertainment',
        frequency: 'monthly',
        start_date: new Date().toISOString().split('T')[0]
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addRecurring(formData));
        setIsAdding(false);
        setFormData({
            text: '',
            amount: '',
            category: 'Entertainment',
            frequency: 'monthly',
            start_date: new Date().toISOString().split('T')[0]
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Active Subscriptions</h3>
                    <p className="text-sm text-gray-400">Manage your recurring bills and payments.</p>
                </div>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            <AnimatePresence>
                {isAdding && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="glass p-6 border-white/10 space-y-4 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                placeholder="Subscription Name (e.g. Netflix)"
                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary"
                                value={formData.text}
                                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                required
                            />
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary font-bold">₹</span>
                                <input
                                    type="number"
                                    placeholder="Amount"
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-8 pr-4 focus:outline-none focus:border-primary"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <select
                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary"
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            >
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                            <select
                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary"
                                value={formData.frequency}
                                onChange={(e) => setFormData({ ...formData, frequency: e.target.value })}
                            >
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                                <option value="yearly">Yearly</option>
                            </select>
                            <input
                                type="date"
                                className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 focus:outline-none focus:border-primary"
                                value={formData.start_date}
                                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                                required
                            />
                        </div>
                        <div className="flex justify-end gap-2">
                            <button
                                type="button"
                                onClick={() => setIsAdding(false)}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="bg-primary text-black font-bold px-6 py-2 rounded-xl text-sm"
                            >
                                Add Subscription
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {recurring.map((item) => (
                    <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border transition-all ${item.is_active ? 'glass border-white/5' : 'bg-white/2 opacity-50 border-transparent'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl ${item.is_active ? 'bg-primary/10 text-primary' : 'bg-gray-500/10 text-gray-500'}`}>
                                <CreditCard size={20} />
                            </div>
                            <div>
                                <h4 className="font-bold">{item.text}</h4>
                                <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> {item.frequency}</span>
                                    <span>Next: {new Date(item.next_date).toLocaleDateString('en-IN')}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="text-right">
                                <p className="font-bold text-lg">₹{parseFloat(item.amount).toLocaleString('en-IN')}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => dispatch(toggleRecurring(item.id))}
                                    className={`p-2 rounded-lg transition-colors ${item.is_active ? 'hover:bg-red-500/10 text-green-500' : 'hover:bg-green-500/10 text-gray-500'}`}
                                    title={item.is_active ? 'Deactivate' : 'Activate'}
                                >
                                    {item.is_active ? <Power size={18} /> : <PowerOff size={18} />}
                                </button>
                                <button
                                    onClick={() => dispatch(deleteRecurring(item.id))}
                                    className="p-2 hover:bg-red-500/10 text-gray-500 hover:text-red-500 transition-colors rounded-lg"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {recurring.length === 0 && !isAdding && (
                    <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                        <ShieldCheck size={48} className="mx-auto text-gray-600 mb-4" />
                        <p className="text-gray-500">No recurring transactions found.</p>
                        <button
                            onClick={() => setIsAdding(true)}
                            className="text-primary text-sm font-bold mt-2 hover:underline"
                        >
                            Add your first subscription
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecurringList;
