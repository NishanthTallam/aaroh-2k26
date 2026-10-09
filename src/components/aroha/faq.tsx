"use client";

import { useState } from "react";

export function FAQ() {
  const faqs = [
    {
      q: "When is Aaroh 2K26?",
      a: "Aaroh 2K26 is a premier three-day inter-college festival scheduled for April 15–17, 2026.",
    },
    {
      q: "Where will the festival take place?",
      a: "The festival takes place across the University Campus, with major arenas including the Main Amphitheatre, Sports Complex Turf, Auditorium Hall A, and the Food Street Courtyard.",
    },
    {
      q: "How can I register for events?",
      a: "Sign in with your participant account, select any published event, verify the auto-calculated fee, scan the payment QR, upload your payment screenshot with UTR number, and your unique registration QR will be generated immediately.",
    },
    {
      q: "Are team events available?",
      a: "Yes! Events are categorized as SOLO, TEAM, or BOTH. For team events, the team captain can dynamically add all team members with their details.",
    },
    {
      q: "Where can I find the schedule and event rules?",
      a: "Full schedules and detailed event rules are available on the Schedule page and on each dedicated event page.",
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div>
      <span className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase block mb-3">
        FREQUENTLY ASKED QUESTIONS
      </span>
      <h2 className="font-serif text-4xl sm:text-5xl font-bold tracking-wide text-[#FFF9EF] mb-8">
        GOT QUESTIONS?
      </h2>

      <div className="flex flex-col divide-y divide-[#FFF9EF]/10">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={faq.q} className="py-5">
              <button
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="w-full text-left flex justify-between items-center text-lg md:text-xl font-semibold text-[#FFF9EF] hover:text-[#E5BE45] transition-colors"
              >
                <span>{faq.q}</span>
                <span className="text-2xl text-[#E5BE45] ml-4">
                  {isOpen ? "−" : "+"}
                </span>
              </button>
              {isOpen && (
                <p className="mt-3 text-sm md:text-base text-[#FFF9EF]/70 leading-relaxed max-w-xl">
                  {faq.a}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
