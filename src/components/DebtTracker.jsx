import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDebt, deleteDebt, updateDebt } from '../store/debtSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, PieChart, Calendar, TrendingDown, DollarSign, Wallet, ArrowRight } from 'lucide-react';
import { formatCurrency } from '../utils/currencyUtils';

const DebtTracker = ({ debts }) => {
    const dispatch = useDispatch();
    const { currency } = useSelector((state) => state.auth);
    const [showAddForm, setShowAddForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        total_amount: '',
        remaining_amount: '',
        interest_rate: '',
        emi_amount: '',
        next_emi_date: '',
        category: 'Personal'
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addDebt({
            ...formData,
            total_amount: parseFloat(formData.total_amount),
            remaining_amount: parseFloat(formData.remaining_amount || formData.total_amount),
            interest_rate: parseFloat(formData.interest_rate),
            emi_amount: parseFloat(formData.emi_amount)
        }));
        setFormData({
            name: '',
            total_amount: '',
            remaining_amount: '',
            interest_rate: '',
            emi_amount: '',
            next_emi_date: '',
            category: 'Personal'
        });
        setShowAddForm(false);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to remove this debt record?')) {
            dispatch(deleteDebt(id));
        }
    };

    const totalDebt = debts.reduce((acc, curr) => acc + curr.remaining_amount, 0);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-bold">Debt & EMI Tracker</h3>
                    <p className="text-sm text-gray-400">Track your loans and manage repayments efficiently.</p>
                </div>
                <button
                    onClick={() => setShowAddForm(!showAddForm)}
                    className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors"
                >
                    <Plus size={20} />
                </button>
            </div>

            {/* Summary Card */}
            <div className="glass p-6 border-primary/20 bg-primary/5">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-xl text-primary">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-gray-400">Total Outstanding Debt</p>
                        <h4 className="text-2xl font-bold text-primary">{formatCurrency(totalDebt, currency)}</h4>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAddForm && (
                    <motion.form
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        onSubmit={handleSubmit}
                        className="glass p-6 border-white/10 space-y-4 overflow-hidden"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400">Loan Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                                    placeholder="e.g., Home Loan"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary text-white"
                                >
                                    <option value="Home">Home Loan</option>
                                    <option value="Car">Car Loan</option>
                                    <option value="Personal">Personal Loan</option>
                                    <option value="Education">Education Loan</option>
                                    <option value="Credit Card">Credit Card</option>
                                </select>
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400">Principal Amount</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.total_amount}
                                    onChange={(e) => setFormData({ ...formData, total_amount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400">Remaining Balance</label>
                                <input
                                    type="number"
                                    value={formData.remaining_amount}
                                    onChange={(e) => setFormData({ ...formData, remaining_amount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                                    placeholder="Optional (defaults to Principal)"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400">Monthly EMI</label>
                                <input
                                    type="number"
                                    required
                                    value={formData.emi_amount}
                                    onChange={(e) => setFormData({ ...formData, emi_amount: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                                    placeholder="0.00"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400">Interest Rate (%)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    required
                                    value={formData.interest_rate}
                                    onChange={(e) => setFormData({ ...formData, interest_rate: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                                    placeholder="e.g., 8.5"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400">Next EMI Date</label>
                                <input
                                    type="date"
                                    required
                                    value={formData.next_emi_date}
                                    onChange={(e) => setFormData({ ...formData, next_emi_date: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-sm focus:outline-none focus:border-primary"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button
                                type="button"
                                onClick={() => setShowAddForm(false)}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-primary text-black font-bold rounded-lg text-sm hover:scale-105 transition-transform"
                            >
                                Add Debt
                            </button>
                        </div>
                    </motion.form>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4">
                {debts.map((debt) => {
                    const progress = ((debt.total_amount - debt.remaining_amount) / debt.total_amount) * 100;
                    return (
                        <motion.div
                            key={debt.id}
                            layout
                            className="glass p-5 border-white/5 space-y-4 group"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex gap-4">
                                    <div className="p-3 bg-white/5 rounded-xl text-primary h-fit">
                                        <Wallet size={20} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-lg">{debt.name}</h4>
                                        <div className="flex items-center gap-3 text-xs text-gray-500">
                                            <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">{debt.category}</span>
                                            <span>{debt.interest_rate}% Interest</span>
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(debt.id)}
                                    className="opacity-0 group-hover:opacity-100 p-2 text-gray-500 hover:text-red-500 transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Repayment Progress</span>
                                    <span className="font-bold text-primary">{progress.toFixed(1)}%</span>
                                </div>
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progress}%` }}
                                        className="h-full bg-primary shadow-neon-blue"
                                    />
                                </div>
                                <div className="flex justify-between text-[10px] text-gray-500 font-medium uppercase tracking-wider">
                                    <span>Paid: {formatCurrency(debt.total_amount - debt.remaining_amount, currency)}</span>
                                    <span>Goal: {formatCurrency(debt.total_amount, currency)}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-white/5">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-medium uppercase">Remaining Balance</p>
                                    <p className="font-bold text-lg">{formatCurrency(debt.remaining_amount, currency)}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-gray-500 font-medium uppercase">Monthly EMI</p>
                                    <div className="flex items-center justify-end gap-1">
                                        <p className="font-bold text-lg text-primary">{formatCurrency(debt.emi_amount, currency)}</p>
                                        <ArrowRight size={14} className="text-primary" />
                                    </div>
                                    <p className="text-[10px] text-gray-400">Next: {new Date(debt.next_emi_date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {debts.length === 0 && (
                    <div className="text-center py-12 glass border-dashed border-white/10">
                        <PieChart size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
                        <p className="text-gray-500">No active loans or debts tracked yet.</p>
                        <button
                            onClick={() => setShowAddForm(true)}
                            className="mt-4 text-primary text-sm font-medium hover:underline"
                        >
                            Add your first loan
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebtTracker;
