import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import lb from "../data/leaderboard.json";
import Modal from "../components/Modal";
import SpinWheel from "../components/SpinWheel";
import Toast from "../components/Toast";
import { store } from "../lib/store";
import { getMembership } from "../lib/membership";

const PERIODS = ["Weekly", "Championship"];
const key = { Weekly: "weekly", Championship: "championship" };

function Podium({ rows }) {
  const [second, first, third] = [rows[1], rows[0], rows[2]];
  const card = (r, highlight) => (
    <div key={r.rank} className={`flex flex-col items-center rounded-2xl border px-2 py-3 text-center ${highlight ? "border-gold/50 bg-gold/10" : "border-hairline bg-card"}`}>
      {r.leader && <span className="mb-1 rounded bg-gold/20 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-widest text-gold">Leader</span>}
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-card-2 text-[11px] font-bold text-fg">{r.initials}</span>
      <p className="mt-1.5 flex items-center gap-1 truncate text-[11px] font-bold text-fg">
        {r.name}
        {r.verified && <span className="ms fill text-[12px] text-indigo-bright">verified</span>}
      </p>
      <p className="tabular text-[11px] font-bold text-gold">{r.xp.toLocaleString()} XP</p>
      {r.reward && <p className="mt-0.5 text-[9px] font-semibold text-teal-pale">{r.reward}</p>}
    </div>
  );
  return (
    <div className="grid grid-cols-3 items-end gap-2">
      {card(second, false)}
      <div className="pb-2">{card(first, true)}</div>
      {card(third, false)}
    </div>
  );
}

