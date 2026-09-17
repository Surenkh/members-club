import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SpinWheel from "../components/SpinWheel";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import PaywallSheet from "../components/PaywallSheet";
import { store } from "../lib/store";
import { getMembership } from "../lib/membership";
import { useNow } from "../lib/time";

export default function Spins() {
  const navigate = useNavigate();
  const [info, setInfo] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const [toast, setToast] = useState(null);
  const [, bump] = useState(0);
  const now = useNow(1000);
  const member = getMembership();
  const active = member.status === "active" || member.status === "cancelled";
  const used = store.spunToday();

  // Next local midnight countdown for cooldown display.
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const left = Math.max(0, midnight.getTime() - now);
  const hh = String(Math.floor(left / 3600000)).padStart(2, "0");
  const mm = String(Math.floor((left % 3600000) / 60000)).padStart(2, "0");
  const ss = String(Math.floor((left % 60000) / 1000)).padStart(2, "0");

  const onResult = (r) => {
    if (r.type === "xp") store.addXp(r.value);
    if (r.type === "cash") store.addPoints(r.value);
    store.setLastSpin({ label: Array.isArray(r.label) ? r.label.join(" ") : r.label, type: r.type, value: r.value || 0 });
    bump((v) => v + 1);
    setToast({ message: `${Array.isArray(r.label) ? r.label.join(" ") : r.label} won` });
  };

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
            <span className="ms">arrow_back</span>
          </Link>
          <div>
            <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">Daily Spin</h1>
            <p className="text-[12px] text-muted">One spin per daily cycle</p>
          </div>
        </div>
        <button onClick={() => setInfo(true)} aria-label="How spins work" className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-card text-muted">
          <span className="ms">info</span>
        </button>
      </div>

      <div className="mt-4 rounded-2xl border border-hairline bg-card p-5">
        {active ? (
          used ? (
            <div className="flex flex-col items-center py-6 text-center">
              <span className="ms fill text-[34px] text-teal-pale">check_circle</span>
              <p className="mt-2 text-sm font-bold text-fg">Today&apos;s spin is used</p>
              <p className="mt-1 text-[12px] text-muted">Next spin in <span className="font-bold tabular text-fg">{hh}:{mm}:{ss}</span></p>
              {store.lastSpin && <p className="mt-1 text-[11px] text-muted">Last result: {store.lastSpin.result?.label}</p>}
            </div>
          ) : (
            <SpinWheel gated={!active} onGate={() => setPaywall(true)} onResult={onResult} />
          )
        ) : (
          <div className="flex flex-col items-center py-4 text-center opacity-90">
            <SpinWheel gated hideButton onGate={() => setPaywall(true)} onResult={() => {}} />
            <button onClick={() => setPaywall(true)} className="mt-4 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white">
              Spin — members only
            </button>
          </div>
        )}
      </div>

      <Modal open={info} onClose={() => setInfo(false)} labelledBy="spin-info">
        <div className="flex items-center justify-between">
          <h3 id="spin-info" className="text-lg font-bold text-fg">How Daily Spin works</h3>
          <button onClick={() => setInfo(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
            <span className="ms">close</span>
          </button>
        </div>
        <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted">
          <p>One spin per daily cycle. Rewards are XP, Credits, competition entries, or no prize.</p>
          <p>The Home wheel and this page share one attempt and one cooldown.</p>
          <p>Reading or closing this sheet never starts a spin.</p>
        </div>
        <button onClick={() => setInfo(false)} className="mt-4 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">Got it</button>
      </Modal>

      <PaywallSheet open={paywall} onClose={() => setPaywall(false)} onPlans={() => navigate("/plans", { state: { from: "/spins" } })} reason="spin" />
      <Toast message={toast?.message} action={toast?.action} open={!!toast} onDone={() => setToast(null)} />
    </div>
  );
}
