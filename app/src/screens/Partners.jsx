import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import partners from "../data/partners.json";
import { store } from "../lib/store";
import { getMembership } from "../lib/membership";
import Chip from "../components/Chip";
import Modal from "../components/Modal";
import QRPass from "../components/QRPass";
import Toast from "../components/Toast";
import PaywallSheet from "../components/PaywallSheet";
import ImageWithSkeleton from "../components/ImageWithSkeleton";

export default function Partners() {
  const navigate = useNavigate();
  const memberState = getMembership();
  const eligible = memberState.status === "active" || memberState.status === "cancelled";
  const [cat, setCat] = useState(() => {
    try {
      return sessionStorage.getItem("filter:partners-cat") || "All Perks";
    } catch {
      return "All Perks";
    }
  });
  const [q, setQ] = useState(() => {
    try {
      return sessionStorage.getItem("filter:partners-q") || "";
    } catch {
      return "";
    }
  });
  const [searchOpen, setSearchOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [claimed, setClaimed] = useState(() => store.claims);
  const [saved, setSaved] = useState(() => store.saved);
  const [toast, setToast] = useState("");
  const [copied, setCopied] = useState(false);
  const [paywall, setPaywall] = useState(false);
  const claimedCount = partners.summary.claimedThisMonth + claimed.size;

  const list = useMemo(() => {
    try {
      sessionStorage.setItem("filter:partners-cat", cat);
      sessionStorage.setItem("filter:partners-q", q);
    } catch {}
    const inCat = cat === "All Perks" ? partners.items : partners.items.filter((p) => p.category === cat);
    if (!q) return inCat;
    return inCat.filter((p) => (p.name + " " + p.benefit + " " + p.category).toLowerCase().includes(q.toLowerCase()));
  }, [cat, q]);

  const openClaim = (p) => {
    if (!eligible && !claimed.has(p.id)) {
      setPaywall(true);
      return;
    }
    setDetail(p);
  };

  const claim = (p) => {
    setClaimed(store.addClaim(p.id));
    setCopied(false);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {}
    setCopied(true);
    setToast("Pass code copied");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[26px] font-bold tracking-tight text-fg">Partner Privileges</h1>
          <p className="mt-1 text-sm text-muted">Curated member concessions & tier perks</p>
        </div>
        <button
          onClick={() => setSearchOpen(!searchOpen)}
          aria-label="Search partners"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-muted"
        >
          <span className="ms">search</span>
        </button>
      </div>

      {searchOpen && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-hairline bg-card px-3.5">
          <span className="ms text-faint">search</span>
          <input
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search partners"
            className="w-full bg-transparent py-3 text-sm text-fg outline-none placeholder:text-faint"
          />
        </div>
      )}

      {/* Summary chips */}
      <div className="scroll-thin mt-4 flex gap-2 overflow-x-auto pb-1">
        <Chip icon="verified">{partners.summary.activePerks} Active Perks</Chip>
        <Chip icon="redeem" tone="teal">{claimedCount} Claimed This Month</Chip>
        <Chip icon="workspace_premium" tone="violet">{partners.summary.tierScope}</Chip>
      </div>

      {/* Category chips */}
      <div className="scroll-thin mt-2.5 flex gap-2 overflow-x-auto pb-1">
        {partners.categories.map((c) => (
          <button
            key={c.key}
            onClick={() => setCat(c.key)}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-[12px] font-bold transition ${
              cat === c.key ? "border-transparent bg-cta text-white" : "border-hairline bg-card text-muted"
            }`}
          >
            {c.key} <span className="tabular opacity-80">({c.count})</span>
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-4 space-y-4">
        {list.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-hairline bg-card">
            <div className="relative">
              <ImageWithSkeleton src={p.image} alt={p.name} className="h-52 w-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/60 to-transparent" />
              <div className="absolute left-3 top-3">
                <span className="rounded-md bg-ink/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-pale backdrop-blur">{p.tierChip}</span>
              </div>
              <button
                onClick={() => setSaved(store.toggleSaved(p.id))}
                aria-label="Save perk"
                className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-ink/60 text-fg backdrop-blur"
              >
                <span className={`ms text-[19px] ${saved.has(p.id) ? "fill" : ""}`}>bookmark_border</span>
              </button>
            </div>
            <div className="p-4">
              <p className="text-[17px] font-bold leading-snug text-fg">{p.name}</p>
              <p className="mt-1 text-sm font-bold text-indigo-bright">{p.benefit}</p>
              <p className="mt-1 text-[12px] leading-relaxed text-muted">{p.detail}</p>
              <div className="mt-3.5 flex items-center gap-2.5">
                {claimed.has(p.id) ? (
                  <Link to={`/partners/${p.id}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold uppercase tracking-wide text-pine active:scale-[0.98]">
                    <span className="ms text-[19px]">qr_code_2</span> View Pass
                  </Link>
                ) : (
                  <button
                    onClick={() => openClaim(p)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cta py-3 text-sm font-bold uppercase tracking-wide text-white active:scale-[0.98]"
                  >
                    <span className="ms text-[19px]">featured_seasonal_and_gifts</span> {p.ctaLabel}
                  </button>
                )}
                <button onClick={() => setDetail(p)} aria-label="Quick look" className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl border border-hairline bg-card-2 text-muted active:scale-[0.98]">
                  <span className="ms">qr_code_2</span>
                </button>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="rounded-2xl border border-dashed border-hairline bg-card p-10 text-center">
            <span className="ms text-[34px] text-faint">loyalty</span>
            <p className="mt-2 text-sm font-semibold text-fg">No partners match</p>
            <p className="mt-1 text-xs text-muted">Try a different category or search.</p>
          </div>
        )}
      </div>

      {/* Curated section */}
      <div className="mt-6 flex items-center justify-between">
        <h2 className="font-display text-[17px] font-bold tracking-tight text-fg">Curated Partner Benefits</h2>
        <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Filtered: {cat === "All Perks" ? "All" : cat}</span>
      </div>

      {/* How to redeem */}
      <div className="mt-4 rounded-2xl border border-hairline bg-card p-4">
        <h3 className="flex items-center gap-2 text-[15px] font-bold text-fg">
          <span className="ms text-[19px] text-teal-pale">info</span> How to redeem perks
        </h3>
        <ol className="mt-3 space-y-2.5">
          {partners.howTo.map((t, i) => (
            <li key={i} className="flex gap-2.5 text-[12px] leading-relaxed text-muted">
              <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-soft text-[10px] font-bold text-indigo-bright">{i + 1}</span>
              {t}
            </li>
          ))}
        </ol>
      </div>

      {/* Claim + QR pass pop-up */}
      <Modal open={!!detail} onClose={() => setDetail(null)} labelledBy="perk-title">
        {detail && (
          <div>
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 id="perk-title" className="text-lg font-bold text-fg">{detail.name}</h3>
                <p className="mt-0.5 text-[12px] text-muted">Curated Partner Benefits · Filtered: {cat === "All Perks" ? "All" : cat}</p>
              </div>
              <button onClick={() => setDetail(null)} aria-label="Close" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
            </div>
            <div className="relative mt-4 overflow-hidden rounded-xl">
              <ImageWithSkeleton src={detail.image} alt={detail.name} className="h-36 w-full" />
              <div className="absolute left-2.5 top-2.5">
                <span className="rounded-md bg-ink/60 px-2 py-1 text-[10px] font-bold uppercase tracking-widest text-teal-pale backdrop-blur">{detail.tierChip}</span>
              </div>
            </div>
            <p className="mt-3 text-sm font-bold text-indigo-bright">{detail.benefit}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-muted">{detail.detail}</p>
            {claimed.has(detail.id) ? (
              <div className="mt-4 flex flex-col items-center rounded-2xl border border-teal/40 bg-teal-soft/40 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-teal-pale">
                  <span className="ms fill text-[15px]">verified</span> Privilege claimed · pass ready
                </p>
                <div className="mt-3">
                  <QRPass passId={detail.passCode || `MB-${detail.id.toUpperCase()}`} />
                </div>
                <div className="mt-3 flex w-full items-center justify-between rounded-xl border border-hairline bg-card-2 px-4 py-2.5">
                  <span className="text-sm font-bold tabular text-fg">{detail.passCode || `MB-${detail.id.toUpperCase()}`}</span>
                  <button onClick={() => copyCode(detail.passCode || detail.id)} className="flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 py-1.5 text-[12px] font-bold text-muted active:scale-[0.98]">
                    <span className="ms text-[16px]">{copied ? "check" : "content_copy"}</span>
                    {copied ? "Copied" : "Copy"}
                  </button>
                </div>
                <Link to={`/partners/${detail.id}`} className="mt-3 text-[12px] font-bold text-indigo-bright">Open full pass screen</Link>
              </div>
            ) : (
              <button onClick={() => claim(detail)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cta py-3.5 text-sm font-bold uppercase tracking-wide text-white active:scale-[0.98]">
                <span className="ms text-[19px]">featured_seasonal_and_gifts</span> {detail.ctaLabel}
              </button>
            )}
          </div>
        )}
      </Modal>

      <PaywallSheet open={paywall} onClose={() => setPaywall(false)} onPlans={() => navigate("/plans", { state: { from: "/partners" } })} reason="claim" />

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </div>
  );
}
