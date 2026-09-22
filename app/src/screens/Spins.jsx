import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
    if (!active) return;
    if (r.type === "xp") store.addXp(r.value);
    if (r.type === "cash") store.addPoints(r.value);
    store.setLastSpin({ label: Array.isArray(r.label) ? r.label.join(" ") : r.label, type: r.type, value: r.value || 0 });
    bump((v) => v + 1);
    setToast({
      message:
        r.type === "xp" ? `+${r.value} XP added`
        : r.type === "cash" ? `$${r.value} cash added`
        : r.type === "retry" ? "One more spin"
        : "No win this time",
    });
  };

  const close = () => {
    if (!info) navigate("/");
  };

  return (
    <>
    <Modal open={true} onClose={close} labelledBy="spin-title">
      <div className="flex items-center justify-between">
        <span className="rounded-full border border-teal/40 bg-teal-soft px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-teal-pale">
          Daily Fortune Wheel
        </span>
        <div className="flex shrink-0 items-center gap-2">
          <button onClick={() => setInfo(true)} aria-label="How spins work" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-muted">
            <span className="ms">info</span>
          </button>
          <button onClick={close} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
            <span className="ms">close</span>
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2.5">
        <span className="ms fill text-[30px] text-gold">casino</span>
        <h1 id="spin-title" className="font-display text-[22px] font-bold tracking-tight text-fg">Daily Spin</h1>
      </div>
      <p className="mt-1 text-[12px] text-muted">One spin per daily cycle</p>

       <div className="mt-4 text-center">
        {active ? (
          <div className="rounded-2xl border border-hairline bg-card p-4">
            <SpinWheel disabled={used} cooldown={used ? `${hh}:${mm}:${ss}` : null} onResult={onResult} />
          </div>
        ) : (
          <div className="flex flex-col items-center py-4 text-center">
            <div className="w-full rounded-2xl border border-hairline bg-card p-4">
              <SpinWheel claimAction={() => setPaywall(true)} onResult={() => {}} />
            </div>
            <p className="mt-3 max-w-[260px] text-[12px] text-muted">Spin to reveal a prize, then claim it as a member.</p>
          </div>
        )}
        {active && used && store.lastSpin && <p className="mt-2.5 text-center text-[11px] text-muted tabular">Last result: {store.lastSpin.result?.label}</p>}
      </div>
    </Modal>

      <Modal open={info} onClose={() => setInfo(false)} labelledBy="spin-info">
        <div className="flex items-center justify-between">
          <h3 id="spin-info" className="text-lg font-bold text-fg">How Daily Spin works</h3>
          <button onClick={() => setInfo(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
            <span className="ms">close</span>
          </button>
        </div>
        <div className="mt-3 space-y-2 text-[13px] leading-relaxed text-muted">
          <p>One spin per daily cycle. Rewards are XP, Credits, competition entries, or no prize.</p>
          <p>The Home wheel and Daily Spin share one attempt and one cooldown.</p>
          <p>Reading or closing this sheet never starts a spin.</p>
        </div>
        <button onClick={() => setInfo(false)} className="mt-4 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">Got it</button>
      </Modal>

      <PaywallSheet open={paywall} onClose={() => setPaywall(false)} onPlans={() => navigate("/plans", { state: { from: "/spins" } })} reason="spin" />
      <Toast message={toast?.message} action={toast?.action} open={!!toast} onDone={() => setToast(null)} />
    </>
  );
}
