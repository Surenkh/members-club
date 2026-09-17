import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PLANS, getMembership, setMembership, statusMeta } from "../lib/membership";
import { store } from "../lib/store";
import Modal from "../components/Modal";
import Chip from "../components/Chip";

export default function Subscription() {
  const navigate = useNavigate();
  const [m, setM] = useState(getMembership());
  const [confirmCancel, setConfirmCancel] = useState(false);
  const plan = PLANS.find((p) => p.id === m.plan);
  const meta = statusMeta(m.status);
  const history = store.billing;

  const refresh = () => setM(getMembership());

  const cancelRenewal = () => {
    const end = new Date();
    end.setMonth(end.getMonth() + 1);
    setMembership({ ...m, status: "cancelled", accessEnd: end.toISOString().slice(0, 10) });
    setConfirmCancel(false);
    refresh();
  };

  const resume = () => {
    setMembership({ ...m, status: "active", accessEnd: null });
    refresh();
  };

  const resolvePayment = () => {
    setMembership({ ...m, status: "active" });
    refresh();
  };

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/account" aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </Link>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">Subscription</h1>
      </div>

      <div className="mt-4 rounded-2xl border border-hairline bg-card p-4">
        <Chip icon={meta.icon} tone={m.status === "active" ? "teal" : m.status === "unsubscribed" || m.status === "inactive" ? "neutral" : "gold"}>
          {meta.label}
        </Chip>
        {plan ? (
          <div className="mt-3">
            <p className="text-[15px] font-bold text-fg">{plan.name} · {m.period}</p>
            <p className="mt-0.5 text-[12px] text-muted tabular">
              {m.status === "cancelled" && m.accessEnd ? `Access until ${m.accessEnd}` : m.renewalDate ? `Renews ${m.renewalDate}` : ""}
            </p>
            <p className="mt-1 text-[12px] text-muted">Member Card ···· 9012</p>
          </div>
        ) : (
          <p className="mt-3 text-[13px] text-muted">No active plan. View plans to subscribe.</p>
        )}
      </div>

      <div className="mt-3 space-y-2">
        {(m.status === "unsubscribed" || m.status === "inactive") && (
          <button onClick={() => navigate("/plans", { state: { from: "/account/subscription" } })} className="w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white">
            View plans
          </button>
        )}
        {m.status === "retry" && (
          <button onClick={resolvePayment} className="w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white">
            Resolve payment
          </button>
        )}
        {m.status === "semi" && (
          <button onClick={() => navigate("/plans", { state: { from: "/account/subscription" } })} className="w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white">
            Resubscribe
          </button>
        )}
        {m.status === "active" && (
          <>
            <button onClick={() => navigate("/plans", { state: { from: "/account/subscription" } })} className="w-full rounded-xl border border-hairline bg-card py-3.5 text-sm font-bold text-fg">
              Change plan
            </button>
            <button onClick={() => setConfirmCancel(true)} className="w-full rounded-xl border border-hairline bg-card py-3.5 text-sm font-bold text-muted">
              Cancel renewal
            </button>
          </>
        )}
        {m.status === "cancelled" && (
          <button onClick={resume} className="w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white">
            Resume renewal
          </button>
        )}
      </div>

      <h2 className="mt-6 font-display text-[17px] font-bold tracking-tight text-fg">Billing history</h2>
      <div className="mt-2.5 space-y-2">
        {history.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-card p-8 text-center">
            <p className="text-sm font-semibold text-fg">No invoices yet</p>
            <p className="mt-1 text-[12px] text-muted">Successful demo payments appear here with a receipt reference.</p>
          </div>
        )}
        {history.map((h, i) => (
          <div key={i} className="rounded-xl border border-hairline-soft bg-card px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-fg">{h.plan} · {h.period}</p>
              <span className="rounded bg-teal-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-pale">{h.status}</span>
            </div>
            <p className="mt-1 text-[11px] tabular text-muted">{h.date} · ${h.amount} {h.currency} · {h.method} · {h.ref}</p>
          </div>
        ))}
      </div>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} labelledBy="cancel-title">
        <h3 id="cancel-title" className="text-lg font-bold text-fg">Cancel renewal?</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Renewal stops, but your paid benefits stay active until the access-end date. You can resume anytime before then.
        </p>
        <div className="mt-4 space-y-2">
          <button onClick={cancelRenewal} className="w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">Confirm cancellation</button>
          <button onClick={() => setConfirmCancel(false)} className="w-full rounded-xl border border-hairline py-3 text-sm font-bold text-muted">Keep my plan</button>
        </div>
      </Modal>
    </div>
  );
}
