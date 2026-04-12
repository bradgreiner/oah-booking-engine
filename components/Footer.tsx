import Link from "next/link";
import Image from "next/image";

const TRUST_BADGES = [
  { src: "/images/trust/airbnbsuperhosttrust.webp", alt: "Airbnb Superhost" },
  { src: "/images/trust/vrbopremierhosttrust.png", alt: "VRBO Premier Host" },
  { src: "/images/trust/30005starreviewstrust.webp", alt: "3,000+ Five-Star Reviews" },
  { src: "/images/trust/250Massetsundermanagementtrust.webp", alt: "$250M Assets Under Management" },
];

interface FooterProps {
  showBadges?: boolean;
}

export default function Footer({ showBadges = true }: FooterProps) {
  return (
    <footer className="border-t border-gray-200 bg-white">
      {/* Trust badges row — public pages only */}
      {showBadges && (
        <div className="flex flex-wrap items-center justify-center gap-8 border-b border-gray-100 px-4 py-6 mb-6">
          {TRUST_BADGES.map((badge) => (
            <div key={badge.alt} className="flex items-center justify-center">
              <Image
                src={badge.src}
                alt={badge.alt}
                width={120}
                height={40}
                unoptimized
                className="h-10 w-auto object-contain opacity-80 transition-opacity hover:opacity-100"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 pb-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="font-serif text-lg font-bold text-[#4C6C4E]">
              Open Air Homes
            </p>
            <p className="mt-1 text-sm text-gray-500">
              Premium short-term and monthly rental management
            </p>
            <p className="mt-2 text-sm text-gray-400">
              reservations@openairhomes.com
            </p>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <Link href="/search" className="hover:text-gray-700">
              Browse Homes
            </Link>
            <Link href="#" className="hover:text-gray-700">
              About
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Terms
            </Link>
            <Link href="#" className="hover:text-gray-700">
              Privacy
            </Link>
          </div>
        </div>
        <div className="mt-8 border-t border-gray-100 pt-6 text-xs text-gray-400">
          <p>
            Open Air Homes is a service of OpenAiRE Brokerage Inc. CA DRE
            #02164159
          </p>
          <p className="mt-1">
            &copy; 2026 Open Air Homes, Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
