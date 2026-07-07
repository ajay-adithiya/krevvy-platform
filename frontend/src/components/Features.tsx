import React from 'react';
import { Gauge, CheckCircle2, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';

interface FeaturesProps {
  onLearnMoreClick: () => void;
}

export default function Features({ onLearnMoreClick }: FeaturesProps) {
  return (
    <section id="features" className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-pure-black border-t border-hairline dark:border-neutral-900 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="mb-16 md:mb-24 md:w-1/2 text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-3xl md:text-4xl lg:text-[40px] font-bold text-pure-black dark:text-pure-white tracking-tight">
              Obsessive Precision.
            </h2>
            <p className="mt-4 font-sans text-base md:text-lg text-tertiary dark:text-neutral-400 leading-relaxed">
              Every component is engineered to exacting standards, stripping away the unnecessary to deliver pure, unadulterated performance.
            </p>
          </motion.div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Feature 1: Large Image (Motor) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-8 relative bg-surface-container-low dark:bg-neutral-900 rounded-xl overflow-hidden group soft-elevation interactive-lift h-[320px] md:h-[420px]"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-pure-black/60 via-pure-black/25 to-transparent z-10" />
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCIr-blw9tOR3r8-q_XBn6ay7nLkssjzRsfzI4ZTD8yERM6-6PvP7H_RRM0va1x25AO7uDSP1SYZ1ZG23MV2ZiFj693NW8ZklCzxQgoXgQIbP8N8CaKXxLhMJPYSVDbDDDOXutYhvqFJmb-XbuckWpcclN6zrOtG0W3oY8DW9RbieugAUsCEzTVHDF-9v72DCiTY61v1y7is7vUinNork0efeKfmF441sHB-Zp9enkHp_7pfAmAgolo"
              alt="Macro photography of precision-machined internal turbine motor"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-x-0 bottom-0 p-8 md:p-10 z-20 flex flex-col items-start text-left">
              <span className="px-2.5 py-1 rounded bg-copper text-pure-white text-[10px] font-semibold tracking-widest uppercase mb-3">
                Propulsion
              </span>
              <h3 className="font-display text-2xl md:text-3xl font-bold text-pure-white leading-tight">
                Hyper-Efficient Motor
              </h3>
              <p className="font-sans text-sm md:text-base text-pure-white/80 mt-2 max-w-md leading-relaxed">
                Generating immense aerodynamic power while maintaining whisper-quiet acoustic signature.
              </p>
            </div>
          </motion.div>

          {/* Feature 2: Spec Focus (100k RPM) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-4 bg-surface dark:bg-neutral-900/60 rounded-xl p-8 md:p-10 flex flex-col justify-between soft-elevation interactive-lift border border-hairline dark:border-neutral-800 text-left"
          >
            <div>
              <div className="p-3 bg-amber-50 dark:bg-amber-950/20 text-copper dark:text-primary-fixed-dim rounded-lg w-fit mb-8">
                <Gauge className="w-8 h-8" />
              </div>
              <h3 className="font-display text-3xl font-bold text-pure-black dark:text-pure-white tracking-tight">
                100,000 RPM
              </h3>
              <p className="font-sans text-sm md:text-base text-tertiary dark:text-neutral-400 mt-3 leading-relaxed">
                Our proprietary digital motor spins five times faster than a Formula One car engine, creating unmatched, pure static pressure suction.
              </p>
            </div>
            
            <button 
              onClick={onLearnMoreClick}
              className="mt-8 pt-6 border-t border-hairline dark:border-neutral-800 w-full flex justify-between items-center text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white group hover:text-copper dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
            >
              <span>Explore Tech Specs</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1.5" />
            </button>
          </motion.div>

          {/* Feature 3: Minimal Spec Focus (Captures 99.97%) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="md:col-span-4 bg-pure-white dark:bg-neutral-900/40 rounded-xl p-8 md:p-10 flex flex-col justify-center soft-elevation interactive-lift border border-hairline dark:border-neutral-800 text-left"
          >
            <div className="uppercase tracking-widest text-xs font-semibold text-copper dark:text-primary-fixed-dim mb-2">
              FILTRATION STANDARDS
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold text-pure-black dark:text-pure-white tracking-tight">
              Captures 99.97%
            </h3>
            <p className="text-xs text-tertiary dark:text-neutral-400 mt-1 mb-6">Of microscope elements down to 0.1 microns</p>
            
            <ul className="space-y-4">
              <li className="flex items-center gap-3 border-b border-hairline dark:border-neutral-800/80 pb-3 font-sans text-sm font-medium text-tertiary dark:text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-copper flex-shrink-0" />
                <span>Allergens &amp; Pollens</span>
              </li>
              <li className="flex items-center gap-3 border-b border-hairline dark:border-neutral-800/80 pb-3 font-sans text-sm font-medium text-tertiary dark:text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-copper flex-shrink-0" />
                <span>Pet Dander &amp; Odors</span>
              </li>
              <li className="flex items-center gap-3 font-sans text-sm font-medium text-tertiary dark:text-neutral-300">
                <CheckCircle2 className="w-5 h-5 text-copper flex-shrink-0" />
                <span>VOCs &amp; Combustion Gases</span>
              </li>
            </ul>
          </motion.div>

          {/* Feature 4: Detail Image (Dial) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            className="md:col-span-8 relative bg-surface-container-low dark:bg-neutral-900 rounded-xl overflow-hidden group soft-elevation interactive-lift h-[320px] md:h-[420px]"
          >
            <img 
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuB7zj8qACxm8Ak2nESKviDV7pUyWbbIWgkvi1ze8cJv0Py1t4mJdt0bQlzSQaQLI84BbAANHTX1vh6HGamJ8cWeYGk-L6BO-sZe-WICHt_bcpkaE6GnqqpEKU0t_iSiH09LWHLkaVma18KhTNQo-EKMv7E9Hty7bMaRGDjN6TmKnBFkFx8IUDYIxEqZ9Ij7euO0SjXrTDqB58f1_5fgGp1lR84rr1bmXEBa67RCjCyAybw1wlv0F4Fu"
              alt="Close-up side profile of a minimalist aluminum and copper dial on the appliance"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-pure-black/10 z-10" />
            
            {/* Overlay panel floating in bottom-left */}
            <div className="absolute bottom-6 left-6 right-6 md:bottom-8 md:left-8 z-20 max-w-sm">
              <div className="bg-pure-white/95 dark:bg-[#111111]/95 backdrop-blur-md p-6 md:p-8 rounded-xl border border-hairline/80 dark:border-neutral-800 text-left shadow-lg">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 dark:bg-amber-950/20 text-copper border border-copper/15 mb-3">
                  <ShieldCheck className="w-3 h-3" />
                  Haptic Feedback
                </span>
                <h3 className="font-display text-xl font-bold text-pure-black dark:text-pure-white">
                  Tactile Interface
                </h3>
                <p className="font-sans text-xs md:text-sm text-tertiary dark:text-neutral-400 mt-2 leading-relaxed">
                  Physical controls milled from high-tensile solid aluminum provide deeply satisfying, immediate mechanical feedback.
                </p>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
