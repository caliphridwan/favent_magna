/**
 * Favent Magna site content — single source of truth for the seed and the
 * content import script.
 *
 * Sources:
 *  • The existing faventmagna.com (Home, About, Solutions, Partnerships,
 *    Contact pages, retrieved 7 Nov 2026) — company intro, mission, vision,
 *    values, approach, services, OEM partners, testimonial and contact details.
 *  • The redesign brief — hero copy and the core service categories.
 *
 * Wording has been edited for clarity and consistency, but no facts,
 * certifications or achievements have been added. Claims on the old site
 * that could imply formal OEM status ("certified distributor", "authorized
 * supplier") have been softened until confirmed — see `statusNote` on
 * partners to state verified status.
 */

export const settings = {
  companyName: "Favent Magna Nigeria Limited",
  tagline: "Empowering Connections. Enabling Possibilities.",
  heroEyebrow: "Enterprise ICT Solutions · Nigeria",
  heroHeadline: "Technology Infrastructure. Security. Connectivity. Delivered.",
  heroSubtext:
    "Empowering organisations with integrated technology solutions, secure infrastructure and dependable digital connectivity.",
  heroPrimaryCta: "Explore Our Services",
  heroSecondaryCta: "Speak With Our Team",
  introHeading: "Your trusted partner for ICT, cloud infrastructure and secure networking.",
  introBody: [
    "Favent Magna Nigeria Limited delivers ICT solutions built around what every organisation depends on: connectivity, security and performance. We supply networking hardware, cybersecurity software and infrastructure from established global manufacturers, and back it with the industry experience to design, deploy and support it.",
    "We work consultatively, not as a box supplier. We listen, analyse your needs, recommend the right technology and implement it — so your ICT setup is secure, efficient and ready to scale.",
  ].join("\n\n"),
  aboutBody: [
    "Favent Magna Nigeria Limited delivers ICT solutions that enhance connectivity, security and performance. From networking hardware and cybersecurity software to complete infrastructure, our offering is backed by industry experience and by strong relationships with Original Equipment Manufacturers (OEMs).",
    "We are consultative and needs-driven rather than a simple product supplier. Every engagement follows the same approach: we listen, analyse, recommend and implement — so each organisation we work with ends up with an ICT setup that is secure, efficient and scalable.",
    "Our work spans the sale and distribution of ICT products, IT system design and consultancy, network infrastructure and structured cabling, cybersecurity and data protection, data centre and storage solutions, internet service management, intelligent traffic management and security surveillance systems, and professional ICT training — with or without certification — for individuals and corporate teams.",
    "Clients choose Favent Magna for personalised recommendations, certified professionals, and fast, reliable solutions tailored to their environment.",
  ].join("\n\n"),
  mission: "To provide solutions that connect systems, so people and devices can communicate efficiently and effectively.",
  vision: "A future where technology blends seamlessly into everyday life — inspiring, educating and connecting people through innovation.",
  whyItems: [
    "Innovation-driven | We keep evolving our solutions to meet the changing ICT needs of the organisations we serve.",
    "Quality assured | Every product and solution we supply is vetted for reliability before it reaches your network.",
    "OEM-backed | Our solutions are built on technology from established global manufacturers.",
    "End-to-end delivery | From consultation and design through deployment and ongoing support, one team owns the outcome.",
  ],
  approachSteps: [
    "Listen | We start by understanding your organisation, your users and the problem you need solved.",
    "Analyse | We assess your existing environment, requirements and constraints.",
    "Recommend | We propose the right technology, designed around your needs and budget.",
    "Implement | Our engineers deploy, configure and test the solution on site.",
    "Support | We stay on hand for maintenance, upgrades, training and expansion.",
  ],
  ctaHeading: "Need expert ICT guidance?",
  ctaBody: "Book an appointment with our team and we'll review your requirements and recommend the right approach.",
  address: "71, GSS Shopping Plaza\nFate GRA, Ilorin\nKwara State, Nigeria",
  phone: "+234 704 181 5111",
  email: "info@faventmagna.com",
  mapEmbedUrl: "https://www.google.com/maps?q=71+GSS+Shopping+Plaza,+Fate+GRA,+Ilorin,+Kwara+State,+Nigeria&output=embed",
  facebookUrl: "https://facebook.com/faventmagna",
  instagramUrl: "https://instagram.com/faventmagna",
  xUrl: "https://twitter.com/faventmagna",
  // The old site links to http://linkedin.com/faventmagna, which is not a valid
  // LinkedIn page URL. Add the real company page URL in Admin → Settings.
  linkedinUrl: null,
  defaultMetaTitle: "Favent Magna Nigeria Limited | ICT, Networking & Cybersecurity Solutions",
  defaultMetaDesc:
    "Favent Magna Nigeria Limited is an ICT solutions company in Ilorin, Nigeria, delivering networking, cybersecurity, data centre and cloud infrastructure, internet service management, IT consultancy and professional ICT training.",
};

