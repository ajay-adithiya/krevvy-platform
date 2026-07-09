import React, { useState } from 'react';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from 'motion/react';
import { ActiveView } from '../types';

interface HeroProps {
  onViewProductsClick: () => void;
  onSearch?: (query: string) => void;
}

export default function Hero({ onViewProductsClick, onSearch }: HeroProps) {
  const [query, setQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && onSearch) {
      onSearch(query.trim());
    }
  };
  return (
    <section className="relative min-h-[90vh] md:min-h-[921px] flex flex-col justify-center items-center overflow-hidden px-6 md:px-12 bg-surface dark:bg-[#0a0a0a] transition-colors duration-500 pt-24 pb-16 md:py-0">
      {/* Decorative architectural background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#eaeaea_1px,transparent_1px),linear-gradient(to_bottom,#eaeaea_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#222_1px,transparent_1px),linear-gradient(to_bottom,#222_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-12 gap-12 items-center z-10 relative">
        {/* Text Copy & CTA Column */}
        <div className="md:col-span-5 flex flex-col items-start z-20 text-left">

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-widest uppercase bg-surface-container dark:bg-neutral-800 text-secondary dark:text-neutral-400 border border-hairline dark:border-neutral-700/50 mb-6">
              KREVVY ENGINEERING LABS
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-[64px] font-bold text-pure-black dark:text-pure-white leading-[1.1] tracking-tighter"
          >
            Elevate <br />
            <span className="text-copper dark:text-primary-fixed-dim bg-gradient-to-r from-copper to-amber-600 bg-clip-text text-transparent">Everyday Living.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-sans text-base md:text-lg text-tertiary dark:text-neutral-400 max-w-md leading-relaxed"
          >
            Discover premium Home & Kitchen essentials and thoughtfully selected lifestyle products designed to bring comfort, functionality. and style to every home
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap gap-4"
          >
            <button
              onClick={onViewProductsClick}
              className="btn-primary px-8 py-4 font-semibold text-sm rounded-full inline-flex items-center gap-2 cursor-pointer group"
            >
              <span>View Products</span>
              <ArrowRight className="w-4.5 h-4.5 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </motion.div>

          {/* Search Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
            className="mt-12 w-full max-w-md"
          >
            <form onSubmit={handleSearchSubmit} className="relative flex items-center w-full group">
              <div className="absolute left-4 text-tertiary dark:text-neutral-500 group-focus-within:text-copper transition-colors">
                <Search className="w-5 h-5" />
              </div>
              <input
                type="text"
                placeholder="Search products..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-pure-white dark:bg-neutral-900 border border-hairline dark:border-neutral-800 rounded-2xl text-sm text-pure-black dark:text-pure-white placeholder-tertiary focus:outline-none focus:border-copper/50 focus:ring-1 focus:ring-copper/50 transition-all shadow-sm"
              />
              <button
                type="submit"
                className="absolute right-3 px-4 py-2 bg-copper text-pure-white text-xs font-semibold rounded-xl hover:bg-copper/90 transition-colors"
              >
                Search
              </button>
            </form>
          </motion.div>
        </div>

        {/* Product Hero Shot Column */}
        <div className="md:col-span-7 relative h-[380px] sm:h-[480px] md:h-[650px] lg:h-[750px] w-full mt-6 md:mt-0 flex justify-center items-center">
          {/* Spotlight overlay backlighting */}
          <div className="absolute inset-0 bg-radial from-white/60 dark:from-white/5 via-transparent to-transparent z-10 pointer-events-none blur-3xl rounded-full" />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full h-full relative z-0 flex justify-center items-center"
          >
            <img
              className="object-contain w-full h-full max-h-[600px] drop-shadow-2xl select-none"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCG1Uk65NNmQlx3PwGcnQ3iI2wuNzaHDRH0zR7JiCzh64mmaGk08Mso5Ix9qdZjF9sK4ElLieH7AmI2mEFHfsOxm3HPxG5cC1sj0xpqwxGCvYjvbcNcwudARgJ9qR-d79UZT16mfYT1q6XkQULMKDjTYWKfhba95ZVBLe_OOS9PYoiCf_azVRwMctaCxQOkU1o7HsJEEe7dphsyBnlvsuPxHuMqAKSPY3h58yFVf8MmdkHb038HPhDU"
              alt="Krevvy Smart Air Purifier in a clean studio mockup"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>


    </section>
  );
}
