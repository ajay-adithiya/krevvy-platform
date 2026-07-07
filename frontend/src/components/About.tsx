import React from 'react';
import { Compass, PenTool, ShieldCheck, Heart, UserCheck, Settings } from 'lucide-react';
import { motion } from 'motion/react';

export default function About() {
  const pillars = [
    {
      icon: <PenTool className="w-6 h-6 text-copper" />,
      title: "Architectural Honesty",
      description: "We believe form must strictly obey function. Every vent, dial, seam, and chamfer on a Krevvy appliance is an aerodynamic or ergonomic necessity—never mere decoration. We strip away the digital fluff to expose raw mechanical perfection."
    },
    {
      icon: <Settings className="w-6 h-6 text-copper" />,
      title: "Material Discipline",
      description: "We completely reject lightweight, cheap plastics. Touchpoints on Krevvy machines are milled from solid aircraft-grade block aluminum and finished with hand-brushed copper highlights, offering tactile feedback that connects you to physical engineering."
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-copper" />,
      title: "Acoustic Sanctity",
      description: "True luxury is quiet. Our fluid-dynamics squad spends thousands of hours in acoustic chambers, designing custom multi-chamber sound mufflers and stabilizing turbine centers, keeping Krevvy running silently in the background of your life."
    }
  ];

  return (
    <section className="py-24 md:py-32 px-6 md:px-12 bg-pure-white dark:bg-pure-black transition-colors duration-500">
      <div className="max-w-5xl mx-auto text-left">
        
        {/* Overline & Main Header */}
        <div className="mb-16">
          <span className="text-xs font-mono tracking-widest uppercase text-copper dark:text-primary-fixed-dim font-bold">
            THE KREVVY CREDO
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-pure-black dark:text-pure-white mt-2 leading-tight">
            Engineering Luxury <br className="hidden md:inline" />
            For Modern Sanctuaries.
          </h2>
          <div className="w-16 h-[3px] bg-copper mt-6 rounded-full" />
        </div>

        {/* Narrative columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-24">
          <div className="md:col-span-7">
            <p className="font-sans text-base md:text-lg text-pure-black dark:text-neutral-200 leading-relaxed font-medium">
              Krevvy was born from a singular, obsessive frustration: why are modern home appliances constructed from cheap, disposable materials and decorated with confusing digital displays?
            </p>
            <p className="font-sans text-sm md:text-base text-tertiary dark:text-neutral-400 mt-6 leading-relaxed">
              We set out to create appliances that feel like luxury furniture and operate like aerospace-grade equipment. We combined advanced thermodynamic calculations with minimalist product design to build the Krevvy brand—a Prowess Click Kart Enterprise.
            </p>
            <p className="font-sans text-sm md:text-base text-tertiary dark:text-neutral-400 mt-6 leading-relaxed">
              Every detail, from the exact weight-balance of our vacuums to the acoustic pitch of our purifiers, is tested inside our dedicated laboratory. The metallic copper highlights serve as a signature nod to Indian metallurgical heritage, blending material tradition with pristine Swiss precision.
            </p>
          </div>

          <div className="md:col-span-5 bg-surface dark:bg-neutral-950 p-8 rounded-xl border border-hairline dark:border-neutral-900 flex flex-col justify-between">
            <div>
              <h3 className="font-display font-bold text-lg text-pure-black dark:text-pure-white mb-2">Our Enterprise Identity</h3>
              <p className="text-xs text-tertiary dark:text-neutral-400 leading-relaxed">
                Krevvy operates under the Prowess Click Kart Enterprise umbrella, leveraging deep advanced logistics, reliable distribution channels, and meticulous manufacturing standards to bring state-of-the-art designs directly to premium household spaces.
              </p>
            </div>
            
            <div className="mt-8 pt-6 border-t border-hairline dark:border-neutral-900 flex items-center gap-4">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/20 text-copper rounded-full">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-tertiary dark:text-neutral-400 block">Manufacturing Base</span>
                <span className="text-xs font-bold text-pure-black dark:text-pure-white block mt-0.5">Surgical-Grade Quality Audits</span>
              </div>
            </div>
          </div>
        </div>

        {/* Three Core Pillars Cards */}
        <div className="mb-24">
          <h3 className="font-display text-xl font-bold text-pure-black dark:text-pure-white mb-10 border-b border-hairline dark:border-neutral-900 pb-4">
            Our Core Pillars of Product Development
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pillars.map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className="p-8 rounded-xl border border-hairline dark:border-neutral-800 bg-pure-white dark:bg-neutral-900/20 soft-elevation interactive-lift flex flex-col items-start text-left"
              >
                <div className="p-3 bg-amber-50 dark:bg-amber-950/30 text-copper rounded-lg mb-6">
                  {pillar.icon}
                </div>
                <h4 className="font-display font-semibold text-lg text-pure-black dark:text-pure-white">
                  {pillar.title}
                </h4>
                <p className="font-sans text-xs md:text-sm text-tertiary dark:text-neutral-400 mt-3 leading-relaxed">
                  {pillar.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Lab Certification Box */}
        <div className="p-8 md:p-12 bg-surface-container-low dark:bg-neutral-950/40 rounded-xl border border-hairline dark:border-neutral-900 flex flex-col md:flex-row items-center gap-8 justify-between">
          <div className="text-center md:text-left">
            <h4 className="font-display font-semibold text-xl text-pure-black dark:text-pure-white">
              Every appliance passes through our 140-point certification sequence.
            </h4>
            <p className="text-xs text-tertiary dark:text-neutral-400 mt-2 max-w-xl">
              From balancing the central motor shaft at micron tolerances to evaluating acoustic decay on 22 separate sensors, we certify the lifelong integrity of our machines.
            </p>
          </div>
          <div className="flex-shrink-0 flex items-center gap-2 px-6 py-3.5 bg-pure-white dark:bg-neutral-900 rounded-full border border-hairline dark:border-neutral-800 text-xs font-bold tracking-wider uppercase text-pure-black dark:text-pure-white">
            <UserCheck className="w-4.5 h-4.5 text-copper" />
            Certified ISO 9001
          </div>
        </div>

      </div>
    </section>
  );
}
