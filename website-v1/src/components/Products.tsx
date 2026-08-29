import React, { useState, useMemo } from 'react';
import { Star, Shield, ArrowRight, Check, Layers, ChevronDown, ChevronRight, Sparkles, Flame, Tag, LayoutGrid, Home, Sprout, Monitor, Flower2, Folder, X, Search, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useFetch } from '../hooks/useFetch';
import { api } from '../lib/api';
import { CmsProduct } from '../types/cms';

type SidebarSection = 'newArrivals' | 'bestSellers' | 'onDiscount';

interface ProductsProps {
  onBuyProduct?: (product: any) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const IconRegistry: Record<string, React.ElementType> = {
  Home,
  Sprout,
  Monitor,
  Flower2,
  LayoutGrid
};

export default function Products({ onBuyProduct, searchQuery, setSearchQuery }: ProductsProps) {
  const { data: pageContent, loading: pageLoading } = useFetch(api.getProductsContent);
  const { data: rawProducts, loading: productsLoading } = useFetch(api.getProducts);
  const { data: rawCategories, loading: categoriesLoading } = useFetch(api.getCategories);

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedSpecs, setExpandedSpecs] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<SidebarSection, boolean>>({
    newArrivals: true,
    bestSellers: true,
    onDiscount: true
  });
  const [activeTag, setActiveTag] = useState<SidebarSection | null>(null);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState<boolean>(true);

  const loading = pageLoading || productsLoading || categoriesLoading;

  if (loading) {
    return (
      <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
        <div className="max-w-7xl mx-auto animate-pulse">
           <div className="h-4 w-32 bg-surface-container rounded-full mb-4"></div>
           <div className="h-12 w-64 bg-surface-container rounded-full mb-4"></div>
           <div className="h-4 w-96 bg-surface-container rounded-full mb-16"></div>
           <div className="flex gap-8">
             <div className="w-[240px] shrink-0 h-96 bg-surface-container rounded-xl"></div>
             <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-12">
               <div className="h-96 bg-surface-container rounded-2xl"></div>
               <div className="h-96 bg-surface-container rounded-2xl"></div>
               <div className="h-96 bg-surface-container rounded-2xl"></div>
             </div>
           </div>
        </div>
      </section>
    );
  }

