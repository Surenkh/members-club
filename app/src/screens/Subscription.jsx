import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PLANS, getMembership, setMembership, statusMeta, cancelScheduledChange } from "../lib/membership";
import { store } from "../lib/store";
import Modal from "../components/Modal";
import Chip from "../components/Chip";

export default function Subscription() {
  const navigate = useNavigate();
  const [m, setM] = useState(getMembership());
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [editPay, setEditPay] = useState(false);
  const [payForm, setPayForm] = useState({ brand: "Member Card", last4: "9012", expiry: "08/28" });
  const [payError, setPayError] = useState("");
  const [receipt, setReceipt] = useState(null);
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

      <button onClick={() => { setPayError(""); setEditPay(true); }} className="mt-3 flex w-full items-center gap-3.5 rounded-xl border border-hairline-soft bg-card px-4 py-4 text-left active:scale-[0.99]">
        <span className="ms text-muted">credit_card</span>
        <span className="flex-1 text-sm font-semibold text-fg">Payment method</span>
        <span className="text-[11px] font-bold text-muted">Member Card ···· 9012</span>
        <span className="ms text-faint">chevron_right</span>
      </button>

      {m.scheduledChange && (
        <div className="mt-3 rounded-2xl border border-gold/40 bg-gold/10 p-4">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-gold">Scheduled change</p>
          <p className="mt-1 text-sm font-bold text-fg">
            {(PLANS.find((p) => p.id === m.scheduledChange.toPlan) || {}).name} · {m.scheduledChange.toPeriod}
          </p>
          <p className="mt-0.5 text-[12px] text-muted">Effective {m.scheduledChange.effectiveDate}. Present benefits stay until then.</p>
          <button
            onClick={() => { cancelScheduledChange(); refresh(); }}
            className="mt-3 w-full rounded-xl border border-hairline bg-card py-2.5 text-[13px] font-bold text-muted"
          >
            Cancel scheduled change
          </button>
        </div>
      )}

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
          <button key={i} onClick={() => setReceipt(h)} className="w-full rounded-xl border border-hairline-soft bg-card px-4 py-3 text-left active:scale-[0.99]">
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-bold text-fg">{h.plan} · {h.period}</p>
              <span className="rounded bg-teal-soft px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-teal-pale">{h.status}</span>
            </div>
            <p className="mt-1 text-[11px] tabular text-muted">{h.date} · ${h.amount} {h.currency} · {h.method} · {h.ref}</p>
          </button>
        ))}
      </div>

      <Modal open={confirmCancel} onClose={() => setConfirmCancel(false)} labelledBy="cancel-title">        <h3 id="cancel-title" className="text-lg font-bold text-fg">Cancel renewal?</h3>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          Renewal stops, but your paid benefits stay active until the access-end date. You can resume anytime before then.
        </p>
        <div className="mt-4 space-y-2">
          <button onClick={cancelRenewal} className="w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">Confirm cancellation</button>
          <button onClick={() => setConfirmCancel(false)} className="w-full rounded-xl border border-hairline py-3 text-sm font-bold text-muted">Keep my plan</button>
        </div>
      </Modal>

      <Modal open={editPay} onClose={() => setEditPay(false)} labelledBy="pay-title">
        <div className="flex items-center justify-between">
          <h3 id="pay-title" className="text-lg font-bold text-fg">Payment method</h3>
          <button onClick={() => setEditPay(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-4 space-y-3">
          {[
            ["brand", "Card brand"],
            ["last4", "Last 4 digits"],
            ["expiry", "Expiry (MM/YY)"],
          ].map(([k, label]) => (
            <div key={k}>
              <label htmlFor={`pm-${k}`} className="mb-1.5 block text-[12px] font-bold text-fg">{label}</label>
              <input
                id={`pm-${k}`}
                value={payForm[k]}
                onChange={(e) => setPayForm({ ...payForm, [k]: e.target.value })}
                className="w-full rounded-xl border border-hairline bg-card px-3.5 py-3 text-sm text-fg outline-none placeholder:text-faint focus:border-indigo-bright"
              />
            </div>
          ))}
        </div>
        {payError && <p className="mt-2 text-[11px] font-semibold text-red-300">{payError}</p>}
        <button
          onClick={() => {
            if (!payForm.brand.trim() || !/^\d{4}$/.test(payForm.last4.trim()) || !/^\d{2}\/\d{2}$/.test(payForm.expiry.trim())) {
              setPayError("Check the brand, 4-digit number, and MM/YY expiry.");
              return;
            }
            try {
              const p = store.profile || {};
              store.setProfile({ ...p, payBrand: payForm.brand.trim(), payLast4: payForm.last4.trim(), payExpiry: payForm.expiry.trim() });
            } catch {}
            setEditPay(false);
          }}
          className="mt-4 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white"
        >
          Save payment method
        </button>
      </Modal>

      <Modal open={!!receipt} onClose={() => setReceipt(null)} labelledBy="receipt-title">
        {receipt && (
          <div>
            <div className="flex items-center justify-between">
              <h3 id="receipt-title" className="text-lg font-bold text-fg">Receipt</h3>
              <button onClick={() => setReceipt(null)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
            </div>
            <div className="mt-4 rounded-xl border border-hairline-soft bg-card p-4 text-[13px]">
              <div className="flex justify-between"><span className="text-muted">Reference</span><span className="font-mono font-bold text-fg">{receipt.ref}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Date</span><span className="font-bold tabular text-fg">{receipt.date}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Plan</span><span className="font-bold text-fg">{receipt.plan} · {receipt.period}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Amount</span><span className="font-bold tabular text-fg">${receipt.amount} {receipt.currency}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Method</span><span className="font-bold text-fg">{receipt.method}</span></div>
              <div className="mt-1.5 flex justify-between"><span className="text-muted">Status</span><span className="font-bold text-teal-pale">{receipt.status}</span></div>
            </div>
            <p className="mt-2 text-center text-[11px] text-muted">Demo receipt. No real payment was processed.</p>
          </div>
        )}
      </Modal>
    </div>
  );
}
