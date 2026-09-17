import { useState } from "react";
import { Link } from "react-router-dom";
import partners from "../data/partners.json";
import { store } from "../lib/store";
import { getMembership } from "../lib/membership";

export default function Discounts() {
  const [tab, setTab] = useState("Active");
  const memberState = getMembership();
  const subscribed = memberState.status === "active" || memberState.status === "cancelled";
  const claimedIds = store.claims;
  const activations = store.activations;
  const active = partners.items.filter((p) => claimedIds.has(p.id) && (activations[p.id]?.state || "ready") === "ready");
  const redeemed = partners.items.filter((p) => claimedIds.has(p.id) && activations[p.id]?.state === "redeemed");
  // History: static demo records plus any expired mock entry.
  const history = [
    { id: "h1", name: "Atelier Mercer · $75 Tailoring Credit", meta: "Used on Sep 2, 2026 · Single use", state: "Used" },
    { id: "h2", name: "Pine Ridge Lodge · 2nd Night", meta: "Expired Aug 31, 2026", state: "Expired" },
  ];

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/account" aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </Link>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">My Discounts</h1>
      </div>

      <div className="mt-4 flex rounded-xl border border-hairline bg-card p-1">
        {["Active", "History"].map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 rounded-lg py-2.5 text-[13px] font-bold transition ${tab === t ? "bg-cta text-white" : "text-muted"}`}>
            {t}
          </button>
        ))}
      </div>

      <div className="mt-3 space-y-2.5">
        {!subscribed ? (
          <div className="rounded-2xl border border-violet/40 bg-violet-soft p-5 text-center">
            <p className="text-sm font-bold text-fg">Claimed benefits live here</p>
            <p className="mt-1 text-[12px] text-muted">Subscribe to claim offers and reopen your passes anytime.</p>
            <Link to="/plans" state={{ from: "/account/discounts" }} className="mt-3 block rounded-xl bg-cta py-3 text-sm font-bold text-white">
              View plans
            </Link>
          </div>
        ) : null}
        {subscribed && tab === "Active" && active.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-card p-10 text-center">
            <span className="ms text-[34px] text-faint">redeem</span>
            <p className="mt-2 text-sm font-semibold text-fg">No discounts yet</p>
            <Link to="/partners" className="mt-1 inline-block text-[13px] font-bold text-indigo-bright">Explore partners</Link>
          </div>
        )}
        {subscribed && tab === "Active" && active.map((p) => (
          <Link to={`/partners/${p.id}`} key={p.id} className="flex items-center gap-3 rounded-2xl border border-hairline bg-card p-3.5 active:scale-[0.99]">
            <img src={p.image} alt={p.name} className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-fg">{p.name}</p>
              <p className="truncate text-[11px] font-semibold text-indigo-bright">{p.benefit}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wider text-teal-pale">Active · tap to reopen</p>
            </div>
            <span className="ms text-faint">chevron_right</span>
          </Link>
        ))}
        {subscribed && tab === "History" && redeemed.map((p) => (
          <div key={p.id} className="rounded-2xl border border-hairline-soft bg-card p-4 opacity-80">
            <p className="text-sm font-bold text-fg">{p.name}</p>
            <p className="mt-0.5 text-[11px] text-muted">Used on {activations[p.id]?.usedOn || "recorded date"} · QR confirmed</p>
            <span className="mt-2 inline-block rounded-md bg-card-2 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">Redeemed</span>
          </div>
        ))}
        {subscribed && tab === "History" && history.map((h) => (
          <div key={h.id} className="rounded-2xl border border-hairline-soft bg-card p-4 opacity-80">
            <p className="text-sm font-bold text-fg">{h.name}</p>
            <p className="mt-0.5 text-[11px] text-muted">{h.meta}</p>
            <span className="mt-2 inline-block rounded-md bg-card-2 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-muted">{h.state}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
