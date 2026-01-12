"use client";

import { useState, useRef, useCallback } from "react";
import { ChevronDown } from "lucide-react";
import { gsap } from "gsap";

const faqs = [
  {
    question: "How do you review AI-generated code?",
    answer:
      "Every line gets reviewed before it ships. I read the code, understand what it does, test it, and verify it follows best practices. If Claude writes something questionable, I either fix it or regenerate it. The AI is fast, but I'm the quality gate.",
  },
  {
    question: "What if the AI makes a mistake?",
    answer:
      "It does. All the time. That's why review exists. AI is great at generating boilerplate, implementing patterns, and moving fast. It's not great at understanding your specific business logic or catching edge cases. That's my job.",
  },
  {
    question: "How do estimates work?",
    answer:
      "I use Monte Carlo simulation to generate probability ranges (P10/P50/P90) based on the complexity of what you're building. The wider the range, the more uncertainty in the scope. You'll see exactly what assumptions went into the estimate.",
  },
  {
    question: "What if the project scope changes?",
    answer:
      "Scope changes happen. We'll re-estimate and get your approval before proceeding. You can always defer features to stay on budget or timeline. No surprises.",
  },
  {
    question: "Do you offer ongoing support?",
    answer:
      "Yes. Every project includes a 30-day support period after launch. For ongoing development, I offer monthly retainers. Unused hours roll over for up to 2 months.",
  },
  {
    question: "Can I use my own designs?",
    answer:
      "Absolutely. If you have Figma designs or wireframes, I can implement them directly. Otherwise, we'll work through design during the Discovery phase.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "Modern web stack: React, Next.js, TypeScript, Node.js, and various databases (PostgreSQL, MongoDB, etc.). For mobile, React Native for cross-platform apps. I pick the right tool for the job, not whatever's trending.",
  },
  {
    question: "Is 'vibe coding' actually professional?",
    answer:
      "The term is tongue-in-cheek, but the work isn't. 25% of Y Combinator's W25 cohort shipped products that are 95% AI-coded. The question isn't whether AI-assisted development is professional—it's whether you're going to benefit from it or watch your competitors do it first.",
  },
];

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  const animateHeight = useCallback(
    (open: boolean) => {
      if (!contentRef.current || !textRef.current) return;

      if (open) {
        // Opening: animate from 0 to auto height
        gsap.set(contentRef.current, { height: "auto", overflow: "hidden" });
        const height = contentRef.current.offsetHeight;
        gsap.fromTo(
          contentRef.current,
          { height: 0 },
          {
            height: height,
            duration: 0.4,
            ease: "power2.out",
            onComplete: () => {
              gsap.set(contentRef.current, { height: "auto", overflow: "visible" });
            },
          }
        );
        gsap.fromTo(
          textRef.current,
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.3, delay: 0.1, ease: "power2.out" }
        );
      } else {
        // Closing: animate from current height to 0
        gsap.to(contentRef.current, {
          height: 0,
          duration: 0.3,
          ease: "power2.inOut",
          overflow: "hidden",
        });
        gsap.to(textRef.current, {
          opacity: 0,
          duration: 0.15,
        });
      }
    },
    []
  );

  // Trigger animation when isOpen changes
  const prevOpen = useRef(isOpen);
  if (prevOpen.current !== isOpen) {
    prevOpen.current = isOpen;
    // Use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => animateHeight(isOpen));
  }

  return (
    <div className="vibe-card-enhanced overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-6 text-left group"
        aria-expanded={isOpen}
      >
        <span className="text-white font-medium pr-4 group-hover:text-purple-300 transition-colors">
          {question}
        </span>
        <ChevronDown
          size={20}
          className={`flex-shrink-0 transition-all duration-300 ${
            isOpen ? "rotate-180 text-purple-400" : "text-zinc-500"
          }`}
        />
      </button>
      <div
        ref={contentRef}
        style={{ height: isOpen ? "auto" : 0, overflow: "hidden" }}
      >
        <div ref={textRef} className="px-6 pb-6" style={{ opacity: isOpen ? 1 : 0 }}>
          <p className="text-zinc-400 text-sm leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="bg-vibe-dark py-24 md:py-32 relative overflow-hidden">
      <div className="vibe-container px-6 relative">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="aura-hidden">
            <h2 className="text-display-premium text-white text-3xl md:text-5xl">
              Questions?
            </h2>
          </div>
        </div>

        {/* FAQ Accordion */}
        <div className="max-w-3xl mx-auto space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="aura-hidden">
              <FAQItem
                question={faq.question}
                answer={faq.answer}
                isOpen={openIndex === index}
                onToggle={() => toggle(index)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
