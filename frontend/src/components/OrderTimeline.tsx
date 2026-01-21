import React from 'react';
import { Check, Package, Truck, Home } from 'lucide-react';

interface OrderTimelineProps {
    isPaid: boolean;
    paidAt?: string;
    isShipped: boolean;
    shippedAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    createdAt: string;
}

const OrderTimeline: React.FC<OrderTimelineProps> = ({
    isPaid,
    paidAt,
    isShipped,
    shippedAt,
    isDelivered,
    deliveredAt,
    createdAt
}) => {
    const steps = [
        {
            title: 'Order Placed',
            date: createdAt,
            icon: Package,
            completed: true
        },
        {
            title: 'Payment Confirmed',
            date: paidAt,
            icon: Check,
            completed: isPaid
        },
        {
            title: 'Shipped',
            date: shippedAt,
            icon: Truck,
            completed: isShipped
        },
        {
            title: 'Delivered',
            date: deliveredAt,
            icon: Home,
            completed: isDelivered
        }
    ];

    return (
        <div className="w-full py-6">
            <div className="flex flex-col md:flex-row justify-between relative overflow-hidden">
                {/* Connecting Line (Desktop) */}
                <div className="absolute top-5 left-0 w-full h-1 bg-gray-200 hidden md:block -z-10"></div>
                <div className="absolute top-5 left-0 h-1 bg-green-500 hidden md:block -z-10 transition-all duration-500"
                    style={{
                        width: isDelivered ? '100%' : isShipped ? '75%' : isPaid ? '50%' : '25%'
                    }}
                ></div>

                {steps.map((step, index) => (
                    <div key={index} className="flex md:flex-col items-center relative z-10 mb-6 md:mb-0">
                        {/* Connecting Line (Mobile) */}
                        {index !== steps.length - 1 && (
                            <div className={`absolute left-5 top-10 w-1 h-full md:hidden -z-10 ${step.completed ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                        )}

                        <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${step.completed ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-400'
                            }`}>
                            <step.icon className="w-5 h-5" />
                        </div>
                        <div className="ml-4 md:ml-0 md:mt-2 md:text-center">
                            <h3 className={`text-sm font-semibold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>
                                {step.title}
                            </h3>
                            {step.completed && step.date && (
                                <p className="text-xs text-gray-500">
                                    {new Date(step.date).toLocaleDateString()}
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OrderTimeline;
