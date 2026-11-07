/**
 * Seed data for Favent Magna.
 *
 * Content here comes ONLY from the supplied project brief (services, partner
 * brands, hero copy). Anything not supplied is left empty or as a clearly
 * bracketed placeholder for an administrator to replace in the dashboard.
 * Industries are seeded UNPUBLISHED as a draft list — publish only the ones
 * Favent Magna actually serves. No projects, testimonials or FAQs are seeded.
 *
 * Safe to run repeatedly: everything is upserted by slug/path.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const services = [
  {
    slug: "access-points-enterprise-switching",
    title: "Access Points and Enterprise Switching",
    icon: "wifi",
    category: "networking",
    shortDescription:
      "Wireless coverage and switched networks planned for capacity, roaming and growth across offices and campuses.",
    intro:
      "Reliable wireless and wired connectivity is the foundation of every modern workplace. We plan, deploy and configure enterprise access points and switching so your users stay connected wherever they work.",
    capabilities: ["Wireless site surveys and coverage planning", "Enterprise access point deployment", "Core, distribution and access switching", "VLAN design and network segmentation", "Controller and cloud-managed Wi-Fi configuration"],
    applications: ["Corporate offices and campuses", "Multi-floor buildings", "Guest and staff wireless networks", "Branch network expansion"],
    benefits: ["Consistent coverage and roaming", "Capacity for growing user numbers", "Simpler central management", "A network designed to scale"],
    partners: ["ruijie-networks", "arista-networks", "giganet"],
    related: ["networking-structured-cabling", "cybersecurity-solutions", "internet-service-management"],
  },
  {
    slug: "cybersecurity-solutions",
    title: "Cybersecurity Solutions",
    icon: "shield",
    category: "security",
    shortDescription: "Firewalls, endpoint protection and secure access that keep networks, users and data protected.",
    intro:
      "Protect your network, users and data with layered security designed, deployed and maintained by our engineers.",
    capabilities: ["Next-generation firewall deployment", "Endpoint protection", "Secure remote access", "Email and web protection"],
    applications: ["Head-office and branch perimeter security", "Protecting finance and customer data", "Securing hybrid and remote workforces", "Guest network segmentation"],
    benefits: ["Reduced risk of malware and unauthorised access", "Visibility of traffic and threats", "Business continuity", "Locally supported security"],
    partners: ["sophos", "microsoft-365"],
    related: ["access-points-enterprise-switching", "physical-security-systems", "professional-technology-training"],
  },
  {
    slug: "physical-security-systems",
    title: "Physical Security Systems",
    icon: "cctv",
    category: "security",
    shortDescription: "Surveillance, access control and safety systems integrated with your network and operations.",
    intro: "Protect people, premises and assets with physical security systems that work hand in hand with your IT infrastructure.",
    capabilities: ["Video surveillance (CCTV / IP cameras)", "Access control systems", "Recording and video storage", "System integration with the network"],
    applications: ["Offices and corporate facilities", "Warehouses and industrial sites", "Schools and campuses", "Multi-site organisations"],
    benefits: ["Improved site safety", "Centralised monitoring", "Recorded evidence when you need it", "One partner for IT and physical security"],
    partners: ["honeywell"],
    related: ["data-centre-infrastructure-storage", "networking-structured-cabling", "cybersecurity-solutions"],
  },
  {
    slug: "networking-structured-cabling",
    title: "Networking and Structured Cabling",
    icon: "network",
    category: "networking",
    shortDescription: "Copper and fibre cabling, racks and pathways installed to standard, labelled and documented.",
    intro: "A well-designed cabling system supports every device and service on your network for years. We design and install structured cabling that is tidy, tested and documented.",
    capabilities: ["Copper (Cat6/Cat6A) cabling", "Fibre optic backbone installation", "Rack, cabinet and patching installation", "Testing, labelling and documentation"],
    applications: ["New office fit-outs", "Network upgrades and relocations", "Server rooms and data centres", "Campus backbones"],
    benefits: ["Reliable performance", "Easier troubleshooting and moves", "Ready for future upgrades", "Clean, professional installations"],
    partners: ["siemon"],
    related: ["access-points-enterprise-switching", "data-centre-infrastructure-storage", "physical-security-systems"],
  },
  {
    slug: "data-centre-infrastructure-storage",
    title: "Data Centre Infrastructure and Storage",
    icon: "server",
    category: "infrastructure",
    shortDescription: "Server rooms, network storage and backup built for availability and dependable data protection.",
    intro: "Keep critical data available and protected with data centre infrastructure and storage designed around your workloads.",
    capabilities: ["Server room and rack infrastructure", "Network-attached storage (NAS)", "Backup and data protection", "Data centre switching"],
    applications: ["File sharing and collaboration", "Video surveillance storage", "Backup and recovery", "Virtualised workloads"],
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
    partners: ["24-online-wireless"],
    related: ["access-points-enterprise-switching", "cybersecurity-solutions", "professional-technology-training"],
  },
  {
    slug: "professional-technology-training",
    title: "Professional Technology Training",
    icon: "graduation",
    category: "training",
    shortDescription: "Practical courses that build in-house skills on the platforms your team operates every day.",
    intro: "Build the confidence and capability of your team with practical training on the technologies they operate.",
    capabilities: ["Networking fundamentals", "Security awareness and administration", "Platform-specific administration", "Handover training for deployed systems"],
    applications: ["IT teams and administrators", "New system handovers", "Graduate and early-career engineers", "End-user awareness"],
    benefits: ["Stronger in-house skills", "Faster issue resolution", "Better use of your technology investment", "Reduced dependency on external support"],
    partners: [],
    related: ["cybersecurity-solutions", "access-points-enterprise-switching", "internet-service-management"],
  },
];

const categories = [
  { slug: "networking", name: "Networking & Connectivity", order: 1 },
  { slug: "security", name: "Security", order: 2 },
  { slug: "infrastructure", name: "Infrastructure", order: 3 },
  { slug: "connectivity", name: "Internet Services", order: 4 },
  { slug: "training", name: "Training", order: 5 },
];

/** @type {{ slug: string; name: string; category: string }[]} */
const partners = [
  { slug: "ruijie-networks", name: "Ruijie Networks", category: "NETWORKING" },
  { slug: "arista-networks", name: "Arista Networks", category: "NETWORKING" },
  { slug: "giganet", name: "GIGANET", category: "NETWORKING" },
  { slug: "sophos", name: "Sophos", category: "SECURITY" },
  { slug: "honeywell", name: "Honeywell", category: "PHYSICAL_SECURITY" },
  { slug: "siemon", name: "Siemon", category: "CABLING" },
  { slug: "qnap", name: "QNAP", category: "STORAGE" },
  { slug: "24-online-wireless", name: "24 Online Wireless", category: "CONNECTIVITY" },
  { slug: "microsoft-365", name: "Microsoft 365", category: "CLOUD_PRODUCTIVITY" },
  // Category to be confirmed by Favent Magna:
  { slug: "sprintly", name: "Sprintly", category: "OTHER" },
  { slug: "zyteco", name: "Zyteco", category: "OTHER" },
  { slug: "ray", name: "RAY", category: "OTHER" },
];