export default function Leaderboard() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState("Weekly");
  const [info, setInfo] = useState(false);
  const [boost, setBoost] = useState(false);
  const [toast, setToast] = useState(null);
  const rows = lb[key[period]] || lb.weekly;
  const rest = rows.slice(3);
  const you = lb.you;
  const memberState = getMembership();
  const hasHistory = store.xpBonus > 0 || store.tickets.length > 0 || store.claims.size > 0;
  const showPersonal = memberState.status === "active" || memberState.status === "cancelled" || memberState.status === "retry" || memberState.status === "semi" || hasHistory;
  const cycleLine = period === "Championship" ? lb.championshipLine : lb.resetLine;
  const handleBoostResult = (r) => {
    if (r.type === "xp") store.addXp(r.value);
    if (r.type === "xp" || r.type === "cash") {
      setToast({ message: `${Array.isArray(r.label) ? r.label.join(" ") : r.label} won`, action: { label: "View board", to: "/leaderboard" } });
    }
  };

  return (
    <div className="px-4 pt-2 pb-4">
      {/* Reset bar */}
      <div className="flex items-center justify-between rounded-2xl border border-hairline bg-card px-4 py-3">
        <p className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
          <span className="ms text-[16px] text-teal-pale">schedule</span>
          {cycleLine}
        </p>
        <button onClick={() => setInfo(true)} aria-label="How XP works" className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline text-muted">
          <span className="ms text-[18px]">info</span>
        </button>
      </div>

      {/* Period tabs */}
      <div className="mt-3 flex rounded-xl border border-hairline bg-card p-1">
        {PERIODS.map((x) => (
          <button
            key={x}
            onClick={() => setPeriod(x)}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold transition ${period === x ? "bg-cta text-white shadow" : "text-muted"}`}
          >
            {x}
          </button>
        ))}
      </div>

      {/* You card or nonmember invitation */}
      {showPersonal ? (
        <div className="mt-3 flex items-center gap-3 rounded-2xl border border-indigo/50 bg-indigo-soft p-4">
          <span className="font-display text-xl font-bold tabular text-indigo-bright">#{you.rank}</span>
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-1 truncate text-sm font-bold text-fg">
              You ({you.tier}) <span className="ms fill text-[14px] text-indigo-bright">verified</span>
            </p>
            <p className="mt-0.5 text-[11px] text-muted">{you.bracket} · +{you.needed} XP needed for Rank {you.neededFor}</p>
          </div>
          <div className="text-right">
            <p className="font-display text-lg font-bold tabular text-fg">{(you.xp + store.xpBonus).toLocaleString()} XP</p>
            <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Points</p>
          </div>
        </div>
      ) : (
        <div className="mt-3 rounded-2xl border border-violet/40 bg-violet-soft p-4 text-center">
          <p className="text-sm font-bold text-fg">Become a member to start earning XP</p>
          <p className="mt-1 text-[12px] text-muted">Rankings are open to browse. Personal standings unlock with membership.</p>
          <button onClick={() => navigate("/plans", { state: { from: "/leaderboard" } })} className="mt-3 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">
            View plans
          </button>
        </div>
      )}

      {/* Boost promo */}
      <button onClick={() => setBoost(true)} className="mt-3 flex w-full items-center gap-2.5 rounded-2xl border border-violet/40 bg-violet-soft p-4 text-left active:scale-[0.99]">
        <span className="ms fill text-[22px] text-gold">bolt</span>
        <span className="flex-1 text-[13px] font-bold text-fg">{lb.boost.label}</span>
        <span className="rounded-lg bg-violet px-3.5 py-2 text-[12px] font-bold text-white">{lb.boost.cta}</span>
      </button>

      {/* Podium */}
      <div className="mt-4">
        <Podium rows={rows} />
      </div>

      {/* Column header */}
      <div className="mt-4 flex items-center justify-between px-1 text-[10px] font-bold uppercase tracking-[0.16em] text-muted">
        <span>Rank & Member</span>
        <span>XP Score</span>
      </div>

      {/* Rows */}
      <div className="mt-2 space-y-1.5">
        {rest.map((r) => (
          <div key={r.rank} className="flex items-center gap-3 rounded-xl border border-hairline-soft bg-card px-3.5 py-3">
            <span className="w-6 text-center text-sm font-bold tabular text-muted">{r.rank}</span>
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-card-2 text-[12px] font-bold text-fg">{r.initials}</span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">{r.name}</p>
              <p className="text-[11px] text-muted">{r.tier}</p>
            </div>
            <span className="text-sm font-bold tabular text-fg">{r.xp.toLocaleString()} <span className="text-[10px] font-bold text-muted">XP</span></span>
          </div>
        ))}
      </div>

      {/* Allocation rules modal */}
      <Modal open={info} onClose={() => setInfo(false)} labelledBy="lb-info">
        <div className="flex items-center justify-between">
          <h3 id="lb-info" className="text-lg font-bold text-fg">Allocation Rules</h3>
          <button onClick={() => setInfo(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <p className="mt-3 text-[13px] leading-relaxed text-muted">{lb.cycleNote}</p>
        <div className="mt-4 space-y-2">
          {lb.rewards.map((w) => (
            <div key={w.place} className="flex items-center gap-2.5 rounded-xl border border-hairline-soft bg-card px-3.5 py-3">
              <span className="ms text-[19px] text-gold">{w.place.startsWith("1st") ? "crown" : "military_tech"}</span>
              <div className="flex-1">
                <p className="text-[13px] font-bold text-fg">{w.place} <span className="text-teal-pale">{w.reward}</span></p>
                {w.perk && <p className="text-[11px] text-muted">{w.perk}</p>}
              </div>
            </div>
          ))}
        </div>
        <button onClick={() => setInfo(false)} className="mt-4 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">Acknowledge</button>
      </Modal>

      {/* Boost modal */}
      <Modal open={boost} onClose={() => setBoost(false)} labelledBy="lb-boost">
        <div className="flex items-center justify-between">
          <h3 id="lb-boost" className="text-lg font-bold text-fg">Boost your XP</h3>
          <button onClick={() => setBoost(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-4">
          <SpinWheel onResult={handleBoostResult} />
        </div>
      </Modal>

      <Toast message={toast?.message} action={toast?.action} open={!!toast} onDone={() => setToast(null)} />
    </div>
  );
}