export const pages = [
  {
    path: "/",
    name: "Home",
    metaTitle: "Favent Magna Nigeria Limited | ICT, Networking & Cybersecurity Solutions",
    metaDescription: settings.defaultMetaDesc,
  },
  {
    path: "/about",
    name: "About Us",
    heading: "About Favent Magna",
    intro: "Empowering Connections. Enabling Possibilities.",
    body: settings.aboutBody,
    metaTitle: "About Us",
    metaDescription:
      "Favent Magna Nigeria Limited is a consultative ICT solutions company delivering connectivity, security and performance through OEM-backed networking, cybersecurity and infrastructure.",
  },
  {
    path: "/services",
    name: "Our Services",
    heading: "Our Services",
    intro:
      "From networking hardware and structured cabling to cybersecurity, data centre, internet management, consultancy and training — delivered by one team.",
    metaTitle: "ICT Services",
    metaDescription:
      "Enterprise networking, structured cabling, cybersecurity, physical security and surveillance, data centre and storage, internet service management, IT consultancy, ICT product supply and training.",
  },
  {
    path: "/solutions",
    name: "Business Solutions",
    heading: "Business Solutions",
    intro: "Our services combined around the outcomes organisations need.",
    metaTitle: "ICT Solutions",
  },
  {
    path: "/partners",
    name: "Technology Partners",
    heading: "Partners & OEMs",
    intro: "We work with leading Original Equipment Manufacturers to deliver reliable, secure and scalable technology.",
    metaTitle: "Partners & OEMs",
    metaDescription: "The global technology brands Favent Magna works with across networking, security, cabling, storage and communications.",
  },
  {
    path: "/industries",
    name: "Industries We Serve",
    heading: "Industries We Serve",
    intro: "Infrastructure for organisations that can't afford downtime.",
  },
  {
    path: "/projects",
    name: "Projects & Case Studies",
    heading: "Projects & Case Studies",
    intro: "Selected work delivered by our team.",
  },
  {
    path: "/training",
    name: "Training",
    heading: "Professional ICT Training & Certification",
    intro: "Industry-standard ICT training for individuals and corporate teams — with or without certification.",
    metaTitle: "ICT Training & Certification",
  },
  {
    path: "/contact",
    name: "Contact Us",
    heading: "Speak With Our Team",
    intro: "Need expert ICT guidance? Tell us about your requirements and our team will get back to you.",
    metaTitle: "Contact Us",
    metaDescription: "Contact Favent Magna Nigeria Limited at 71, GSS Shopping Plaza, Fate GRA, Ilorin. Call +234 704 181 5111 or email info@faventmagna.com.",
  },
  { path: "/privacy", name: "Privacy Notice", heading: "Privacy Notice" },
];

export const categories = [
  { slug: "networking", name: "Networking & Connectivity", order: 1 },
  { slug: "security", name: "Security", order: 2 },
  { slug: "infrastructure", name: "Infrastructure & Smart Systems", order: 3 },
  { slug: "connectivity", name: "Internet Services", order: 4 },
  { slug: "consultancy", name: "Consultancy & Supply", order: 5 },
  { slug: "training", name: "Training", order: 6 },
];

/** Slugs renamed since the first seed: applied before upserting partners. */
export const partnerRenames = [{ from: "zyteco", to: "zkteco" }];

/**
 * OEM partners. The first 12 appear on the existing site; the rest come from
 * the brief. `published: false` = shown nowhere until Favent Magna confirms.
 */
