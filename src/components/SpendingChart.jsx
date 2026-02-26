import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const SpendingChart = ({ data }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass p-6 h-[400px] w-full border-white/5"
        >
            <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-bold">Spending Overview</h3>
                <div className="flex gap-4">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-primary" />
                        <span className="text-xs text-gray-400">Income</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-secondary" />
                        <span className="text-xs text-gray-400">Expenses</span>
                    </div>
                </div>
            </div>

            <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#00f2ff" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis
                        dataKey="name"
                        stroke="#4b5563"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        dy={10}
                    />
                    <YAxis
                        stroke="#4b5563"
                        fontSize={12}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `₹${value}`}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(10, 10, 11, 0.8)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '12px',
                            backdropFilter: 'blur(10px)'
                        }}
                    />
                    <Area
                        type="monotone"
                        dataKey="income"
                        stroke="#00f2ff"
                        fillOpacity={1}
                        fill="url(#colorIncome)"
                        strokeWidth={2}
                        animationDuration={1500}
                    />
                    <Area
                        type="monotone"
                        dataKey="expense"
                        stroke="#10b981"
                        fillOpacity={1}
                        fill="url(#colorExpense)"
                        strokeWidth={2}
                        animationDuration={1500}
                        animationBegin={500}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </motion.div>
    );
};

export default SpendingChart;
