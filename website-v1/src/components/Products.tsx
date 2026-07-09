import React, { useState, useMemo } from 'react';
import { Star, Shield, ArrowRight, Check, Layers, ChevronDown, ChevronRight, Sparkles, Flame, Tag, LayoutGrid, Home, Sprout, Monitor, Flower2, Folder, X, Search } from 'lucide-react';
import { Product } from '../types';
import { motion, AnimatePresence } from 'motion/react';

type CategoryId = 'all' | 'home-kitchen' | 'agriculture' | 'office-ergonomics' | 'spiritual-decor';
type SidebarSection = 'newArrivals' | 'bestSellers' | 'onDiscount';

interface ProductsProps {
  onBuyProduct?: (product: Product) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function Products({ onBuyProduct, searchQuery, setSearchQuery }: ProductsProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<SidebarSection, boolean>>({
    newArrivals: true,
    bestSellers: true,
    onDiscount: true
  });
  const [activeTag, setActiveTag] = useState<SidebarSection | null>(null);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState<boolean>(true);

  const toggleSpecs = (productId: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const toggleSection = (section: SidebarSection) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const productList: Product[] = [
    {
      id: "aero-aura",
      name: "Krevvy Aero Aura",
      tagline: "The Masterpiece of Air Purification",
      description: "Combines 100,000 RPM fluid engineering with medical-grade 3-stage HEPA filtration to create an immaculate oasis of pure, quiet air in any modern architectural setting.",
      price: "$349.00",
      category: "home-kitchen",
      isBestSeller: true,
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
      category: "home-kitchen",
      isNewArrival: true,
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
    },
    {
      id: "terra-sensor",
      name: "Krevvy Terra Sensor",
      tagline: "Intelligent Soil Monitoring",
      description: "Advanced agricultural sensor array providing real-time soil moisture, pH, and nutrient analysis directly to your smart devices for precision farming.",
      price: "$189.00",
      category: "agriculture",
      isNewArrival: true,
      rating: 4.7,
      reviewsCount: 89,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG1Uk65NNmQlx3PwGcnQ3iI2wuNzaHDRH0zR7JiCzh64mmaGk08Mso5Ix9qdZjF9sK4ElLieH7AmI2mEFHfsOxm3HPxG5cC1sj0xpqwxGCvYjvbcNcwudARgJ9qR-d79UZT16mfYT1q6XkQULMKDjTYWKfhba95ZVBLe_OOS9PYoiCf_azVRwMctaCxQOkU1o7HsJEEe7dphsyBnlvsuPxHuMqAKSPY3h58yFVf8MmdkHb038HPhDU",
      primaryColorAccent: "#4A7C59",
      features: [
        { title: "Tri-Sensor Array", description: "Simultaneous monitoring of NPK, moisture, and pH levels." },
        { title: "Solar Powered", description: "Self-sustaining operation with integrated micro-solar panels." }
      ],
      specifications: [
        { name: "Connectivity", value: "LoRaWAN & Wi-Fi" },
        { name: "Battery Life", value: "Indefinite (Solar)" }
      ],
      amazonUrl: "https://www.amazon.com/s?k=krevvy+soil+sensor"
    },
    {
      id: "ergo-lumbar",
      name: "Krevvy Ergo Lumbar",
      tagline: "Dynamic Posture Support",
      description: "Engineered lumbar support system utilizing responsive memory foam and active cooling gel layers for unparalleled office comfort during extended sessions.",
      price: "$129.00",
      category: "office-ergonomics",
      isBestSeller: true,
      rating: 4.9,
      reviewsCount: 342,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7zj8qACxm8Ak2nESKviDV7pUyWbbIWgkvi1ze8cJv0Py1t4mJdt0bQlzSQaQLI84BbAANHTX1vh6HGamJ8cWeYGk-L6BO-sZe-WICHt_bcpkaE6GnqqpEKU0t_iSiH09LWHLkaVma18KhTNQo-EKMv7E9Hty7bMaRGDjN6TmKnBFkFx8IUDYIxEqZ9Ij7euO0SjXrTDqB58f1_5fgGp1lR84rr1bmXEBa67RCjCyAybw1wlv0F4Fu",
      primaryColorAccent: "#2E3C4E",
      features: [
        { title: "Adaptive Memory Core", description: "Instantly molds to your unique spinal curvature." },
        { title: "Cryo-Gel Surface", description: "Dissipates body heat during prolonged seating sessions." }
      ],
      specifications: [
        { name: "Material", value: "High-density polyurethane foam" },
        { name: "Straps", value: "Dual adjustable elastic" }
      ],
      amazonUrl: "https://www.amazon.com/s?k=krevvy+lumbar+support"
    },
    {
      id: "zen-diffuser",
      name: "Krevvy Zen Diffuser",
      tagline: "Ultrasonic Aromatherapy",
      description: "A minimalist ceramic essential oil diffuser utilizing silent ultrasonic vibrations to disperse micro-fine therapeutic mist into your meditation space.",
      price: "$79.00",
      category: "spiritual-decor",
      discountLabel: "20% Off",
      rating: 4.6,
      reviewsCount: 201,
      image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIr-blw9tOR3r8-q_XBn6ay7nLkssjzRsfzI4ZTD8yERM6-6PvP7H_RRM0va1x25AO7uDSP1SYZ1ZG23MV2ZiFj693NW8ZklCzxQgoXgQIbP8N8CaKXxLhMJPYSVDbDDDOXutYhvqFJmb-XbuckWpcclN6zrOtG0W3oY8DW9RbieugAUsCEzTVHDF-9v72DCiTY61v1y7is7vUinNork0efeKfmF441sHB-Zp9enkHp_7pfAmAgolo",
      primaryColorAccent: "#D4AF37",
      features: [
        { title: "Ultrasonic Atomization", description: "Preserves the structural integrity of essential oils." },
        { title: "Ambient Glow", description: "Soft, warm LED lighting with adjustable intensity." }
      ],
      specifications: [
        { name: "Capacity", value: "300ml water tank" },
        { name: "Runtime", value: "Up to 10 hours continuous" }
      ],
      amazonUrl: "https://www.amazon.com/s?k=krevvy+diffuser"
    }
  ];

  const categories: { id: CategoryId; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Products', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'home-kitchen', label: 'Home & Kitchen', icon: <Home className="w-4 h-4" /> },
    { id: 'agriculture', label: 'Agriculture', icon: <Sprout className="w-4 h-4" /> },
    { id: 'office-ergonomics', label: 'Office & Ergonomics', icon: <Monitor className="w-4 h-4" /> },
    { id: 'spiritual-decor', label: 'Spiritual & Decor', icon: <Flower2 className="w-4 h-4" /> }
  ];

  // Filter by category first
  let filteredProducts = productList.filter(p =>
    selectedCategory === 'all' || p.category === selectedCategory
  );

  // Then filter by active tag if one is selected
  if (activeTag === 'newArrivals') {
    filteredProducts = filteredProducts.filter(p => p.isNewArrival);
  } else if (activeTag === 'bestSellers') {
    filteredProducts = filteredProducts.filter(p => p.isBestSeller);
  } else if (activeTag === 'onDiscount') {
    filteredProducts = filteredProducts.filter(p => p.discountLabel);
  }

  // Then filter by search query
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.description.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  }

  // Counts for sidebar badges (based on category + search, not active tags)
  const categoryProducts = productList.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    if (!matchesCategory) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) || 
           p.description.toLowerCase().includes(q) ||
           p.category.toLowerCase().includes(q);
  });
  
  const newArrivalsCount = categoryProducts.filter(p => p.isNewArrival).length;
  const bestSellersCount = categoryProducts.filter(p => p.isBestSeller).length;
  const onDiscountCount = categoryProducts.filter(p => p.discountLabel).length;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        {/* Title Section — preserved exactly */}
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

        {/* Search Bar */}
        <div className="mb-8 w-full max-w-md">
          <div className="relative flex items-center w-full group">
            <div className="absolute left-4 text-tertiary dark:text-neutral-500 group-focus-within:text-copper transition-colors">
              <Search className="w-5 h-5" />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-pure-white dark:bg-neutral-900 border border-hairline dark:border-neutral-800 rounded-2xl text-sm text-pure-black dark:text-pure-white placeholder-tertiary focus:outline-none focus:border-copper/50 focus:ring-1 focus:ring-copper/50 transition-all shadow-sm"
            />
          </div>
        </div>

        {/* Sidebar + Grid Layout */}
        <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

          {/* LEFT: Shop by Category Sidebar */}
          <aside className="w-full md:w-[240px] shrink-0">
            <div className="sticky top-28 bg-transparent">

              {/* Sidebar Title */}
              <button
                onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
                className="w-full flex items-center justify-between text-sm font-semibold uppercase tracking-wider text-pure-black dark:text-pure-white mb-4 hover:text-copper transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Folder className="w-4 h-4" />
                  Categories
                </span>
                {isCategoriesExpanded ? <ChevronDown className="w-4 h-4 text-tertiary" /> : <ChevronRight className="w-4 h-4 text-tertiary" />}
              </button>

              {/* Category Tree */}
              <AnimatePresence initial={false}>
                {isCategoriesExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden mb-6 font-sans"
                  >
                    <div className="pt-1">
                      <button
                        onClick={() => { setSelectedCategory('all'); setActiveTag(null); }}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs font-light transition-colors ${selectedCategory === 'all'
                            ? 'text-copper dark:text-primary-fixed-dim bg-copper/5 border-l-2 border-copper'
                            : 'text-pure-black dark:text-pure-white hover:text-copper dark:hover:text-primary-fixed-dim'
                          }`}
                      >
                        All Products
                      </button>

                      <div className="ml-1 pl-3 border-l border-hairline dark:border-neutral-800 flex flex-col mt-0.5">
                        {categories.filter(cat => cat.id !== 'all').map((cat) => (
                          <div key={cat.id} className="relative flex items-center">
                            <div className="absolute -left-3 w-3 border-t border-hairline dark:border-neutral-800 top-1/2" />
                            <button
                              onClick={() => { setSelectedCategory(cat.id); setActiveTag(null); }}
                              className={`w-full flex items-center gap-2 px-2 py-1.5 text-xs font-light transition-colors ${selectedCategory === cat.id
                                  ? 'text-copper dark:text-primary-fixed-dim bg-copper/5 border-l-2 border-copper'
                                  : 'text-secondary dark:text-neutral-400 hover:text-pure-black dark:hover:text-pure-white'
                                }`}
                            >
                              {cat.label}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Collapsible Sections */}
              <div className="space-y-1">
                {/* New Arrivals */}
                <div>
                  <button
                    onClick={() => toggleSection('newArrivals')}
                    className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-light text-pure-black dark:text-pure-white cursor-pointer hover:text-copper dark:hover:text-primary-fixed-dim transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Sparkles className={`w-3.5 h-3.5 ${activeTag === 'newArrivals' ? 'text-copper dark:text-primary-fixed-dim' : 'text-tertiary dark:text-neutral-500'}`} />
                      New Arrivals
                      {newArrivalsCount > 0 && (
                        <span className="text-[10px] font-mono text-tertiary dark:text-neutral-500">({newArrivalsCount})</span>
                      )}
                    </span>
                    {expandedSections.newArrivals ? <ChevronDown className="w-3.5 h-3.5 text-tertiary" /> : <ChevronRight className="w-3.5 h-3.5 text-tertiary" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections.newArrivals && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-7 pb-1">
                          <button
                            onClick={() => setActiveTag(activeTag === 'newArrivals' ? null : 'newArrivals')}
                            className={`text-xs font-light transition-colors cursor-pointer ${activeTag === 'newArrivals'
                                ? 'text-copper dark:text-primary-fixed-dim'
                                : 'text-tertiary dark:text-neutral-400 hover:text-pure-black dark:hover:text-pure-white'
                              }`}
                          >
                            View New Arrivals
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Best Sellers */}
                <div>
                  <button
                    onClick={() => toggleSection('bestSellers')}
                    className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-light text-pure-black dark:text-pure-white cursor-pointer hover:text-copper dark:hover:text-primary-fixed-dim transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Flame className={`w-3.5 h-3.5 ${activeTag === 'bestSellers' ? 'text-copper dark:text-primary-fixed-dim' : 'text-tertiary dark:text-neutral-500'}`} />
                      Best Sellers
                      {bestSellersCount > 0 && (
                        <span className="text-[10px] font-mono text-tertiary dark:text-neutral-500">({bestSellersCount})</span>
                      )}
                    </span>
                    {expandedSections.bestSellers ? <ChevronDown className="w-3.5 h-3.5 text-tertiary" /> : <ChevronRight className="w-3.5 h-3.5 text-tertiary" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections.bestSellers && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-7 pb-1">
                          <button
                            onClick={() => setActiveTag(activeTag === 'bestSellers' ? null : 'bestSellers')}
                            className={`text-xs font-light transition-colors cursor-pointer ${activeTag === 'bestSellers'
                                ? 'text-copper dark:text-primary-fixed-dim'
                                : 'text-tertiary dark:text-neutral-400 hover:text-pure-black dark:hover:text-pure-white'
                              }`}
                          >
                            View Best Sellers
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* On Discount */}
                <div>
                  <button
                    onClick={() => toggleSection('onDiscount')}
                    className="w-full flex items-center justify-between py-1.5 px-2 text-xs font-light text-pure-black dark:text-pure-white cursor-pointer hover:text-copper dark:hover:text-primary-fixed-dim transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <Tag className={`w-3.5 h-3.5 ${activeTag === 'onDiscount' ? 'text-copper dark:text-primary-fixed-dim' : 'text-tertiary dark:text-neutral-500'}`} />
                      On Discount
                      {onDiscountCount > 0 && (
                        <span className="text-[10px] font-mono text-tertiary dark:text-neutral-500">({onDiscountCount})</span>
                      )}
                    </span>
                    {expandedSections.onDiscount ? <ChevronDown className="w-3.5 h-3.5 text-tertiary" /> : <ChevronRight className="w-3.5 h-3.5 text-tertiary" />}
                  </button>
                  <AnimatePresence initial={false}>
                    {expandedSections.onDiscount && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="pl-7 pb-1">
                          <button
                            onClick={() => setActiveTag(activeTag === 'onDiscount' ? null : 'onDiscount')}
                            className={`text-xs font-light transition-colors cursor-pointer ${activeTag === 'onDiscount'
                                ? 'text-copper dark:text-primary-fixed-dim'
                                : 'text-tertiary dark:text-neutral-400 hover:text-pure-black dark:hover:text-pure-white'
                              }`}
                          >
                            View Discounted Products
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* Active filter indicator */}
              {activeTag && (
                <div className="mt-6 pt-4 border-t border-hairline dark:border-neutral-800">
                  <button
                    onClick={() => setActiveTag(null)}
                    className="flex items-center gap-1.5 text-[10px] font-mono tracking-wider uppercase text-tertiary dark:text-neutral-500 hover:text-copper dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
                  >
                    <X className="w-3 h-3" /> Clear filter
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT: Existing Product Cards Grid — preserved exactly */}
          <div className="w-full md:w-[11 0%]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-12">
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

                      {/* Available on Amazon + View Details */}
                      <div className="mt-10 pt-6 border-t border-hairline dark:border-neutral-800 flex items-center justify-between gap-4">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-copper dark:text-primary-fixed-dim">
                            <Shield className="w-3.5 h-3.5" />
                            Available on Amazon
                          </span>
                        </div>

                        <button
                          onClick={() => window.open(product.amazonUrl, '_blank')}
                          className="btn-primary py-3.5 px-8 rounded-full font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                        >
                          <span>View Details</span>
                          <ArrowRight className="w-2 h-2" />
                        </button>
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-sans text-sm text-tertiary dark:text-neutral-400">No products match the current filter.</p>
                <button
                  onClick={() => { setSelectedCategory('all'); setActiveTag(null); }}
                  className="mt-4 text-xs font-semibold text-copper dark:text-primary-fixed-dim hover:underline cursor-pointer"
                >
                  View all products
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
