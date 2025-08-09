// /src/pages/Pricing.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// --- UI Component: PricingCard ---
const PricingCard = ({ plan, prices, features, isFeatured = false, billingCycle }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.3 }}
    transition={{ duration: 0.5 }}
    className={`p-8 rounded-2xl shadow-lg border-2 w-full ${isFeatured ? 'bg-dark text-white border-primary scale-105' : 'bg-white border-gray-200'}`}
  >
    {isFeatured && <div className="text-center mb-4"><span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full uppercase">Most Popular</span></div>}
    <h3 className="font-heading text-2xl font-bold text-center">{plan.name}</h3>
    
    <div className="text-center my-6 h-24 flex flex-col justify-center">
        <AnimatePresence mode="wait">
            <motion.p 
                key={billingCycle}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.2 }}
                className="text-5xl font-extrabold"
            >
                {prices[billingCycle]}
            </motion.p>
        </AnimatePresence>
        <p className={`text-base font-medium ${isFeatured ? 'opacity-70' : 'text-gray-500'}`}>{plan.userType}</p>
    </div>

    <ul className="space-y-4 mb-8">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-3">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${isFeatured ? 'bg-secondary' : 'bg-green-100 text-secondary'}`}>✓</span>
          <span className={`${isFeatured ? 'opacity-90' : 'text-gray-700'}`}>{feature}</span>
        </li>
      ))}
    </ul>
    <Link to="/login" className={`block w-full text-center font-bold py-3.5 rounded-lg transition-colors ${isFeatured ? 'bg-primary hover:bg-primary-dark text-white' : 'bg-primary/10 hover:bg-primary/20 text-primary'}`}>
      {plan.cta}
    </Link>
  </motion.div>
);

// --- UI Component: FAQ Item ---
const FaqItem = ({ q, a, isOpen, onClick }) => (
  <div className="border-b border-gray-200 last:border-b-0">
    <button onClick={onClick} className="w-full flex justify-between items-center text-left py-5 px-4 hover:bg-gray-50 rounded-lg transition-colors">
      <span className="text-lg font-semibold text-dark">{q}</span>
      <motion.span animate={{ rotate: isOpen ? 45 : 0 }} className="text-primary text-2xl">+</motion.span>
    </button>
    <AnimatePresence>
    {isOpen && (
      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
        <p className="text-gray-600 px-4 pb-5">{a}</p>
      </motion.div>
    )}
    </AnimatePresence>
  </div>
);

function Pricing() {
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [openFaq, setOpenFaq] = useState(0);

  const plans = {
    free: { name: 'Basic', userType: '/user', cta: 'Get Started', features: ["Basic Interest Profiler", "Limited Career Matches (Top 3)", "Access to Public Resources"] },
    premium: { name: 'Premium', userType: '/user', cta: 'Go Premium', features: ["Holistic Assessment Suite", "Unlimited Career Matches", "Personalized AI Roadmap", "AI Interview Practice", "Full Resource Library Access"] },
    schools: { name: 'For Schools', userType: '/school', cta: 'Contact Sales', features: ["Everything in Premium", "Counselor Dashboard", "Bulk Student Onboarding", "Progress & Analytics Reporting"] }
  };
  const prices = {
    free: { monthly: '₹0', annually: '₹0' },
    premium: { monthly: '₹499', annually: '₹4,999' },
    schools: { monthly: 'Custom', annually: 'Custom' }
  };
  const faqData = [
    { q: "Is the Basic plan really free forever?", a: "Yes! The Basic plan is free forever and is designed to give you a great introduction to our platform and your potential career paths." },
    { q: "What happens if I upgrade to Premium?", a: "You will unlock all the advanced features, including the full assessment suite, unlimited career matches, and the personalized AI-powered roadmap to guide your next steps." },
    { q: "Can I cancel my Premium subscription anytime?", a: "Absolutely. You can cancel your subscription at any time, and you will retain access to Premium features until the end of your current billing period." }
  ];

  return (
    <div className="bg-light-gray">
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 left-0 right-0 z-10">
          <div className="container mx-auto px-6 h-20 flex justify-between items-center">
              <Link to="/" className="font-heading text-2xl font-bold text-primary">Learn-x-AI</Link>
              <Link to="/login" className="font-bold text-primary">Login</Link>
          </div>
      </header>
      
      <main>
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <motion.h1 initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }} className="font-heading text-4xl md:text-6xl font-extrabold text-dark mb-4">Find the Perfect Plan</motion.h1>
            <motion.p initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.1 }} className="text-lg text-gray-600 max-w-2xl mx-auto">A small price for invaluable clarity. Start for free, and upgrade when you're ready to unlock your full potential.</motion.p>
          
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.2 }} className="mt-10 flex justify-center items-center gap-4">
                <span className={`font-semibold ${billingCycle === 'monthly' ? 'text-primary' : 'text-gray-500'}`}>Monthly</span>
                <div onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annually' : 'monthly')} className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer ${billingCycle === 'monthly' ? 'bg-primary' : 'bg-primary'}`}>
                    <motion.div layout className="w-6 h-6 bg-white rounded-full shadow-md" />
                </div>
                <span className={`font-semibold ${billingCycle === 'annually' ? 'text-primary' : 'text-gray-500'}`}>Annually</span>
            </motion.div>
          </div>
          
          <div className="container mx-auto px-6 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center max-w-6xl">
            <PricingCard plan={plans.free} prices={prices.free} features={plans.free.features} billingCycle={billingCycle} />
            <PricingCard plan={plans.premium} prices={prices.premium} features={plans.premium.features} billingCycle={billingCycle} isFeatured={true} />
            <PricingCard plan={plans.schools} prices={prices.schools} features={plans.schools.features} billingCycle={billingCycle} />
          </div>
        </section>

        <section className="py-24">
             <div className="container mx-auto px-6">
                <h2 className="font-heading text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
                <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-4 sm:p-6 border">
                    {faqData.map((item, index) => <FaqItem key={index} {...item} isOpen={openFaq === index} onClick={() => setOpenFaq(openFaq === index ? null : index)} />)}
                </div>
            </div>
        </section>
      </main>
    </div>
  );
}

export default Pricing;