import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import partners from "../data/partners.json";
import Chip from "../components/Chip";
import QRPass from "../components/QRPass";
import Toast from "../components/Toast";
import { store } from "../lib/store";

const VERIFY_STATES = ["Valid", "Redeemed", "Expired", "Invalid"];

export default function ClaimQR() {
  const { id } = useParams();
  const p = partners.items.find((x) => x.id === id) || partners.items[0];
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState("");
  const [preview, setPreview] = useState("Valid");
  const [, bump] = useState(0);
  const passCode = p.passCode || "MB-" + p.id.toUpperCase() + "-8841";
  const activation = store.activations[p.id] || { state: "ready", usedOn: null };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(passCode);
    } catch {}
    setCopied(true);
    setToast("Pass code copied");
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="pb-6">
      {/* Hero */}
      <div className="relative">
        <img src={p.image} alt={p.name} className="h-56 w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />
        <Link to="/partners" className="absolute left-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-hairline bg-ink/60 backdrop-blur">
          <span className="ms text-fg">arrow_back</span>
        </Link>
      </div>

      <div className="px-4 -mt-6">
        <div className="rounded-2xl border border-hairline bg-card p-5" style={{ boxShadow: "var(--shadow-pop)" }}>
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">{p.category}</p>
              <h1 className="mt-1 text-xl font-bold tracking-tight text-fg">{p.name}</h1>
              <p className="mt-0.5 text-sm font-semibold text-indigo-bright">{p.benefit}</p>
            </div>
            <Chip tone="teal" icon="verified">Claimed</Chip>
          </div>

          {/* QR */}
          <div className="mt-5 flex flex-col items-center">
            <QRPass passId={passCode} />
            <div className="mt-4 flex w-full items-center justify-between rounded-xl border border-hairline bg-card-2 px-4 py-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted">Pass code</p>
                <p className="mt-0.5 text-sm font-bold tabular text-fg">{passCode}</p>
              </div>
              <button onClick={copy} className="flex items-center gap-1.5 rounded-lg border border-hairline bg-card px-3 py-2 text-[12px] font-bold text-muted active:scale-[0.98]">
                <span className="ms text-[16px]">{copied ? "check" : "content_copy"}</span>
                {copied ? "Copied" : "Copy"}
              </button>
            </div>
            <p className="mt-3 max-w-[280px] text-center text-[11px] leading-relaxed text-muted">
              Present your active tier credentials embedded in your profile pass for instant authorization.
            </p>
          </div>

          <button onClick={() => setToast("Pass saved to wallet (demo)")} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3.5 text-sm font-bold text-black active:scale-[0.98]">
            <span className="ms">account_balance_wallet</span> Add to Apple Wallet
          </button>

          {activation.state === "redeemed" ? (
            <p className="mt-3 rounded-xl border border-hairline-soft bg-card-2 px-4 py-3 text-center text-[12px] font-bold text-muted">
              Redeemed{activation.usedOn ? ` · Used on ${activation.usedOn}` : ""}. This activation is read-only.
            </p>
          ) : null}
        </div>
      </div>

      {/* Demo verification preview (presenter tool, not a customer control) */}
      <div className="mx-4 mt-4 rounded-2xl border border-dashed border-hairline bg-card p-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-muted">Demo · verification preview</p>
        <div className="mt-2.5 flex gap-1.5">
          {VERIFY_STATES.map((s) => (
            <button
              key={s}
              onClick={() => setPreview(s)}
              className={`flex-1 rounded-lg border px-1 py-2 text-[11px] font-bold transition ${preview === s ? "border-transparent bg-cta text-white" : "border-hairline bg-card-2 text-muted"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <p className="mt-2.5 text-[12px] text-muted">
          {preview === "Valid" && "Staff scan would accept this pass."}
          {preview === "Redeemed" && "Staff scan would reject it as already redeemed."}
          {preview === "Expired" && "Staff scan would reject it as expired."}
          {preview === "Invalid" && "Staff scan would reject it as invalid."}
        </p>
        {preview === "Valid" && activation.state !== "redeemed" && (
          <button
            onClick={() => {
              const today = new Date().toISOString().slice(0, 10);
              store.setActivation(p.id, { state: "redeemed", usedOn: today, method: "QR" });
              bump((v) => v + 1);
              setToast("Partner confirmed redemption");
            }}
            className="mt-3 w-full rounded-xl border border-hairline bg-card-2 py-3 text-[13px] font-bold text-fg active:scale-[0.98]"
          >
            Confirm partner redemption (demo)
          </button>
        )}
      </div>

      <Toast message={toast} open={!!toast} onDone={() => setToast("")} />
    </div>
  );
}
