import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import competitions from "../data/competitions.json";
import Countdown from "../components/Countdown";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Chip from "../components/Chip";

export default function CompetitionDetails() {
  const { id } = useParams();
  const c = competitions.find((x) => x.id === id) || competitions[0];
  const [bundle, setBundle] = useState(c.bundles[1] || c.bundles[0] || null);
  const [custom, setCustom] = useState(0);
  const [faq, setFaq] = useState(-1);
  const [showTickets, setShowTickets] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState("");

  const totalEntries = bundle ? bundle.entries + bundle.bonus : 0;
  const price = bundle ? bundle.price : 0;

  return (
    <div className="pb-28">
      {/* Hero */}
      <div className="relative">
        <img src={c.image} alt="" className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <Link to="/competitions" className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-ink/60 backdrop-blur">
          <span className="ms text-fg">arrow_back</span>
        </Link>
        <div className="absolute bottom-4 left-4 right-4">
          <Chip tone="teal" icon="schedule" className="mb-2">Draw in</Chip>
          <h1 className="text-2xl font-bold tracking-tight text-white">{c.title}</h1>
          <p className="mt-0.5 text-sm text-[#c4cbe4]">{c.subtitle}</p>
        </div>
      </div>

      <div className="px-4 pt-4">
        <div className="flex justify-center">
          <Countdown to={c.drawDate} />
        </div>

        {/* Pool + your entries */}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-hairline bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Prize pool</p>
            <p className="mt-1 text-xl font-bold tabular text-fg">${c.pool.toLocaleString()}</p>
          </div>
          <div className="rounded-2xl border border-hairline bg-card p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Your entries</p>
            <p className="mt-1 text-xl font-bold tabular text-fg">{c.yourEntries}</p>
          </div>
        </div>

        {/* Bundles */}
        <h2 className="mt-6 text-base font-bold text-fg">Entry bundles</h2>
        <div className="mt-3 space-y-2.5">
          {c.bundles.map((b, i) => (
            <button
              key={i}
              onClick={() => setBundle(b)}
              className={`flex w-full items-center justify-between rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                bundle === b ? "border-indigo-bright bg-indigo-soft" : "border-hairline bg-card"
              }`}
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-fg">{b.entries} Entries</span>
                  <span className="text-[11px] font-semibold text-teal">+{b.bonus} Bonus</span>
                  {b.label && <Chip tone="violet">{b.label}</Chip>}
                </div>
                <p className="mt-1 text-[11px] text-muted tabular">${b.perEntry.toFixed(2)} per entry</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="text-base font-bold tabular text-fg">${b.price}</span>
                <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${bundle === b ? "border-indigo-bright bg-indigo" : "border-hairline"}`}>
                  {bundle === b && <span className="ms text-[13px] text-white">check</span>}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Custom */}
        <div className="mt-3 rounded-2xl border border-hairline bg-card p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-fg">Custom amount</p>
              <p className="mt-0.5 text-[11px] text-muted">Min 5 entries</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => setCustom(Math.max(0, custom - 5))} className="h-9 w-9 rounded-lg border border-hairline bg-card-2 text-lg font-bold text-fg">-</button>
              <span className="w-10 text-center text-lg font-bold tabular text-fg">{custom}</span>
              <button onClick={() => setCustom(custom + 5)} className="h-9 w-9 rounded-lg border border-hairline bg-card-2 text-lg font-bold text-fg">+</button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        {c.faq.length > 0 && (
          <>
            <h2 className="mt-6 text-base font-bold text-fg">Details</h2>
            <div className="mt-3 space-y-2">
              {c.faq.map((f, i) => (
                <div key={i} className="overflow-hidden rounded-xl border border-hairline bg-card">
                  <button onClick={() => setFaq(faq === i ? -1 : i)} className="flex w-full items-center justify-between px-4 py-3.5 text-left">
                    <span className="text-[13px] font-semibold text-fg">{f.q}</span>
                    <span className={`ms text-faint transition-transform ${faq === i ? "rotate-180" : ""}`}>expand_more</span>
                  </button>
                  {faq === i && <p className="px-4 pb-4 text-[13px] leading-relaxed text-muted">{f.a}</p>}
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Sticky bar */}
      <div className="fixed bottom-[76px] inset-x-0 z-30">
        <div className="mx-auto max-w-md px-4">
          <div className="flex items-center justify-between rounded-2xl border border-hairline bg-card-2/95 px-4 py-3 backdrop-blur" style={{ boxShadow: "var(--shadow-bar)" }}>
            <div>
              <p className="text-[11px] text-muted">{totalEntries} entries</p>
              <p className="text-lg font-bold tabular text-fg">${price}</p>
            </div>
            <button onClick={() => setShowTickets(true)} className="rounded-xl bg-indigo px-6 py-3 text-sm font-bold text-white active:scale-[0.98]">
              Continue
            </button>
          </div>
        </div>
      </div>

      {/* Tickets modal */}
      <Modal open={showTickets} onClose={() => setShowTickets(false)} labelledBy="tickets-title">
        <div className="flex items-center justify-between">
          <h3 id="tickets-title" className="text-lg font-bold text-fg">Confirm entries</h3>
          <button onClick={() => setShowTickets(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-4 rounded-xl border border-hairline-soft bg-card p-4">
          <p className="text-sm font-bold text-fg">{c.title}</p>
          <p className="mt-1 text-[13px] text-muted">{totalEntries} entries · ${price}</p>
        </div>
        <button
          onClick={() => { setShowTickets(false); setShowCheckout(true); }}
          className="mt-4 w-full rounded-xl bg-indigo py-3.5 text-sm font-bold text-white active:scale-[0.98]"
        >
          Proceed to payment
        </button>
      </Modal>

      {/* Checkout modal */}
      <Modal open={showCheckout} onClose={() => setShowCheckout(false)} labelledBy="checkout-title">
        <div className="flex items-center justify-between">
          <h3 id="checkout-title" className="text-lg font-bold text-fg">Payment</h3>
          <button onClick={() => setShowCheckout(false)} className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-4 space-y-2.5">
          <button onClick={() => { setShowCheckout(false); setToast("Entries added"); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black active:scale-[0.98]">
            <span className="ms">file_download</span> Pay with Apple Pay
          </button>
          <button onClick={() => { setShowCheckout(false); setToast("Entries added"); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-card py-3.5 text-sm font-bold text-fg active:scale-[0.98]">
            <span className="ms">credit_card</span> Sovereign Card ···· 9012
          </button>
        </div>
      </Modal>

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </div>
  );
}