const solutions = [
  { slug: "secure-campus-office-connectivity", title: "Secure campus & office connectivity", icon: "building", summary: "Cabling, switching, Wi-Fi and firewall delivered as one network.", services: ["networking-structured-cabling", "access-points-enterprise-switching", "cybersecurity-solutions"] },
  { slug: "surveillance-access-control", title: "Surveillance & access control", icon: "cctv", summary: "Cameras, entry systems and recording storage on a dependable network.", services: ["physical-security-systems", "data-centre-infrastructure-storage"] },
  { slug: "data-protection-continuity", title: "Data protection & business continuity", icon: "database", summary: "Network storage, backup and security policies that keep data available.", services: ["data-centre-infrastructure-storage", "cybersecurity-solutions"] },
  { slug: "managed-internet-guest-wifi", title: "Managed internet & guest Wi-Fi", icon: "globe", summary: "Hotspot, bandwidth and user controls for shared and public connectivity.", services: ["internet-service-management", "access-points-enterprise-switching"] },
];

// DRAFT — seeded unpublished. Publish only the sectors actually served.
const industries = [
  "Corporate & enterprise", "Financial services", "Education", "Healthcare",
  "Hospitality", "Government & public sector", "Energy & industrial", "Retail & multi-site",
];

const pages = [
  { path: "/", name: "Home", metaTitle: "Favent Magna Nigeria Limited | Technology Infrastructure, Security & Connectivity" },
  { path: "/about", name: "About Us", heading: "About Favent Magna", intro: "[Replace with the company introduction from the existing website.]" },
  { path: "/services", name: "Our Services", heading: "Our Services", intro: "Seven disciplines delivered by one integrated team — from wireless and switching to security, cabling, storage, internet management and training." },
  { path: "/solutions", name: "Business Solutions", heading: "Business Solutions", intro: "Our services combined around the outcomes organisations need." },
  { path: "/partners", name: "Technology Partners", heading: "Technology Partners", intro: "The platforms we design, deploy and support." },
  { path: "/industries", name: "Industries We Serve", heading: "Industries We Serve", intro: "Infrastructure for organisations that can't afford downtime." },
  { path: "/projects", name: "Projects & Case Studies", heading: "Projects & Case Studies", intro: "Selected work delivered by our team." },
  { path: "/training", name: "Training", heading: "Professional Technology Training", intro: "Practical programmes that build in-house skills on the platforms your team operates every day." },
  { path: "/contact", name: "Contact Us", heading: "Speak With Our Team", intro: "Tell us about your requirements and our engineers will get back to you." },
  { path: "/privacy", name: "Privacy Notice", heading: "Privacy Notice" },
];

