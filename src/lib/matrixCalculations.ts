/**
 * Destiny Matrix Calculator Engine
 * 
 * Calculates the 22-energy matrix based on birth date.
 * Numbers are reduced to 1-22 range (based on Major Arcana energies).
 */

/** Reduce a number to 1-22 range */
export function reduceToArcana(num: number): number {
  while (num > 22) {
    num = String(num).split('').reduce((sum, d) => sum + parseInt(d), 0);
  }
  return num;
}

/** Sum digits of a number */
function sumDigits(num: number): number {
  return String(Math.abs(num)).split('').reduce((sum, d) => sum + parseInt(d), 0);
}

export interface ChakraRow {
  name: string;
  sanskrit: string;
  physics: number;
  energy: number;
  emotions: number;
}

export interface MatrixResult {
  birthDate: Date;
  name?: string;
  gender?: "M" | "F";
  /** Core numbers */
  day: number;
  month: number;
  year: number;
  /** Calculated positions */
  A: number; // top (day)
  B: number; // right (month)
  C: number; // bottom (year reduced)
  D: number; // left (sum of A+B+C)
  /** Center */
  center: number; // sum of A+B+C+D
  /** Diagonal intersections */
  E: number; // A+B
  F: number; // B+C
  G: number; // C+D
  H: number; // D+A
  /** Purpose line */
  skyPurpose: number;
  earthPurpose: number;
  personalPurpose: number;
  /** Comfort zone */
  comfortZone: number;
  /** Specific life areas */
  soulComfort: number;
  firstImpression: number;
  karmicTasks: number;
  relationship: number;
  money: number;
  talents: number;
  parentsRelation: number;
  /** Health chart */
  healthChart: ChakraRow[];
  /** Personal year */
  personalYear: number;
  currentAge: number;
  /** All unique energies */
  allNumbers: number[];
}

export interface CompatibilityResult {
  person1: MatrixResult;
  person2: MatrixResult;
  compatibilityScore: number;
  strengths: string[];
  challenges: string[];
  advice: string;
}

function calculatePersonalYear(birthDate: Date): number {
  const currentYear = new Date().getFullYear();
  const dayNum = birthDate.getDate();
  const monthNum = birthDate.getMonth() + 1;
  return reduceToArcana(sumDigits(dayNum) + sumDigits(monthNum) + sumDigits(currentYear));
}

function calculateHealthChart(A: number, B: number, C: number, D: number, E: number, F: number, G: number, H: number, center: number): ChakraRow[] {
  // Simplified chakra mapping based on matrix positions
  return [
    { name: "Crown", sanskrit: "Sahasrara", physics: reduceToArcana(A + center), energy: reduceToArcana(A + E), emotions: reduceToArcana(A + H) },
    { name: "Third Eye", sanskrit: "Ajna", physics: reduceToArcana(E + center), energy: reduceToArcana(A + B), emotions: reduceToArcana(E + F) },
    { name: "Throat", sanskrit: "Vishuddha", physics: reduceToArcana(B + center), energy: reduceToArcana(B + E), emotions: reduceToArcana(B + F) },
    { name: "Heart", sanskrit: "Anahata", physics: reduceToArcana(F + center), energy: reduceToArcana(B + C), emotions: reduceToArcana(F + G) },
    { name: "Solar Plexus", sanskrit: "Manipura", physics: reduceToArcana(C + center), energy: reduceToArcana(C + F), emotions: reduceToArcana(C + G) },
    { name: "Sacral", sanskrit: "Swadhisthana", physics: reduceToArcana(G + center), energy: reduceToArcana(C + D), emotions: reduceToArcana(G + H) },
    { name: "Root", sanskrit: "Muladhara", physics: reduceToArcana(D + center), energy: reduceToArcana(D + G), emotions: reduceToArcana(D + H) },
  ];
}

export function calculateMatrix(birthDate: Date, name?: string, gender?: "M" | "F"): MatrixResult {
  const day = birthDate.getDate();
  const month = birthDate.getMonth() + 1;
  const year = birthDate.getFullYear();

  const A = reduceToArcana(day);
  const B = reduceToArcana(month);
  const C = reduceToArcana(sumDigits(year));
  const D = reduceToArcana(A + B + C);

  const center = reduceToArcana(A + B + C + D);

  const E = reduceToArcana(A + B);
  const F = reduceToArcana(B + C);
  const G = reduceToArcana(C + D);
  const H = reduceToArcana(D + A);

  const skyPurpose = reduceToArcana(A + B);
  const earthPurpose = reduceToArcana(C + D);
  const personalPurpose = reduceToArcana(skyPurpose + earthPurpose);

  const comfortZone = reduceToArcana(E + F + G + H);

  // Additional life area calculations
  const soulComfort = reduceToArcana(center + A);
  const firstImpression = reduceToArcana(A + E);
  const karmicTasks = reduceToArcana(C + G);
  const relationship = reduceToArcana(F + center);
  const money = reduceToArcana(D + H);
  const talents = reduceToArcana(E + B);
  const parentsRelation = reduceToArcana(H + G);

  const healthChart = calculateHealthChart(A, B, C, D, E, F, G, H, center);
  const personalYear = calculatePersonalYear(birthDate);

  const now = new Date();
  const currentAge = now.getFullYear() - birthDate.getFullYear() -
    (now < new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate()) ? 1 : 0);

  const allNumbers = Array.from(new Set([A, B, C, D, center, E, F, G, H, personalPurpose])).sort((a, b) => a - b);

  return {
    birthDate, name, gender,
    day, month, year,
    A, B, C, D, center,
    E, F, G, H,
    skyPurpose, earthPurpose, personalPurpose,
    comfortZone,
    soulComfort, firstImpression, karmicTasks,
    relationship, money, talents, parentsRelation,
    healthChart, personalYear, currentAge,
    allNumbers,
  };
}

export function calculateCompatibility(date1: Date, date2: Date, name1?: string, name2?: string): CompatibilityResult {
  const person1 = calculateMatrix(date1, name1);
  const person2 = calculateMatrix(date2, name2);

  // Simple compatibility score based on matching numbers
  const shared = person1.allNumbers.filter(n => person2.allNumbers.includes(n));
  const score = Math.min(100, Math.round((shared.length / Math.max(person1.allNumbers.length, person2.allNumbers.length)) * 100 + 40));

  const strengths: string[] = [];
  const challenges: string[] = [];

  if (Math.abs(person1.center - person2.center) <= 3) strengths.push("Strong core energy alignment — you understand each other deeply.");
  else challenges.push("Different core energies — requires effort to understand each other's essence.");

  if (person1.relationship === person2.relationship) strengths.push("Identical relationship energy — natural romantic harmony.");
  if (shared.length >= 3) strengths.push(`You share ${shared.length} common energies, creating a strong bond.`);

  if (person1.comfortZone !== person2.comfortZone) challenges.push("Different comfort zones — growth opportunity through contrast.");
  if (Math.abs(person1.money - person2.money) > 5) challenges.push("Different attitudes toward money and material security.");

  if (strengths.length === 0) strengths.push("Your differences create complementary strengths.");
  if (challenges.length === 0) challenges.push("Maintain individual identities while building together.");

  const advice = score >= 70
    ? "Your energies are naturally aligned. Focus on shared goals and maintain open communication."
    : "Your differences are your strength. Embrace each other's unique qualities and learn from the contrast.";

  return { person1, person2, compatibilityScore: score, strengths, challenges, advice };
}
