import React, { useEffect } from 'react';
import { useSpring, useTransform, motion } from 'framer-motion';
import { useSelector } from 'react-redux';
import { formatCurrency } from '../utils/currencyUtils';

const SummaryCard = ({ title, amount, icon: Icon, color }) => {
    const { currency } = useSelector((state) => state.auth);
    const springValue = useSpring(0, { stiffness: 100, damping: 30 });
    const displayValue = useTransform(springValue, (latest) =>
        formatCurrency(latest, currency)
    );

    useEffect(() => {
        springValue.set(amount);
    }, [amount, springValue]);

    return (
        <motion.div
            whileHover={{ y: -5, scale: 1.02 }}
            className="glass p-6 min-w-[240px] flex-1 border-white/5 relative group overflow-hidden"
        >
            <div className={`absolute top-0 right-0 w-32 h-32 -mr-16 -mt-16 rounded-full opacity-10 blur-3xl`} style={{ background: color }} />

            <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Icon size={24} style={{ color }} />
                </div>
                {amount > 0 && (
                    <span className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-full border border-green-500/20">
                        +12.5%
                    </span>
                )}
            </div>

            <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
            <motion.h3 className="text-2xl font-bold">
                {displayValue}
            </motion.h3>
        </motion.div>
    );
};

export default SummaryCard;
