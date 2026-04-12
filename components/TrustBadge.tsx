export default function TrustBadge({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex items-center gap-2">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-5 w-5 text-[#C5A55A]"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      <span>{text}</span>
    </div>
  );
}
