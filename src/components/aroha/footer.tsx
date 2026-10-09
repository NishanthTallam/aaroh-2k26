import Link from "next/link";
import { ArohaLogo } from "./aroha-logo";

export function Footer() {
  return (
    <footer className="bg-[#0C0A09] border-t border-[#D4A72C]/20 pt-20 pb-10 px-6 md:px-14">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-16 border-b border-white/10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <ArohaLogo size="lg" />
            <p className="mt-4 text-sm text-[#FFF9EF]/60 max-w-sm">
              Where Culture Meets Celebration. Three days of culture, competition,
              creativity, and unforgettable festival energy.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-5">
              Navigation
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-[#FFF9EF]/70">
              <Link href="/#home" className="hover:text-[#E5BE45] transition-colors">Home</Link>
              <Link href="/#about" className="hover:text-[#E5BE45] transition-colors">About</Link>
              <Link href="/events" className="hover:text-[#E5BE45] transition-colors">Events</Link>
              <Link href="/schedule" className="hover:text-[#E5BE45] transition-colors">Schedule</Link>
              <Link href="/results" className="hover:text-[#E5BE45] transition-colors">Results</Link>
              <Link href="/#coordinates" className="hover:text-[#E5BE45] transition-colors">Coordinates</Link>
              <Link href="/#faq" className="hover:text-[#E5BE45] transition-colors">FAQ</Link>
            </div>
          </div>

          {/* Events */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-5">
              Events
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-[#FFF9EF]/70">
              <Link href="/events?category=CULTURAL" className="hover:text-[#E5BE45] transition-colors">Culturals</Link>
              <Link href="/events?category=SPORTS" className="hover:text-[#E5BE45] transition-colors">Sports</Link>
              <Link href="/events?category=CREATIVE_MEDIA" className="hover:text-[#E5BE45] transition-colors">Creative Media</Link>
              <Link href="/events?category=FOOD_FEST" className="hover:text-[#E5BE45] transition-colors">Food Fest</Link>
            </div>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-xs font-bold tracking-[0.2em] text-[#E5BE45] uppercase mb-5">
              Connect
            </h4>
            <div className="flex flex-col gap-2.5 text-sm text-[#FFF9EF]/70">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-[#E5BE45] transition-colors">Instagram</a>
              <a href="https://youtube.com" target="_blank" rel="noreferrer" className="hover:text-[#E5BE45] transition-colors">YouTube</a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-[#E5BE45] transition-colors">LinkedIn</a>
              <Link href="/auth/login" className="hover:text-[#E5BE45] transition-colors">Participant Login</Link>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF9EF]/40 tracking-wider">
          <span>© 2026 Aaroh 2K26. All rights reserved.</span>
          <span className="text-[#E5BE45]/60 font-medium">CELEBRATE • COMPETE • CREATE</span>
          <span>EST. 2026 • HYDERABAD</span>
        </div>
      </div>
    </footer>
  );
}