export const partners = [
  { slug: "ruijie-networks", name: "Ruijie Networks", category: "NETWORKING", websiteUrl: "https://www.ruijienetworks.com/" },
  { slug: "arista-networks", name: "Arista Networks", category: "NETWORKING", websiteUrl: "https://www.arista.com/en/" },
  { slug: "giganet", name: "Giganet", category: "NETWORKING", websiteUrl: "https://www.giga-net.co.uk/" },
  { slug: "teltonika-networks", name: "Teltonika Networks", category: "NETWORKING", websiteUrl: "https://teltonika-networks.com/" },
  { slug: "mart-networks", name: "Mart Networks", category: "NETWORKING", websiteUrl: "https://mart-networks.com/" },
  { slug: "sophos", name: "Sophos", category: "SECURITY", websiteUrl: "https://www.sophos.com/" },
  { slug: "honeywell", name: "Honeywell", category: "PHYSICAL_SECURITY", websiteUrl: "https://www.honeywell.com/" },
  { slug: "zkteco", name: "ZKTeco", category: "PHYSICAL_SECURITY", websiteUrl: "https://www.zkteco.com/en/" },
  { slug: "siemon", name: "Siemon", category: "CABLING", websiteUrl: "https://www.siemon.com/en/" },
  { slug: "qnap", name: "QNAP", category: "STORAGE", websiteUrl: "https://www.qnap.com/en" },
  { slug: "mitel", name: "Mitel", category: "UNIFIED_COMMUNICATIONS", websiteUrl: "https://www.mitel.com/" },
  { slug: "vtech", name: "VTech", category: "UNIFIED_COMMUNICATIONS", websiteUrl: "https://www.vtech.com/" },
  { slug: "24-online-wireless", name: "24 Online Wireless", category: "CONNECTIVITY", websiteUrl: null },
  { slug: "microsoft-365", name: "Microsoft 365", category: "CLOUD_PRODUCTIVITY", websiteUrl: "https://www.microsoft.com/microsoft-365" },
  // In the brief but not on the existing site — confirm before publishing.
  { slug: "sprintly", name: "Sprintly", category: "OTHER", websiteUrl: null, published: false },
  { slug: "ray", name: "RAY", category: "OTHER", websiteUrl: null, published: false },
];

const networking = ["ruijie-networks", "arista-networks", "giganet", "teltonika-networks", "mart-networks"];

