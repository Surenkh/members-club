import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import competitions from "../data/competitions.json";
import Countdown from "../components/Countdown";
import { formatDrawDate } from "../lib/time";
import { drawTarget } from "../lib/draw";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import Chip from "../components/Chip";

const GALLERY_LABELS = ["Aero Louvers", "Weissach Cockpit", "Diffuser", "Exhaust"];

export default function CompetitionDetails() {
  const { id } = useParams();
  const c = competitions.items.find((x) => x.id === id) || competitions.items[0];
  const target = drawTarget(c.id);
  const [bundle, setBundle] = useState(c.bundles[1] || c.bundles[0] || null);
  const [custom, setCustom] = useState(c.customDefault || 0);
  const [faq, setFaq] = useState(-1);
  const [showTickets, setShowTickets] = useState(false);
  const [ticketsOpen, setTicketsOpen] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [toast, setToast] = useState("");

  const totalEntries = bundle ? bundle.entries + bundle.bonus : 0;
  const price = bundle ? bundle.price : 0;
  const customTotal = (custom * (c.customPrice || 0)).toFixed(custom % 1 ? 2 : 0);

  return (
    <div className="pb-44">
      {/* Back */}
      <div className="px-4 pt-2">
        <Link to="/competitions" aria-label="Back" className="flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </Link>
      </div>

      {/* Hero */}
      <div className="relative mt-3">
        <img src={c.detailsImage} alt={c.detailsTitle} className="h-64 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/25 to-transparent" />
        <div className="absolute left-4 top-3 flex items-center gap-2">
          <Chip icon="emoji_events">Active Vault Draw</Chip>
          {c.vaultNo && <Chip icon="verified">{c.vaultNo}</Chip>}
        </div>
        {(c.assetClass || c.msrp) && (
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#c4cbe4]">{c.assetClass}</p>
              <p className="font-display text-[26px] font-bold leading-none text-white">{c.msrp} <span className="text-sm font-semibold">MSRP</span></p>
            </div>
            {c.cashOpt && <Chip tone="teal" icon="paid">{c.cashOpt}</Chip>}
          </div>
        )}
      </div>

      <div className="px-4 pt-4">
        {(c.drawLabel || c.drawNo) && (
          <div className="flex items-center justify-between text-[11px] font-semibold text-muted">
            <span>{c.drawLabel}</span>
            <span className="tabular">{c.drawNo}</span>
          </div>
        )}
        <h1 className="mt-1 font-display text-[26px] font-bold leading-tight tracking-tight text-fg">{c.detailsTitle}</h1>
        <p className="mt-1 text-sm text-muted">{c.detailsSubtitle}</p>

        {/* Time remaining */}
        <div className="mt-4 rounded-2xl border border-hairline bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Time Remaining</p>
            <Chip tone="teal" icon="schedule">Closing Soon</Chip>
          </div>
          <div className="mt-3 flex justify-center">
            <Countdown to={target} />
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-hairline-soft pt-3 text-[12px] text-muted">
            <span className="flex items-center gap-1.5"><span className="ms text-[15px]">event</span>{formatDrawDate(target)}</span>
            <span className="font-bold tabular text-fg">21:00 UTC</span>
          </div>
        </div>

        {/* Your entries */}
        <div className="mt-3 rounded-2xl border border-hairline bg-card p-4">
          <div className="flex items-center justify-between">
            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
              <span className="ms text-[15px]">confirmation_number</span> Your Entries
            </p>
            <p className="font-display text-xl font-bold tabular text-fg">{c.yourEntries} <span className="text-[11px] font-semibold text-muted">Total</span></p>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-2 text-center">
            <div className="rounded-lg bg-card-2 py-2">
              <p className="text-[10px] text-muted">Auto Entries</p>
              <p className="mt-0.5 text-sm font-bold tabular text-fg">{c.autoAllocated || c.yourEntries}</p>
            </div>
            <div className="rounded-lg bg-card-2 py-2">
              <p className="text-[10px] text-muted">Tier Two</p>
              <p className="mt-0.5 text-sm font-bold text-teal-pale">Active</p>
            </div>
            <div className="rounded-lg bg-card-2 py-2">
              <p className="text-[10px] text-muted">Purchased / Add-on</p>
              <p className="mt-0.5 text-sm font-bold tabular text-fg">0</p>
            </div>
          </div>
          {c.tickets && c.tickets.length > 0 && (
            <div className="mt-2 overflow-hidden rounded-lg border border-hairline-soft">
              <button onClick={() => setTicketsOpen(!ticketsOpen)} className="flex w-full items-center justify-between px-3 py-2.5 text-left">
                <span className="flex items-center gap-1.5 text-[12px] font-semibold text-muted">
                  <span className="ms text-[15px]">token</span> View Ticket Identifiers ({c.tickets.length})
                </span>
                <span className={`ms text-faint transition-transform ${ticketsOpen ? "rotate-180" : ""}`}>expand_more</span>
              </button>
              {ticketsOpen && (
                <div className="border-t border-hairline-soft px-3 py-2.5">
                  <p className="text-[11px] font-bold text-fg">Auto-Allocated ({c.tickets.length}) <span className="ml-1 font-semibold text-teal-pale">SHA-256 Verified</span></p>
                  <p className="mt-1.5 font-mono text-[11px] leading-relaxed tabular text-muted">{c.tickets.join(" ")}</p>
                  <p className="mt-2 text-[11px] font-bold text-fg">Purchased Add-ons (0)</p>
                  <p className="text-[11px] text-muted">No additional tickets purchased yet.</p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Bundles */}
        {c.bundles.length > 0 && (
          <>
            <div className="mt-4 flex items-center gap-2 rounded-xl border border-teal/30 bg-teal-soft px-3.5 py-2.5 text-[12px] text-teal-pale">
              <span className="ms text-[16px]">info</span>
              Available purchase limit <span className="ml-auto font-bold tabular text-fg">{c.purchaseLimit}</span>
            </div>
            <div className="mt-3 space-y-2.5">
              {c.bundles.map((b, i) => (
                <button
                  key={i}
                  onClick={() => setBundle(b)}
                  className={`relative flex w-full items-center justify-between rounded-2xl border p-4 text-left transition active:scale-[0.99] ${
                    bundle === b ? "border-indigo-bright bg-indigo-soft" : "border-hairline bg-card"
                  }`}
                >
                  {b.label && (
                    <span className={`absolute -top-2.5 right-4 rounded px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest text-white ${b.label === "Most Popular" ? "bg-gold-deep" : "bg-violet"}`}>
                      {b.label}
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-bold text-fg">{b.entries} Entries <span className="ml-1 text-[11px] font-semibold text-teal-pale">+{b.bonus} Bonus</span></p>
                    <p className="mt-1 text-[11px] text-muted tabular">${b.perEntry.toFixed(2)} per entry</p>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <span className="font-display text-lg font-bold tabular text-fg">${b.price}</span>
                    <span className={`flex h-5 w-5 items-center justify-center rounded-full border ${bundle === b ? "border-indigo-bright bg-indigo" : "border-hairline"}`}>
                      {bundle === b && <span className="ms text-[13px] text-white">check</span>}
                    </span>
                  </div>
                </button>
              ))}
              {/* Custom */}
              <div className="rounded-2xl border border-hairline bg-card p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-fg">Custom</p>
                    <p className="mt-0.5 text-[11px] text-muted tabular">${c.customPrice.toFixed(2)} per entry</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <button onClick={() => setCustom(Math.max(0, custom - 5))} aria-label="Fewer entries" className="h-9 w-9 rounded-lg border border-hairline bg-card-2 text-lg font-bold text-fg">-</button>
                    <span className="w-12 text-center font-display text-base font-bold tabular text-fg">{custom}</span>
                    <button title="Surprise me" onClick={() => setCustom(5 * (1 + Math.floor(Math.random() * 20)))} aria-label="Surprise me" className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-card-2 text-fg"><span className="ms text-[18px]">casino</span></button>
                    <button onClick={() => setCustom(custom + 5)} aria-label="More entries" className="h-9 w-9 rounded-lg border border-hairline bg-card-2 text-lg font-bold text-fg">+</button>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[10px] text-muted">entries</p>
                    <p className="font-display text-lg font-bold tabular text-fg">${customTotal}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Specs */}
        {c.specs && c.specs.length > 0 && (
          <>
            <h2 className="mt-6 font-display text-[17px] font-bold tracking-tight text-fg">Specifications & Logistics</h2>
            <div className="mt-3 grid grid-cols-2 gap-2.5">
              {c.specs.map((s) => (
                <div key={s.label} className="rounded-2xl border border-hairline bg-card p-3.5">
                  <span className="ms text-[20px] text-teal-pale">{s.icon}</span>
                  <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.14em] text-muted">{s.label}</p>
                  <p className="mt-0.5 font-display text-[17px] font-bold leading-tight text-fg">{s.value}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted">{s.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-2.5 flex gap-3 rounded-2xl border border-hairline bg-card p-4">
              <span className="ms shrink-0 text-[22px] text-teal-pale">flight_takeoff</span>
              <div>
                <p className="text-sm font-bold text-fg">{c.deliveryTitle}</p>
                <p className="mt-1 text-[12px] leading-relaxed text-muted">{c.deliveryText}</p>
              </div>
            </div>
            <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Asset Visual Inspection</p>
            <div className="scroll-thin -mx-4 mt-2.5 flex snap-x gap-2.5 overflow-x-auto px-4 pb-1">
              {["det-g1.jpg", "det-g2.jpg", "det-g3.jpg", "det-g4.jpg", "det-g5.jpg", "det-g6.jpg", "det-g7.jpg", "det-g8.jpg"].map((g, i) => (
                <div key={g} className="relative w-44 shrink-0 snap-start overflow-hidden rounded-xl border border-hairline">
                  <img src={`/assets/${g}`} alt={`${c.detailsTitle} inspection ${i + 1}`} className="h-28 w-full object-cover" />
                  {i < GALLERY_LABELS.length && (
                    <span className="absolute bottom-2 left-2 rounded-md bg-ink/65 px-2 py-1 text-[10px] font-bold text-fg backdrop-blur">{GALLERY_LABELS[i]}</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {/* FAQ */}
        {c.faq.length > 0 && (
          <>
            <h2 className="mt-6 text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Draw Governance & Rules</h2>
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
      {bundle && (
        <div className="fixed bottom-[76px] inset-x-0 z-30">
          <div className="mx-auto max-w-md px-4">
            <div className="flex items-center justify-between rounded-2xl border border-hairline bg-card-2/95 px-4 py-3 backdrop-blur" style={{ boxShadow: "var(--shadow-bar)" }}>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Total Due</p>
                <p className="font-display text-lg font-bold tabular text-fg">${price} <span className="text-[11px] font-semibold text-teal-pale">{totalEntries} entries</span></p>
              </div>
              <button onClick={() => setShowTickets(true)} className="flex items-center gap-1.5 rounded-xl bg-cta px-6 py-3 text-sm font-bold text-white active:scale-[0.98]">
                Continue <span className="ms text-[18px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tickets modal */}
      <Modal open={showTickets} onClose={() => setShowTickets(false)} labelledBy="tickets-title">
        <div className="flex items-center justify-between">
          <h3 id="tickets-title" className="text-lg font-bold text-fg">Confirm entries</h3>
          <button onClick={() => setShowTickets(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-4 rounded-xl border border-hairline-soft bg-card p-4">
          <p className="text-sm font-bold text-fg">{c.detailsTitle}</p>
          <p className="mt-1 text-[13px] text-muted">{totalEntries} entries · ${price}</p>
        </div>
        <button onClick={() => { setShowTickets(false); setShowCheckout(true); }} className="mt-4 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white active:scale-[0.98]">
          Proceed to payment
        </button>
      </Modal>

      {/* Checkout modal */}
      <Modal open={showCheckout} onClose={() => setShowCheckout(false)} labelledBy="checkout-title">
        <div className="flex items-center justify-between">
          <h3 id="checkout-title" className="text-lg font-bold text-fg">Payment</h3>
          <button onClick={() => setShowCheckout(false)} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
        </div>
        <div className="mt-4 space-y-2.5">
          <button onClick={() => { setShowCheckout(false); setToast("Entries added"); }} className="flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black active:scale-[0.98]">
            <span className="ms">file_download</span> Pay with Apple Pay
          </button>
          <button onClick={() => { setShowCheckout(false); setToast("Entries added"); }} className="flex w-full items-center justify-center gap-2 rounded-xl border border-hairline bg-card py-3.5 text-sm font-bold text-fg active:scale-[0.98]">
            <span className="ms">credit_card</span> Member Card ···· 9012
          </button>
        </div>
      </Modal>

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </div>
  );
}
