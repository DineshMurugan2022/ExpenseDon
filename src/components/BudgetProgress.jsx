import React from 'react';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../utils/currencyUtils';

const BudgetProgress = ({ category, budgeted, spent, color }) => {
    const { currency } = useSelector((state) => state.auth);
    const percentage = Math.min((spent / budgeted) * 100, 100);
    const isOverBudget = spent > budgeted;

    return (
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium text-gray-400">{category}</span>
                <span className={`${isOverBudget ? 'text-red-500 font-bold' : 'text-gray-300'}`}>
                    {formatCurrency(spent, currency)} / {formatCurrency(budgeted, currency)}
                </span>
            </div>
            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${percentage}%` }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className={`h-full rounded-full ${isOverBudget ? 'bg-red-500' : ''}`}
                    style={{ backgroundColor: isOverBudget ? undefined : color }}
                />
            </div>
            {isOverBudget && (
                <p className="text-[10px] text-red-500 italic">Over budget by {formatCurrency(spent - budgeted, currency)}</p>
            )}
        </div>
    );
};

export default BudgetProgress;
