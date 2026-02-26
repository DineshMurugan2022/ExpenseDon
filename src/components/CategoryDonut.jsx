import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const CategoryDonut = ({ data, colors }) => {
    // Process data for the donut chart
    const chartData = Object.keys(data).map(name => ({
        name,
        value: data[name]
    })).sort((a, b) => b.value - a.value).slice(0, 5); // Top 5 categories

    return (
        <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                        stroke="none"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={colors[entry.name] || '#6b7280'} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: 'rgba(13, 13, 20, 0.9)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            color: '#fff'
                        }}
                        itemStyle={{ color: '#fff' }}
                    />
                </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-gray-500 uppercase font-bold tracking-wider">Top Spend</span>
                <span className="text-sm font-bold text-white">{chartData[0]?.name || 'N/A'}</span>
            </div>
        </div>
    );
};

export default CategoryDonut;
