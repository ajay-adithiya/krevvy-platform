import React, { useState } from 'react';
import { HelpCircle, ChevronDown, BookOpen, Inbox, ShieldAlert, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';

export default function FAQ() {
  const { data: faqData, loading } = useFetch(api.getFaqContent);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-[#050505] transition-colors duration-500">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          <div className="h-4 w-32 bg-surface-container rounded-full mb-4 animate-pulse"></div>
          <div className="h-10 w-64 bg-surface-container rounded-full mb-12 animate-pulse"></div>
          <div className="w-full space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-16 w-full bg-surface-container rounded-xl animate-pulse"></div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!faqData || !faqData.categories || faqData.categories.length === 0) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-[#050505] transition-colors duration-500">
        <div className="max-w-4xl mx-auto text-center text-secondary dark:text-neutral-500">
          FAQ content is currently empty.
        </div>
      </section>
    );
  }

  const { content, categories } = faqData;

  // Filter out categories that have no visible FAQs
  const visibleCategories = categories
    .filter(c => c.isVisible)
    .map(c => ({
      ...c,
      faqs: c.faqs.filter(faq => faq.isVisible)
    }))
    .filter(c => c.faqs.length > 0)
    .sort((a, b) => a.displayOrder - b.displayOrder);

  // Flatten FAQs for "All" view or filter by active category
  const activeFaqs = activeCategory === 'all'
    ? visibleCategories.flatMap(c => c.faqs)
    : visibleCategories.find(c => c.id === activeCategory)?.faqs || [];

  const toggleExpand = (id: string) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const activeCategoriesList = [];
  if (content?.allFaqsLabel) {
    activeCategoriesList.push({ id: 'all', displayLabel: content.allFaqsLabel });
  }
  activeCategoriesList.push(...visibleCategories);

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-pure-black border-t border-hairline dark:border-neutral-900 transition-colors duration-500">
      <div className="max-w-4xl mx-auto">

        {/* Title block */}
        <div className="text-center md:text-left mb-16">
          {content?.headerEyebrow && (
            <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-bold">
              {content.headerEyebrow}
            </span>
          )}
          {content?.headerTitle && (
            <h2
              className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2 leading-tight"
              dangerouslySetInnerHTML={{ __html: content.headerTitle.replace(/\n/g, '<br />') }}
            />
          )}
          {content?.headerSubtitle && (
            <p className="font-sans text-secondary dark:text-neutral-400 text-sm md:text-base max-w-xl mt-3 whitespace-pre-wrap">
              {content.headerSubtitle}
            </p>
          )}
        </div>

        {/* Category Toolbar */}
        <div className="flex flex-wrap gap-2 justify-center md:justify-start border-b border-hairline dark:border-neutral-900 pb-6 mb-10">
          {activeCategoriesList.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id);
                setExpandedId(null);
              }}
              className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 transition-all duration-300 cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-copper text-pure-white shadow-sm'
                  : 'bg-surface dark:bg-neutral-900 text-secondary hover:text-pure-black dark:text-neutral-400 dark:hover:text-pure-white border border-hairline dark:border-neutral-800'
              }`}
            >
              {cat.displayLabel}
            </button>
          ))}
        </div>

        {/* Accordion List */}
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {activeFaqs.map((faq) => {
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
                    <div className="p-6 md:p-8 bg-surface/50 dark:bg-neutral-950/20 text-sm md:text-base text-tertiary dark:text-neutral-400 leading-relaxed text-left whitespace-pre-wrap">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Fallback Contact Reminder */}
        {content?.fallbackSupportText && (
          <div className="mt-12 text-center p-6 bg-surface dark:bg-neutral-900/20 rounded-xl border border-hairline dark:border-neutral-900/50">
            <p className="text-xs text-secondary dark:text-neutral-400 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: content.fallbackSupportText }} />
          </div>
        )}

      </div>
    </section>
  );
}
