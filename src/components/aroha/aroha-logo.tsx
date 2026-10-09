import Link from "next/link";

interface ArohaLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function ArohaLogo({ className = "", size = "md" }: ArohaLogoProps) {
  const sizeClasses = {
    sm: "text-xl",
    md: "text-2xl md:text-3xl",
    lg: "text-4xl md:text-5xl",
  };

  return (
    <Link href="/" className={`inline-flex items-baseline gap-2 group ${className}`}>
      <span
        className={`font-serif font-bold tracking-[0.18em] text-[#FFF9EF] group-hover:text-[#E5BE45] transition-colors ${sizeClasses[size]}`}
      >
        AAROH
      </span>
      <span className="font-sans font-bold tracking-[0.25em] text-[#E5BE45] text-xs md:text-sm">
        2K26
      </span>
    </Link>
  );
}
