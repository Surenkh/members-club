import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PLANS, planPrice, subscribe, getMembership, previewPlanChange, applyPlanChange } from "../lib/membership";
import Modal from "../components/Modal";

export default function Plans() {
  const navigate = useNavigate();
  const location = useLocation();
  const origin = location.state?.from || "/";
  const [period, setPeriod] = useState("monthly");
  const [plan, setPlan] = useState(null);
  const [phase, setPhase] = useState("ready"); // ready | processing | failed | success | review
  const [record, setRecord] = useState(null);
  const [preview, setPreview] = useState(null);
  const currentMember = getMembership();
  const changing = currentMember.status === "active" && currentMember.plan && currentMember.plan !== (plan && plan.id);

  const startCheckout = (p) => {
    setPlan(p);
    if (currentMember.status === "active" && currentMember.plan && currentMember.plan !== p.id) {
      setPreview(previewPlanChange(currentMember, p.id, period));
      setPhase("review");
    } else {
      setPhase("ready");
    }
  };

  const confirm = (simulateFail) => {
    setPhase("processing");
    setTimeout(() => {
      if (simulateFail) {
        setPhase("failed");
        return;
      }
      const rec = subscribe(plan.id, period);
      setRecord(rec);
      setPhase("success");
    }, 1300);
  };

  const amount = plan ? planPrice(plan, period) : 0;

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <Link to={origin} aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </Link>
        <div>
          <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">Membership plans</h1>
          <p className="text-[12px] text-muted">Demo prices. No real payment is processed.</p>
        </div>
      </div>

      <div className="mt-4 flex rounded-xl border border-hairline bg-card p-1">
        {["monthly", "yearly"].map((x) => (
          <button
            key={x}
            onClick={() => setPeriod(x)}
            className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold capitalize transition ${period === x ? "bg-cta text-white" : "text-muted"}`}
          >
            {x}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-3">
        {PLANS.map((p) => (
          <div key={p.id} className={`rounded-2xl border p-4 ${p.recommended ? "border-indigo-bright bg-indigo-soft" : "border-hairline bg-card"}`}>
            <div className="flex items-center justify-between">
              <p className="flex items-center gap-2 text-[15px] font-bold text-fg">
                <span className="ms text-[19px] text-gold">{p.icon}</span> {p.name}
              </p>
              {p.recommended && <span className="rounded bg-gold/20 px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-gold">Recommended</span>}
            </div>
            <p className="mt-1 font-display text-[26px] font-bold text-fg">
              ${period === "yearly" ? p.yearly : p.monthly}
              <span className="ml-1 text-[12px] font-semibold text-muted">/ {period === "yearly" ? "year" : "month"}</span>
            </p>
            {period === "yearly" && <p className="text-[11px] text-muted">Charged ${p.yearly} once per year.</p>}
            <p className="mt-1 text-[12px] text-muted">{p.blurb}</p>
            <ul className="mt-2.5 space-y-1">
              {p.perks.map((perk) => (
                <li key={perk} className="flex items-center gap-2 text-[12px] text-fg">
                  <span className="ms fill text-[15px] text-teal-pale">check_circle</span> {perk}
                </li>
              ))}
            </ul>
            <button onClick={() => startCheckout(p)} className="mt-3.5 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white active:scale-[0.98]">
              {currentMember.status === "active" && currentMember.plan === p.id ? "Current plan" : `Choose ${p.name}`}
            </button>
          </div>
        ))}
      </div>

      <Modal open={!!plan} onClose={() => (phase === "processing" ? null : setPlan(null))} labelledBy="checkout-title">
        {plan && phase === "review" && preview && (
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-fg">{preview.kind === "upgrade" ? "Upgrade plan" : "Schedule plan change"}</h3>
              <button onClick={() => setPlan(null)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
                <span className="ms">close</span>
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-hairline-soft bg-card p-4 text-[13px]">
              <div className="flex justify-between"><span className="text-muted">Change to</span><span className="font-bold text-fg">{plan.name} · {period}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Amount due now</span><span className="font-bold tabular text-fg">${preview.amountDue} USD</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Effective</span><span className="font-bold text-fg">{preview.effectiveDate}</span></div>
            </div>
            <p className="mt-2.5 text-[12px] leading-relaxed text-muted">{preview.note}</p>
            <button
              onClick={() => {
                if (preview.kind === "upgrade") {
                  applyPlanChange(plan.id, period, preview);
                  setPhase("success");
                  setRecord({ amount: preview.amountDue, period, ref: "MB-CHANGE" });
                } else {
                  applyPlanChange(plan.id, period, preview);
                  setPlan(null);
                  navigate(origin);
                }
              }}
              className="mt-4 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white active:scale-[0.98]"
            >
              {preview.kind === "upgrade" ? `Confirm upgrade — $${preview.amountDue}` : "Schedule change"}
            </button>
          </div>
        )}
        {plan && phase !== "success" && phase !== "review" && (
          <div>
            <div className="flex items-center justify-between">
              <h3 id="checkout-title" className="text-lg font-bold text-fg">Checkout</h3>
              <button onClick={() => setPlan(null)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
                <span className="ms">close</span>
              </button>
            </div>
            <div className="mt-4 rounded-xl border border-hairline-soft bg-card p-4 text-[13px]">
              <div className="flex justify-between"><span className="text-muted">Plan</span><span className="font-bold text-fg">{plan.name} · {period}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Amount due now</span><span className="font-bold tabular text-fg">${amount} USD</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Renews</span><span className="font-bold text-fg">{period === "yearly" ? "Yearly" : "Monthly"}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Method</span><span className="font-bold text-fg">Member Card ···· 9012</span></div>
            </div>
            {phase === "failed" && (
              <p className="mt-3 rounded-xl border border-red-400/40 bg-red-400/10 px-4 py-3 text-[12px] font-semibold text-red-300">
                Payment failed (demo). Nothing was charged and your selection is kept.
              </p>
            )}
            <button
              disabled={phase === "processing"}
              onClick={() => confirm(false)}
              className="mt-4 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white active:scale-[0.98] disabled:opacity-60"
            >
              {phase === "processing" ? "Processing..." : phase === "failed" ? "Retry: Subscribe" : `Subscribe: $${amount}`}
            </button>
            {phase !== "processing" && (
              <button onClick={() => confirm(true)} className="mt-2 w-full py-1 text-[11px] font-semibold text-faint">
                Simulate a failed payment
              </button>
            )}
          </div>
        )}
        {plan && phase === "success" && record && (
          <div className="flex flex-col items-center text-center">
            <span className="ms fill text-[44px] text-teal-pale">check_circle</span>
            <h3 className="mt-2 text-lg font-bold text-fg">Welcome to {plan.name}</h3>
            <p className="mt-1 text-[13px] text-muted">${record.amount} USD · {record.period} · renews {record.period === "yearly" ? "yearly" : "monthly"}</p>
            <p className="mt-1 text-[12px] text-muted">Receipt {record.ref} saved to billing history.</p>
            <button onClick={() => navigate(origin)} className="mt-4 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white">Continue</button>
          </div>
        )}
      </Modal>
    </div>
  );
}
