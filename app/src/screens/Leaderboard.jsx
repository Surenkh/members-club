import { useState } from "react";
import lb from "../data/leaderboard.json";
import Chip from "../components/Chip";
import Modal from "../components/Modal";
import SpinWheel from "../components/SpinWheel";
import Toast from "../components/Toast";

const PERIODS = ["Weekly", "Monthly", "All-Time"];
const key = { Weekly: "weekly", Monthly: "monthly", "All-Time": "allTime" };
// Avatar bg/text pairs tuned for WCAG AA contrast (decorative initials next to full names)
const avatarTone = {
  Sovereign: { bg: "#7c3aed", fg: "#ffffff" },
  Apex: { bg: "#e8c37e", fg: "#402d08" },
  Elite: { bg: "#17b8a6", fg: "#052e29" },
};

export default function Leaderboard() {
  const [period, setPeriod] = useState("Weekly");
  const [info, setInfo] = useState(false);
  const [boost, setBoost] = useState(false);
  const [toast, setToast] = useState("");
  const rows = lb[key[period]] || lb.weekly;

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">{period} Leaderboard</h1>
          <p className="mt-1 text-sm text-muted">XP earned across draws, streaks & partners</p>
        </div>
        <button onClick={() => setInfo(true)} aria-label="How XP works" className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-card text-muted">
          <span className="ms">info</span>
        </button>
      </div>

      {/* Period tabs */}
      <div className="mt-4 flex rounded-xl border border-hairline bg-card p-1">
        {PERIODS.map((x) => (
          <button
            key={x}
            onClick={() => setPeriod(x)}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold transition ${period === x ? "bg-indigo text-white shadow" : "text-muted"}`}
          >
            {x}
          </button>
        ))}
      </div>

      {/* Your standing */}
      <div className="mt-4 flex items-center justify-between rounded-2xl border border-indigo/40 bg-indigo-soft p-4">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-widest text-muted">Your position</p>
          <p className="mt-0.5 text-lg font-bold text-fg">
            #{rows.find((r) => r.you)?.rank ?? "-"} <span className="text-sm font-semibold text-muted">this {period.toLowerCase()}</span>
          </p>
        </div>
        <button onClick={() => setBoost(true)} className="rounded-xl bg-violet px-4 py-2.5 text-[13px] font-bold text-white active:scale-[0.98]">
          Boost XP
        </button>
      </div>

      {/* Rows */}
      <div className="mt-4 space-y-1.5">
        {rows.map((r) => (
          <div
            key={r.rank}
            className={`flex items-center gap-3 rounded-xl border px-3.5 py-3 ${
              r.you ? "border-indigo-bright bg-indigo-soft" : "border-hairline-soft bg-card"
            }`}
          >
            <span className={`w-7 text-center text-sm font-bold tabular ${r.rank <= 3 ? "text-gold" : "text-muted"}`}>{r.rank}</span>
            <div className="flex h-9 w-9 items-center justify-center rounded-full text-[12px] font-bold" style={{ background: (avatarTone[r.tier] || {}).bg || "#263150", color: (avatarTone[r.tier] || {}).fg || "#fff" }}>
              {r.name.split(" ").map((w) => w[0]).join("").slice(0, 2)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-fg">
                {r.name} {r.you && <span className="text-[10px] font-bold text-indigo-bright">(you)</span>}
              </p>
              <p className="text-[11px] text-muted">{r.tier}</p>
            </div>
            <span className="text-sm font-bold tabular text-fg">{r.xp.toLocaleString()} XP</span>
          </div>
        ))}
      </div>

      {/* Info modal */}
      <Modal open={info} onClose={() => setInfo(false)} labelledBy="lb-info">
        <div className="flex items-center justify-between">
          <h3 id="lb-info" className="text-lg font-bold text-fg">How XP works</h3>
          <button onClick={() => setInfo(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-3 space-y-2.5 text-[13px] leading-relaxed text-muted">
          <p>XP accrues from competition entries, daily streaks, partner claims and the bonus wheel.</p>
          <p>Weekly boards reset Monday 00:00 UTC. Top members each week receive bonus entries and tier perks.</p>
        </div>
        <button onClick={() => setInfo(false)} className="mt-4 w-full rounded-xl bg-indigo py-3 text-sm font-bold text-white">Got it</button>
      </Modal>

      {/* Boost modal */}
      <Modal open={boost} onClose={() => setBoost(false)} labelledBy="lb-boost">
        <div className="flex items-center justify-between">
          <h3 id="lb-boost" className="text-lg font-bold text-fg">Boost your XP</h3>
          <button onClick={() => setBoost(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-4">
          <SpinWheel onResult={(r) => r.type !== "none" && setToast(`${r.label} won`)} />
        </div>
      </Modal>

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </div>
  );
}
