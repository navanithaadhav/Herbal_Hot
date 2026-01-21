import React from 'react';
import {
    PieChart,
    Pie,
    Tooltip,
    ResponsiveContainer,
    Cell,
    Legend
} from 'recharts';

interface TopProduct {
    _id: string;
    name: string;
    totalSold: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

interface TopProductsChartProps {
    data: TopProduct[];
    range: string;
    setRange: (range: string) => void;
}

const COLORS = [
    '#ef4444', // Red
    '#f97316', // Orange
    '#eab308', // Yellow
    '#22c55e', // Green
    '#3b82f6', // Blue
    '#6366f1', // Indigo
    '#a855f7', // Purple
    '#ec4899', // Pink
    '#14b8a6', // Teal
    '#06b6d4', // Cyan
    '#8b5cf6', // Violet
    '#f43f5e', // Rose
    '#10b981', // Emerald
    '#0ea5e9', // Sky
];

const TopProductsChart: React.FC<TopProductsChartProps> = ({ data, range, setRange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Highly Moving Products</h3>
                <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                        onClick={() => setRange('weekly')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${range === 'weekly' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Weekly
                    </button>
                    <button
                        onClick={() => setRange('monthly')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${range === 'monthly' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        Monthly
                    </button>
                    <button
                        onClick={() => setRange('all')}
                        className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${range === 'all' ? 'bg-white text-red-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        All
                    </button>
                </div>
            </div>

            <div className="w-full h-[300px]">
                {data.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No sales data for this period
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={100}
                                fill="#8884d8"
                                paddingAngle={5}
                                dataKey="totalSold"
                                nameKey="name"
                            >
                                {data.map((_entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#fff',
                                    borderRadius: '8px',
                                    border: 'none',
                                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                                }}
                                itemStyle={{ color: '#374151' }}
                            />
                            <Legend
                                verticalAlign="bottom"
                                height={36}
                                iconType="circle"
                                formatter={(value) => <span className="text-sm text-gray-600 font-medium ml-1">{value}</span>}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default TopProductsChart;
