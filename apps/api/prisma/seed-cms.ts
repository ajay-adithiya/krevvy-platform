import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting CMS content migration (Phase 7B)...');
  const results = {
    created: 0,
    updated: 0,
    skipped: 0
  };

  // 1. Categories
  const categoriesData = [
    { slug: 'home-kitchen', name: 'Home & Kitchen', displayLabel: 'Home & Kitchen', iconName: 'Home', displayOrder: 1 },
    { slug: 'agriculture', name: 'Agriculture', displayLabel: 'Agriculture', iconName: 'Sprout', displayOrder: 2 },
    { slug: 'office-ergonomics', name: 'Office & Ergonomics', displayLabel: 'Office & Ergonomics', iconName: 'Monitor', displayOrder: 3 },
    { slug: 'spiritual-decor', name: 'Spiritual & Decor', displayLabel: 'Spiritual & Decor', iconName: 'Flower2', displayOrder: 4 }
  ];

  for (const cat of categoriesData) {
    const existing = await prisma.category.findUnique({ where: { slug: cat.slug } });
    if (existing) {
      await prisma.category.update({
        where: { id: existing.id },
        data: {
          displayLabel: cat.displayLabel,
          iconName: cat.iconName,
          displayOrder: cat.displayOrder,
        }
      });
      results.updated++;
    } else {
      await prisma.category.create({
        data: {
          name: cat.name,
          slug: cat.slug,
          description: '',
          isActive: true,
          displayLabel: cat.displayLabel,
          iconName: cat.iconName,
          displayOrder: cat.displayOrder,
        }
      });
      results.created++;
    }
  }

  // Fetch Categories for product mapping
  const cats = await prisma.category.findMany();
  const getCatId = (slug: string) => cats.find(c => c.slug === slug)?.id;

  // 2. Products
  const productsData = [
    {
      name: "Krevvy Aero Aura",
      slug: "krevvy-aero-aura",
      tagline: "The Masterpiece of Air Purification",
      description: "Combines 100,000 RPM fluid engineering with medical-grade 3-stage HEPA filtration to create an immaculate oasis of pure, quiet air in any modern architectural setting.",
      price: 349.00,
      categorySlug: "home-kitchen",
      isBestSeller: true,
      isNewArrival: false,
      ratingDisplay: 4.9,
      reviewCountDisplay: 182,
      primaryColorAccent: "#B5671A",
      amazonUrl: "https://www.amazon.com/s?k=krevvy+air+purifier",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG1Uk65NNmQlx3PwGcnQ3iI2wuNzaHDRH0zR7JiCzh64mmaGk08Mso5Ix9qdZjF9sK4ElLieH7AmI2mEFHfsOxm3HPxG5cC1sj0xpqwxGCvYjvbcNcwudARgJ9qR-d79UZT16mfYT1q6XkQULMKDjTYWKfhba95ZVBLe_OOS9PYoiCf_azVRwMctaCxQOkU1o7HsJEEe7dphsyBnlvsuPxHuMqAKSPY3h58yFVf8MmdkHb038HPhDU",
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
      ]
    },
    {
      name: "Krevvy Vortex Prime",
      slug: "krevvy-vortex-prime",
      tagline: "Unparalleled Digital Suction Power",
      description: "A lightweight, cordless masterpiece utilizing Krevvy's signature high-velocity motor to extract dust and microscopic dander from deep within premium upholstery and hardwood floors.",
      price: 499.00,
      categorySlug: "home-kitchen",
      isBestSeller: false,
      isNewArrival: true,
      ratingDisplay: 4.8,
      reviewCountDisplay: 114,
      primaryColorAccent: "#111111",
      amazonUrl: "https://www.amazon.com/s?k=krevvy+vacuum+cleaner",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIr-blw9tOR3r8-q_XBn6ay7nLkssjzRsfzI4ZTD8yERM6-6PvP7H_RRM0va1x25AO7uDSP1SYZ1ZG23MV2ZiFj693NW8ZklCzxQgoXgQIbP8N8CaKXxLhMJPYSVDbDDDOXutYhvqFJmb-XbuckWpcclN6zrOtG0W3oY8DW9RbieugAUsCEzTVHDF-9v72DCiTY61v1y7is7vUinNork0efeKfmF441sHB-Zp9enkHp_7pfAmAgolo",
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
      ]
    },
    {
      name: "Krevvy Terra Sensor",
      slug: "krevvy-terra-sensor",
      tagline: "Intelligent Soil Monitoring",
      description: "Advanced agricultural sensor array providing real-time soil moisture, pH, and nutrient analysis directly to your smart devices for precision farming.",
      price: 189.00,
      categorySlug: "agriculture",
      isBestSeller: false,
      isNewArrival: true,
      ratingDisplay: 4.7,
      reviewCountDisplay: 89,
      primaryColorAccent: "#4A7C59",
      amazonUrl: "https://www.amazon.com/s?k=krevvy+soil+sensor",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCG1Uk65NNmQlx3PwGcnQ3iI2wuNzaHDRH0zR7JiCzh64mmaGk08Mso5Ix9qdZjF9sK4ElLieH7AmI2mEFHfsOxm3HPxG5cC1sj0xpqwxGCvYjvbcNcwudARgJ9qR-d79UZT16mfYT1q6XkQULMKDjTYWKfhba95ZVBLe_OOS9PYoiCf_azVRwMctaCxQOkU1o7HsJEEe7dphsyBnlvsuPxHuMqAKSPY3h58yFVf8MmdkHb038HPhDU",
      features: [
        { title: "Tri-Sensor Array", description: "Simultaneous monitoring of NPK, moisture, and pH levels." },
        { title: "Solar Powered", description: "Self-sustaining operation with integrated micro-solar panels." }
      ],
      specifications: [
        { name: "Connectivity", value: "LoRaWAN & Wi-Fi" },
        { name: "Battery Life", value: "Indefinite (Solar)" }
      ]
    },
    {
      name: "Krevvy Ergo Lumbar",
      slug: "krevvy-ergo-lumbar",
      tagline: "Dynamic Posture Support",
      description: "Engineered lumbar support system utilizing responsive memory foam and active cooling gel layers for unparalleled office comfort during extended sessions.",
      price: 129.00,
      categorySlug: "office-ergonomics",
      isBestSeller: true,
      isNewArrival: false,
      ratingDisplay: 4.9,
      reviewCountDisplay: 342,
      primaryColorAccent: "#2E3C4E",
      amazonUrl: "https://www.amazon.com/s?k=krevvy+lumbar+support",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuB7zj8qACxm8Ak2nESKviDV7pUyWbbIWgkvi1ze8cJv0Py1t4mJdt0bQlzSQaQLI84BbAANHTX1vh6HGamJ8cWeYGk-L6BO-sZe-WICHt_bcpkaE6GnqqpEKU0t_iSiH09LWHLkaVma18KhTNQo-EKMv7E9Hty7bMaRGDjN6TmKnBFkFx8IUDYIxEqZ9Ij7euO0SjXrTDqB58f1_5fgGp1lR84rr1bmXEBa67RCjCyAybw1wlv0F4Fu",
      features: [
        { title: "Adaptive Memory Core", description: "Instantly molds to your unique spinal curvature." },
        { title: "Cryo-Gel Surface", description: "Dissipates body heat during prolonged seating sessions." }
      ],
      specifications: [
        { name: "Material", value: "High-density polyurethane foam" },
        { name: "Straps", value: "Dual adjustable elastic" }
      ]
    },
    {
      name: "Krevvy Zen Diffuser",
      slug: "krevvy-zen-diffuser",
      tagline: "Ultrasonic Aromatherapy",
      description: "A minimalist ceramic essential oil diffuser utilizing silent ultrasonic vibrations to disperse micro-fine therapeutic mist into your meditation space.",
      price: 79.00,
      categorySlug: "spiritual-decor",
      isBestSeller: false,
      isNewArrival: false,
      discountLabel: "20% Off",
      ratingDisplay: 4.6,
      reviewCountDisplay: 201,
      primaryColorAccent: "#D4AF37",
      amazonUrl: "https://www.amazon.com/s?k=krevvy+diffuser",
      imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuCIr-blw9tOR3r8-q_XBn6ay7nLkssjzRsfzI4ZTD8yERM6-6PvP7H_RRM0va1x25AO7uDSP1SYZ1ZG23MV2ZiFj693NW8ZklCzxQgoXgQIbP8N8CaKXxLhMJPYSVDbDDDOXutYhvqFJmb-XbuckWpcclN6zrOtG0W3oY8DW9RbieugAUsCEzTVHDF-9v72DCiTY61v1y7is7vUinNork0efeKfmF441sHB-Zp9enkHp_7pfAmAgolo",
      features: [
        { title: "Ultrasonic Atomization", description: "Preserves the structural integrity of essential oils." },
        { title: "Ambient Glow", description: "Soft, warm LED lighting with adjustable intensity." }
      ],
      specifications: [
        { name: "Capacity", value: "300ml water tank" },
        { name: "Runtime", value: "Up to 10 hours continuous" }
      ]
    }
  ];

  let displayOrder = 1;
  for (const p of productsData) {
    let product = await prisma.product.findFirst({ where: { name: p.name } });
    const data = {
      name: p.name,
      slug: p.slug,
      tagline: p.tagline,
      description: p.description,
      price: p.price,
      categoryId: getCatId(p.categorySlug) || '',
      isBestSeller: p.isBestSeller,
      isNewArrival: p.isNewArrival,
      discountLabel: p.discountLabel,
      ratingDisplay: p.ratingDisplay,
      reviewCountDisplay: p.reviewCountDisplay,
      primaryColorAccent: p.primaryColorAccent,
      amazonUrl: p.amazonUrl,
      isActive: true
    };

    if (product) {
      await prisma.product.update({ where: { id: product.id }, data });
      results.updated++;
    } else {
      product = await prisma.product.create({ data });
      results.created++;
    }

    // Handle features
    await prisma.productFeature.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < p.features.length; i++) {
      await prisma.productFeature.create({
        data: {
          productId: product.id,
          title: p.features[i].title,
          description: p.features[i].description,
          displayOrder: i + 1
        }
      });
      results.created++;
    }

    // Handle specs
    await prisma.productSpecification.deleteMany({ where: { productId: product.id } });
    for (let i = 0; i < p.specifications.length; i++) {
      await prisma.productSpecification.create({
        data: {
          productId: product.id,
          name: p.specifications[i].name,
          value: p.specifications[i].value,
          displayOrder: i + 1
        }
      });
      results.created++;
    }

    const existingImage = await prisma.productImage.findFirst({ where: { productId: product.id, imageUrl: p.imageUrl } });
    if (!existingImage) {
      await prisma.productImage.deleteMany({ where: { productId: product.id }}); // simplify
      await prisma.productImage.create({
        data: {
          productId: product.id,
          imageUrl: p.imageUrl,
          publicId: `migrated-${p.slug}`,
          altText: p.name,
          displayOrder: 1,
          isPrimary: true
        }
      });
      results.created++;
    }
  }

  // 3. Global Site Content
  await prisma.globalSiteContent.upsert({
    where: { id: 1 },
    update: {
      seoGlobalTitle: "Krevvy | Premium Home Engineering",
      seoGlobalDescription: "Premium Home & Kitchen essentials and thoughtfully selected lifestyle products.",
      footerBrandDescription: "Engineering luxury home technologies with obsessive material and acoustic discipline.",
      copyrightText: "© 2024 Krevvy.",
      complianceText: "A Prowess Click Kart Enterprise.",
      contactPhone: "+1 (800) 955-KREV",
      contactEmail: "concierge@krevvy.com",
      hqAddress: "1407 Premium tech park, Sector 5, Bangalore, India",
      companyName: "Prowess Click Kart Enterprise",
      businessHours: "Mon–Fri, 9:00 AM – 6:00 PM EST",
      buyOnAmazonLabel: "Buy on Amazon",
      amazonModalTitle: "You are heading to Amazon",
      amazonModalSubtitle: "To complete your premium purchase securely.",
      amazonModalContinueLabel: "Continue to Amazon Store",
      amazonModalCancelLabel: "Cancel and stay on Krevvy.com",
      amazonModalTrustText: "Secure hand-off encrypted. Direct seller registry.",
      amazonModalVerifiedLabel: "Verified Amazon Partner",
      amazonModalItemLabel: "Selected Item",
      amazonModalPriceLabel: "Launch Price",
      mobileMenuOpenLabel: "Main menu",
      mobileMenuCloseLabel: "Main menu"
    },
    create: {
      id: 1,
      seoGlobalTitle: "Krevvy | Premium Home Engineering",
      seoGlobalDescription: "Premium Home & Kitchen essentials and thoughtfully selected lifestyle products.",
      footerBrandDescription: "Engineering luxury home technologies with obsessive material and acoustic discipline.",
      copyrightText: "© 2024 Krevvy.",
      complianceText: "A Prowess Click Kart Enterprise.",
      contactPhone: "+1 (800) 955-KREV",
      contactEmail: "concierge@krevvy.com",
      hqAddress: "1407 Premium tech park, Sector 5, Bangalore, India",
      companyName: "Prowess Click Kart Enterprise",
      businessHours: "Mon–Fri, 9:00 AM – 6:00 PM EST",
      buyOnAmazonLabel: "Buy on Amazon",
      amazonModalTitle: "You are heading to Amazon",
      amazonModalSubtitle: "To complete your premium purchase securely.",
      amazonModalContinueLabel: "Continue to Amazon Store",
      amazonModalCancelLabel: "Cancel and stay on Krevvy.com",
      amazonModalTrustText: "Secure hand-off encrypted. Direct seller registry.",
      amazonModalVerifiedLabel: "Verified Amazon Partner",
      amazonModalItemLabel: "Selected Item",
      amazonModalPriceLabel: "Launch Price",
      mobileMenuOpenLabel: "Main menu",
      mobileMenuCloseLabel: "Main menu"
    }
  });
  results.updated++;

  // 4. Amazon Modal Benefits
  const benefits = [
    { title: "Official Manufacturer Warranty", description: "Every order qualifies for Krevvy’s 3-Year Extended Concierge warranty program upon activation.", iconName: "ShieldCheck" },
    { title: "Free Express Prime Shipping", description: "Complimentary express shipping and standard returns handled fully through Amazon Prime logistics.", iconName: "Truck" },
    { title: "Concierge Customer Support", description: "24/7 dedicated support by our engineering squad. Reach us anytime with your Amazon order ID.", iconName: "Award" }
  ];

  await prisma.amazonModalBenefit.deleteMany();
  for (let i = 0; i < benefits.length; i++) {
    await prisma.amazonModalBenefit.create({
      data: { ...benefits[i], displayOrder: i + 1 }
    });
    results.created++;
  }

  // 5. Home Page Content
  const heroImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuCG1Uk65NNmQlx3PwGcnQ3iI2wuNzaHDRH0zR7JiCzh64mmaGk08Mso5Ix9qdZjF9sK4ElLieH7AmI2mEFHfsOxm3HPxG5cC1sj0xpqwxGCvYjvbcNcwudARgJ9qR-d79UZT16mfYT1q6XkQULMKDjTYWKfhba95ZVBLe_OOS9PYoiCf_azVRwMctaCxQOkU1o7HsJEEe7dphsyBnlvsuPxHuMqAKSPY3h58yFVf8MmdkHb038HPhDU";
  let heroMedia = await prisma.mediaAsset.findFirst({ where: { url: heroImageUrl } });
  if (!heroMedia) {
    heroMedia = await prisma.mediaAsset.create({
      data: { url: heroImageUrl, publicId: 'hero-media', altText: 'Hero', filename: 'hero.jpg' }
    });
    results.created++;
  }
  await prisma.homePageContent.upsert({
    where: { id: 1 },
    update: {
      heroEyebrow: "KREVVY ENGINEERING LABS",
      heroTitle: "Elevate \n Everyday Living.",
      heroSubtitle: "Discover premium Home & Kitchen essentials and thoughtfully selected lifestyle products designed to bring comfort, functionality. and style to every home",
      heroCtaLabel: "View Products",
      heroMediaId: heroMedia.id,
      searchPlaceholder: "Search products...",
      searchButtonLabel: "Search",
      collectionEyebrow: "THE KREVVY COLLECTION",
      collectionTitle: "Engineering Marvels.",
      collectionDescription: "Explore our meticulously engineered appliances where form obeys function down to the micrometer."
    },
    create: {
      id: 1,
      heroEyebrow: "KREVVY ENGINEERING LABS",
      heroTitle: "Elevate \n Everyday Living.",
      heroSubtitle: "Discover premium Home & Kitchen essentials and thoughtfully selected lifestyle products designed to bring comfort, functionality. and style to every home",
      heroCtaLabel: "View Products",
      heroMediaId: heroMedia.id,
      searchPlaceholder: "Search products...",
      searchButtonLabel: "Search",
      collectionEyebrow: "THE KREVVY COLLECTION",
      collectionTitle: "Engineering Marvels.",
      collectionDescription: "Explore our meticulously engineered appliances where form obeys function down to the micrometer."
    }
  });
  results.updated++;

  // 6. Products Page Content
  await prisma.productsPageContent.upsert({
    where: { id: 1 },
    update: {
      pageEyebrow: "THE KREVVY COLLECTION",
      pageTitle: "Engineering Marvels.",
      pageSubtitle: "Explore our meticulously engineered appliances where form obeys function down to the micrometer.",
      emptySearchMessage: "No products match the current filter.",
      allProductsLabel: "View all products",
      viewTechSpecsLabel: "View Full Tech Specs",
      hideTechSpecsLabel: "Hide Full Tech Specs",
      categoriesFilterLabel: "Categories",
      newArrivalsFilterLabel: "New Arrivals",
      bestSellersFilterLabel: "Best Sellers",
      onDiscountFilterLabel: "On Discount",
      inStockLabel: "In Stock",
      warrantyLabel: "3-Yr Warranty",
      featuresHeadingLabel: "Core Engineering Modules",
      clearFilterLabel: "Clear filter",
      viewDetailsButtonLabel: "View Details"
    },
    create: {
      id: 1,
      pageEyebrow: "THE KREVVY COLLECTION",
      pageTitle: "Engineering Marvels.",
      pageSubtitle: "Explore our meticulously engineered appliances where form obeys function down to the micrometer.",
      emptySearchMessage: "No products match the current filter.",
      allProductsLabel: "View all products",
      viewTechSpecsLabel: "View Full Tech Specs",
      hideTechSpecsLabel: "Hide Full Tech Specs",
      categoriesFilterLabel: "Categories",
      newArrivalsFilterLabel: "New Arrivals",
      bestSellersFilterLabel: "Best Sellers",
      onDiscountFilterLabel: "On Discount",
      inStockLabel: "In Stock",
      warrantyLabel: "3-Yr Warranty",
      featuresHeadingLabel: "Core Engineering Modules",
      clearFilterLabel: "Clear filter",
      viewDetailsButtonLabel: "View Details"
    }
  });
  results.updated++;

  // 7. About Page Content
  await prisma.aboutPageContent.upsert({
    where: { id: 1 },
    update: {
      credoEyebrow: "THE KREVVY CREDO",
      credoTitle: "Engineering Luxury \n For Modern Sanctuaries.",
      narrativeText: "Krevvy was born from a singular, obsessive frustration: why are modern home appliances constructed from cheap, disposable materials and decorated with confusing digital displays?\n\nWe set out to create appliances that feel like luxury furniture and operate like aerospace-grade equipment. We combined advanced thermodynamic calculations with minimalist product design to build the Krevvy brand—a Prowess Click Kart Enterprise.\n\nEvery detail, from the exact weight-balance of our vacuums to the acoustic pitch of our purifiers, is tested inside our dedicated laboratory. The metallic copper highlights serve as a signature nod to Indian metallurgical heritage, blending material tradition with pristine Swiss precision.",
      enterpriseTitle: "Our Enterprise Identity",
      enterpriseDescription: "Krevvy operates under the Prowess Click Kart Enterprise umbrella, leveraging deep advanced logistics, reliable distribution channels, and meticulous manufacturing standards to bring state-of-the-art designs directly to premium household spaces.",
      manufacturingBaseTitle: "Manufacturing Base",
      manufacturingBaseSubtitle: "Surgical-Grade Quality Audits",
      certificationTitle: "Every appliance passes through our 140-point certification sequence.",
      certificationDescription: "From balancing the central motor shaft at micron tolerances to evaluating acoustic decay on 22 separate sensors, we certify the lifelong integrity of our machines.",
      certificationBadgeLabel: "Certified ISO 9001"
    },
    create: {
      id: 1,
      credoEyebrow: "THE KREVVY CREDO",
      credoTitle: "Engineering Luxury \n For Modern Sanctuaries.",
      narrativeText: "Krevvy was born from a singular, obsessive frustration: why are modern home appliances constructed from cheap, disposable materials and decorated with confusing digital displays?\n\nWe set out to create appliances that feel like luxury furniture and operate like aerospace-grade equipment. We combined advanced thermodynamic calculations with minimalist product design to build the Krevvy brand—a Prowess Click Kart Enterprise.\n\nEvery detail, from the exact weight-balance of our vacuums to the acoustic pitch of our purifiers, is tested inside our dedicated laboratory. The metallic copper highlights serve as a signature nod to Indian metallurgical heritage, blending material tradition with pristine Swiss precision.",
      enterpriseTitle: "Our Enterprise Identity",
      enterpriseDescription: "Krevvy operates under the Prowess Click Kart Enterprise umbrella, leveraging deep advanced logistics, reliable distribution channels, and meticulous manufacturing standards to bring state-of-the-art designs directly to premium household spaces.",
      manufacturingBaseTitle: "Manufacturing Base",
      manufacturingBaseSubtitle: "Surgical-Grade Quality Audits",
      certificationTitle: "Every appliance passes through our 140-point certification sequence.",
      certificationDescription: "From balancing the central motor shaft at micron tolerances to evaluating acoustic decay on 22 separate sensors, we certify the lifelong integrity of our machines.",
      certificationBadgeLabel: "Certified ISO 9001"
    }
  });
  results.updated++;

  const pillars = [
    {
      iconName: "PenTool",
      title: "Architectural Honesty",
      description: "We believe form must strictly obey function. Every vent, dial, seam, and chamfer on a Krevvy appliance is an aerodynamic or ergonomic necessity—never mere decoration. We strip away the digital fluff to expose raw mechanical perfection."
    },
    {
      iconName: "Settings",
      title: "Material Discipline",
      description: "We completely reject lightweight, cheap plastics. Touchpoints on Krevvy machines are milled from solid aircraft-grade block aluminum and finished with hand-brushed copper highlights, offering tactile feedback that connects you to physical engineering."
    },
    {
      iconName: "ShieldCheck",
      title: "Acoustic Sanctity",
      description: "True luxury is quiet. Our fluid-dynamics squad spends thousands of hours in acoustic chambers, designing custom multi-chamber sound mufflers and stabilizing turbine centers, keeping Krevvy running silently in the background of your life."
    }
  ];
  await prisma.aboutPillar.deleteMany();
  for (let i = 0; i < pillars.length; i++) {
    await prisma.aboutPillar.create({ data: { ...pillars[i], displayOrder: i + 1 }});
    results.created++;
  }

  // 8. Contact Page Content
  await prisma.contactPageContent.upsert({
    where: { id: 1 },
    update: {
      headerEyebrow: "CONCIERGE COMMUNICATIONS",
      headerTitle: "Consult With Our Team.",
      headerSubtitle: "Whether you require tailored product advice, order tracking, or warranty concierge assistance, our engineering squad is ready to assist.",
      warrantyCardTitle: "Purchased on Amazon?",
      warrantyCardText: "If you recently acquired your Krevvy device through our official Amazon partner channel, make sure to activate your 3-Year Extended Warranty. Send your Order ID and name in this form to initiate automatic registry.",
      formNameLabel: "Full Name",
      formEmailLabel: "Email Address",
      formPhoneLabel: "Phone Number",
      formCategoryLabel: "Inquiry Category",
      formMessageLabel: "Message Content",
      formSubmitLabel: "Send Transmission",
      validationRequiredMessage: "Full name is required.",
      validationEmailMessage: "Please enter a valid email address.",
      successMessageTitle: "Transmission Successful",
      successMessageDescription: "Thank you. Your inquiry has been routed to our technical support desk. A Krevvy engineer will contact you shortly.",
      successResetButtonLabel: "Send Another message",
      contactTouchpointsHeading: "Direct Touchpoints",
      contactPhoneHeading: "Concierge Helpline",
      contactEmailHeading: "Support Mailroom",
      contactAddressHeading: "HQ Enterprise Coordinates",
      formLoadingMessage: "Transmitting...",
      successTicketPrefixLabel: "Ticket Reference Code:"
    },
    create: {
      id: 1,
      headerEyebrow: "CONCIERGE COMMUNICATIONS",
      headerTitle: "Consult With Our Team.",
      headerSubtitle: "Whether you require tailored product advice, order tracking, or warranty concierge assistance, our engineering squad is ready to assist.",
      warrantyCardTitle: "Purchased on Amazon?",
      warrantyCardText: "If you recently acquired your Krevvy device through our official Amazon partner channel, make sure to activate your 3-Year Extended Warranty. Send your Order ID and name in this form to initiate automatic registry.",
      formNameLabel: "Full Name",
      formEmailLabel: "Email Address",
      formPhoneLabel: "Phone Number",
      formCategoryLabel: "Inquiry Category",
      formMessageLabel: "Message Content",
      formSubmitLabel: "Send Transmission",
      validationRequiredMessage: "Full name is required.",
      validationEmailMessage: "Please enter a valid email address.",
      successMessageTitle: "Transmission Successful",
      successMessageDescription: "Thank you. Your inquiry has been routed to our technical support desk. A Krevvy engineer will contact you shortly.",
      successResetButtonLabel: "Send Another message",
      contactTouchpointsHeading: "Direct Touchpoints",
      contactPhoneHeading: "Concierge Helpline",
      contactEmailHeading: "Support Mailroom",
      contactAddressHeading: "HQ Enterprise Coordinates",
      formLoadingMessage: "Transmitting...",
      successTicketPrefixLabel: "Ticket Reference Code:"
    }
  });
  results.updated++;

  const inquiries = [
    { value: "product_inquiry", label: "Pre-Purchase Consultation" },
    { value: "amazon_support", label: "Amazon Order & Delivery Help" },
    { value: "warranty_registry", label: "Extended Warranty Activation" },
    { value: "technical_feedback", label: "Technical Engineering Feedback" }
  ];
  await prisma.contactInquiryOption.deleteMany();
  for (let i = 0; i < inquiries.length; i++) {
    await prisma.contactInquiryOption.create({ data: { ...inquiries[i], displayOrder: i + 1 }});
    results.created++;
  }

  // 9. FAQ Page Content
  await prisma.faqPageContent.upsert({
    where: { id: 1 },
    update: {
      headerEyebrow: "SUPPORT INTELLIGENCE",
      headerTitle: "Frequently Asked Questions.",
      headerSubtitle: "Obtain immediate, transparent answers regarding Krevvy product standards, Amazon logistics, and warranty coverage.",
      fallbackSupportText: "Cannot find the answer to your specific technical question? Contact our concierge desk directly at concierge@krevvy.com. We will analyze your query and follow up within 12 hours.",
      allFaqsLabel: "All FAQs"
    },
    create: {
      id: 1,
      headerEyebrow: "SUPPORT INTELLIGENCE",
      headerTitle: "Frequently Asked Questions.",
      headerSubtitle: "Obtain immediate, transparent answers regarding Krevvy product standards, Amazon logistics, and warranty coverage.",
      fallbackSupportText: "Cannot find the answer to your specific technical question? Contact our concierge desk directly at concierge@krevvy.com. We will analyze your query and follow up within 12 hours.",
      allFaqsLabel: "All FAQs"
    }
  });
  results.updated++;

  const faqCategories = [
    { slug: "product", displayLabel: "Engineering" },
    { slug: "warranty", displayLabel: "Warranty" },
    { slug: "shipping", displayLabel: "Shipping" },
    { slug: "general", displayLabel: "General" }
  ];

  for (let i = 0; i < faqCategories.length; i++) {
    const fc = faqCategories[i];
    await prisma.faqCategory.upsert({
      where: { slug: fc.slug },
      update: { displayLabel: fc.displayLabel, displayOrder: i + 1 },
      create: { slug: fc.slug, displayLabel: fc.displayLabel, displayOrder: i + 1 }
    });
    results.updated++;
  }

  const fCats = await prisma.faqCategory.findMany();
  const getFaqCatId = (slug: string) => fCats.find(c => c.slug === slug)?.id;

  const faqs = [
    {
      category: "product",
      question: "How does the 100,000 RPM motor maintain whisper-quiet operation?",
      answer: "Our digital motor utilizes dual aerospace-grade fluid dynamics chambers and a perfectly balanced ceramic rotor shaft that completely eliminates mechanical friction. This isolates vibration, dampening high-frequency whines and channeling airflow in a direct stream, keeping operational sound levels below 18dB on stealth mode."
    },
    {
      category: "product",
      question: "How often do I need to replace the True HEPA H13 filters?",
      answer: "Under standard continuous household use, Krevvy H13 filters are engineered to last 8,760 hours (approximately 12 months). When a replacement is required, the Aero Aura’s haptic dial will pulsate in a soft copper glow, and you can order certified replacement cartridges directly on our Amazon partner store."
    },
    {
      category: "warranty",
      question: "How do I register my product for the 3-Year Concierge Warranty?",
      answer: "Activation is simple. Within 30 days of receiving your device, navigate to our Contact page and send an inquiry selecting 'Extended Warranty Activation'. Provide your name, email, and 17-digit Amazon Order ID. Our concierge crew will process the registry and email your formal warranty certificate."
    },
    {
      category: "warranty",
      question: "What is covered under the Krevvy warranty?",
      answer: "The 3-Year Extended Concierge Warranty provides full protection against all manufacturer defects, electrical issues, and motor wear. It includes complimentary express round-trip courier shipping from your doorstep, direct priority support from our engineering department, and full product replacements if repairs cannot be made."
    },
    {
      category: "shipping",
      question: "Are orders fulfilled and shipped directly through Amazon?",
      answer: "Yes, absolutely. To guarantee prompt delivery, all official Krevvy inventories are stored directly inside local Amazon fulfillment warehouses. When you checkout, your order is dispatched via secure Amazon Prime logistics, featuring expedited delivery schedules and real-time tracking."
    },
    {
      category: "shipping",
      question: "Do you offer international shipping?",
      answer: "We support shipping across the United States, India, and European Union regions via our localized Amazon global storefronts. If you reside outside these boundaries, please consult our concierge staff via the Contact page to coordinate special shipping pathways."
    },
    {
      category: "general",
      question: "What is the relationship between Krevvy and Prowess Click Kart?",
      answer: "Krevvy is a flagship luxury brand operated and backed by Prowess Click Kart Enterprise. Prowess handles our corporate administration, capital backing, global supply chain compliance, and international logistics, leaving our design studios and engineering labs free to focus purely on creating uncompromising appliances."
    }
  ];
  await prisma.faqItem.deleteMany();
  for (let i = 0; i < faqs.length; i++) {
    await prisma.faqItem.create({
      data: {
        faqCategoryId: getFaqCatId(faqs[i].category) || '',
        question: faqs[i].question,
        answer: faqs[i].answer,
        displayOrder: i + 1
      }
    });
    results.created++;
  }

  // 10. Navigation
  const navItems = [
    { label: 'Home', targetView: 'home' },
    { label: 'Products', targetView: 'products' },
    { label: 'About', targetView: 'about' },
    { label: 'Contact', targetView: 'contact' },
    { label: 'FAQ', targetView: 'faq' }
  ];
  await prisma.navigationItem.deleteMany();
  for (let i = 0; i < navItems.length; i++) {
    await prisma.navigationItem.create({ data: { ...navItems[i], displayOrder: i + 1 }});
    results.created++;
  }

  // 11. Footer
  await prisma.footerGroup.deleteMany();

  const g1 = await prisma.footerGroup.create({ data: { title: "Philosophy", displayOrder: 1 }});
  const g2 = await prisma.footerGroup.create({ data: { title: "Concierge Room", displayOrder: 2 }});
  const g3 = await prisma.footerGroup.create({ data: { title: "Compliance", displayOrder: 3 }});

  const links = [
    { groupId: g1.id, label: "Our Brand Story", targetView: "about", displayOrder: 1 },
    { groupId: g1.id, label: "Engineering Lab Studies", targetView: "products", displayOrder: 2 },
    { groupId: g1.id, label: "Support Intel (FAQ)", targetView: "faq", displayOrder: 3 },

    { groupId: g2.id, label: "Personal Consultation", targetView: "contact", displayOrder: 1 },
    { groupId: g2.id, label: "Verify Amazon Order ID", targetView: "amazon", displayOrder: 2 },
    { groupId: g2.id, label: "Submit Tech Feedback", targetView: "contact", displayOrder: 3 },

    { groupId: g3.id, label: "Privacy Policy", targetView: "none", displayOrder: 1 },
    { groupId: g3.id, label: "Terms of Service", targetView: "none", displayOrder: 2 },
    { groupId: g3.id, label: "Amazon Store Registry", targetView: "none", displayOrder: 3 },
  ];

  for (const link of links) {
    await prisma.footerLink.create({ data: link });
    results.created++;
  }

  console.log(`Migration Complete: Created ${results.created}, Updated ${results.updated}, Skipped ${results.skipped}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
