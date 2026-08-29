import React, { useEffect } from 'react';
import { X, ExternalLink, ShoppingBag, ShieldCheck, Heart, Truck, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useGlobalContent } from '../contexts/GlobalContentContext';

interface AmazonModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName?: string;
  price?: string;
  amazonUrl?: string;
}

export default function AmazonModal({ 
  isOpen, 
  onClose, 
  productName = "",
  price = "",
  amazonUrl = ""
}: AmazonModalProps) {
  const { content } = useGlobalContent();
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const title = content?.amazonModalTitle;
  const description = content?.amazonModalDescription;
  const trustText = content?.amazonModalTrustText;
  const verifiedLabel = content?.amazonModalVerifiedLabel;
  const itemLabel = content?.amazonModalItemLabel;
  const priceLabel = content?.amazonModalPriceLabel;
  const continueLabel = content?.amazonModalContinueLabel;
  const cancelLabel = content?.amazonModalCancelLabel;
  const benefits = content?.amazonModalBenefits || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-pure-black/60 backdrop-blur-sm"
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative w-full max-w-lg bg-pure-white dark:bg-inverse-surface text-pure-black dark:text-pure-white rounded-xl shadow-2xl overflow-hidden border border-hairline dark:border-neutral-800 z-10 p-6 md:p-8"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            {/* Close Button */}
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface dark:hover:bg-neutral-800 text-tertiary hover:text-pure-black dark:hover:text-pure-white transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="text-center md:text-left mb-6">
              {verifiedLabel && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-amber-50 dark:bg-amber-950/40 text-copper dark:text-primary-fixed-dim border border-copper/10 mb-3">
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {verifiedLabel}
                </span>
              )}
              {title && (
                <h2 id="modal-title" className="font-display font-semibold text-2xl tracking-tight mt-1">
                  {title}
                </h2>
              )}
              {description && (
                <p className="text-secondary dark:text-neutral-400 text-sm mt-1">
                  {description}
                </p>
              )}
            </div>

            {/* Product Quick-View */}
            <div className="p-4 bg-surface dark:bg-neutral-800/40 rounded-lg border border-hairline dark:border-neutral-800 mb-6">
              <div className="flex justify-between items-start gap-4">
                <div>
                  {itemLabel && <div className="text-xs font-mono uppercase tracking-wider text-secondary dark:text-neutral-400">{itemLabel}</div>}
                  <div className="font-display font-semibold text-lg text-pure-black dark:text-pure-white mt-0.5">{productName}</div>
                </div>
                {price && (
                  <div className="text-right">
                    {priceLabel && <div className="text-xs font-mono uppercase tracking-wider text-secondary dark:text-neutral-400">{priceLabel}</div>}
                    <div className="font-display font-bold text-lg text-copper dark:text-primary-fixed-dim mt-0.5">{price}</div>
                  </div>
                )}
              </div>
            </div>

            {/* Benefits list */}
            {benefits.length > 0 && (
              <div className="space-y-4 mb-8">
                {benefits.map((benefit) => {
                  let IconComponent = Award; // Fallback
                  if (benefit.iconName === 'ShieldCheck') IconComponent = ShieldCheck;
                  if (benefit.iconName === 'Truck') IconComponent = Truck;
                  if (benefit.iconName === 'Award') IconComponent = Award;

                  return (
                    <div key={benefit.id} className="flex items-start gap-3">
                      <div className="p-2 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 mt-0.5">
                        <IconComponent className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{benefit.title}</h4>
                        <p className="text-xs text-secondary dark:text-neutral-400 mt-0.5">{benefit.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3">
              {continueLabel && (
                <a
                  href={amazonUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  className="w-full btn-primary py-4 px-6 rounded-full font-semibold text-center flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                >
                  {continueLabel}
                  <ExternalLink className="w-4 h-4" />
                </a>
              )}
              {cancelLabel && (
                <button
                  onClick={onClose}
                  className="w-full bg-transparent hover:bg-surface dark:hover:bg-neutral-800 text-secondary dark:text-neutral-300 hover:text-pure-black dark:hover:text-pure-white py-3 px-6 rounded-full font-medium text-center text-sm transition-colors border border-transparent hover:border-hairline"
                >
                  {cancelLabel}
                </button>
              )}
            </div>

            {/* Trust Footer */}
            {trustText && (
              <div className="mt-6 pt-4 border-t border-hairline dark:border-neutral-800 text-center">
                <p className="text-[10px] text-tertiary dark:text-neutral-500 flex items-center justify-center gap-1">
                  <Heart className="w-3 h-3 text-copper fill-copper" /> {trustText}
                </p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
