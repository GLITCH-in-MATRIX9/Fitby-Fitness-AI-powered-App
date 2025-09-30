import React, { useState } from 'react';

// --- Stripe setup ---
const STRIPE_PUBLIC_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || null;

const loadStripeScript = () => {
  return new Promise((resolve, reject) => {
    if (typeof window.Stripe !== "undefined") {
      resolve(window.Stripe);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://js.stripe.com/v3/";
    script.async = true;

    script.onload = () => {
      if (typeof window.Stripe !== "undefined") resolve(window.Stripe);
      else reject(new Error("Stripe loaded but not found."));
    };

    script.onerror = () => reject(new Error("Failed to load Stripe script."));
    document.head.appendChild(script);
  });
};

const loadStripe = async (publicKey) => {
  try {
    const Stripe = await loadStripeScript();
    return Stripe(publicKey);
  } catch (e) {
    console.error("Stripe init error:", e);
    return null;
  }
};

// --- PackageSection ---
const PackageSection = () => {
  const [loading, setLoading] = useState(null);
  const [paymentMessage, setPaymentMessage] = useState(null);

  const handlePayment = async (planName, price) => {
    setLoading(planName);
    setPaymentMessage(null);

    try {
      if (!STRIPE_PUBLIC_KEY)
        throw new Error("Stripe publishable key missing in .env");

      const stripe = await loadStripe(STRIPE_PUBLIC_KEY);
      if (!stripe) throw new Error("Stripe initialization failed.");

      const response = await fetch(
        "https://fitby-fitness-ai-powered-app.onrender.com/api/personalized-trainer/create-checkout-session",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ planName, amount: price * 100, currency: "usd" }),
        }
      );

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Server error (${response.status}): ${errorBody}`);
      }

      const session = await response.json();
      if (!session.id) throw new Error("No session ID returned.");

      const result = await stripe.redirectToCheckout({ sessionId: session.id });
      if (result.error) throw new Error(result.error.message);

    } catch (error) {
      console.error(error);
      setPaymentMessage(`Payment failed: ${error.message}`);
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
        "Access to exercise video library",
      ],
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
        "Priority chat support & community access",
      ],
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
        "Supplement recommendations & workout gear discounts",
      ],
    },
  ];

  return (
    <section className="py-16 px-4 font-sans min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="text-4xl lg:text-5xl font-extrabold text-[#ec6124] mb-6 leading-tight">
              Start Your Body Goal from Choosing Our Package
            </h2>
          </div>
          <div>
            <p className="text-gray-700 text-lg leading-relaxed">
              Choose the perfect training package that aligns with your fitness goals and lifestyle.
              Our expertly designed plans offer comprehensive support, personalized guidance, and flexible
              options to help you achieve sustainable results.
            </p>
          </div>
        </div>

        {/* Error Message */}
        {paymentMessage && (
          <div
            className="bg-red-100 border border-red-300 text-red-800 p-4 rounded-lg mb-8"
            role="alert"
          >
            <p className="font-bold">Payment Alert</p>
            <p className="text-sm">{paymentMessage}</p>
          </div>
        )}

        {/* Package Cards */}
        <div className="grid md:grid-cols-3 gap-8" id="PackageSection">
          {packages.map((pkg) => (
            <div
              key={pkg.name}
              className={`relative rounded-xl shadow-md p-8 transition-all duration-300 transform hover:scale-105 ${pkg.popular ? "border-4 border-orange-500" : "border-none"}`}
            >
              {pkg.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2">
                  <span className="bg-orange-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                    POPULAR
                  </span>
                </div>
              )}

              <h3 className="text-3xl font-extrabold text-gray-900 mb-2 pt-4">
                {pkg.name}
              </h3>

              <p className="text-gray-700 text-sm mb-6 h-12 flex items-center">
                {pkg.description}
              </p>

              <div className="mb-8 pb-6">
                <span className="text-orange-500 text-5xl font-extrabold">${pkg.price}</span>
                <span className="text-gray-600 text-lg ml-2">/ MONTH</span>
              </div>

              <button
                onClick={() => handlePayment(pkg.name, pkg.price)}
                disabled={loading === pkg.name}
                className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-lg transition transform hover:scale-105"
              >
                {loading === pkg.name ? "Loading..." : "Get Started"}
              </button>

              <div className="space-y-4 pt-8">
                <h4 className="text-gray-900 font-bold text-lg mb-4 uppercase tracking-wider">
                  What's Included
                </h4>
                {pkg.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start space-x-3">
                    <div className="w-5 h-5 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
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
                    <span className="text-gray-700 text-base">{feature}</span>
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
