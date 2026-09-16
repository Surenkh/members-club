export default function Chip({ icon, children, tone = "neutral", className = "" }) {
  const tones = {
    neutral: "bg-card-2 text-muted border-hairline-soft",
    indigo: "bg-indigo-soft text-indigo-bright border-transparent",
    teal: "bg-teal-soft text-teal border-transparent",
    violet: "bg-violet-soft text-violet border-transparent",
    gold: "bg-[rgba(232,195,126,0.14)] text-gold border-transparent",
  };
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-md border px-2.5 py-1 text-[11px] font-bold tracking-wide ${tones[tone]} ${className}`}
    >
      {icon ? <span className="ms text-[15px] leading-none">{icon}</span> : null}
      {children}
    </span>
  );
}
