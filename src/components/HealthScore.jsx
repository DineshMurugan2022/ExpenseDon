import React from 'react';
import { motion } from 'framer-motion';

const HealthScore = ({ score }) => {
    // Calculate color based on score (0-100)
    const getColor = (s) => {
        if (s >= 80) return '#10b981'; // Green
        if (s >= 50) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    const color = getColor(score);
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (score / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-40 h-40 flex items-center justify-center">
                {/* Background Circle */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="12"
                    />
                    {/* Foreground Circle (Animated) */}
                    <motion.circle
                        cx="80"
                        cy="80"
                        r={radius}
                        fill="transparent"
                        stroke={color}
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset: offset }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                        strokeLinecap="round"
                    />
                </svg>
                {/* Score Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-4xl font-black text-white"
                    >
                        {Math.round(score)}
                    </motion.span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">Health Score</span>
                </div>
            </div>
            {/* Status Label */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-4 px-4 py-1.5 rounded-full border text-[11px] font-bold"
                style={{ borderColor: `${color}40`, color, backgroundColor: `${color}10` }}
            >
                {score >= 80 ? 'EXCELLENT' : score >= 50 ? 'GOOD' : 'CRITICAL'}
            </motion.div>
        </div>
    );
};

export default HealthScore;
