import React from 'react';
import { MessageCircle, Zap, Shield, Users, ChevronRight, CheckCircle2, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useWhatsApp } from '../context/WatsappContext';
import Model from './model/Model';
import Auth from './Auth';

export const Home = () => {
    const { setShowModal, showModal, setIsRegistering, isRegistering } = useWhatsApp();
    return (
        <>
            {
                showModal &&
                <Model text="Create Account" width="md" setIsRegistering={setIsRegistering} setShowModal={setShowModal} showModal={showModal} isRegistering={isRegistering} Component={() => <Auth isRegistering={isRegistering} setIsRegistering={setIsRegistering} />} />
            }
            <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
                <div className="max-w-full px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                            <MessageCircle className="w-8 h-8 text-blue-600" />
                            <span className="text-xl font-semibold text-gray-800">
                                <Link to="/">
                                    WhatsApp Compaign
                                </Link>
                            </span>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center space-x-2 px-4 py-2 rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            <span>Get started</span>
                        </button>
                    </div>
                </div>
            </header>
            <div className="space-y-12 mt-16">
                {/* Hero Section */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 md:p-12">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                            Supercharge Your WhatsApp Marketing
                        </h1>
                        <p className="text-xl text-gray-600 mb-8">
                            Reach your customers instantly with personalized WhatsApp campaigns. Boost engagement and drive conversions with our powerful platform.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                onClick={() => setShowModal(true)}
                            >
                                Get Started Free
                                <ChevronRight className="w-5 h-5 ml-2" />
                            </button>
                            <Link to="/dashboard/settings" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                                View Demo
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                            <Zap className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Instant Delivery</h3>
                        <p className="text-gray-600">Send messages instantly to thousands of customers with our optimized delivery system.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                            <Shield className="w-6 h-6 text-green-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">WhatsApp Approved</h3>
                        <p className="text-gray-600">Fully compliant with WhatsApp Business API guidelines and best practices.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <h3 className="text-lg font-semibold mb-2">Smart Targeting</h3>
                        <p className="text-gray-600">Segment your audience and send personalized messages to the right customers.</p>
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold mb-6 text-center">Why Choose Our Platform?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="flex items-start space-x-4">
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Pre-built Templates</h3>
                                <p className="text-gray-600">Choose from 10+ professionally designed templates for various industries.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Bulk Messaging</h3>
                                <p className="text-gray-600">Send messages to thousands of contacts with just a few clicks.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">Analytics & Tracking</h3>
                                <p className="text-gray-600">Track delivery rates, engagement, and campaign performance.</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-4">
                            <CheckCircle2 className="w-6 h-6 text-green-500 flex-shrink-0" />
                            <div>
                                <h3 className="font-semibold mb-1">24/7 Support</h3>
                                <p className="text-gray-600">Get help anytime with our dedicated customer support team.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Success Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
                        <div className="text-gray-600">Delivery Rate</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">5M+</div>
                        <div className="text-gray-600">Messages Sent</div>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="text-3xl font-bold text-blue-600 mb-2">1000+</div>
                        <div className="text-gray-600">Happy Customers</div>
                    </div>
                </div>

                {/* CTA Section */}
                <div className="bg-blue-600  p-8 md:p-12 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to Get Started?</h2>
                    <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join thousands of businesses already using our platform to reach their customers on WhatsApp.
                    </p>
                    <button className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-blue-50">
                        Start Free Trial
                    </button>
                </div>
            </div>
        </>
    );
};