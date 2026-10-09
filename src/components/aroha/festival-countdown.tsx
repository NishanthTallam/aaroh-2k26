"use client";

import { useState, useEffect } from "react";

export function FestivalCountdown() {
  const [timeLeft, setTimeLeft] = useState({
    days: 3,
    hours: 12,
    minutes: 48,
    seconds: 32,
  });

  useEffect(() => {
    // Set target date for Aaroh 2K26
    const target = new Date("2026-04-15T09:00:00Z").getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="bg-[#1A1512] border-y border-[#D4A72C]/30 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
        <div className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase">
          THE FESTIVAL BEGINS IN
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {formatNumber(timeLeft.days)}
            </strong>
            <span className="text-[10px] tracking-[0.2em] text-[#FFF9EF]/50 mt-1 uppercase">
              DAYS
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[#D4A72C]/30 hidden sm:block" />

          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {formatNumber(timeLeft.hours)}
            </strong>
            <span className="text-[10px] tracking-[0.2em] text-[#FFF9EF]/50 mt-1 uppercase">
              HOURS
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[#D4A72C]/30 hidden sm:block" />

          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {formatNumber(timeLeft.minutes)}
            </strong>
            <span className="text-[10px] tracking-[0.2em] text-[#FFF9EF]/50 mt-1 uppercase">
              MINUTES
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[#D4A72C]/30 hidden sm:block" />

          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {formatNumber(timeLeft.seconds)}
            </strong>
            <span className="text-[10px] tracking-[0.2em] text-[#FFF9EF]/50 mt-1 uppercase">
              SECONDS
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