async function main() {
  await prisma.siteSetting.upsert({
    where: { id: 1 },
    update: {},
    create: {
      id: 1,
      companyName: "Favent Magna Nigeria Limited",
      tagline: "Technology infrastructure, security and connectivity.",
      heroEyebrow: "Enterprise Technology · Nigeria",
      heroHeadline: "Technology Infrastructure. Security. Connectivity. Delivered.",
      heroSubtext: "Empowering organisations with integrated technology solutions, secure infrastructure and dependable digital connectivity.",
      introHeading: "One partner for the infrastructure your organisation runs on.",
      introBody:
        "Favent Magna Nigeria Limited designs, deploys and supports enterprise technology infrastructure — from wireless access and switching to cybersecurity, physical security, structured cabling, data centre storage, internet service management and professional training.",
      whyItems: [
        "One accountable partner | Network, security, cabling, storage and connectivity scoped and delivered by a single team.",
        "Vendor-diverse choice | A broad platform ecosystem means solutions fit your requirements and budget — not one brand's catalogue.",
        "Designed to be supported | Documented installs and clean handovers make every system easier to run, extend and troubleshoot.",
        "Skills that stay with you | Professional training builds your team's confidence on the technology we deploy.",
      ],
      approachSteps: [
        "Assess | Site survey and requirements gathering with your stakeholders.",
        "Design | Architecture, bill of materials and a costed proposal.",
        "Deploy | Installation, configuration and testing on site.",
        "Train & hand over | Documentation and hands-on training for your team.",
        "Support | Ongoing maintenance, upgrades and expansion.",
      ],
      ctaHeading: "Planning your next infrastructure project?",
      ctaBody: "Book a consultation and our engineers will review your requirements and recommend the right approach.",
      address: null, // [ADD OFFICE ADDRESS IN ADMIN → SITE SETTINGS]
      phone: null,
      whatsapp: null,
      email: null,
      defaultMetaTitle: "Favent Magna Nigeria Limited",
      defaultMetaDesc:
        "Favent Magna Nigeria Limited delivers enterprise networking, cybersecurity, physical security, structured cabling, data centre storage, internet service management and technology training.",
    },
  });

  for (const p of pages) {
    await prisma.page.upsert({ where: { path: p.path }, update: {}, create: p });
  }

  for (const c of categories) {
    await prisma.serviceCategory.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }

  for (const [i, p] of partners.entries()) {
    await prisma.partner.upsert({ where: { slug: p.slug }, update: {}, create: { ...p, order: i } });
  }

  // services first without relations to related services (they may not exist yet)
  for (const [i, s] of services.entries()) {
    const category = await prisma.serviceCategory.findUnique({ where: { slug: s.category } });
    const data = {
      title: s.title,
      icon: s.icon,
      shortDescription: s.shortDescription,
      intro: s.intro,
      capabilities: s.capabilities,
      applications: s.applications,
      benefits: s.benefits,
      order: i + 1,
      categoryId: category?.id ?? null,
      partners: { connect: s.partners.map((slug) => ({ slug })) },
    };
    await prisma.service.upsert({ where: { slug: s.slug }, update: {}, create: { slug: s.slug, ...data } });
  }
  for (const s of services) {
    await prisma.service.update({
      where: { slug: s.slug },
      data: { related: { set: s.related.map((slug) => ({ slug })) } },
    });
  }

  for (const [i, s] of solutions.entries()) {
    await prisma.solution.upsert({
      where: { slug: s.slug },
      update: {},
      create: { slug: s.slug, title: s.title, summary: s.summary, icon: s.icon, order: i, services: { connect: s.services.map((slug) => ({ slug })) } },
    });
  }

  for (const [i, name] of industries.entries()) {
    const slug = name.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    await prisma.industry.upsert({ where: { slug }, update: {}, create: { name, slug, order: i, published: false } });
  }

  const email = process.env.SEED_ADMIN_EMAIL;
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (email && password) {
    if (password.length < 12) throw new Error("SEED_ADMIN_PASSWORD must be at least 12 characters.");
    const existing = await prisma.admin.findUnique({ where: { email: email.toLowerCase() } });
    if (!existing) {
      await prisma.admin.create({
        data: {
          email: email.toLowerCase(),
          name: process.env.SEED_ADMIN_NAME || "Site Administrator",
          passwordHash: await bcrypt.hash(password, 12),
          role: "SUPER_ADMIN",
        },
      });
      console.log(`Created super admin ${email}`);
    }
  } else {
    console.warn("SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD not set — no admin created. Run `npm run admin:create` later.");
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
