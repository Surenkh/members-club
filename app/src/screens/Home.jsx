import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import member from "../data/member.json";
import competitions from "../data/competitions.json";
import partners from "../data/partners.json";
import lb from "../data/leaderboard.json";
import streaks from "../data/streaks.json";
import { store } from "../lib/store";
import { getMembership } from "../lib/membership";
import PaywallSheet from "../components/PaywallSheet";
import Chip from "../components/Chip";
import SpinWheel from "../components/SpinWheel";
import Toast from "../components/Toast";
import { CountdownChip } from "../components/Countdown";
import ImageWithSkeleton from "../components/ImageWithSkeleton";
import { drawTarget } from "../lib/draw";

function AllocationPanel({ xpBonus }) {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Entries");
  const rows = [
    { name: "Porsche 911 GT3 RS", entries: 8, tag: "(Tier One)" },
    { name: "Rolex Submariner + Leica", entries: 5, tag: null },
    { name: "Carlton St. Moritz Escape", entries: 2, tag: null },
  ];
  return (
    <div className="mt-4 rounded-2xl border border-hairline bg-card p-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between" aria-expanded={open}>
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          <span className="ms text-[16px]">analytics</span> Member Allocation
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-muted">
          Details
          <span className={`ms text-[16px] transition-transform ${open ? "rotate-180" : ""}`}>expand_more</span>
        </span>
      </button>
      <div className="mt-3 flex gap-2">
        <Chip icon="confirmation_number">{member.entries} Entries</Chip>
        <Chip icon="military_tech">{(member.xp + xpBonus).toLocaleString()} XP</Chip>
        <Chip icon="redeem" tone="teal">{member.claimed} Claimed</Chip>
      </div>
      {open && (
        <div className="mt-3 border-t border-hairline-soft pt-3">
          <div className="flex rounded-lg border border-hairline-soft bg-card-2 p-0.5">
            {["Entries", "XP & Level", "Perks (3)"].map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md py-1.5 text-[11px] font-bold transition ${tab === t ? "bg-cta text-white" : "text-muted"}`}
              >
                {t}
              </button>
            ))}
          </div>
          {tab === "Entries" && (
            <div className="mt-3">
              <p className="text-[11px] font-semibold text-muted">Allocated Monthly Pool {member.entriesPlaced} / {member.entries} Placed</p>
              <div className="mt-2 space-y-1.5">
                {rows.map((r) => (
                  <div key={r.name} className="flex items-center justify-between rounded-lg bg-card-2 px-3 py-2">
                    <span className="truncate text-[12px] font-semibold text-fg">{r.name} {r.tag && <span className="text-muted">{r.tag}</span>}</span>
                    <span className="ml-2 shrink-0 text-[12px] font-bold tabular text-fg">{r.entries} Entries</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {tab === "XP & Level" && (
            <div className="mt-3 rounded-lg bg-card-2 p-3">
              <p className="text-[12px] font-bold text-fg">{member.levelName}</p>
              <p className="mt-0.5 text-[11px] text-muted">{member.tierBadge} ({member.boost})</p>
              <p className="mt-2 text-[12px] font-bold tabular text-fg">{(member.xp + xpBonus).toLocaleString()} / {member.xpMax.toLocaleString()} XP</p>
              <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-hairline-soft">
                <div className="h-full rounded-full bg-gradient-to-r from-indigo to-violet" style={{ width: `${Math.min(100, ((member.xp + xpBonus) / member.xpMax) * 100)}%` }} />
              </div>
              <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted">
                <span className="ms text-[14px]">lock_open</span>
                Next Milestone: {member.nextLevel} · {member.xpToGo} XP to go
              </p>
            </div>
          )}
          {tab === "Perks (3)" && (
            <div className="mt-3 space-y-1.5">
              {streaks.wallet.map((w) => (
                <div key={w.name} className="flex items-center gap-2.5 rounded-lg bg-card-2 p-2">
                  <span className="ms text-muted">{w.icon}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[12px] font-semibold text-fg">{w.name}</p>
                    {w.meta ? <p className="text-[10px] text-muted">{w.meta}</p> : null}
                  </div>
                  <span className="shrink-0 rounded-md bg-indigo-soft px-2 py-1 text-[10px] font-bold text-indigo-bright">{w.cta}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function VaultHero({ c }) {
  return (
    <div className="mt-4 overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="relative">
        <ImageWithSkeleton src={c.image} alt={c.title} className="h-52 w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="rounded-md bg-ink/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-fg backdrop-blur">{c.badge}</span>
        </div>
        <div className="absolute right-3 top-3">
          <CountdownChip to={drawTarget(c.id)} />
        </div>
        <div className="absolute bottom-3 left-3 right-3">
          <div className="flex items-center gap-2">
            <Chip tone="violet" icon="military_tech">{c.tierTag}</Chip>
            <span className="text-[11px] font-semibold text-[#c4cbe4]">{c.tierNote}</span>
          </div>
          <p className="mt-1.5 font-display text-[22px] font-bold leading-tight tracking-tight text-white">{c.title} {c.titleSuffix}</p>
          <p className="mt-0.5 text-[12px] text-[#c4cbe4]">{c.subtitle}</p>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between rounded-xl border border-hairline-soft bg-card-2 px-3.5 py-2.5">
          <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
            <span className="ms text-[16px]">settings</span> Your Current Entries
          </span>
          <span className="text-[12px] font-bold tabular text-fg">{c.yourEntries} Auto-Allocated</span>
        </div>
        <div className="mt-2 flex items-center justify-between px-1 text-[11px] text-muted">
          <span>Tier Multiplier: <span className="font-bold text-teal-pale">{c.multiplier} Boost Active</span></span>
          <span>Draw Odds: <span className="font-bold tabular text-fg">1 in {c.odds.split(" ").pop()}</span></span>
        </div>
        <Link to={`/competitions/${c.id}`} className="mt-3 block rounded-xl bg-cta py-3 text-center text-sm font-bold text-white active:scale-[0.98]">
          Add more entries
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [paywall, setPaywall] = useState(false);
  const [xpBonus, setXpBonus] = useState(store.xpBonus);
  const memberState = getMembership();
  const canSpin = memberState.status === "active" || memberState.status === "cancelled";
  const spinUsed = store.spunToday();
  const vault = competitions.items[0];
  const activeCards = competitions.items.filter((c) => c.status !== "ended").slice(0, 4);
  const top3 = lb.weekly.slice(0, 3);
  const rows = lb.weekly.slice(3, 8);

  const onWheelResult = (r) => {
    if (r.type === "xp") setXpBonus(store.addXp(r.value));
    if (r.type === "cash") store.addPoints(r.value);
    store.setLastSpin({ label: Array.isArray(r.label) ? r.label.join(" ") : r.label, type: r.type, value: r.value || 0 });
    setToast({ message: `${Array.isArray(r.label) ? r.label.join(" ") : r.label} won`, action: { label: "View board", to: "/leaderboard" } });
  };

  return (
    <div className="px-4 pt-2 pb-4">
      <AllocationPanel xpBonus={xpBonus} />
      <VaultHero c={vault} />

      {/* Competitions preview */}
      <section id="competitionsSection" className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-1.5 text-[17px] font-bold tracking-tight text-fg">
              <span className="ms text-[19px] text-indigo-bright">emoji_events</span> Competitions
            </h2>
            <p className="mt-0.5 text-[12px] text-muted">Active draws & luxury allocation pools</p>
          </div>
          <Link to="/competitions" className="flex items-center gap-0.5 text-[13px] font-bold text-indigo-bright">
            View all <span className="ms text-[16px]">chevron_right</span>
          </Link>
        </div>
        <div className="scroll-thin -mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {activeCards.map((c) => (
            <Link to={`/competitions/${c.id}`} key={c.id} className="w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-card">
              <div className="relative">
                <ImageWithSkeleton src={c.image} alt={c.title} className="h-36 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5">
                  <CountdownChip to={drawTarget(c.id)} />
                </div>
              </div>
              <div className="p-3.5">
                <p className="text-[15px] font-bold leading-snug text-fg">{c.title}{c.titleSuffix ? ` ${c.titleSuffix}` : ""}</p>
                <p className="mt-1 line-clamp-2 text-[12px] leading-snug text-muted">{c.subtitle}</p>
                <div className="mt-2.5 flex items-center justify-between rounded-lg bg-card-2 px-2.5 py-2">
                  <span className="text-[12px] font-bold tabular text-fg">${c.entryPrice.toFixed(2)} <span className="font-semibold text-muted">/ entry</span></span>
                  {c.pool ? <span className="text-[10px] font-bold uppercase tracking-wider text-teal-pale tabular">{c.pool} pool</span> : null}
                </div>
                {c.multiplier && (
                  <p className="mt-1.5 px-0.5 text-[11px] text-muted">Tier Multiplier: <span className="font-bold text-teal-pale">{c.multiplier} Boost</span></p>
                )}
                <div className="mt-2.5 flex items-center justify-between">
                  <span className="text-[11px] font-semibold text-muted tabular">{c.yourEntries > 0 ? `${c.yourEntries} your entries` : "Members draw"}</span>
                  <span className="rounded-lg bg-cta px-4 py-2 text-[12px] font-bold text-white">Enter</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Partners preview */}
      <section id="partnersSection" className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-1.5 text-[17px] font-bold tracking-tight text-fg">
              <span className="ms text-[19px] text-indigo-bright">loyalty</span> Partner Privileges
            </h2>
            <p className="mt-0.5 text-[12px] text-muted">Curated member concessions & perks</p>
          </div>
          <Link to="/partners" className="flex items-center gap-0.5 text-[13px] font-bold text-indigo-bright">
            Explore {partners.items.length} <span className="ms text-[16px]">chevron_right</span>
          </Link>
        </div>
        <div className="scroll-thin -mx-4 mt-3 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-1">
          {partners.items.map((p) => (
            <Link to="/partners" key={p.id} className="w-64 shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-card">
              <div className="relative">
                <ImageWithSkeleton src={p.image} alt={p.name} className="h-36 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="rounded-md bg-ink/60 px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-teal-pale backdrop-blur">{p.tierChip}</span>
                </div>
              </div>
              <div className="p-3.5">
                <p className="text-[15px] font-bold leading-snug text-fg">{p.shortName}</p>
                <p className="mt-1 text-[13px] font-bold leading-snug text-indigo-bright">{p.benefit}</p>
                <p className="mt-1 line-clamp-2 text-[11px] leading-snug text-muted">{p.detail}</p>
                <p className="mt-2.5 text-[12px] font-bold text-teal-pale">Claim benefit</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Wheel */}
      <section id="wheelSection" className="mt-6 rounded-2xl border border-hairline bg-card p-5">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-violet/40 bg-violet-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-pale">
            Daily Fortune Wheel
          </span>
          <h2 className="mt-2.5 font-display text-xl font-bold tracking-tight text-fg">Spin & Claim Today&apos;s Drop</h2>
          <p className="mt-1 max-w-[260px] text-[12px] leading-relaxed text-muted">Every daily spin grants verifiable XP, cash perks, or free re-spins.</p>
        </div>
        <div className="mt-4">
          {spinUsed ? (
            <div className="flex flex-col items-center rounded-2xl border border-hairline bg-card p-5 text-center">
              <span className="ms fill text-[26px] text-teal-pale">check_circle</span>
              <p className="mt-2 text-sm font-bold text-fg">Today&apos;s spin is used</p>
              <Link to="/spins" className="mt-1 text-[12px] font-bold text-indigo-bright">Open Spins for the countdown</Link>
            </div>
          ) : (
            <SpinWheel gated={!canSpin} onGate={() => setPaywall(true)} onResult={onWheelResult} />
          )}
        </div>
      </section>

      {/* Leaderboard preview */}
      <section id="leaderboardSection" className="mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="flex items-center gap-1.5 text-[17px] font-bold tracking-tight text-fg">
              <span className="ms text-[19px] text-indigo-bright">leaderboard</span> Weekly Leaderboard
            </h2>
            <p className="mt-0.5 text-[12px] text-muted">{lb.resetLine}</p>
          </div>
          <Link to="/leaderboard" className="flex items-center gap-0.5 text-[13px] font-bold text-indigo-bright">
            Info <span className="ms text-[16px]">info</span>
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {[top3[1], top3[0], top3[2]].map((r) => (
            <div key={r.rank} className={`flex flex-col items-center rounded-2xl border px-2 py-3 text-center ${r.leader ? "border-gold/50 bg-gold/10" : "border-hairline bg-card"}`}>
              {r.leader && <span className="mb-1 rounded bg-gold/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-gold">Leader</span>}
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-card-2 text-[11px] font-bold text-fg">{r.initials}</span>
              <p className="mt-1.5 truncate text-[11px] font-bold text-fg">{r.name}</p>
              <p className="tabular text-[11px] font-bold text-gold">{r.xp.toLocaleString()} XP</p>
            </div>
          ))}
        </div>
        <div className="mt-2.5 space-y-1.5">
          {rows.map((r) => (
            <div key={r.rank} className="flex items-center gap-2.5 rounded-xl border border-hairline-soft bg-card px-3 py-2.5">
              <span className="w-5 text-center text-[12px] font-bold tabular text-muted">{r.rank}</span>
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-card-2 text-[10px] font-bold text-fg">{r.initials}</span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[12px] font-semibold text-fg">{r.name}</p>
                <p className="text-[10px] text-muted">{r.tier}</p>
              </div>
              <span className="text-[12px] font-bold tabular text-fg">{r.xp.toLocaleString()} XP</span>
            </div>
          ))}
          <Link to="/leaderboard" className="flex items-center gap-2.5 rounded-xl border border-indigo/50 bg-indigo-soft px-3 py-2.5">
            <span className="w-5 text-center text-[12px] font-bold tabular text-indigo-bright">#{lb.you.rank}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-[12px] font-bold text-fg">You ({lb.you.tier})</p>
              <p className="text-[10px] text-muted">{lb.you.bracket} · +{lb.you.needed} XP needed for Rank {lb.you.neededFor}</p>
            </div>
            <span className="text-[12px] font-bold tabular text-fg">{lb.you.xp.toLocaleString()} XP</span>
          </Link>
        </div>
      </section>

      <Toast message={toast?.message} action={toast?.action} open={!!toast} onDone={() => setToast(null)} />
      <PaywallSheet open={paywall} onClose={() => setPaywall(false)} onPlans={() => navigate("/plans", { state: { from: "/" } })} reason="spin" />
    </div>
  );
}
