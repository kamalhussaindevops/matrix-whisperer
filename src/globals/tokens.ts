// Design Tokens — Matrix of Destiny
// Source of truth for all color, typography, spacing, radius, and shadow values.
// These values must be applied with pixel-perfect fidelity. Do not approximate any value.

export const colors = {
  brand: {
    primary: '#4f46e5',
    hover: '#4338ca',
    deep: '#1e1b4b',
    tint: '#e0e7ff',
    wash: '#eef2ff',
  },
  hero: {
    gradStart: '#667eea',
    gradEnd: '#764ba2',
    gradient: 'linear-gradient(135deg,#667eea 0%,#764ba2 100%)',
    trustBadge: 'rgba(255,255,255,0.2)',
  },
  bg: {
    page: '#f8f9fc',
    card: '#ffffff',
    testimonial: '#f1f5f9',
    footer: '#0f172a',
  },
  text: {
    body: '#1a1a2e',
    heading: '#0f172a',
    section: '#1e1b4b',
    nav: '#334155',
    muted: '#475569',
    subtle: '#64748b',
    footerBody: '#cbd5e1',
    footerLink: '#94a3b8',
    footerHead: '#ffffff',
  },
  border: {
    default: '#e2e8f0',
    input: '#cbd5e1',
    card: '#eef2ff',
    faq: '#e2e8f0',
    footerDiv: '#1e293b',
  },
  status: {
    star: '#fbbf24',
    error: '#dc2626',
    disabled: '#94a3b8',
  },
} as const;

export const radius = {
  input: '12px',
  testimonialCard: '20px',
  faqItem: '20px',
  card: '24px',
  calcCard: '24px',
  heroBottom: '32px',
  testimonialWrap: '32px',
  pill: '999px',
} as const;

export const shadows = {
  card: '0 4px 12px rgba(0,0,0,0.05)',
  cardHover: '0 20px 25px -12px rgba(0,0,0,0.1)',
  calcCard: '0 20px 35px -10px rgba(0,0,0,0.2)',
  testimonial: '0 2px 8px rgba(0,0,0,0.04)',
} as const;

export const type = {
  stack: "system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',sans-serif",
  stackWeb: "'Inter',system-ui,sans-serif",
  sizes: {
    heroH1: '2.5rem',
    heroH1Mob: '1.75rem',
    heroSub: '1.25rem',
    sectionTitle: '1.875rem',
    cardTitle: '1.35rem',
    body: '1rem',
    small: '0.875rem',
    badge: '0.7rem',
    xs: '0.75rem',
    copyright: '0.8rem',
  },
  weights: { hero: 800, sectionTitle: 700, cardTitle: 600, nav: 500, body: 400 },
  tracking: { hero: '-0.02em' },
  leading: { body: '1.5', relaxed: '1.65' },
} as const;

// Keep legacy exports for backward compatibility with existing components
export const typography = {
  fontStack: type.stack,
  fontStackWeb: type.stackWeb,
  sizes: {
    heroH1: type.sizes.heroH1,
    heroH1Mobile: type.sizes.heroH1Mob,
    heroSubtitle: type.sizes.heroSub,
    sectionTitle: type.sizes.sectionTitle,
    testimonialH: '1.75rem',
    cardTitle: type.sizes.cardTitle,
    faqQuestion: '1.125rem',
    body: type.sizes.body,
    navLink: '1rem',
    footerLink: type.sizes.small,
    badge: type.sizes.badge,
    trustBadge: type.sizes.small,
    genderNote: type.sizes.xs,
    copyright: type.sizes.copyright,
  },
  tracking: type.tracking,
  leading: type.leading,
} as const;

export const spacing = {
  sectionPadding: '48px 0',
  heroPadding: '60px 0 40px',
  containerMax: '1280px',
  containerPad: '0 24px',
} as const;
