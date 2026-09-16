import { useState } from "react";
import { Link } from "react-router-dom";
import competitions from "../data/competitions.json";
import Chip from "../components/Chip";

const FILTERS = [
  { key: "all", label: "All Draws" },
  { key: "active", label: "Active" },
  { key: "coming", label: "Coming Soon" },
  { key: "ended", label: "Ended & Winners" },
];

export default function Competitions() {
  const [f, setF] = useState("all");
  const list = competitions.filter((c) => (f === "all" ? true : c.status === f));
  const count = (k) => (k === "all" ? competitions.length : competitions.filter((c) => c.status === k).length);

  return (
    <div className="px-4 pt-5 pb-4">
      <h1 className="text-2xl font-bold tracking-tight text-fg">Competitions</h1>
      <p className="mt-1 text-sm text-muted">Members-only prize draws</p>

      <div className="scroll-thin mt-4 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((x) => (
          <button
            key={x.key}
            onClick={() => setF(x.key)}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-[12px] font-bold transition ${
              f === x.key
                ? "border-transparent bg-indigo text-white"
                : "border-hairline bg-card text-muted"
            }`}
          >
            {x.label} <span className="tabular opacity-80">({count(x.key)})</span>
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3.5">
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-card p-10 text-center">
            <span className="ms text-[34px] text-faint">emoji_events</span>
            <p className="mt-2 text-sm font-semibold text-fg">No draws here yet</p>
            <p className="mt-1 text-xs text-muted">New competitions are announced to members first.</p>
          </div>
        )}
        {list.map((c) => (
          <Link
            to={c.status === "ended" ? "#" : `/competitions/${c.id}`}
            key={c.id}
            className="block overflow-hidden rounded-2xl border border-hairline bg-card active:scale-[0.99]"
            onClick={(e) => c.status === "ended" && e.preventDefault()}
          >
            <div className="relative">
              <img src={c.image} alt="" className="h-44 w-full object-cover" />
              {c.status === "ended" && <div className="absolute inset-0 bg-black/55 backdrop-blur-[1px]" />}
              <div className="absolute left-3 top-3">
                {c.status === "active" && <Chip tone="teal" icon="schedule">Closes in {c.closesInDays}d</Chip>}
                {c.status === "coming" && <Chip tone="violet" icon="upcoming">Coming soon</Chip>}
                {c.status === "ended" && <Chip tone="gold" icon="workspace_premium">Winner drawn</Chip>}
              </div>
            </div>
            <div className="p-4">
              <p className="text-[15px] font-bold text-fg">{c.title}</p>
              <p className="mt-0.5 text-xs text-muted">{c.subtitle}</p>

              {c.status === "ended" && c.winner ? (
                <div className="mt-3 flex items-center justify-between rounded-xl border border-hairline-soft bg-card-2 px-3.5 py-3">
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Winner</p>
                    <p className="mt-0.5 text-sm font-bold text-fg">{c.winner.name}</p>
                  </div>
                  <button className="rounded-lg border border-hairline bg-card px-3 py-2 text-[12px] font-bold text-muted">
                    View details
                  </button>
                </div>
              ) : c.status === "coming" ? (
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px] text-muted">Opens to members soon</span>
                  <span className="rounded-lg border border-hairline bg-card-2 px-3.5 py-2 text-[12px] font-bold text-muted">Notify me</span>
                </div>
              ) : (
                <div className="mt-3 flex items-center justify-between">
                  <div className="text-[12px] text-muted">
                    <span className="font-bold text-fg tabular">${c.entryPrice.toFixed(2)}</span> / entry
                    {c.yourEntries > 0 && <span className="ml-2 tabular">· You hold {c.yourEntries}</span>}
                  </div>
                  <span className="rounded-lg bg-indigo px-3.5 py-2 text-[12px] font-bold text-white">
                    {c.yourEntries > 0 ? "Add entries" : "Enter"}
                  </span>
                </div>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
