import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getTransactions } from '../store/transactionSlice';
import { PieChart as PieChartIcon, BarChart3, TrendingUp, TrendingDown as TrendingDownIcon, Target, FileSpreadsheet, Loader2 } from 'lucide-react';
import {
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = ['#00f2ff', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#8b5cf6', '#ef4444', '#6b7280'];

const Analytics = () => {
    const dispatch = useDispatch();
    const { transactions, isLoading } = useSelector((state) => state.transactions);

    useEffect(() => {
        dispatch(getTransactions());
    }, [dispatch]);

    // Data Processing for Pie Chart (Category Distribution)
    const categoryDataMap = transactions
        .filter(t => parseFloat(t.amount) < 0)
        .reduce((acc, t) => {
            const amount = Math.abs(parseFloat(t.amount));
            acc[t.category] = (acc[t.category] || 0) + amount;
            return acc;
        }, {});

    const pieData = Object.keys(categoryDataMap).map(name => ({
        name,
        value: categoryDataMap[name]
    })).sort((a, b) => b.value - a.value);

    // Data Processing for Bar Chart (Monthly Comparison)
    const monthlyDataMap = transactions.reduce((acc, t) => {
        const date = new Date(t.created_at || 0);
        const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });
        if (!acc[month]) acc[month] = { name: month, income: 0, expense: 0 };

        const amount = parseFloat(t.amount);
        if (amount > 0) {
            acc[month].income += amount;
        } else {
            acc[month].expense += Math.abs(amount);
        }
        return acc;
    }, {});

    const barData = Object.values(monthlyDataMap).slice(-6);

    // Summary Metrics
    const totalExpenses = transactions
        .filter(t => parseFloat(t.amount) < 0)
        .reduce((acc, t) => acc + Math.abs(parseFloat(t.amount)), 0);

    const totalIncome = transactions
        .filter(t => parseFloat(t.amount) > 0)
        .reduce((acc, t) => acc + parseFloat(t.amount), 0);

    const savingsRate = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome * 100).toFixed(1) : 0;

    const highestCategory = pieData.length > 0 ? pieData[0] : { name: 'N/A', value: 0 };

    const exportToCSV = () => {
        const headers = ['Date', 'Description', 'Category', 'Amount'];
        const rows = transactions.map(t => [
            new Date(t.created_at).toLocaleDateString('en-IN'),
            t.text,
            t.category,
            t.amount
        ]);

        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    if (isLoading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={48} />
            </div>
        );
    }

    return (
        <div className="flex-1 p-8 space-y-8 max-w-7xl mx-auto pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold neon-text text-primary">Financial Analytics</h2>
                    <p className="text-gray-400">Deep dive into your income and spending patterns.</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={exportToCSV}
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 transition-colors text-sm font-bold"
                >
                    <FileSpreadsheet size={18} className="text-primary" />
                    Export CSV
                </motion.button>
            </header>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="glass p-6 border-white/5"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                            <Target size={20} />
                        </div>
                        <span className="text-sm text-gray-400">Top Expense</span>
                    </div>
                    <h3 className="text-2xl font-bold">{highestCategory.name}</h3>
                    <p className="text-sm text-orange-500 mt-1">₹{highestCategory.value.toLocaleString('en-IN')}</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass p-6 border-white/5"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <TrendingUp size={20} />
                        <span className="text-sm text-gray-400">Savings Rate</span>
                    </div>
                    <h3 className="text-2xl font-bold">{savingsRate}%</h3>
                    <p className="text-sm text-green-500 mt-1">of income saved</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass p-6 border-white/5"
                >
                    <div className="flex items-center gap-4 mb-4">
                        <div className="p-2 bg-blue-500/10 rounded-lg text-blue-500">
                            <PieChartIcon size={20} />
                        </div>
                        <span className="text-sm text-gray-400">Avg. Monthly</span>
                    </div>
                    <h3 className="text-2xl font-bold">₹{(totalExpenses / (barData.length || 1)).toFixed(0).toLocaleString('en-IN')}</h3>
                    <p className="text-sm text-blue-500 mt-1">expense per month</p>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Category Distribution */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 border-white/5 min-h-[450px]"
                >
                    <h3 className="text-xl font-bold mb-8">Category Distribution</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 11, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                    formatter={(value) => `₹${value.toLocaleString('en-IN')}`}
                                />
                                <Legend verticalAlign="bottom" height={36} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Income vs Expenses */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass p-8 border-white/5 min-h-[450px]"
                >
                    <h3 className="text-xl font-bold mb-8">Income vs Expenses</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis dataKey="name" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                                <YAxis stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `₹${v}`} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(10, 10, 11, 0.9)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: '12px'
                                    }}
                                    formatter={(v) => `₹${v.toLocaleString('en-IN')}`}
                                />
                                <Legend verticalAlign="top" align="right" />
                                <Bar dataKey="income" fill="#00f2ff" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="expense" fill="#10b981" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Analytics;
