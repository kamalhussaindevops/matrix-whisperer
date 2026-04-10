export type ArcanaProfileEntry = {
  name: string;
  core: string;
  gift: string;
  lesson: string;
  relationship: string;
  money: string;
  talent: string;
  family: string;
};

export const ARCANA_PROFILE: Record<number, ArcanaProfileEntry> = {
  1: { name: "The Magician", core: "initiation and will", gift: "you start momentum quickly", lesson: "finish what you begin", relationship: "you need an active, inspired bond", money: "income grows through skill and self-direction", talent: "leadership, communication, invention", family: "you become the initiator in family decisions" },
  2: { name: "The High Priestess", core: "intuition and depth", gift: "you read subtle dynamics", lesson: "voice your needs clearly", relationship: "you seek emotional safety and honesty", money: "best results come from careful timing", talent: "analysis, research, spiritual guidance", family: "you notice hidden family patterns and mediate softly" },
  3: { name: "The Empress", core: "creation and nurture", gift: "you grow people and projects", lesson: "avoid over-giving", relationship: "you express love through care and beauty", money: "prosperity follows creative consistency", talent: "design, mentoring, growth strategy", family: "you are a source of warmth and support" },
  4: { name: "The Emperor", core: "structure and order", gift: "you build stable systems", lesson: "allow flexibility", relationship: "you value loyalty and reliability", money: "wealth accumulates through discipline", talent: "management, operations, planning", family: "you carry protector and provider energy" },
  5: { name: "The Hierophant", core: "values and tradition", gift: "you teach practical wisdom", lesson: "update beliefs when needed", relationship: "you seek trust and shared principles", money: "steady growth through service and expertise", talent: "teaching, counseling, guidance", family: "you help family members align around values" },
  6: { name: "The Lovers", core: "choice and alignment", gift: "you connect hearts and ideas", lesson: "choose decisively", relationship: "partnership is your growth mirror", money: "success comes through aligned collaborations", talent: "relationship building, diplomacy", family: "you heal distance through empathy" },
  7: { name: "The Chariot", core: "movement and victory", gift: "you execute under pressure", lesson: "balance speed with reflection", relationship: "you need shared direction", money: "wins come from focus and persistence", talent: "strategy, logistics, competitive execution", family: "you motivate family progress" },
  8: { name: "Strength", core: "inner power", gift: "you calm chaos with courage", lesson: "use power gently", relationship: "you need respect and emotional maturity", money: "stability comes from consistency", talent: "coaching, resilience leadership", family: "you hold emotional strength for others" },
  9: { name: "The Hermit", core: "wisdom and insight", gift: "you see long-term truth", lesson: "do not isolate too long", relationship: "you need depth, not noise", money: "expert positioning creates income", talent: "analysis, writing, mentoring", family: "you guide by thoughtful example" },
  10: { name: "Wheel of Fortune", core: "cycles and timing", gift: "you adapt quickly to change", lesson: "build routines through uncertainty", relationship: "you need flexibility and trust", money: "opportunity expands when you stay prepared", talent: "trend sensing, pivot strategy", family: "you teach resilience during transitions" },
  11: { name: "Justice", core: "truth and balance", gift: "you make fair decisions", lesson: "avoid harsh self-judgment", relationship: "you seek reciprocity and clarity", money: "strong through ethical decisions", talent: "law, policy, mediation", family: "you restore fairness and accountability" },
  12: { name: "The Hanged Man", core: "perspective and surrender", gift: "you transform through reframing", lesson: "act after reflection", relationship: "you need patience and emotional understanding", money: "growth appears after strategic pauses", talent: "deep problem solving, counseling", family: "you break cycles by changing viewpoint" },
  13: { name: "Death", core: "transformation", gift: "you renew systems and identities", lesson: "release what is complete", relationship: "you need honest evolution", money: "prosperity follows courageous resets", talent: "change management, reinvention", family: "you lead family transitions with clarity" },
  14: { name: "Temperance", core: "integration and harmony", gift: "you blend opposites effectively", lesson: "do not postpone decisions forever", relationship: "you create peaceful partnership", money: "steady expansion through moderation", talent: "facilitation, healing, synthesis", family: "you calm tension and restore balance" },
  15: { name: "The Devil", core: "desire and mastery", gift: "you can materialize big goals", lesson: "choose freedom over attachment", relationship: "you need healthy boundaries", money: "strong magnetism for resources", talent: "sales, influence, enterprise", family: "you expose and heal control patterns" },
  16: { name: "The Tower", core: "liberating truth", gift: "you remove false structures", lesson: "rebuild consciously", relationship: "you need authenticity over comfort", money: "reset then rebuild stronger", talent: "crisis leadership, diagnostics", family: "you end inherited illusions" },
  17: { name: "The Star", core: "hope and vision", gift: "you inspire and uplift", lesson: "anchor dreams in routine", relationship: "you need emotional openness", money: "flow through visibility and trust", talent: "creative direction, healing presence", family: "you restore optimism in family dynamics" },
  18: { name: "The Moon", core: "sensitivity and subconscious", gift: "you perceive what others miss", lesson: "separate fear from intuition", relationship: "you need emotional transparency", money: "best through creative and intuitive paths", talent: "psychology, art, storytelling", family: "you heal emotional undercurrents" },
  19: { name: "The Sun", core: "vitality and joy", gift: "you energize people naturally", lesson: "share spotlight generously", relationship: "you need warmth and play", money: "growth through confidence and visibility", talent: "teaching, leadership, performance", family: "you bring clarity and optimism" },
  20: { name: "Judgement", core: "calling and awakening", gift: "you hear life's deeper signal", lesson: "act on your calling", relationship: "you need purpose-centered partnership", money: "prosperity follows meaningful work", talent: "coaching, mission strategy", family: "you awaken family members to purpose" },
  21: { name: "The World", core: "mastery and completion", gift: "you connect systems globally", lesson: "avoid perfection paralysis", relationship: "you need shared long-term vision", money: "success through integrated ecosystems", talent: "systems design, global communication", family: "you unify diverse family perspectives" },
  22: { name: "The Fool", core: "faith and beginnings", gift: "you leap into new chapters bravely", lesson: "pair spontaneity with grounding", relationship: "you need freedom with commitment", money: "opportunities open through bold starts", talent: "innovation, entrepreneurship", family: "you introduce fresh paths into family legacy" },
};

export function profileFor(number: number): ArcanaProfileEntry {
  return ARCANA_PROFILE[number] ?? ARCANA_PROFILE[22];
}