export const services = [
  {
    slug: "access-points-enterprise-switching",
    title: "Access Points and Enterprise Switching",
    icon: "wifi",
    category: "networking",
    shortDescription: "Enterprise wireless, routers and switches planned for capacity, roaming and growth across offices and campuses.",
    intro:
      "Reliable wireless and wired connectivity is the foundation of every modern workplace. We plan, supply and configure enterprise access points, routers and switches so your users stay connected wherever they work.",
    capabilities: ["Wireless site surveys and coverage planning", "Enterprise access point deployment", "Routers and core, distribution and access switching", "VLAN design and network segmentation", "Controller and cloud-managed Wi-Fi configuration"],
    applications: ["Corporate offices and campuses", "Schools and institutions", "Guest and staff wireless networks", "Branch network expansion"],
    benefits: ["Consistent coverage and roaming", "Capacity for growing user numbers", "Simpler central management", "A network designed to scale"],
    partners: networking,
    related: ["networking-structured-cabling", "cybersecurity-solutions", "internet-service-management"],
  },
  {
    slug: "networking-structured-cabling",
    title: "Networking and Structured Cabling",
    icon: "network",
    category: "networking",
    shortDescription: "Custom-designed, high-performance networks and standards-based cabling for businesses, institutions and data centres.",
    intro:
      "A well-designed network and cabling system supports every device and service you run for years. We design and deploy high-performance networks with structured cabling that is tidy, tested and documented.",
    capabilities: ["Network infrastructure design and deployment", "Copper (Cat6/Cat6A) cabling", "Fibre optic backbone installation", "Rack, cabinet and patching installation", "Testing, labelling and documentation"],
    applications: ["New office fit-outs", "Network upgrades and relocations", "Server rooms and data centres", "Campus backbones"],
    benefits: ["Reliable performance", "Easier troubleshooting and moves", "Ready for future upgrades", "Clean, professional installations"],
    partners: ["siemon", ...networking],
    related: ["access-points-enterprise-switching", "data-centre-infrastructure-storage", "it-consultancy-system-design"],
  },
  {
    slug: "cybersecurity-solutions",
    title: "Cybersecurity Solutions",
    icon: "shield",
    category: "security",
    shortDescription: "Advanced threat protection and data security, powered by trusted providers including Sophos.",
    intro: "Protect your network, users and data with layered cybersecurity and data protection, designed, deployed and maintained by our engineers.",
    capabilities: ["Next-generation firewall deployment", "Endpoint and ransomware protection", "Secure remote access", "Email and web protection", "Data protection policies"],
    applications: ["Head-office and branch perimeter security", "Protecting finance and customer data", "Securing hybrid and remote workforces", "Guest network segmentation"],
    benefits: ["Reduced risk of malware and unauthorised access", "Visibility of traffic and threats", "Business continuity", "Locally supported security"],
    partners: ["sophos", "microsoft-365"],
    related: ["physical-security-systems", "data-centre-infrastructure-storage", "professional-technology-training"],
  },
  {
    slug: "physical-security-systems",
    title: "Physical Security and Surveillance Systems",
    icon: "cctv",
    category: "security",
    shortDescription: "Security surveillance with advanced video monitoring, intrusion detection and real-time alerts, plus access control.",
    intro:
      "We design and implement security surveillance systems that offer advanced video monitoring, intrusion detection and real-time alerts — integrated with access control and your IT infrastructure.",
    capabilities: ["Video surveillance (CCTV / IP cameras)", "Intrusion detection", "Real-time alerts and monitoring", "Access control and attendance systems", "Recording and video storage"],
    applications: ["Offices and corporate facilities", "Warehouses and industrial sites", "Schools and campuses", "Multi-site organisations"],
    benefits: ["Improved site safety", "Centralised monitoring", "Recorded evidence when you need it", "One partner for IT and physical security"],
    partners: ["honeywell", "zkteco"],
    related: ["data-centre-infrastructure-storage", "networking-structured-cabling", "intelligent-traffic-management"],
  },
  {
    slug: "data-centre-infrastructure-storage",
    title: "Data Centre Infrastructure and Storage",
    icon: "server",
    category: "infrastructure",
    shortDescription: "End-to-end solutions for data storage, backups and efficient digital asset management.",
    intro: "Keep critical data available and protected with data centre infrastructure, storage and backup designed around your workloads.",
    capabilities: ["Server room and rack infrastructure", "Network-attached storage (NAS)", "Backup and data protection", "Digital asset management", "Data centre switching"],
    applications: ["File sharing and collaboration", "Video surveillance storage", "Backup and recovery", "Cloud and hybrid workloads"],
    benefits: ["Higher availability", "Protected business data", "Scalable capacity", "Organised, maintainable infrastructure"],
    partners: ["qnap", "arista-networks"],
    related: ["networking-structured-cabling", "cybersecurity-solutions", "physical-security-systems"],
  },
  {
    slug: "internet-service-management",
    title: "Internet Service Management",
    icon: "globe",
    category: "connectivity",
    shortDescription: "Bandwidth, hotspot and user management that keeps connectivity fair, measurable and online.",
    intro: "Get more from your internet connection with management tools that control bandwidth, authenticate users and keep connectivity dependable.",
    capabilities: ["Bandwidth management and policies", "Hotspot and guest Wi-Fi authentication", "User and access management", "Usage monitoring and reporting"],
    applications: ["Hotels and hospitality", "Schools and campuses", "Shared offices and estates", "Public and guest Wi-Fi"],
    benefits: ["Fair use of available bandwidth", "Controlled guest access", "Measurable usage", "Better user experience"],
    partners: ["24-online-wireless", "teltonika-networks"],
    related: ["access-points-enterprise-switching", "cybersecurity-solutions", "professional-technology-training"],
  },
  {
    slug: "it-consultancy-system-design",
    title: "IT Consultancy and System Design",
    icon: "briefcase",
    category: "consultancy",
    shortDescription: "Professional advice, planning and deployment support for ICT-driven business growth.",
    intro:
      "Get practical, needs-driven guidance before you invest. We assess your environment, design the right system and support deployment so your technology serves your business goals.",
    capabilities: ["ICT needs assessment", "IT system and network design", "Technology selection and planning", "Deployment support"],
    applications: ["New offices and facilities", "Infrastructure upgrades", "Multi-site expansion", "Technology planning"],
    benefits: ["Informed investment decisions", "Designs that scale", "Lower deployment risk", "Technology aligned with business goals"],
    partners: [],
    related: ["networking-structured-cabling", "ict-product-sales-distribution", "data-centre-infrastructure-storage"],
  },
  {
    slug: "ict-product-sales-distribution",
    title: "ICT Product Sales and Distribution",
    icon: "package",
    category: "consultancy",
    shortDescription: "Supply of access points, routers, switches, cables and data centre hardware from leading global brands.",
    intro:
      "Source the right equipment with confidence. We supply networking, security, cabling, storage and communications products from established Original Equipment Manufacturers, with advice on what fits your requirements.",
    capabilities: ["Access points, routers and switches", "Structured cabling products", "Data centre and storage hardware", "Security and surveillance equipment", "Communications equipment"],
    applications: ["New deployments", "Expansion and upgrades", "Replacement and spares", "Project supply"],
    benefits: ["Genuine products from established brands", "Guidance on the right specification", "One supplier across the stack", "Backed by deployment and support services"],
    partners: ["ruijie-networks", "arista-networks", "giganet", "teltonika-networks", "mart-networks", "siemon", "qnap", "zkteco", "honeywell", "mitel", "vtech"],
    related: ["it-consultancy-system-design", "access-points-enterprise-switching", "networking-structured-cabling"],
  },
  {
    slug: "intelligent-traffic-management",
    title: "Intelligent Traffic Management Systems",
    icon: "traffic",
    category: "infrastructure",
    shortDescription: "Intelligent traffic management systems designed to reduce congestion, enhance road safety and provide real-time monitoring.",
    intro:
      "We design and implement intelligent traffic management systems tailored to reduce congestion, enhance road safety and provide real-time traffic monitoring.",
    capabilities: ["System design and implementation", "Real-time traffic monitoring", "Congestion management", "Road safety enhancement"],
    applications: ["Urban road networks", "Junctions and intersections", "Estates and campuses", "Public-sector infrastructure projects"],
    benefits: ["Reduced congestion", "Safer roads", "Real-time visibility", "Data to plan improvements"],
    partners: [],
    related: ["physical-security-systems", "it-consultancy-system-design", "networking-structured-cabling"],
  },
  {
    slug: "professional-technology-training",
    title: "Professional ICT Training and Certification",
    icon: "graduation",
    category: "training",
    shortDescription: "Industry-standard ICT training for individuals and corporate teams — with or without certification.",
    intro: "Build the confidence and capability of your team, or advance your own career, with practical, industry-standard ICT training.",
    capabilities: ["Networking fundamentals", "Security awareness and administration", "Platform-specific administration", "Certification-track programmes", "Handover training for deployed systems"],
    applications: ["Individuals building ICT careers", "Corporate IT teams", "New system handovers", "End-user awareness"],
    benefits: ["Stronger in-house skills", "Faster issue resolution", "Better use of your technology investment", "Recognised certification options"],
    partners: [],
    related: ["cybersecurity-solutions", "access-points-enterprise-switching", "it-consultancy-system-design"],
  },
];

