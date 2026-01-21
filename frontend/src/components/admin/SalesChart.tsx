import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';

interface SalesData {
    _id: string; // Date "YYYY-MM-DD"
    sales: number;
    orders: number;
}

interface SalesChartProps {
    data: SalesData[];
    range: string;
    setRange: (range: string) => void;
}

const SalesChart: React.FC<SalesChartProps> = ({ data, range, setRange }) => {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-gray-800">Sales Overview</h3>
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
                        <AreaChart
                            data={data}
                            margin={{
                                top: 10,
                                right: 30,
                                left: 0,
                                bottom: 0,
                            }}
                        >
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8} />
                                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                            <XAxis
                                dataKey="_id"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                dy={10}
                                tickFormatter={(value) => {
                                    const date = new Date(value);
                                    return `${date.getDate()}/${date.getMonth() + 1}`;
                                }}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#9ca3af', fontSize: 12 }}
                                tickFormatter={(value) => `₹${value}`}
                            />
                            <Tooltip
                                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#ef4444"
                                strokeWidth={2}
                                fillOpacity={1}
                                fill="url(#colorSales)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
};

export default SalesChart;
