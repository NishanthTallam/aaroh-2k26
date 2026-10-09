import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export function EventMarquee() {
  return (
    <section className="bg-[#111111] py-20 md:py-24 px-6 md:px-14 overflow-hidden border-y border-white/10">
      {/* Decorative Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 text-[#E5BE45]">
          <div className="h-px flex-1 bg-[#D4A72C]/40" />
          <span className="text-xs font-bold tracking-[0.25em] uppercase whitespace-nowrap">
            AAROH 2K26 FESTIVAL
          </span>
          <div className="h-px flex-1 bg-[#D4A72C]/40" />
        </div>
        <h2 className="mt-3 font-serif text-3xl sm:text-4xl text-center text-[#FFF9EF] font-bold tracking-tight">
          DON'T MISS <span className="text-[#E5BE45] italic">THE MOMENTS.</span>
        </h2>
      </div>

      {/* Rotating Marquee */}
      <div className="flex overflow-hidden w-full py-4 group">
        {/* Continuous Rotation Wrapper */}
        <div className="flex items-center justify-center animate-[marquee_20s_linear_infinite]">
          {/* Content repeated twice for seamless loop */}
          {[
            "CULTURALS • SPORTS • CREATIVE MEDIA • FOOD FEST",
            "CULTURALS • SPORTS • CREATIVE MEDIA • FOOD FEST"
          ].map((text, sectionIndex) => (
            <div key={sectionIndex} className="flex items-center whitespace-nowrap">
              {[...text.split(" • ")].map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center px-8">
                  {/* Text */}
                  <span className="font-mono text-lg md:text-xl font-medium text-white drop-shadow-md">
                    {item}
                  </span>
                  {/* Decorative Star */}
                  <span className="ml-4 w-1 h-1 rounded-full bg-[#E5BE45] animate-[pulse_2s_infinite]"></span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-8 max-w-7xl mx-auto text-center">
        <Link
          href="/events"
          className="inline-flex items-center gap-3 px-8 py-4 bg-[#E5BE45] text-[#111111] font-bold text-sm tracking-[0.2em] uppercase rounded-full hover:bg-[#D4A72C] hover:scale-105 transition-all shadow-lg"
        >
          <span>View Full Schedule</span>
          <ArrowRight className="w-4 h-4" />
          <Sparkles className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

