import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import data from "../data/streaks.json";
import Modal from "./Modal";
import Toast from "./Toast";
import { getMembership } from "../lib/membership";

const LS_KEY = "member-streak";

function DayIcon({ state }) {
  if (state === "claimed") return <span className="ms fill text-[18px] text-teal-pale">token</span>;
  if (state === "ready") return <span className="ms fill text-[18px] text-gold">offline_bolt</span>;
  return <span className="ms text-[18px] text-faint">token</span>;
}

export default function StreaksModal({ open, onClose, onClaim }) {
  const [claimedToday, setClaimedToday] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY));
      return Boolean(s && s.date === new Date().toDateString());
    } catch {
      return false;
    }
  });
  const [freshReset, setFreshReset] = useState(false);
  const [toast, setToast] = useState("");
  const collectedRef = useRef(false);
  const memberState = getMembership();
  const collectible = memberState.status === "active" || memberState.status === "cancelled";
  const previewOnly = !collectible;

  const collect = () => {
    setClaimedToday(true);
    localStorage.setItem(LS_KEY, JSON.stringify({ date: new Date().toDateString(), claimed: true }));
    setToast(`+${data.claimXp} XP claimed`);
    onClaim?.(data.claimXp);
  };

  // Eligible members collect automatically on open. No second Claim button.
  // A missed day restarts the seven-day sequence (demo rule, see spec notes).
  useEffect(() => {
    if (!open) {
      collectedRef.current = false;
      return;
    }
    setToast("");
    if (!collectible || claimedToday) return;
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY));
      const last = s?.date ? new Date(s.date) : null;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      if (last && last.toDateString() !== new Date().toDateString() && last.toDateString() !== yesterday.toDateString()) {
        setFreshReset(true);
      }
    } catch {}
    if (collectedRef.current) return;
    collectedRef.current = true;
    collect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  const day = data.dayOfWeek;
  const claimedCount = data.claimedCount + (claimedToday ? 1 : 0);

  return (
    <Modal open={open} onClose={onClose} labelledBy="streaks-title">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-teal/40 bg-teal-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-pale">
          {data.streakLabel}
        </span>
        <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
          <span className="ms">close</span>
        </button>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="ms fill text-[30px] text-gold">local_fire_department</span>
        <h3 id="streaks-title" className="font-display text-[22px] font-bold tracking-tight text-fg">Daily Streaks</h3>
      </div>

      {/* Progress */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-hairline bg-card p-4">
        <p className="text-sm font-bold text-fg">Day {day + (claimedToday ? 1 : 0)} of 7</p>
        <p className="text-[11px] font-bold text-teal-pale">{claimedCount} Days Claimed</p>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-hairline-soft">
        <div
          className="h-full rounded-full bg-gradient-to-r from-indigo to-violet"
          style={{ width: `${(claimedCount / 7) * 100}%` }}
        />
      </div>

      <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Week 1 Rewards</p>

      {/* Day grid */}
      <div className="mt-2.5 grid grid-cols-3 gap-2">
        {data.days.map((d) => {
          const isReady = d.state === "ready" && !claimedToday;
          const isClaimed = d.state === "claimed" || (d.state === "ready" && claimedToday);
          return (
            <div
              key={d.day}
              className={`flex min-w-0 flex-col items-center rounded-xl border px-1 py-2.5 ${
                isReady
                  ? "border-gold/60 bg-gold/10"
                  : isClaimed
                  ? "border-teal/30 bg-teal-soft"
                  : "border-hairline-soft bg-card"
              }`}
            >
              <span className="text-[9px] font-bold uppercase tracking-wider text-muted">{d.day}</span>
              <span className="mt-1"><DayIcon state={isClaimed ? "claimed" : d.state} /></span>
              <span className="mt-0.5 text-[10px] font-bold tabular text-fg">+{d.xp} XP</span>
              <span className={`mt-1 rounded px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider ${isReady ? "bg-gold/20 text-gold" : isClaimed ? "text-teal-pale" : "text-faint"}`}>
                {isClaimed ? "Claimed" : isReady ? "Ready" : d.in}
              </span>
            </div>
          );
        })}
        {/* Finale card */}
        <div className="col-span-3 mt-1 rounded-2xl border border-violet/40 bg-gradient-to-br from-[#1b1440] to-[#101a30] p-4">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 rounded-full bg-violet-soft px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-violet-pale">
              <span className="ms text-[13px]">military_tech</span> {data.finale.label}
            </span>
            <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-muted">
              <span className="ms text-[13px]">lock</span> {data.finale.daysLeft} Days Left
            </span>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Cash Reward</p>
              <p className="mt-0.5 flex items-center gap-1.5 font-display text-xl font-bold text-gold-pale">
                <span className="ms text-[18px]">payments</span> {data.finale.cash}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[9px] font-bold uppercase tracking-widest text-muted">Bonus XP</p>
              <p className="mt-0.5 flex items-center justify-end gap-1.5 font-display text-xl font-bold text-violet-pale">
                <span className="ms text-[18px]">diamond</span> {data.finale.xp}
              </p>
            </div>
          </div>
        </div>
      </div>

      {freshReset && collectible && (
        <p className="mt-3 rounded-xl border border-hairline-soft bg-card px-4 py-2.5 text-[11px] leading-relaxed text-muted">
          A day was missed, so a fresh seven-day sequence started. Demo rule; not a final policy.
        </p>
      )}

      {previewOnly ? (
        <div className="mt-4">
          <p className="rounded-xl border border-hairline-soft bg-card px-4 py-3 text-[12px] leading-relaxed text-muted">
            Daily streaks reward members with XP and a Day 7 finale. This is a preview — nothing is collected.
          </p>
          <Link to="/plans" onClick={onClose} className="mt-3 block rounded-xl bg-cta py-3.5 text-center text-sm font-bold text-white active:scale-[0.98]">
            View plans
          </Link>
        </div>
      ) : claimedToday ? (
        <p className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-teal/40 bg-teal-soft py-3.5 text-sm font-bold text-teal-pale">
          <span className="ms fill text-[19px]">check_circle</span> Today&apos;s reward collected
        </p>
      ) : null}
      <p className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-muted">
        <span className="ms text-[14px]">schedule</span>
        Next unlock in <span className="font-bold tabular text-fg">{data.unlockIn}</span>
      </p>

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </Modal>
  );
}
