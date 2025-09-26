import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const PackageSection = () => {
    const [loading, setLoading] = useState(null);

    const handlePayment = async (planName, price) => {
        setLoading(planName);

        try {
            const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

            const stripe = await loadStripe(stripeKey);

            if (!stripe) {
                throw new Error('Stripe failed to load. Please check your publishable key');
            }

            const body = {
                planName: planName,
                amount: price * 100, // Convert to cents for Stripe
                currency: 'usd'
            };

            const response = await fetch('https://fitby-fitness-ai-powered-app.onrender.com/api/personalized-trainer/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status}`);
            }

            const session = await response.json();

            if (!session.id) {
                throw new Error('No session ID returned from server');
            }


            const result = await stripe.redirectToCheckout({
                sessionId: session.id,
            });

            if (result.error) {
                throw new Error(result.error.message);
            }
        } catch (error) {
            console.error('Payment error:', error);
            alert(`Payment failed: ${error.message}`);
        } finally {
            setLoading(null);
        }
    };
    const packages = [
        {
            name: "Basic Plan",
            price: 299,
            popular: false,
            description: "Perfect for beginners starting their fitness journey",
            features: [
                "Basic workout plan (3 days/week)",
                "Nutrition guidelines and tips",
                "Progress tracking dashboard",
                "Email support from trainers",
                "Access to exercise video library"
            ]
        },
        {
            name: "Regular Plan",
            price: 399,
            popular: true,
            description: "Most popular choice for dedicated fitness enthusiasts",
            features: [
                "Personalized workout plan (5 days/week)",
                "Complete meal plans & recipes",
                "Real-time progress analytics",
                "Weekly video calls with trainer",
                "Priority chat support & community access"
            ]
        },
        {
            name: "Premium Plan",
            price: 599,
            popular: false,
            description: "Complete package for serious athletes and professionals",
            features: [
                "Advanced AI-powered workout plans (7 days/week)",
                "Custom meal plans with macro tracking",
                "24/7 personal trainer availability",
                "Biometric monitoring & health insights",
                "Supplement recommendations & workout gear discounts"
            ]
        }
    ];

    return (
        <section className="py-16 px-4 bg-gray-900">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="grid lg:grid-cols-2 gap-8 mb-12">
                    <div>
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                            Start Your Body Goal from Choosing Our Package
                        </h2>
                    </div>
                    <div>
                        <p className="text-gray-300 text-lg leading-relaxed">
                            Choose the perfect training package that aligns with your fitness goals and lifestyle.
                            Our expertly designed plans offer comprehensive support, personalized guidance, and
                            flexible options to help you achieve sustainable results. Whether you're starting your
                            fitness journey or pushing towards advanced goals, we have the right package for you.
                        </p>
                    </div>
                </div>

                {/* Package Cards */}
                <div className="grid md:grid-cols-3 gap-8">
                    {packages.map((pkg, index) => (
                        <div
                            key={index}
                            className={`relative bg-gray-800 rounded-lg p-8 transition-transform duration-300 hover:scale-105 ${pkg.popular ? 'border-2 border-orange-500 transform scale-105' : 'border border-gray-700'
                                }`}
                        >
                            {/* Popular Badge */}
                            {pkg.popular && (
                                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                                    <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                                        POPULAR
                                    </span>
                                </div>
                            )}

                            {/* Plan Name */}
                            <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>

                            {/* Description */}
                            <p className="text-gray-400 text-sm mb-6">{pkg.description}</p>

                            {/* Price */}
                            <div className="mb-8">
                                <span className="text-orange-500 text-4xl font-bold">${pkg.price}</span>
                                <span className="text-gray-400 text-lg ml-2">/ MONTH</span>
                            </div>

                            {/* Get Started Button */}
                            <button
                                onClick={() => handlePayment(pkg.name, pkg.price)}
                                disabled={loading === pkg.name}
                                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 mb-8"
                            >
                                {loading === pkg.name ? 'Processing...' : 'Get Started'}
                            </button>

                            {/* Features */}
                            <div className="space-y-4">
                                <h4 className="text-white font-semibold mb-4">What's Include</h4>
                                {pkg.features.map((feature, featureIndex) => (
                                    <div key={featureIndex} className="flex items-center space-x-3">
                                        <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                                            <svg
                                                className="w-3 h-3 text-white"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                        </div>
                                        <span className="text-gray-300 text-sm">{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PackageSection;
