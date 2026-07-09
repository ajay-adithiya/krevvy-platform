import React, { useState, useEffect } from 'react';
import { Star, HelpCircle, ChevronRight, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ActiveView } from './types';

import Header from './components/Header';
import Hero from './components/Hero';

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
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<{ name: string; price: string; url: string }>({
    name: "Krevvy Aero Aura",
    price: "$349.00",
    url: "https://www.amazon.com/s?k=krevvy+air+purifier"
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setActiveView('products');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

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
              <Hero onViewProductsClick={() => setActiveView('products')} onSearch={handleSearch} />
            )}

            {/* Catalog Page */}
            {activeView === 'products' && (
              <Products 
                onBuyProduct={triggerAmazonModal} 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery} 
              />
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
      <Footer setActiveView={setActiveView} onBuyClick={triggerDefaultAmazonModal} darkMode={darkMode} />

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
