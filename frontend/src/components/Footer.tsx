import React from 'react';
import { ActiveView } from '../types';
import Logo from './Logo';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onBuyClick: () => void;
}

export default function Footer({ setActiveView, onBuyClick }: FooterProps) {
  
  const handleNavClick = (view: ActiveView) => {
    setActiveView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-surface dark:bg-[#0a0a0a] border-t border-hairline dark:border-neutral-900 transition-colors duration-500 py-16 px-6 md:px-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12">
        
        {/* Brand/Signature column */}
        <div className="md:col-span-4 flex flex-col items-start gap-4 text-left">
          <button 
            onClick={() => handleNavClick('home')}
            className="p-1 rounded focus:outline-none focus:ring-2 focus:ring-copper/30"
            aria-label="Krevvy Home"
          >
            <Logo className="h-6 w-auto" />
          </button>
          
          <p className="text-xs text-tertiary dark:text-neutral-500 max-w-sm leading-relaxed mt-2">
            Engineering luxury home technologies with obsessive material and acoustic discipline.
          </p>
          
          <div className="text-xs font-mono text-tertiary dark:text-neutral-500 mt-4 leading-normal">
            <div>© 2024 Krevvy.</div>
            <div>A Prowess Click Kart Enterprise.</div>
          </div>
        </div>

        {/* Links Column 1 */}
        <div className="md:col-span-3 text-left">
          <h4 className="text-xs font-bold uppercase tracking-widest text-pure-black dark:text-pure-white mb-4">
            Philosophy
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button 
                onClick={() => handleNavClick('about')}
                className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
              >
                Our Brand Story
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('products')}
                className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
              >
                Engineering Lab Studies
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('faq')}
                className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
              >
                Support Intel (FAQ)
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="md:col-span-3 text-left">
          <h4 className="text-xs font-bold uppercase tracking-widest text-pure-black dark:text-pure-white mb-4">
            Concierge Room
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <button 
                onClick={() => handleNavClick('contact')}
                className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
              >
                Personal Consultation
              </button>
            </li>
            <li>
              <button 
                onClick={onBuyClick}
                className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
              >
                Verify Amazon Order ID
              </button>
            </li>
            <li>
              <button 
                onClick={() => handleNavClick('contact')}
                className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
              >
                Submit Tech Feedback
              </button>
            </li>
          </ul>
        </div>

        {/* Links Column 3 */}
        <div className="md:col-span-2 text-left">
          <h4 className="text-xs font-bold uppercase tracking-widest text-pure-black dark:text-pure-white mb-4">
            Compliance
          </h4>
          <ul className="space-y-3 text-sm text-secondary dark:text-neutral-400">
            <li>
              <span className="cursor-not-allowed hover:text-copper">Privacy Policy</span>
            </li>
            <li>
              <span className="cursor-not-allowed hover:text-copper">Terms of Service</span>
            </li>
            <li>
              <span className="cursor-not-allowed hover:text-copper">Amazon Store Registry</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Baseline */}
      <div className="max-w-7xl mx-auto border-t border-hairline dark:border-neutral-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <span className="text-[10px] text-tertiary dark:text-neutral-500 font-mono tracking-wider">
          PLATFORM INGRESS: CLOUD RUN SECURITY ENCRYPTED
        </span>
        <span className="text-[10px] text-tertiary dark:text-neutral-500 font-mono tracking-wider">
          DESIGN SYSTEM VER 1.04 — CRAFTED UNDER MINIMALIST SPECIFICATION
        </span>
      </div>
    </footer>
  );
}
