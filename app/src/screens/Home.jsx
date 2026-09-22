import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import member from "../data/member.json";
import competitions from "../data/competitions.json";
import partners from "../data/partners.json";
import lb from "../data/leaderboard.json";
import { store } from "../lib/store";
import { getMembership } from "../lib/membership";
import PaywallSheet from "../components/PaywallSheet";
import Chip from "../components/Chip";
import SpinWheel from "../components/SpinWheel";
import Toast from "../components/Toast";
import { CountdownChip } from "../components/Countdown";
import ImageWithSkeleton from "../components/ImageWithSkeleton";
import Modal from "../components/Modal";
import QRPass from "../components/QRPass";
import { nextSunday2100UTC, useNow } from "../lib/time";
import { drawTarget } from "../lib/draw";

function AllocationPanel({ xpBonus, subscribed }) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("Entries");
  const rows = competitions.items
    .filter((c) => c.autoAllocated)
    .map((c) => ({
      id: c.id,
      name: c.detailsTitle || c.title,
      entries: c.autoAllocated,
      image: c.image,
      tag: c.id === "porsche-911" ? "Tier One" : "Member allocation",
    }));

  if (!subscribed) {
    return (
      <div className="mt-4 rounded-2xl border border-violet/40 bg-violet-soft p-4">
        <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-violet-pale">
          <span className="ms text-[16px]">analytics</span> Member Allocation
        </p>
        <p className="mt-2 text-sm font-bold text-fg">Automatic entries live here</p>
        <p className="mt-1 text-[12px] leading-relaxed text-muted">Subscribe to see your monthly pool, per-draw allocations, and level progress.</p>
        <button onClick={() => navigate("/plans", { state: { from: "/" } })} className="mt-3 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white active:scale-[0.98]">
          View plans
        </button>
      </div>
    );
  }

  return (
    <div className="depth-card mt-4 rounded-2xl border border-hairline bg-gradient-to-br from-card via-card to-indigo-soft/30 p-4">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between" aria-expanded={open}>
        <span className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-muted">
          <span className="ms text-[16px]">analytics</span> Member Allocation
        </span>
        <span className="flex items-center gap-1 text-[11px] font-bold text-muted">
          Details
          <span className={`ms text-[16px] transition-transform ${open ? "rotate-180" : ""}`}>expand_more</span>
        </span>
      </button>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <div className="rounded-xl border border-indigo/30 bg-indigo-soft/50 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-indigo-bright"><span className="ms text-[15px]">confirmation_number</span> Monthly pool</p>
          <p className="mt-1 font-display text-xl font-bold tabular text-fg">{member.entries}</p>
          <p className="text-[10px] font-semibold text-muted">automatic entries</p>
        </div>
        <div className="rounded-xl border border-teal/30 bg-teal-soft/40 px-3 py-2.5">
          <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-teal-pale"><span className="ms text-[15px]">military_tech</span> XP balance</p>
          <p className="mt-1 font-display text-xl font-bold tabular text-fg">{(member.xp + xpBonus).toLocaleString()}</p>
          <p className="text-[10px] font-semibold text-muted">{member.levelName}</p>
        </div>
      </div>
      {open && (
        <div className="mt-3 border-t border-hairline-soft pt-3">
          <div className="flex rounded-lg border border-hairline-soft bg-card-2 p-0.5">
            {["Entries", "XP & Level"].map((t) => (
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
                  <Link key={r.id} to={`/competitions/${r.id}`} className="group flex min-h-[78px] items-center gap-3 overflow-hidden rounded-xl border border-hairline-soft bg-card-2 p-2.5 active:scale-[0.99]">
                    <img src={r.image} alt="" className="h-12 w-14 shrink-0 rounded-lg object-cover opacity-90 transition duration-300 group-hover:scale-105" />
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[12px] font-bold text-fg">{r.name}</span>
                      <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-wider text-teal-pale">{r.tag}</span>
                      <span className="mt-1 block"><CountdownChip to={drawTarget(r.id)} /></span>
                    </span>
                    <span className="flex shrink-0 flex-col items-center rounded-lg border border-indigo/40 bg-indigo-soft px-2 py-1.5">
                      <span className="font-display text-lg font-bold tabular text-fg">{r.entries}</span>
                      <span className="text-[8px] font-bold uppercase tracking-wider text-indigo-bright">Entries</span>
                    </span>
                  </Link>
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
        </div>
      )}
    </div>
  );
}

function VaultHero({ c, subscribed }) {
  return (
    <div className="depth-card mt-4 flex flex-col overflow-hidden rounded-2xl border border-hairline bg-card">
      <div className="relative">
        <ImageWithSkeleton src={c.image} alt={c.title} className="h-[228px] w-full" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/20 to-transparent" />
        <div className="absolute left-3 top-3 flex items-center gap-2">
          <span className="liquid-glass rounded-md px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-fg">{c.badge}</span>
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
      <div className="flex flex-1 flex-col p-3.5">
        {subscribed ? (
          <div className="flex items-center justify-between px-1 py-1">
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-muted">
              <span className="ms text-[15px] text-teal-pale">confirmation_number</span> {c.yourEntries} auto-allocated entries
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-teal-pale">Active</span>
          </div>
        ) : (
          <div className="flex items-center justify-between rounded-xl border border-violet/40 bg-violet-soft px-3.5 py-2.5">
            <span className="text-[12px] font-semibold text-muted">Members get automatic entries here</span>
            <Link to="/plans" state={{ from: "/" }} className="shrink-0 rounded-lg bg-cta px-3 py-1.5 text-[11px] font-bold text-white">View plans</Link>
          </div>
        )}
        <Link to={`/competitions/${c.id}`} className="mt-4 block rounded-xl bg-cta py-3.5 text-center text-sm font-bold text-white shadow-[var(--shadow-card)] active:scale-[0.98]">
          Add Entries
        </Link>
      </div>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [toast, setToast] = useState(null);
  const [paywall, setPaywall] = useState(false);
  const [partnerDetail, setPartnerDetail] = useState(null);
  const [claimed, setClaimed] = useState(() => store.claims);
  const [copied, setCopied] = useState(false);
  const [xpBonus, setXpBonus] = useState(store.xpBonus);
  const memberState = getMembership();
  const subscribed = memberState.status === "active" || memberState.status === "cancelled";
  const canSpin = subscribed;
  const spinUsed = store.spunToday();
  const now = useNow(1000);
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const spinLeft = Math.max(0, midnight.getTime() - now);
  const spinHours = String(Math.floor(spinLeft / 3600000)).padStart(2, "0");
  const spinMinutes = String(Math.floor((spinLeft % 3600000) / 60000)).padStart(2, "0");
  const spinSeconds = String(Math.floor((spinLeft % 60000) / 1000)).padStart(2, "0");
  const vault = competitions.items[0];
  const activeCards = competitions.items.filter((c) => c.status !== "ended").slice(0, 4);
  const top3 = lb.weekly.slice(0, 3);
  const rows = lb.weekly.slice(3, 8);
  const boardReset = nextSunday2100UTC(new Date(now));
  const boardDiff = Math.max(0, boardReset.getTime() - now);
  const boardCountdown = `${String(Math.floor(boardDiff / 86400000)).padStart(2, "0")}d ${String(Math.floor((boardDiff % 86400000) / 3600000)).padStart(2, "0")}h ${String(Math.floor((boardDiff % 3600000) / 60000)).padStart(2, "0")}m`;

  const onWheelResult = (r) => {
    if (!canSpin) return;
    if (r.type === "xp") setXpBonus(store.addXp(r.value));
    if (r.type === "cash") store.addPoints(r.value);
    store.setLastSpin({ label: Array.isArray(r.label) ? r.label.join(" ") : r.label, type: r.type, value: r.value || 0 });
    setToast({
      message:
        r.type === "xp" ? `+${r.value} XP added`
        : r.type === "cash" ? `$${r.value} cash added`
        : r.type === "retry" ? "One more spin"
        : "No win this time",
      action: { label: "View board", to: "/leaderboard" },
    });
  };

  const openPartner = (p) => {
    if (!subscribed && !claimed.has(p.id)) {
      setPaywall(true);
      return;
    }
    setPartnerDetail(p);
  };

  const claimPartner = (p) => {
    setClaimed(store.addClaim(p.id));
    setCopied(false);
  };

  const copyPartnerCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
    setCopied(true);
    setToast({ message: "Pass code copied" });
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="px-4 pt-2 pb-4">
      <AllocationPanel xpBonus={xpBonus} subscribed={subscribed} />
      <VaultHero c={vault} subscribed={subscribed} />

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
            <Link to={`/competitions/${c.id}`} key={c.id} className="motion-card w-[308px] shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-card">
              <div className="relative">
                <ImageWithSkeleton src={c.image} alt={c.title} className="h-36 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5">
                  <CountdownChip to={drawTarget(c.id)} />
                </div>
              </div>
              <div className="flex min-h-[216px] flex-1 flex-col p-3.5">
                <p className="min-h-[38px] text-[15px] font-bold leading-snug text-fg">{c.title}{c.titleSuffix ? ` ${c.titleSuffix}` : ""}</p>
                <p className="mt-1 min-h-[32px] line-clamp-2 text-[12px] leading-snug text-muted">{c.subtitle}</p>
                <div className="mt-2.5 flex items-center justify-between rounded-lg border border-teal/30 bg-teal-soft/35 px-2.5 py-2">
                  <span className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-widest text-teal-pale"><span className="ms text-[13px]">confirmation_number</span> Your entries</span>
                  <span className="font-display text-base font-bold tabular text-fg">{c.yourEntries || 0}</span>
                </div>
                <div className="mt-2.5 rounded-xl bg-cta py-3 text-center text-sm font-bold text-white shadow-[var(--shadow-card)]">
                  Add Entries
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
            <div key={p.id} className="motion-card w-[308px] shrink-0 snap-start overflow-hidden rounded-2xl border border-hairline bg-card">
              <div className="relative">
                <ImageWithSkeleton src={p.image} alt={p.name} className="h-36 w-full" />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                <div className="absolute bottom-2.5 left-2.5">
                  <span className="liquid-glass rounded-md px-2 py-1 text-[9px] font-bold uppercase tracking-widest text-teal-pale">{p.tierChip}</span>
                </div>
              </div>
              <div className="flex min-h-[216px] flex-1 flex-col p-3.5">
                <p className="min-h-[38px] text-[15px] font-bold leading-snug text-fg">{p.shortName}</p>
                <p className="mt-1 min-h-[36px] text-[13px] font-bold leading-snug text-indigo-bright">{p.benefit}</p>
                <p className="mt-1 min-h-[32px] line-clamp-2 text-[11px] leading-snug text-muted">{p.detail}</p>
                <button onClick={() => openPartner(p)} className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3 text-sm font-bold text-white shadow-[var(--shadow-card)] active:scale-[0.98]">
                  <span className="ms text-[18px]">featured_seasonal_and_gifts</span>
                  {claimed.has(p.id) ? "View Pass" : "Claim"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Wheel */}
      <section id="wheelSection" className="mt-6 rounded-2xl border border-hairline bg-card p-5">
        <div className="flex flex-col items-center text-center">
          <span className="rounded-full border border-violet/40 bg-violet-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-violet-pale">
            Daily Fortune Wheel
          </span>
          <h2 className="mt-2.5 font-display text-xl font-bold tracking-tight text-fg">Daily Spin</h2>
          <p className="mt-1 max-w-[260px] text-[12px] leading-relaxed text-muted">Every daily spin grants verifiable XP, cash perks, or free re-spins.</p>
        </div>
        <div className="mt-4">
          <SpinWheel
            disabled={spinUsed && canSpin}
            cooldown={spinUsed && canSpin ? `${spinHours}:${spinMinutes}:${spinSeconds}` : null}
            claimAction={!canSpin ? () => setPaywall(true) : undefined}
            onResult={onWheelResult}
          />
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
            <p className="mt-1 inline-flex items-center gap-1.5 rounded-lg border border-teal/30 bg-teal-soft/40 px-2 py-1 text-[11px] font-bold tabular text-teal-pale">
              <span className="ms text-[14px]">schedule</span> Ends in {boardCountdown}
            </p>
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
        </div>
      </section>

      <Modal open={!!partnerDetail} onClose={() => setPartnerDetail(null)} labelledBy="home-partner-title">
        {partnerDetail && (
          <div className="min-h-[560px]">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-teal-pale">Partner privilege</p>
                <h2 id="home-partner-title" className="mt-1 text-lg font-bold text-fg">{partnerDetail.name}</h2>
              </div>
              <button onClick={() => setPartnerDetail(null)} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
            </div>
            <ImageWithSkeleton src={partnerDetail.image} alt={partnerDetail.name} className="mt-4 h-44 w-full rounded-xl" />
            <p className="mt-3 text-sm font-bold text-indigo-bright">{partnerDetail.benefit}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{partnerDetail.detail}</p>
            {claimed.has(partnerDetail.id) ? (
              <div className="mt-4 flex flex-col items-center rounded-2xl border border-teal/40 bg-teal-soft/40 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-pale"><span className="ms fill text-[15px]">verified</span> Pass ready</p>
                <div className="mt-3"><QRPass passId={partnerDetail.passCode || `MB-${partnerDetail.id.toUpperCase()}`} size={144} /></div>
                <div className="mt-3 flex w-full items-center justify-between rounded-xl border border-hairline bg-card-2 px-4 py-2.5">
                  <span className="text-sm font-bold tabular text-fg">{partnerDetail.passCode || `MB-${partnerDetail.id.toUpperCase()}`}</span>
                  <button onClick={() => copyPartnerCode(partnerDetail.passCode || partnerDetail.id)} className="flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 py-1.5 text-[12px] font-bold text-muted active:scale-[0.98]"><span className="ms text-[16px]">{copied ? "check" : "content_copy"}</span>{copied ? "Copied" : "Copy"}</button>
                </div>
              </div>
            ) : (
              <button onClick={() => claimPartner(partnerDetail)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 text-sm font-bold text-white active:scale-[0.98]"><span className="ms text-[19px]">featured_seasonal_and_gifts</span> Claim benefit</button>
            )}
          </div>
        )}
      </Modal>

      <Toast message={toast?.message} action={toast?.action} open={!!toast} onDone={() => setToast(null)} />
      <PaywallSheet open={paywall} onClose={() => setPaywall(false)} onPlans={() => navigate("/plans", { state: { from: "/" } })} reason="spin" />
    </div>
  );
}
