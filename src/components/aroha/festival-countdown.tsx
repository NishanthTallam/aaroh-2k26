"use client";

import { useState, useEffect } from "react";
import { Clock } from "lucide-react";

export function FestivalCountdown() {
  // Target date: October 14, 2026 (14-10-2026) 09:00 AM IST
  const targetTime = new Date("2026-10-14T09:00:00+05:30").getTime();

  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = Date.now();
      const difference = targetTime - now;

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor(
            (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          ),
          minutes: Math.floor(
            (difference % (1000 * 60 * 60)) / (1000 * 60)
          ),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());
    setMounted(true);

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(interval);
  }, [targetTime]);

  const formatNumber = (num: number) => String(num).padStart(2, "0");

  return (
    <section className="bg-[#1A1512] border-y border-[#D4A72C]/30 py-8 px-6">
      <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-center gap-8 md:gap-16">
        <div className="text-xs font-bold tracking-[0.25em] text-[#E5BE45] uppercase flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#E5BE45]" />
          THE FESTIVAL BEGINS IN • OCT 14, 2026
        </div>

        <div className="flex items-center gap-6 md:gap-10">
          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {mounted ? formatNumber(timeLeft.days) : "00"}
            </strong>
            <span className="text-[10px] tracking-[0.2em] text-[#FFF9EF]/50 mt-1 uppercase">
              DAYS
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[#D4A72C]/30 hidden sm:block" />

          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {mounted ? formatNumber(timeLeft.hours) : "00"}
            </strong>
            <span className="text-[10px] tracking-[0.2em] text-[#FFF9EF]/50 mt-1 uppercase">
              HOURS
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[#D4A72C]/30 hidden sm:block" />

          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {mounted ? formatNumber(timeLeft.minutes) : "00"}
            </strong>
            <span className="text-[10px] tracking-[0.2em] text-[#FFF9EF]/50 mt-1 uppercase">
              MINUTES
            </span>
          </div>

          <div className="w-[1px] h-8 bg-[#D4A72C]/30 hidden sm:block" />

          <div className="flex flex-col items-center">
            <strong className="font-serif text-4xl md:text-5xl font-bold text-[#FFF9EF] leading-none">
              {mounted ? formatNumber(timeLeft.seconds) : "00"}
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

