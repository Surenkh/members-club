import { useState } from "react";
import { Link } from "react-router-dom";
import member from "../data/member.json";
import competitions from "../data/competitions.json";
import partners from "../data/partners.json";
import TierCard from "../components/TierCard";
import Chip from "../components/Chip";
import SpinWheel from "../components/SpinWheel";
import Toast from "../components/Toast";

const TABS = ["Entries", "XP & Level", "Perks"];

export default function Home() {
  const [tab, setTab] = useState("Entries");
  const [toast, setToast] = useState("");
  const active = competitions.filter((c) => c.status === "active");

  return (
    <div className="px-4 pt-5 pb-4">
      {/* Header */}
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={member.avatarUrl} alt={member.name} className="h-11 w-11 rounded-full border border-hairline object-cover" />
          <div>
            <p className="text-[11px] font-semibold text-muted">Welcome back</p>
            <p className="text-sm font-bold text-fg">{member.name}</p>
          </div>
        </div>
        <Chip tone="violet" icon="workspace_premium">{member.tier}</Chip>
      </header>

      <div className="mt-4">
        <TierCard member={member} />
      </div>

      {/* Tabs */}
      <div className="mt-5 flex rounded-xl border border-hairline bg-card p-1">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold transition ${
              tab === t ? "bg-indigo text-white shadow" : "text-muted"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="mt-4">
        {tab === "Entries" && (
          <div className="rounded-2xl border border-hairline bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Active entries</p>
                <p className="mt-1 text-3xl font-bold tabular text-fg">{member.entries}</p>
              </div>
              <Chip tone="indigo" icon="confirmation_number">Auto-allocation on</Chip>
            </div>
            <div className="mt-4 space-y-2.5">
              {active.slice(0, 3).map((c) => (
                <div key={c.id} className="flex items-center justify-between rounded-xl border border-hairline-soft bg-card-2 px-3.5 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-fg">{c.title}</p>
                    <p className="text-[11px] text-muted tabular">{c.yourEntries} your entries</p>
                  </div>
                  <Link to={`/competitions/${c.id}`} className="ml-3 shrink-0 rounded-lg bg-indigo px-3 py-2 text-[12px] font-bold text-white active:scale-[0.98]">
                    Add entries
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "XP & Level" && (
          <div className="rounded-2xl border border-hairline bg-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest text-muted">This week</p>
                <p className="mt-1 text-3xl font-bold tabular text-fg">+{member.xpThisWeek.toLocaleString()} XP</p>
              </div>
              <Chip tone="gold" icon="military_tech">Level {member.level}</Chip>
            </div>
            <div className="mt-5">
              <SpinWheel onResult={(r) => r.type !== "none" && setToast(`${r.label} won`)} />
            </div>
          </div>
        )}

        {tab === "Perks" && (
          <div className="rounded-2xl border border-hairline bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-[11px] font-bold uppercase tracking-widest text-muted">{member.tier} perks</p>
              <Chip tone="teal" icon="verified">3 active</Chip>
            </div>
            <div className="mt-4 space-y-2.5">
              {partners.slice(0, 3).map((p) => (
                <Link to="/partners" key={p.id} className="flex items-center gap-3 rounded-xl border border-hairline-soft bg-card-2 p-3 active:scale-[0.99]">
                  <img src={p.image} alt="" className="h-12 w-12 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-fg">{p.name}</p>
                    <p className="truncate text-[11px] text-muted">{p.benefit}</p>
                  </div>
                  <span className="ms text-faint">chevron_right</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Competitions preview */}
      <section id="competitions" className="mt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-fg">Live Competitions</h2>
          <Link to="/competitions" className="text-[13px] font-bold text-indigo-bright">View all</Link>
        </div>
        <div className="mt-3 space-y-3">
          {active.slice(0, 2).map((c) => (
            <Link to={`/competitions/${c.id}`} key={c.id} className="block overflow-hidden rounded-2xl border border-hairline bg-card active:scale-[0.99]">
              <img src={c.image} alt="" className="h-40 w-full object-cover" />
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-[15px] font-bold text-fg">{c.title}</p>
                    <p className="mt-0.5 text-xs text-muted">{c.subtitle}</p>
                  </div>
                  <Chip tone="teal" icon="schedule">{c.closesInDays}d</Chip>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-[12px] font-semibold text-muted tabular">${c.entryPrice.toFixed(2)} / entry</span>
                  <span className="rounded-lg bg-indigo px-3.5 py-2 text-[12px] font-bold text-white">Enter</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </div>
  );
}