  const content = pageContent;
  const productList = (rawProducts || []).filter(p => p.isActive).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
  const cmsCategories = (rawCategories || []).filter(c => c.isActive).sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));

  const categories = [
    { id: 'all', label: content?.allProductsLabel || 'All Products', iconName: 'LayoutGrid' },
    ...cmsCategories.map(c => ({
      id: c.id,
      label: c.displayLabel || c.name,
      iconName: c.iconName || 'LayoutGrid'
    }))
  ];

  const toggleSpecs = (productId: string) => {
    setExpandedSpecs(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  const toggleSection = (section: SidebarSection) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Filter by category first
  let filteredProducts = productList.filter(p =>
    selectedCategory === 'all' || p.categoryId === selectedCategory
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
      (p.description || '').toLowerCase().includes(q) ||
      (p.category?.name || '').toLowerCase().includes(q)
    );
  }

  // Counts for sidebar badges (based on category + search, not active tags)
  const categoryProducts = productList.filter(p => {
    const matchesCategory = selectedCategory === 'all' || p.categoryId === selectedCategory;
    if (!matchesCategory) return false;
    if (searchQuery.trim() === '') return true;
    const q = searchQuery.toLowerCase();
    return p.name.toLowerCase().includes(q) ||
           (p.description || '').toLowerCase().includes(q) ||
           (p.category?.name || '').toLowerCase().includes(q);
  });

  const newArrivalsCount = categoryProducts.filter(p => p.isNewArrival).length;
  const bestSellersCount = categoryProducts.filter(p => p.isBestSeller).length;
  const onDiscountCount = categoryProducts.filter(p => p.discountLabel).length;

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-surface-container-lowest dark:bg-[#0a0a0a] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">

        {/* Title Section */}
        <div className="text-center md:text-left mb-16">
          {content?.pageEyebrow && (
            <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-semibold">
              {content.pageEyebrow}
            </span>
          )}
          {content?.pageTitle && (
            <h2
              className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2"
              dangerouslySetInnerHTML={{ __html: content.pageTitle.replace(/\n/g, '<br />') }}
            />
          )}
          {content?.pageSubtitle && (
            <p className="font-sans text-secondary dark:text-neutral-400 text-sm md:text-base max-w-xl mt-3 whitespace-pre-wrap">
              {content.pageSubtitle}
            </p>
          )}
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
                  {content?.categoriesFilterLabel}
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
                        {categories.find(c => c.id === 'all')?.label}
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
                      {content?.newArrivalsFilterLabel}
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
                            {content?.newArrivalsFilterLabel}
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
                      {content?.bestSellersFilterLabel}
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
                            {content?.bestSellersFilterLabel}
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
                      {content?.onDiscountFilterLabel}
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
                            {content?.onDiscountFilterLabel}
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
                    <X className="w-3 h-3" /> {content?.clearFilterLabel}
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* RIGHT: Product Cards Grid */}
          <div className="w-full md:w-[110%]">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-12">
              {filteredProducts.map((product) => {
                const isSpecsExpanded = !!expandedSpecs[product.id];
                const primaryImage = product.images?.find(i => i.isPrimary) || product.images?.[0];

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
                      <div className="absolute top-4 left-4 flex flex-col gap-2">
                        {product.discountLabel && (
                          <span className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-red-100 dark:border-red-900/30 max-w-fit">
                            {product.discountLabel}
                          </span>
                        )}
                        <div className="flex gap-2">
                          {content?.inStockLabel && (
                            <span className="bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-emerald-100 dark:border-emerald-900/30">
                              {content.inStockLabel}
                            </span>
                          )}
                          {content?.warrantyLabel && (
                            <span className="bg-amber-50 dark:bg-amber-950/30 text-copper dark:text-primary-fixed-dim text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded border border-amber-100 dark:border-amber-900/30 flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {content.warrantyLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {primaryImage && (
                        <img
                          className="object-contain max-h-full max-w-full drop-shadow-xl hover:scale-103 transition-transform duration-500 ease-out"
                          src={primaryImage.imageUrl}
                          alt={product.name}
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>

                    {/* Info and Purchase Panel */}
                    <div className="p-8 md:p-10 flex-grow flex flex-col justify-between">
                      <div>
                        {/* Ratings */}
                        {product.ratingDisplay && (
                          <div className="flex items-center gap-1.5 mb-2">
                            <div className="flex text-amber-500">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} className="w-4 h-4 fill-current stroke-current" />
                              ))}
                            </div>
                            <span className="text-xs font-bold font-mono text-pure-black dark:text-pure-white">{product.ratingDisplay}</span>
                            {product.reviewCountDisplay && (
                              <span className="text-xs text-tertiary dark:text-neutral-400">({product.reviewCountDisplay} reviews)</span>
                            )}
                          </div>
                        )}

                        {/* Titles */}
                        <h3 className="font-display text-2xl md:text-3xl font-bold text-pure-black dark:text-pure-white tracking-tight">
                          {product.name}
                        </h3>
                        {product.tagline && (
                          <p className="text-xs font-semibold tracking-wider uppercase text-copper dark:text-primary-fixed-dim mt-1">
                            {product.tagline}
                          </p>
                        )}
                        <p className="text-lg font-bold text-pure-black dark:text-pure-white mt-2">
                          ${Number(product.price).toFixed(2)}
                        </p>

                        {/* Description */}
                        <p className="font-sans text-sm text-tertiary dark:text-neutral-400 mt-4 leading-relaxed whitespace-pre-wrap">
                          {product.description}
                        </p>

                        {/* Features List */}
                        {product.features && product.features.length > 0 && (
                          <div className="mt-8 border-t border-hairline dark:border-neutral-800/80 pt-6">
                            {content?.featuresHeadingLabel && (
                              <h4 className="text-xs font-bold uppercase tracking-wider text-pure-black dark:text-pure-white mb-4">
                                {content.featuresHeadingLabel}
                              </h4>
                            )}
                            <ul className="space-y-4">
                              {[...product.features].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((feat, index) => (
                                <li key={index} className="flex gap-3">
                                  <div className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-50 dark:bg-amber-950/20 text-copper dark:text-primary-fixed-dim flex items-center justify-center">
                                    <Check className="w-3.5 h-3.5" />
                                  </div>
                                  <div>
                                    <span className="text-xs font-bold text-pure-black dark:text-pure-white block leading-tight">{feat.title}</span>
                                    {feat.description && (
                                      <span className="text-xs text-tertiary dark:text-neutral-400 mt-0.5 block whitespace-pre-wrap">{feat.description}</span>
                                    )}
                                  </div>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Toggle technical specifications collapse drawer */}
                      {product.specifications && product.specifications.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-hairline dark:border-neutral-800/80">
                          <button
                            onClick={() => toggleSpecs(product.id)}
                            className="w-full flex justify-between items-center py-2 text-xs font-bold uppercase tracking-wider text-secondary dark:text-neutral-300 hover:text-copper dark:hover:text-primary-fixed-dim transition-colors cursor-pointer"
                          >
                            <span className="flex items-center gap-1.5">
                              <Layers className="w-3.5 h-3.5 text-copper" />
                              {isSpecsExpanded ? content?.hideSpecsLabel : content?.viewSpecsLabel}
                            </span>
                            <span>{isSpecsExpanded ? "−" : "+"}</span>
                          </button>

                          {isSpecsExpanded && (
                            <div className="mt-4 bg-surface dark:bg-neutral-900/60 p-4 rounded-xl border border-hairline dark:border-neutral-800/50 space-y-3">
                              {[...product.specifications].sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0)).map((spec, index) => (
                                <div key={index} className="flex justify-between items-start gap-4 text-xs border-b border-hairline/40 dark:border-neutral-800 pb-2 last:border-0 last:pb-0">
                                  <span className="font-semibold text-secondary dark:text-neutral-400">{spec.name}</span>
                                  <span className="font-mono text-pure-black dark:text-pure-white text-right font-medium whitespace-pre-wrap">{spec.value}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Available on Amazon + View Details */}
                      <div className="mt-10 pt-6 border-t border-hairline dark:border-neutral-800 flex items-center justify-between gap-4">
                        <div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-copper dark:text-primary-fixed-dim">
                            <Shield className="w-3.5 h-3.5" />
                            Available on Amazon
                          </span>
                        </div>

                        {product.amazonUrl ? (
                          <button
                            onClick={() => window.open(product.amazonUrl, '_blank')}
                            className="btn-primary py-3.5 px-8 rounded-full font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                          >
                            <span>{product.amazonButtonLabel || content?.viewDetailsButtonLabel}</span>
                            <ArrowRight className="w-2 h-2" />
                          </button>
                        ) : (
                          <button
                            onClick={() => onBuyProduct && onBuyProduct(product)}
                            className="btn-primary py-3.5 px-8 rounded-full font-semibold text-xs uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm"
                          >
                            <span>{product.amazonButtonLabel || content?.viewDetailsButtonLabel}</span>
                            <ArrowRight className="w-2 h-2" />
                          </button>
                        )}
                      </div>

                    </div>
                  </motion.div>
                );
              })}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-20">
                <p className="font-sans text-sm text-tertiary dark:text-neutral-400">{content?.emptySearchMessage}</p>
                {content?.allProductsLabel && (
                  <button
                    onClick={() => { setSelectedCategory('all'); setActiveTag(null); }}
                    className="mt-4 text-xs font-semibold text-copper dark:text-primary-fixed-dim hover:underline cursor-pointer"
                  >
                    {content.allProductsLabel}
                  </button>
                )}
              </div>
            )}
          </div>

        </div>
      </div>
    </section>
  );
}
