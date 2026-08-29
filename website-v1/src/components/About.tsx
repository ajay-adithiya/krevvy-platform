import React from 'react';
import { Compass, PenTool, ShieldCheck, Heart, UserCheck, Settings, CheckCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';

const IconRegistry: Record<string, React.ElementType> = {
  PenTool,
  Settings,
  ShieldCheck,
  Heart,
  UserCheck,
  Compass,
  CheckCircle,
};

export default function About() {
  const { data, loading } = useFetch(api.getAboutContent);

  if (loading) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-pure-black transition-colors duration-500">
        <div className="max-w-5xl mx-auto text-left animate-pulse">
          <div className="h-4 w-32 bg-surface-container rounded-full mb-4"></div>
          <div className="h-12 w-64 bg-surface-container rounded-full mb-16"></div>
          <div className="h-4 w-full bg-surface-container rounded-full mb-4"></div>
          <div className="h-4 w-3/4 bg-surface-container rounded-full"></div>
        </div>
      </section>
    );
  }

  const content = data?.content;
  const pillars = data?.pillars || [];

  if (!content) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-pure-black transition-colors duration-500">
         <div className="max-w-5xl mx-auto text-center text-secondary dark:text-neutral-500">About content is currently empty.</div>
      </section>
    );
  }

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-pure-black transition-colors duration-500">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Overline & Main Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-bold">
            {content.pageEyebrow}
          </span>
          <h2
            className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2 leading-tight"
            dangerouslySetInnerHTML={{ __html: (content.pageTitle || "").replace(/\n/g, '<br class="hidden md:inline" />') }}
          />
          <div className="w-16 h-[3px] bg-copper mt-6 rounded-full" />
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-7">
            {content.pageSubtitle && (
              <p className="font-sans text-base md:text-lg text-pure-black dark:text-neutral-200 leading-relaxed font-medium whitespace-pre-wrap">
                {content.pageSubtitle}
              </p>
            )}
            {content.narrativeText && (
              <p className="font-sans text-sm md:text-base text-tertiary dark:text-neutral-400 mt-6 leading-relaxed whitespace-pre-wrap">
                {content.narrativeText}
              </p>
            )}
          </div>

          {(content.enterpriseHeading || content.enterpriseText) && (
            <div className="md:col-span-5 bg-surface dark:bg-neutral-950 p-8 rounded-xl border border-hairline dark:border-neutral-900 flex flex-col justify-between">
              <div>
                <h3 className="font-display font-bold text-lg text-pure-black dark:text-pure-white mb-2">{content.enterpriseHeading}</h3>
                <p className="text-xs text-tertiary dark:text-neutral-400 leading-relaxed whitespace-pre-wrap">
                  {content.enterpriseText}
                </p>
              </div>

              {(content.manufacturingHeading || content.manufacturingText) && (
                <div className="mt-8 pt-6 border-t border-hairline dark:border-neutral-900 flex items-center gap-4">
                  <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-copper rounded-full">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary dark:text-neutral-400 block">{content.manufacturingHeading}</span>
                    <span className="text-xs font-bold text-pure-black dark:text-pure-white block mt-0.5">{content.manufacturingText}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Three Core Pillars Cards */}
        {pillars.length > 0 && (
          <div className="mb-24">
            {content.pillarsHeading && (
              <h3 className="font-display text-xl font-bold text-pure-black dark:text-pure-white mb-10 border-b border-hairline dark:border-neutral-900 pb-4">
                {content.pillarsHeading}
              </h3>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pillars.map((pillar, i) => {
                const IconComponent = IconRegistry[pillar.iconName] || CheckCircle;
                return (
                  <motion.div
                    key={pillar.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="p-8 rounded-xl border border-hairline dark:border-neutral-800 bg-pure-white dark:bg-neutral-900/20 soft-elevation interactive-lift flex flex-col items-start text-left"
                  >
                    <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-copper rounded-lg mb-6">
                      <IconComponent className="w-6 h-6 text-copper" />
                    </div>
                    <h4 className="font-display font-semibold text-lg text-pure-black dark:text-pure-white">
                      {pillar.title}
                    </h4>
                    <p className="font-sans text-xs md:text-sm text-tertiary dark:text-neutral-400 mt-3 leading-relaxed whitespace-pre-wrap">
                      {pillar.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lab Certification Box */}
        {(content.certificationHeading || content.certificationText) && (
          <div className="p-8 md:p-12 bg-surface-container-low dark:bg-neutral-950/40 rounded-xl border border-hairline dark:border-neutral-900 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="text-center md:text-left">
              <h4 className="font-display font-semibold text-xl text-pure-black dark:text-pure-white">
                {content.certificationHeading}
              </h4>
              <p className="text-xs text-tertiary dark:text-neutral-400 mt-2 max-w-xl whitespace-pre-wrap">
                {content.certificationText}
              </p>
            </div>
            {content.certificationBadgeLabel && (
              <div className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 bg-pure-white dark:bg-neutral-900 rounded-full border border-hairline dark:border-neutral-800 text-xs font-bold tracking-wider uppercase text-pure-black dark:text-pure-white">
                <UserCheck className="w-4.5 h-4.5 text-copper" />
                {content.certificationBadgeLabel}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
