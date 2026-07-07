import React, { useState } from 'react';
import { HelpCircle, ChevronDown, BookOpen, Inbox, ShieldAlert, Award } from 'lucide-react';
import { FaqItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState<'all' | 'product' | 'warranty' | 'shipping' | 'general'>('all');
  const [expandedId, setExpandedId] = useState<string | null>("quiet-motor");

  const faqs: FaqItem[] = [
    {
      id: "quiet-motor",
      category: "product",
      question: "How does the 100,000 RPM motor maintain whisper-quiet operation?",
      answer: "Our digital motor utilizes dual aerospace-grade fluid dynamics chambers and a perfectly balanced ceramic rotor shaft that completely eliminates mechanical friction. This isolates vibration, dampening high-frequency whines and channeling airflow in a direct stream, keeping operational sound levels below 18dB on stealth mode."
    },
    {
      id: "filter-life",
      category: "product",
      question: "How often do I need to replace the True HEPA H13 filters?",
      answer: "Under standard continuous household use, Krevvy H13 filters are engineered to last 8,760 hours (approximately 12 months). When a replacement is required, the Aero Aura’s haptic dial will pulsate in a soft copper glow, and you can order certified replacement cartridges directly on our Amazon partner store."
    },
    {
      id: "warranty-registration",
      category: "warranty",
      question: "How do I register my product for the 3-Year Concierge Warranty?",
      answer: "Activation is simple. Within 30 days of receiving your device, navigate to our Contact page and send an inquiry selecting 'Extended Warranty Activation'. Provide your name, email, and 17-digit Amazon Order ID. Our concierge crew will process the registry and email your formal warranty certificate."
    },
    {
      id: "warranty-coverage",
      category: "warranty",
      question: "What is covered under the Krevvy warranty?",
      answer: "The 3-Year Extended Concierge Warranty provides full protection against all manufacturer defects, electrical issues, and motor wear. It includes complimentary express round-trip courier shipping from your doorstep, direct priority support from our engineering department, and full product replacements if repairs cannot be made."
    },
    {
      id: "amazon-shipping",
      category: "shipping",
      question: "Are orders fulfilled and shipped directly through Amazon?",
      answer: "Yes, absolutely. To guarantee prompt delivery, all official Krevvy inventories are stored directly inside local Amazon fulfillment warehouses. When you checkout, your order is dispatched via secure Amazon Prime logistics, featuring expedited delivery schedules and real-time tracking."
    },
    {
      id: "international-delivery",
      category: "shipping",
      question: "Do you offer international shipping?",
      answer: "We support shipping across the United States, India, and European Union regions via our localized Amazon global storefronts. If you reside outside these boundaries, please consult our concierge staff via the Contact page to coordinate special shipping pathways."
    },
    {
      id: "prowess-identity",
      category: "general",
      question: "What is the relationship between Krevvy and Prowess Click Kart?",
      answer: "Krevvy is a flagship luxury brand operated and backed by Prowess Click Kart Enterprise. Prowess handles our corporate administration, capital backing, global supply chain compliance, and international logistics, leaving our design studios and engineering labs free to focus purely on creating uncompromising appliances."
    }
  ];

  const filteredFaqs = faqs.filter(faq => {
    if (activeCategory === 'all') return true;
    return faq.category === activeCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const categories = [
    { id: 'all', label: 'All FAQs', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'product', label: 'Engineering', icon: <ChevronDown className="w-3.5 h-3.5" /> },
    { id: 'warranty', label: 'Warranty', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'shipping', label: 'Shipping', icon: <Inbox className="w-3.5 h-3.5" /> }
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-pure-black border-t border-hairline dark:border-neutral-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">
        
        {/* Title block */}
        <div className="text-center md:text-left mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-bold">
            SUPPORT INTELLIGENCE
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2 leading-tight">
            Frequently Asked Questions.
          </h2>
          <p className="font-sans text-secondary dark:text-neutral-400 text-sm md:text-base max-w-xl mt-3">
            Obtain immediate, transparent answers regarding Krevvy product standards, Amazon logistics, and warranty coverage.
          </p>
        </div>

        {/* Category Toolbar */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start border-b border-hairline dark:border-neutral-900 pb-6 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as any);
                setExpandedId(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-copper text-pure-white shadow-sm'
                  : 'bg-surface dark:bg-neutral-900 text-secondary hover:text-pure-black dark:text-neutral-400 dark:hover:text-pure-white border border-hairline dark:border-neutral-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div 
                  key={faq.id}
                  className="rounded-xl border border-hairline dark:border-neutral-800 bg-pure-white dark:bg-neutral-900/10 overflow-hidden transition-all duration-300 shadow-xs"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    aria-expanded={isExpanded}
                    className="w-full px-6 py-5 md:py-6 flex justify-between items-center gap-4 text-left font-display font-semibold text-base text-pure-black dark:text-pure-white hover:text-copper dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
                  >
                    <span className="flex items-start gap-3">
                      <HelpCircle className="w-5 h-5 text-copper mt-0.5 flex-shrink-0" />
                      <span>{faq.question}</span>
                    </span>
                    <ChevronDown className={`w-5 h-5 text-tertiary transition-transform duration-300 flex-shrink-0 ${isExpanded ? 'rotate-180' : ''}`} />
                  </button>

                  <div 
                    className={`transition-all duration-300 ease-in-out ${
                      isExpanded ? 'max-h-[500px] border-t border-hairline dark:border-neutral-800' : 'max-h-0'
                    } overflow-hidden`}
                  >
                    <div className="p-6 md:p-8 bg-surface/50 dark:bg-neutral-950/20 text-sm md:text-base text-tertiary dark:text-neutral-400 leading-relaxed text-left">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Fallback Contact Reminder */}
        <div className="mt-12 text-center p-6 bg-surface dark:bg-neutral-900/20 rounded-xl border border-hairline dark:border-neutral-900/50">
          <p className="text-xs text-secondary dark:text-neutral-400">
            Cannot find the answer to your specific technical question? Contact our concierge desk directly at <span className="font-semibold text-pure-black dark:text-pure-white">concierge@krevvy.com</span>. We will analyze your query and follow up within 12 hours.
          </p>
        </div>

      </div>
    </section>
  );
}
