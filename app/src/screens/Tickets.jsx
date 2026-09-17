import { useState } from "react";
import { Link } from "react-router-dom";
import competitions from "../data/competitions.json";
import { store } from "../lib/store";

export default function Tickets() {
  const [tab, setTab] = useState("Active");
  const purchased = store.tickets;
  const reserved = store.reserved;

  const groups = competitions.items.map((c) => {
    const mine = purchased.filter((t) => t.competitionId === c.id);
    const res = reserved.filter((r) => r.competitionId === c.id);
    const autoCount = c.autoAllocated || 0;
    const total = autoCount + mine.reduce((s, t) => s + t.entries, 0) + res.reduce((s, r) => s + r.entries, 0);
    return { c, mine, res, autoCount, total };
  });
  const active = groups.filter((g) => g.c.status !== "ended" && g.total > 0);
  const ended = groups.filter((g) => g.c.status === "ended");
  const shown = tab === "Active" ? active : ended;

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/account" aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </Link>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">My Tickets</h1>
      </div>

      <div className="mt-4 flex rounded-xl border border-hairline bg-card p-1">
        {["Active", "Past"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold transition ${tab === t ? "bg-cta text-white" : "text-muted"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {shown.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-card p-10 text-center">
            <span className="ms text-[34px] text-faint">confirmation_number</span>
            <p className="mt-2 text-sm font-semibold text-fg">{tab === "Active" ? "No active tickets yet" : "No past tickets"}</p>
            <Link to="/competitions" className="mt-1 inline-block text-[13px] font-bold text-indigo-bright">Explore competitions</Link>
          </div>
        )}
        {shown.map((g) => (
          <div key={g.c.id} className="overflow-hidden rounded-2xl border border-hairline bg-card">
            <Link to={`/competitions/${g.c.id}`} className="flex items-center gap-3 p-3.5">
              <img src={g.c.image} alt={g.c.title} className="h-14 w-14 shrink-0 rounded-xl object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-fg">{g.c.title}</p>
                <p className="mt-0.5 text-[11px] text-muted tabular">{g.total} entries · {g.c.status}</p>
              </div>
              <span className="ms text-faint">chevron_right</span>
            </Link>
            <div className="border-t border-hairline-soft px-3.5 py-3 text-[12px]">
              {g.autoCount > 0 && (
                <div className="flex justify-between py-0.5"><span className="text-muted">Automatic entries</span><span className="font-bold tabular text-fg">{g.autoCount}</span></div>
              )}
              {g.res.map((r, i) => (
                <div key={i} className="flex justify-between py-0.5"><span className="text-muted">{r.source} · Reserved</span><span className="font-bold tabular text-gold">{r.entries}</span></div>
              ))}
              {g.mine.map((t, i) => (
                <div key={i} className="flex justify-between py-0.5">
                  <span className="text-muted">{t.source}{t.order ? ` · ${t.order}` : ""}</span>
                  <span className="font-bold tabular text-fg">{t.entries}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
