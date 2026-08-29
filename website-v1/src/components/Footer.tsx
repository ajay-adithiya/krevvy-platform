import React from 'react';
import { ActiveView } from '../types';
import Logo from './Logo';
import { useGlobalContent } from '../contexts/GlobalContentContext';

interface FooterProps {
  setActiveView: (view: ActiveView) => void;
  onBuyClick: () => void;
  darkMode: boolean;
}

export default function Footer({ setActiveView, onBuyClick, darkMode }: FooterProps) {
  const { content, footerGroups } = useGlobalContent();

  const handleNavClick = (view: string) => {
    setActiveView(view as ActiveView);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logoUrl = content?.logoMedia?.url;
  const copyrightText = content?.copyrightText;
  const complianceText = content?.complianceText;

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
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-auto" />
            ) : (
              <Logo className="h-10 w-auto" darkMode={darkMode} />
            )}
          </button>

          {copyrightText && (
            <p className="text-xs text-tertiary dark:text-neutral-500 max-w-sm leading-relaxed mt-2 whitespace-pre-wrap">
              {copyrightText}
            </p>
          )}
        </div>

        {/* Dynamic Footer Groups */}
        {footerGroups.map((group) => (
          <div key={group.id} className="md:col-span-3 text-left">
            <h4 className="text-xs font-bold uppercase tracking-widest text-pure-black dark:text-pure-white mb-4">
              {group.title}
            </h4>
            <ul className="space-y-3 text-sm">
              {group.links.map((link) => (
                <li key={link.id}>
                  {link.targetView.startsWith('http') ? (
                    <a
                      href={link.targetView}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
                    >
                      {link.label}
                    </a>
                  ) : link.targetView === 'amazon' ? (
                    <button
                      onClick={onBuyClick}
                      className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  ) : link.targetView === 'disabled' ? (
                    <span className="text-secondary dark:text-neutral-400 cursor-not-allowed hover:text-copper">
                      {link.label}
                    </span>
                  ) : (
                    <button
                      onClick={() => handleNavClick(link.targetView)}
                      className="text-secondary hover:text-copper dark:text-neutral-400 dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
                    >
                      {link.label}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Baseline */}
      {complianceText && (
        <div className="max-w-7xl mx-auto border-t border-hairline dark:border-neutral-900 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-[10px] text-tertiary dark:text-neutral-500 font-mono tracking-wider w-full text-center whitespace-pre-wrap">
            {complianceText}
          </span>
        </div>
      )}
    </footer>
  );
}
