export interface Testimonial {
  name: string;
  role: string;
  location: string;
  text: string;
  rating: number;
  initials: string;
  color: string;
  tags: string[]; // calculator types this testimonial is relevant to
}

export const allTestimonials: Testimonial[] = [
  { name: "Sarah M.", role: "Life Coach", location: "United States", text: "The health chart blew my mind — I use the personal matrix with every client now. The accuracy is unreal.", rating: 5, initials: "SM", color: "#7c3aed", tags: ["personal"] },
  { name: "Marco R.", role: "Yoga Teacher", location: "Italy", text: "The compatibility calculator revealed dynamics I never noticed. It saved my relationship, honestly.", rating: 5, initials: "MR", color: "#2563eb", tags: ["compatibility"] },
  { name: "Priya K.", role: "Astrology Enthusiast", location: "India", text: "The arcana calculator showed me my dominant archetype and shadow energy — it explained so much about my patterns.", rating: 5, initials: "PK", color: "#059669", tags: ["arcana"] },
  { name: "Elena V.", role: "Mother of Two", location: "Germany", text: "The child matrix helped me understand my daughter's emotional needs and learning style. A parenting game-changer.", rating: 5, initials: "EV", color: "#d97706", tags: ["child"] },
  { name: "James L.", role: "UX Designer", location: "Australia", text: "Clean design, instant results, genuinely helpful interpretations. This is my go-to calculator — bookmarked forever.", rating: 5, initials: "JL", color: "#dc2626", tags: ["personal", "arcana"] },
  { name: "Aisha B.", role: "Wellness Blogger", location: "UK", text: "The karmic calculator revealed debt patterns I've been repeating for years. The release point reading changed my approach.", rating: 5, initials: "AB", color: "#0891b2", tags: ["karmic"] },
  { name: "David K.", role: "Entrepreneur", location: "Canada", text: "The money line reading was spot-on. I restructured decisions around the insights and saw real improvements in months.", rating: 5, initials: "DK", color: "#4f46e5", tags: ["personal", "karmic"] },
  { name: "Yuki T.", role: "Therapist", location: "Japan", text: "I recommend the compatibility calculator to every couple I work with. It gives language to patterns they struggle to express.", rating: 5, initials: "YT", color: "#be185d", tags: ["compatibility"] },
  { name: "Sofia A.", role: "Numerology Student", location: "Brazil", text: "The arcana guide and shadow energy reading are unlike anything I've seen. This goes way beyond basic numerology.", rating: 5, initials: "SA", color: "#7c3aed", tags: ["arcana"] },
  { name: "Lucas N.", role: "Primary School Teacher", location: "France", text: "Understanding my students' child matrices has completely changed how I approach their learning and behavior.", rating: 5, initials: "LN", color: "#059669", tags: ["child"] },
];

export function getTestimonialsForTab(tab: string): Testimonial[] {
  const tagged = allTestimonials.filter((t) => t.tags.includes(tab));
  if (tagged.length >= 3) return tagged;
  // Pad with general ones if not enough specific ones
  const rest = allTestimonials.filter((t) => !t.tags.includes(tab));
  return [...tagged, ...rest].slice(0, 4);
}
