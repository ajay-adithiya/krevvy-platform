import React, { useState } from 'react';
import { Star, Shield, Info, ArrowRight, Check, SlidersHorizontal, Layers, Pocket } from 'lucide-react';
import { Product } from '../types';
import { motion } from 'motion/react';

interface ProductsProps {
  onBuyProduct: (productName: string, price: string, url: string) => void;
}

export default function Products({ onBuyProduct }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'purifier' | 'vacuum'>('all');
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});

  const toggleSpecs = (productId: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const productList: Product[] = [
    {
      id: "aero-aura",
      name: "Krevvy Aero Aura",
      tagline: "The Masterpiece of Air Purification",
      description: "Combines 100,000 RPM fluid engineering with medical-grade 3-stage HEPA filtration to create an immaculate oasis of pure, quiet air in any modern architectural setting.",
      price: "$349.00",
      rating: 4.9,
      reviewsCount: 182,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG1Uk65NNmQlx3PwGcnQ3iI2wuNzaHDRH0zR7JiCzh64mmaGk08Mso5Ix9qdZjF9sK4ElLieH7AmI2mEFHfsOxm3HPxG5cC1sj0xpqwxGCvYjvbcNcwudARgJ9qR-d79UZT16mfYT1q6XkQULMKDjTYWKfhba95ZVBLe_OOS9PYoiCf_azVRwMctaCxQOkU1o7HsJEEe7dphsyBnlvsuPxHuMqAKSPY3h58yFVf8MmdkHb038HPhDU",
      primaryColorAccent: "#B5671A",
      features: [
        { title: "True HEPA H13 Filtration", description: "Surgical-grade weave trapping 99.97% of airborne pathogens and allergens down to 0.1 microns." },
        { title: "WhisperStealth Tech", description: "Bespoke acoustic dampening chambers keeping operation below 18dB on night mode." },
        { title: "Milled Aluminum Dial", description: "Satisfying haptic rotary controls milled from single-block premium alloys." }
      ],
      specifications: [
        { name: "CADR Rating", value: "420 m³/hour (Clean Air Delivery Rate)" },
        { name: "Recommended Space", value: "Up to 950 sq. ft (88 m²)" },
        { name: "Filter Life", value: "8,760 hours (Approximately 12 months continuous)" },
        { name: "Dimensions", value: "540mm x 260mm x 260mm" },
        { name: "Max Energy Draw", value: "40 Watts at max speed" },
        { name: "Connectivity", value: "Dual-band Wi-Fi & Apple HomeKit enabled" }
      ],
      amazonUrl: "https://www.amazon.com/s?k=krevvy+air+purifier"
    },
    {
      id: "vortex-prime",
      name: "Krevvy Vortex Prime",
      tagline: "Unparalleled Digital Suction Power",
      description: "A lightweight, cordless masterpiece utilizing Krevvy's signature high-velocity motor to extract dust and microscopic dander from deep within premium upholstery and hardwood floors.",
      price: "$499.00",
      rating: 4.8,
      reviewsCount: 114,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIr-blw9tOR3r8-q_XBn6ay7nLkssjzRsfzI4ZTD8yERM6-6PvP7H_RRM0va1x25AO7uDSP1SYZ1ZG23MV2ZiFj693NW8ZklCzxQgoXgQIbP8N8CaKXxLhMJPYSVDbDDDOXutYhvqFJmb-XbuckWpcclN6zrOtG0W3oY8DW9RbieugAUsCEzTVHDF-9v72DCiTY61v1y7is7vUinNork0efeKfmF441sHB-Zp9enkHp_7pfAmAgolo",
      primaryColorAccent: "#111111",
      features: [
        { title: "100K RPM Digital Turbine", description: "Generates massive 185 AW suction power to safely capture deep-seated dust." },
        { title: "Smart Floor Adapt Engine", description: "Dynamically modulates suction impedance when transitioning from stone floors to deep wool rugs." },
        { title: "Modular Quick-Release", description: "Instant structural changes for ceiling dust, car detail, and standard upright modes." }
      ],
      specifications: [
        { name: "Suction Power", value: "185 Air Watts (AW)" },
        { name: "Motor Power", value: "450W Brushless DC (BLDC)" },
        { name: "Battery Capacity", value: "7-cell Lithium-ion, 75 minutes runtime in Eco" },
        { name: "Bin Volumetric size", value: "0.8 Liters with hygienic click-empty lever" },
        { name: "Net Weight", value: "1.95 kg (Balanced gravity-center layout)" },
        { name: "Noise Output", value: "58dB - 68dB" }
      ],
      amazonUrl: "https://www.amazon.com/s?k=krevvy+vacuum+cleaner"
    }
  ];

  const filteredProducts = productList.filter(p => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'purifier') return p.id === 'aero-aura';
    if (selectedCategory === 'vacuum') return p.id === 'vortex-prime';
    return true;
  });

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Title Section */}
        <div className="text-center md:text-left mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-semibold">
            THE KREVVY COLLECTION
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2">
            Engineering Marvels.
          </h2>
          <p className="font-sans text-secondary dark:text-neutral-400 text-sm md:text-base max-w-xl mt-3">
            Explore our meticulously engineered appliances where form obeys function down to the micrometer.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-6 border-b border-hairline dark:border-neutral-900 pb-6 mb-12">
          <div className="flex gap-2 bg-surface dark:bg-neutral-900/60 p-1 rounded-full border border-hairline dark:border-neutral-800">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-pure-black text-pure-white dark:bg-pure-white dark:text-pure-black shadow-sm'
                  : 'text-secondary hover:text-pure-black dark:text-neutral-400 dark:hover:text-pure-white'
              }`}
            >
              All Engineering
            </button>
            <button
              onClick={() => setSelectedCategory('purifier')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === 'purifier'
                  ? 'bg-pure-black text-pure-white dark:bg-pure-white dark:text-pure-black'
                  : 'text-secondary hover:text-pure-black dark:text-neutral-400 dark:hover:text-pure-white'
              }`}
            >
              Air Purifiers
            </button>
            <button
              onClick={() => setSelectedCategory('vacuum')}
              className={`px-6 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                selectedCategory === 'vacuum'
                  ? 'bg-pure-black text-pure-white dark:bg-pure-white dark:text-pure-black'
                  : 'text-secondary hover:text-pure-black dark:text-neutral-400 dark:hover:text-pure-white'
              }`}
            >
              Digital Vacuums
            </button>
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-secondary dark:text-neutral-400">
            <SlidersHorizontal className="w-4 h-4 text-copper" />
            Showing {filteredProducts.length} premium models
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {filteredProducts.map((product) => {
            const isSpecsExpanded = !!expandedSpecs[product.id];
            return (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-pure-white dark:bg-neutral-900/40 rounded-2xl overflow-hidden border border-hairline dark:border-neutral-800 shadow-sm flex flex-col text-left"
              >
                {/* Product Image Frame */}
                <div className="relative bg-surface dark:bg-[#111] p-8 md:p-12 border-b border-hairline dark:border-neutral-800 flex justify-center items-center h-[340px] md:h-[400px]">
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-emerald-100 dark:border-emerald-900/30">
                      In Stock
                    </span>
                    <span className="bg-amber-50 dark:bg-amber-950/30 text-copper dark:text-primary-fixed-dim text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-amber-100 dark:border-amber-900/30 flex items-center gap-1">
                      <Shield className="w-3 h-3" />
                      3-Yr Warranty
                    </span>
                  </div>

                  <img
                    className="object-contain max-h-full max-w-full drop-shadow-xl hover:scale-103 transition-transform duration-500 ease-out"
                    src={product.image}
                    alt={product.name}
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Info and Purchase Panel */}
                <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
                  <div>
                    {/* Ratings */}
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="flex text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current stroke-current" />
                        ))}
                      </div>
                      <span className="text-xs font-bold font-mono text-pure-black dark:text-pure-white">{product.rating}</span>
                      <span className="text-xs text-tertiary dark:text-neutral-400">({product.reviewsCount} reviews)</span>
                    </div>

                    {/* Titles */}
                    <h3 className="font-display text-2xl md:text-3xl font-bold text-pure-black dark:text-pure-white tracking-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs font-semibold tracking-wider uppercase text-copper dark:text-primary-fixed-dim mt-1">
                      {product.tagline}
                    </p>

                    {/* Description */}
                    <p className="font-sans text-sm text-tertiary dark:text-neutral-400 mt-4 leading-relaxed">
                      {product.description}
                    </p>

                    {/* Features List */}
                    <div className="mt-8 border-t border-hairline dark:border-neutral-800/80 pt-6">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-4">
                        Core Engineering Modules
                      </h4>
                      <ul className="space-y-4">
                        {product.features.map((feat, index) => (
                          <li key={index} className="flex gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper dark:text-primary-fixed-dim flex items-center justify-center">
                              <Check className="w-3.5 h-3.5" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-pure-black dark:text-pure-white block leading-tight">{feat.title}</span>
                              <span className="text-xs text-tertiary dark:text-neutral-400 mt-0.5 block">{feat.description}</span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Toggle technical specifications collapse drawer */}
                  <div className="mt-8 pt-6 border-t border-hairline dark:border-neutral-800/80">
                    <button
                      onClick={() => toggleSpecs(product.id)}
                      className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-300 hover:text-copper dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
                    >
                      <span className="flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-copper" />
                        {isSpecsExpanded ? "Hide Full Tech Specs" : "View Full Tech Specs"}
                      </span>
                      <span>{isSpecsExpanded ? "−" : "+"}</span>
                    </button>

                    {isSpecsExpanded && (
                      <div className="mt-4 bg-surface dark:bg-neutral-900/60 p-4 rounded-xl border border-hairline dark:border-neutral-800/50 space-y-3">
                        {product.specifications.map((spec, index) => (
                          <div key={index} className="flex justify-between items-start gap-4 text-xs border-b border-hairline/40 dark:border-neutral-800 pb-2 last:border-0 last:pb-0">
                            <span className="font-semibold text-secondary dark:text-neutral-400">{spec.name}</span>
                            <span className="font-mono text-pure-black dark:text-pure-white text-right font-medium">{spec.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pricing and Action */}
                  <div className="mt-10 pt-6 border-t border-hairline dark:border-neutral-800 flex items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary dark:text-neutral-400">Launch Pricing</span>
                      <div className="text-2xl font-display font-bold text-pure-black dark:text-pure-white">{product.price}</div>
                    </div>

                    <button
                      onClick={() => onBuyProduct(product.name, product.price, product.amazonUrl)}
                      className="btn-primary py-3.5 px-8 rounded-full font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <span>Secure Amazon Checkout</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>

                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
