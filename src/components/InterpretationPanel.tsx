"use client";

import { getInterpretation } from "@/lib/matrixInterpretations";
import { MatrixResult } from "@/lib/matrixCalculations";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Heart, Star, Coins, Sparkles, Shield, Users, Eye, Compass, Calendar, Brain, Zap, Activity } from "lucide-react";

interface InterpretationPanelProps {
  result: MatrixResult;
}

const InterpretationPanel = ({ result }: InterpretationPanelProps) => {
  const sections = [
    { label: "Soul Comfort", number: result.soulComfort, desc: "Your inner peace and soul's resting state — the energy you return to when you feel safe and relaxed", icon: Heart },
    { label: "First Impression", number: result.firstImpression, desc: "How others perceive you at first meeting — your energetic signature in social situations", icon: Eye },
    { label: "Karmic Tasks & Previous Life", number: result.karmicTasks, desc: "Lessons carried from past incarnations — the work your soul has committed to completing in this lifetime", icon: Shield },
    { label: "Relationship Energy", number: result.relationship, desc: "How you experience love, intimacy, and partnership — your patterns in romantic relationships", icon: Heart },
    { label: "Money & Career", number: result.money, desc: "Your relationship with wealth, abundance, and career path — how you attract and manage material resources", icon: Coins },
    { label: "Talents & Strengths", number: result.talents, desc: "Your natural gifts, abilities, and innate skills — the areas where you excel effortlessly", icon: Star },
    { label: "Relationship with Parents", number: result.parentsRelation, desc: "Family dynamics and parental energy — how your upbringing shapes your patterns and beliefs", icon: Users },
    { label: "Personal Purpose", number: result.personalPurpose, desc: "Your core life mission — the unique contribution you are meant to make in this lifetime", icon: Compass },
    { label: "Sky Purpose", number: result.skyPurpose, desc: "Your spiritual direction and higher calling — the transcendent purpose that guides your soul's evolution", icon: Sparkles },
    { label: "Earth Purpose", number: result.earthPurpose, desc: "Your material direction and worldly mission — how you are meant to serve and contribute in practical terms", icon: Brain },
    { label: "Center Energy", number: result.center, desc: "Your core essence and true self — the fundamental energy that defines who you are at the deepest level", icon: Zap },
    { label: "Comfort Zone", number: result.comfortZone, desc: "Your default energy pattern — the familiar behaviors and situations you gravitate toward", icon: Shield },
    { label: "Personal Year Forecast", number: result.personalYear, desc: `Energy theme for ${new Date().getFullYear()} — how this year's energy interacts with your matrix (age ${result.currentAge})`, icon: Calendar },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <h3 className="mb-6 font-display text-2xl text-foreground">
        Your Destiny Matrix <span className="text-gradient-primary">Interpretation</span>
      </h3>
      <Accordion type="single" collapsible className="space-y-2">
        {sections.map((section, i) => {
          const interp = getInterpretation(section.number);
          const Icon = section.icon;
          return (
            <AccordionItem
              key={i}
              value={`item-${i}`}
              className="rounded-xl border border-border bg-gradient-card px-4 shadow-soft"
            >
              <AccordionTrigger className="py-4 hover:no-underline">
                <div className="flex items-center gap-3 text-left">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Icon className="h-4 w-4 text-primary" />
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-sans text-sm font-semibold text-foreground">{section.label}</p>
                      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 font-display text-xs text-accent">
                        {section.number}
                      </span>
                    </div>
                    <p className="font-sans text-xs text-muted-foreground">{interp.name} — {section.desc}</p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="pb-5">
                <div className="space-y-4 pl-[52px] text-sm text-muted-foreground">
                  {/* Archetype & Keywords */}
                  <div>
                    <p className="mb-2 font-semibold text-primary text-base">{interp.archetype}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {interp.keywords.map((kw, j) => (
                        <span key={j} className="rounded-full bg-secondary px-2.5 py-0.5 text-xs text-foreground">{kw}</span>
                      ))}
                    </div>
                  </div>

                  {/* Element & Body */}
                  <div className="flex gap-4 text-xs">
                    <span className="flex items-center gap-1"><Activity className="h-3 w-3 text-accent" /> Element: <strong className="text-foreground">{interp.element}</strong></span>
                    <span className="flex items-center gap-1"><Heart className="h-3 w-3 text-accent" /> Body: <strong className="text-foreground">{interp.bodyArea}</strong></span>
                  </div>

                  {/* Positive */}
                  <div>
                    <p className="mb-1.5 font-medium text-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" /> In Balance (Positive)
                    </p>
                    <p className="leading-relaxed">{interp.positive}</p>
                  </div>

                  {/* Negative */}
                  <div>
                    <p className="mb-1.5 font-medium text-foreground flex items-center gap-1.5">
                      <span className="h-1.5 w-1.5 rounded-full bg-destructive" /> Out of Balance (Negative)
                    </p>
                    <p className="leading-relaxed">{interp.negative}</p>
                  </div>

                  {/* Advice */}
                  <div className="rounded-lg bg-primary/5 border border-primary/10 p-4">
                    <p className="font-medium text-primary text-xs uppercase tracking-wider mb-1.5">✦ Practical Advice</p>
                    <p className="leading-relaxed">{interp.advice}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </motion.div>
  );
};

export default InterpretationPanel;
