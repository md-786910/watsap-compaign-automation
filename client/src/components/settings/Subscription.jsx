import { CheckCircle2 } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { useFetch } from '../../hooks/useFetch';
import showToast from '../../helpers/Toast';
const SUBSCRIPTION_PLANS = [
    {
        name: 'Free',
        price: '$0',
        credits: 300,
        features: [
            'Up to 300 messages/month',
            'Basic templates',
            'Single device',
            'Email support'
        ]
    },
    {
        name: 'Pro',
        price: '$9',
        credits: 1000,
        features: [
            'Up to 1000 messages/month',
            'Advanced templates',
            'Multiple devices',
            'Priority support',
            'Analytics dashboard',
            'Custom branding'
        ]
    },

];
function Subscription() {
    const [subscription, setSubscription] = useState({
        plan: 'free',
        status: 'active',
        nextBilling: '2024-04-01',
        credits: {
            total: 300,
            used: 150,
            remaining: 150
        }
    });

    const { data, error, loading } = useFetch("/auth/profile", {
        method: "GET",
    }, [])

    if (error) {
        return showToast(error, "error")
    }

    useEffect(() => {
        if (data) {
            const futureDate = new Date();
            futureDate.setDate(futureDate.getDate() + 30);
            setSubscription({
                ...subscription,
                nextBilling: futureDate,
                credits: {
                    total: data.total_credit,
                    used: data.used_credit,
                    remaining: data.remaining_credit
                }
            })
        }
    }, [data])


    return (
        <>
            {/* Current Subscription */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Current Subscription</h2>
                </div>
                <div className="p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">
                                {subscription.plan.charAt(0).toUpperCase() + subscription.plan.slice(1)} Plan
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Next billing date: {new Date(subscription.nextBilling).toLocaleDateString()}
                            </p>
                        </div>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${subscription.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                            }`}>
                            {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
                        </span>
                    </div>

                    {/* Credits Usage */}
                    <div className="mt-6">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Credits Usage</h4>
                        <div className="bg-gray-100 rounded-full h-2">
                            <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${(subscription.credits.used / subscription.credits.total) * 100}%` }}
                            />
                        </div>
                        <div className="mt-2 flex justify-between text-sm text-gray-600">
                            <span>{subscription.credits.used.toLocaleString()} used</span>
                            <span>{subscription.credits.remaining.toLocaleString()} remaining</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subscription Plans */}
            <div className="bg-white rounded-lg shadow-md">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-xl font-semibold text-gray-800">Available Plans</h2>
                </div>
                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {SUBSCRIPTION_PLANS.map((plan, index) => (
                            <div
                                key={plan.name}
                                className={`rounded-lg border-2 p-6 ${plan.name.toLowerCase() === subscription.plan
                                    ? 'border-blue-500 bg-blue-50'
                                    : 'border-gray-200'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900">{plan.name}</h3>
                                        <div className="mt-1">
                                            <span className="text-2xl font-bold text-gray-900">{plan.price}</span>
                                            <span className="text-gray-500">/month</span>
                                        </div>
                                    </div>
                                    {index === 1 && (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            Popular
                                        </span>
                                    )}
                                </div>

                                <div className="mt-6 space-y-4">
                                    {plan.features.map((feature, index) => (
                                        <div key={index} className="flex items-start">
                                            <CheckCircle2 className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" />
                                            <span className="text-sm text-gray-600">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleUpgrade(plan.name.toLowerCase())}
                                    disabled={plan.name.toLowerCase() === subscription.plan}
                                    className={`mt-6 w-full py-2 px-4 rounded-md ${plan.name.toLowerCase() === subscription.plan
                                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700  cursor-not-allowed'
                                        }`}
                                >
                                    {plan.name.toLowerCase() === subscription.plan ? 'Current Plan' : 'Upcoming'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Subscription