export const solutions = [
  { slug: "secure-campus-office-connectivity", title: "Secure campus & office connectivity", icon: "building", summary: "Cabling, switching, Wi-Fi and firewall delivered as one network.", services: ["networking-structured-cabling", "access-points-enterprise-switching", "cybersecurity-solutions"] },
  { slug: "surveillance-access-control", title: "Surveillance & access control", icon: "cctv", summary: "Cameras, intrusion detection, entry systems and recording storage on a dependable network.", services: ["physical-security-systems", "data-centre-infrastructure-storage"] },
  { slug: "data-protection-continuity", title: "Data protection & business continuity", icon: "database", summary: "Network storage, backup and security policies that keep data available.", services: ["data-centre-infrastructure-storage", "cybersecurity-solutions"] },
  { slug: "managed-internet-guest-wifi", title: "Managed internet & guest Wi-Fi", icon: "globe", summary: "Hotspot, bandwidth and user controls for shared and public connectivity.", services: ["internet-service-management", "access-points-enterprise-switching"] },
  { slug: "smart-traffic-infrastructure", title: "Smart traffic & public infrastructure", icon: "traffic", summary: "Intelligent traffic management and surveillance for safer, less congested roads.", services: ["intelligent-traffic-management", "physical-security-systems"] },
];

