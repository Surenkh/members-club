import { useEffect, useState } from "react";
import data from "../data/streaks.json";
import Modal from "./Modal";
import Toast from "./Toast";

const LS_KEY = "nexus-streak";

export default function StreaksModal({ open, onClose, onClaim }) {
  const [state, setState] = useState(() => {
    try {
      const s = JSON.parse(localStorage.getItem(LS_KEY));
      return s && s.date === new Date().toDateString() ? { ...data, todayClaimed: true, currentStreak: data.currentStreak + 1 } : data;
    } catch {
      return data;
    }
  });
  const [toast, setToast] = useState("");

  useEffect(() => {
    if (open) setToast("");
  }, [open]);

  const claim = () => {
    const next = { ...state, todayClaimed: true, currentStreak: state.currentStreak + 1 };
    setState(next);
    localStorage.setItem(LS_KEY, JSON.stringify({ date: new Date().toDateString(), claimed: true }));
    setToast(`+${state.week.find((d) => d.today)?.xp || 150} XP claimed`);
    onClaim && onClaim(next);
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="streaks-title">
      <div className="flex items-center justify-between">
        <div>
          <h3 id="streaks-title" className="text-lg font-bold text-fg">Daily Streaks</h3>
          <p className="mt-0.5 text-[12px] text-muted">Keep the chain alive for bonus entries</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
          <span className="ms">close</span>
        </button>
      </div>

      <div className="mt-4 flex items-center justify-between rounded-2xl border border-hairline bg-gradient-to-br from-[#151d36] to-[#0e1524] p-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Current streak</p>
          <p className="mt-1 text-3xl font-bold tabular text-fg">
            {state.currentStreak} <span className="text-sm font-semibold text-muted">days</span>
          </p>
        </div>
        <span className="ms fill text-[34px] text-gold">local_fire_department</span>
      </div>

      {/* Week grid */}
      <div className="mt-4 grid grid-cols-7 gap-1">
        {state.week.map((d) => (
          <div
            key={d.day}
            className={`flex min-w-0 flex-col items-center rounded-lg border px-0.5 py-2 ${
              d.today
                ? "border-indigo-bright bg-indigo-soft"
                : d.claimed
                ? "border-teal/30 bg-teal-soft"
                : "border-hairline-soft bg-card"
            }`}
          >
            <span className="text-[8px] font-bold uppercase tracking-wider text-muted">{d.day}</span>
            <span className={`ms mt-1 text-[15px] ${d.claimed || (d.today && state.todayClaimed) ? "fill text-teal" : "text-faint"}`}>
              {d.claimed || (d.today && state.todayClaimed) ? "check_circle" : "radio_button_unchecked"}
            </span>
            <span className="mt-0.5 text-[8px] font-bold tabular text-muted">+{d.xp}</span>
          </div>
        ))}
      </div>

      <div className="mt-3.5 rounded-xl border border-hairline-soft bg-card px-4 py-3">
        <p className="text-[12px] text-muted">
          <span className="font-bold text-fg">Milestone:</span> reach {data.milestone.at} days for {data.milestone.reward}.
        </p>
      </div>

      <button
        onClick={claim}
        disabled={state.todayClaimed}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo py-3.5 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-55"
      >
        <span className="ms">verified</span>
        {state.todayClaimed ? "Claimed today" : `Claim today (+${state.week.find((d) => d.today)?.xp || 150} XP)`}
      </button>

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </Modal>
  );
}
