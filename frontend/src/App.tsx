import React, { useState, useEffect } from 'react';
import { ShoppingBag, Star, HelpCircle, Sparkles, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveView } from './types';

import Header from './components/Header';
import Hero from './components/Hero';
import Features from './components/Features';
import Products from './components/Products';
import About from './components/About';
import Contact from './components/Contact';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AmazonModal from './components/AmazonModal';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; price: string; url: string }>({
    name: "Krevvy Aero Aura",
    price: "$349.00",
    url: "https://www.amazon.com/s?k=krevvy+air+purifier"
  });

  // Load and apply dark mode preference from LocalStorage or system settings on Mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  // Update DOM class and LocalStorage when darkMode state changes
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return next;
    });
  };

  // Trigger Amazon confirmation modal with custom product parameters
  const triggerAmazonModal = (name: string, price: string, url: string) => {
    setSelectedProduct({ name, price, url });
    setModalOpen(true);
  };

  // Default handler for general Amazon CTA button
  const triggerDefaultAmazonModal = () => {
    triggerAmazonModal(
      "Krevvy Aero Aura Smart Purifier",
      "$349.00",
      "https://www.amazon.com/s?k=krevvy+air+purifier"
    );
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-pure-white dark:bg-pure-black text-pure-black dark:text-pure-white transition-colors duration-500 overflow-x-hidden selection:bg-copper selection:text-white">
      {/* Universal Sticky Header Navigation */}
      <Header 
        activeView={activeView} 
        setActiveView={setActiveView} 
        darkMode={darkMode} 
        toggleDarkMode={toggleDarkMode}
        onBuyClick={triggerDefaultAmazonModal}
      />

      {/* Main Content Canvas with smooth entry and exit transitions */}
      <main className="flex-grow pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}
          >
            {activeView === 'home' && (
              <>
                {/* 1. Immersive Hero Screen */}
                <Hero onViewProductsClick={() => setActiveView('products')} />

                {/* 2. Bento Grid of Engineering Precision */}
                <Features onLearnMoreClick={() => setActiveView('products')} />

                {/* 3. High-Conversion Secondary CTA */}
                <section className="py-24 md:py-32 px-6 md:px-12 bg-surface dark:bg-neutral-900/10 flex flex-col items-center justify-center text-center relative overflow-hidden transition-colors duration-500">
                  <div className="absolute inset-0 bg-radial from-amber-500/5 to-transparent dark:from-amber-500/3 pointer-events-none blur-3xl" />
                  
                  <div className="max-w-3xl mx-auto space-y-6 z-10 relative">
                    <span className="inline-flex items-center gap-1 text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      ELEVATE YOUR HOUSEHOLD SANCTUARY
                    </span>
                    <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white max-w-2xl mx-auto leading-tight">
                      Ready to elevate your everyday environment?
                    </h2>
                    <p className="font-sans text-sm md:text-base text-tertiary dark:text-neutral-400 max-w-xl mx-auto leading-relaxed">
                      Experience the absolute pinnacle of luxury functional design, fluid thermodynamics, and material engineering in your own home.
                    </p>
                    
                    <div className="pt-6">
                      <button 
                        onClick={triggerDefaultAmazonModal}
                        className="btn-secondary px-8 py-4 font-semibold text-sm rounded-full inline-flex items-center gap-2.5 cursor-pointer shadow-sm group"
                      >
                        <span>Shop Krevvy on Amazon</span>
                        <ShoppingBag className="w-4.5 h-4.5 text-copper transition-transform duration-300 group-hover:scale-110" />
                      </button>
                    </div>

                    <div className="pt-6 flex justify-center items-center gap-6 text-[11px] font-mono tracking-widest uppercase text-secondary dark:text-neutral-500">
                      <span>✓ FREE PRIME COURIER</span>
                      <span>•</span>
                      <span>✓ 3-YEAR EXTENDED WARRANTY</span>
                    </div>
                  </div>
                </section>
              </>
            )}

            {/* Catalog Page */}
            {activeView === 'products' && (
              <Products onBuyProduct={triggerAmazonModal} />
            )}

            {/* About Page */}
            {activeView === 'about' && (
              <About />
            )}

            {/* Support Concierge Consultation Page */}
            {activeView === 'contact' && (
              <Contact />
            )}

            {/* Accordion FAQ Page */}
            {activeView === 'faq' && (
              <FAQ />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Universal Footer section */}
      <Footer setActiveView={setActiveView} onBuyClick={triggerDefaultAmazonModal} />

      {/* Global Amazon Redirection Modal */}
      <AmazonModal 
        isOpen={modalOpen} 
        onClose={() => setModalOpen(false)} 
        productName={selectedProduct.name}
        price={selectedProduct.price}
        amazonUrl={selectedProduct.url}
      />
    </div>
  );
}
