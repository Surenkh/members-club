import { useState } from "react";

const SLIDES = [
  { icon: "emoji_events", title: "Competitions", text: "Members-only draws with automatic entries. Browse every prize free.", image: "/assets/comp-porsche.jpg" },
  { icon: "loyalty", title: "Partner perks", text: "Discounts and passes from partner brands. Claim in seconds.", image: "/assets/part-verve.jpg" },
  { icon: "casino", title: "Daily rewards", text: "One spin a day plus streak rewards that grow all week.", image: "/assets/stmoritz.jpg" },
  { icon: "leaderboard", title: "Leaderboards", text: "Weekly and Championship boards. XP only comes from real actions.", image: "/assets/ap.jpg" },
];

// Optional, skippable introduction. Information only; grants no benefits.
export default function Onboarding({ onDone }) {
  const [i, setI] = useState(0);
  const s = SLIDES[i];
  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-ink/95 sm:items-center" role="dialog" aria-modal="true" aria-label="How membership works">
      <div className="w-full max-w-md p-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
        <div className="overflow-hidden rounded-3xl border border-hairline bg-card">
          <img src={s.image} alt="" className="h-52 w-full object-cover" />
          <div className="p-5">
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, d) => (
                <span key={d} className={`h-1.5 flex-1 rounded-full ${d === i ? "bg-indigo-bright" : "bg-hairline-soft"}`} />
              ))}
            </div>
            <h2 className="mt-3 flex items-center gap-2 font-display text-xl font-bold text-fg">
              <span className="ms text-[22px] text-indigo-bright">{s.icon}</span> {s.title}
            </h2>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{s.text}</p>
            <div className="mt-4 flex gap-2">
              {i > 0 && (
                <button onClick={() => setI(i - 1)} className="rounded-xl border border-hairline px-5 py-3 text-sm font-bold text-muted">
                  Back
                </button>
              )}
              {i < SLIDES.length - 1 ? (
                <button onClick={() => setI(i + 1)} className="flex-1 rounded-xl bg-cta py-3 text-sm font-bold text-white">
                  Next
                </button>
              ) : (
                <button onClick={onDone} className="flex-1 rounded-xl bg-cta py-3 text-sm font-bold text-white">
                  Start exploring
                </button>
              )}
            </div>
            <button onClick={onDone} className="mt-2 w-full py-1 text-[12px] font-semibold text-faint">
              Skip introduction
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
