import { useState } from "react";
import { Link } from "react-router-dom";
import competitions from "../data/competitions.json";
import Chip from "../components/Chip";
import { CountdownChip } from "../components/Countdown";
import { drawTarget } from "../lib/draw";
import Modal from "../components/Modal";
import ImageWithSkeleton from "../components/ImageWithSkeleton";

export default function Competitions() {
  const [f, setF] = useState(() => {
    try {
      return sessionStorage.getItem("filter:competitions") || "all";
    } catch {
      return "all";
    }
  });
  const pick = (k) => {
    setF(k);
    try {
      sessionStorage.setItem("filter:competitions", k);
    } catch {}
  };
  const [winner, setWinner] = useState(null);
  const counts = {
    all: competitions.items.length,
    active: competitions.items.filter((c) => c.status === "active").length,
    upcoming: competitions.items.filter((c) => c.status === "upcoming").length,
    ended: competitions.items.filter((c) => c.status === "ended").length,
  };
  const list = competitions.items.filter((c) => {
    if (f === "all") return true;
    return c.status === f;
  });

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/" aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">Competitions</h1>
        </div>
      </div>

      <div className="scroll-thin mt-4 flex gap-2 overflow-x-auto pb-1">
        {competitions.filters.map((x) => (
          <button
            key={x.key}
            onClick={() => pick(x.key)}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-[12px] font-bold transition ${
              f === x.key ? "border-transparent bg-cta text-white" : "border-hairline bg-card text-muted"
            }`}
          >
            {x.label} <span className="tabular opacity-80">({counts[x.key]})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3.5">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-card p-10 text-center">
            <span className="ms text-[34px] text-faint">filter_list_off</span>
            <p className="mt-2 text-sm font-semibold text-fg">There are currently no draws matching this filter segment in your tier.</p>
          </div>
        )}
        {list.map((c) => (
          <div key={c.id} className="overflow-hidden rounded-2xl border border-hairline bg-card">
            {c.status === "ended" ? (
              <div className="p-4">
                <div className="flex items-center gap-2">
                  <Chip tone="teal" icon="verified">Winner Published</Chip>
                  <Chip icon="event_available">Completed Draw</Chip>
                </div>
                <p className="mt-3 text-[15px] font-bold text-fg">{c.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-muted">{c.subtitle}</p>
                <div className="mt-3 flex items-center justify-between rounded-xl border border-hairline-soft bg-card-2 px-3.5 py-3">
                  <div>
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-muted">
                      <span className="ms text-[14px]">military_tech</span> Official Result
                    </p>
                    <p className="mt-1 text-sm font-bold text-fg">Winner: {c.winner.name} <span className="font-semibold text-muted">({c.winner.ticket})</span></p>
                  </div>
                </div>
                <button onClick={() => setWinner(c)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-card-2 py-3 text-sm font-bold text-muted active:scale-[0.98]">
                  <span className="ms text-[18px]">visibility</span> {c.cta}
                </button>
              </div>
            ) : (
              <>
                <div className="relative">
                  <ImageWithSkeleton src={c.image} alt={c.title} className="h-44 w-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                  <div className="absolute left-3 top-3 flex items-center gap-2">
                    <CountdownChip to={drawTarget(c.id)} />
                  </div>
                  {c.autoEntries ? (
                    <div className="absolute right-3 top-3">
                      <Chip icon="confirmation_number">{c.autoEntries} Auto-Entries</Chip>
                    </div>
                  ) : null}
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-1.5">
                    <span className="rounded-md bg-ink/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-pale backdrop-blur">{c.badge}</span>
                    {c.tierChip ? (
                      <span className="rounded-md bg-ink/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-gold backdrop-blur">{c.tierChip}</span>
                    ) : null}
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-[15px] font-bold text-fg">{c.title}{c.titleSuffix ? ` ${c.titleSuffix}` : ""}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted">{c.subtitle}</p>
                  {c.autoAllocated ? (
                    <div className="mt-3 space-y-1.5">
                      <div className="flex items-center justify-between rounded-xl border border-hairline-soft bg-card-2 px-3.5 py-2.5">
                        <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                          <span className="ms text-[16px]">settings</span> Your Current Entries
                        </span>
                        <span className="text-[12px] font-bold tabular text-fg">{c.autoAllocated} Auto-Allocated</span>
                      </div>
                      {c.multiplier && (
                        <div className="flex items-center justify-between px-1 text-[11px] text-muted">
                          <span>Tier Multiplier: <span className="font-bold text-teal-pale">{c.multiplier} Boost Active</span></span>
                          {c.odds && <span>Draw Odds: <span className="font-bold tabular text-fg">1 in {c.odds.split(" ").pop()}</span></span>}
                        </div>
                      )}
                    </div>
                  ) : null}
                  {c.autoEntries ? (
                    <div className="mt-3 flex items-center justify-between rounded-xl border border-hairline-soft bg-card-2 px-3.5 py-2.5">
                      <span className="text-[12px] font-semibold text-muted">Entry Status</span>
                      <span className="text-[12px] font-bold tabular text-fg">{c.yourEntries} Entries Active</span>
                    </div>
                  ) : null}
                  <Link to={`/competitions/${c.id}`} className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-cta py-3 text-sm font-bold text-white active:scale-[0.98]">
                    {c.cta === "View Competition" ? null : <span className="ms text-[18px]">add_circle</span>}
                    {c.cta}
                    {c.cta === "View Competition" ? <span className="ms text-[18px]">arrow_forward</span> : null}
                  </Link>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      <Modal open={!!winner} onClose={() => setWinner(null)} labelledBy="winner-title">
        {winner && (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-pale">Completed Draw</p>
                <h2 id="winner-title" className="mt-1 text-lg font-bold text-fg">{winner.title}</h2>
              </div>
              <button onClick={() => setWinner(null)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
                <span className="ms">close</span>
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-hairline-soft bg-card p-4">
              <p className="flex items-center gap-2 text-sm font-bold text-fg">
                <span className="ms text-gold">military_tech</span> Winner published
              </p>
              <p className="mt-2 text-sm text-muted">{winner.winner.name}</p>
              <p className="mt-1 font-mono text-[12px] text-muted">{winner.winner.ticket}</p>
            </div>
            <button onClick={() => setWinner(null)} className="mt-4 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">Close</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