// DRAFT — seeded unpublished. Publish only the sectors actually served.
export const industries = [
  "Corporate & enterprise", "Financial services", "Education", "Healthcare",
  "Hospitality", "Government & public sector", "Energy & industrial", "Retail & multi-site",
];

// From the existing homepage.
export const testimonials = [
  { key: "adetayo-campus-wifi", quote: "Favent Magna transformed our entire network infrastructure.", author: "Engr. Adetayo", role: "Campus Wi-Fi project", published: true },
];

const slugify = (s) => s.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

/**
 * Write the content above to the database.
 * overwrite=false (seed): only creates missing rows — never touches admin edits.
 * overwrite=true (import): also updates existing rows with this content.
 */
export async function applyContent(prisma, { overwrite = false } = {}) {
  const upd = (data) => (overwrite ? data : {});

  await prisma.siteSetting.upsert({ where: { id: 1 }, update: upd(settings), create: { id: 1, ...settings } });

  for (const p of pages) await prisma.page.upsert({ where: { path: p.path }, update: upd(p), create: p });

  for (const c of categories) await prisma.serviceCategory.upsert({ where: { slug: c.slug }, update: upd(c), create: c });

  for (const r of partnerRenames) {
    const [from, to] = await Promise.all([prisma.partner.findUnique({ where: { slug: r.from } }), prisma.partner.findUnique({ where: { slug: r.to } })]);
    if (from && !to) await prisma.partner.update({ where: { slug: r.from }, data: { slug: r.to } });
    else if (from && to) await prisma.partner.delete({ where: { slug: r.from } });
  }
  for (const [i, p] of partners.entries()) {
    const data = { name: p.name, category: p.category, websiteUrl: p.websiteUrl, order: i, published: p.published ?? true };
    await prisma.partner.upsert({ where: { slug: p.slug }, update: upd(data), create: { slug: p.slug, ...data } });
  }

  for (const [i, s] of services.entries()) {
    const category = await prisma.serviceCategory.findUnique({ where: { slug: s.category } });
    const base = {
      title: s.title,
      icon: s.icon,
      shortDescription: s.shortDescription,
      intro: s.intro,
      capabilities: s.capabilities,
      applications: s.applications,
      benefits: s.benefits,
      order: i + 1,
      categoryId: category?.id ?? null,
    };
    const partnerRefs = s.partners.map((slug) => ({ slug }));
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: overwrite ? { ...base, partners: { set: partnerRefs } } : {},
      create: { slug: s.slug, ...base, partners: { connect: partnerRefs } },
    });
  }
  for (const s of services) {
    const current = await prisma.service.findUnique({ where: { slug: s.slug }, select: { _count: { select: { related: true } } } });
    if (overwrite || !current?._count.related) {
      await prisma.service.update({ where: { slug: s.slug }, data: { related: { set: s.related.map((slug) => ({ slug })) } } });
    }
  }

  for (const [i, s] of solutions.entries()) {
    const data = { title: s.title, summary: s.summary, icon: s.icon, order: i };
    const refs = s.services.map((slug) => ({ slug }));
    await prisma.solution.upsert({
      where: { slug: s.slug },
      update: overwrite ? { ...data, services: { set: refs } } : {},
      create: { slug: s.slug, ...data, services: { connect: refs } },
    });
  }

  // Industries keep their published state even on overwrite.
  for (const [i, name] of industries.entries()) {
    const slug = slugify(name);
    await prisma.industry.upsert({ where: { slug }, update: {}, create: { name, slug, order: i, published: false } });
  }

  for (const [i, t] of testimonials.entries()) {
    const exists = await prisma.testimonial.findFirst({ where: { author: t.author, quote: t.quote } });
    if (!exists) await prisma.testimonial.create({ data: { quote: t.quote, author: t.author, role: t.role, order: i, published: t.published } });
  }
}
