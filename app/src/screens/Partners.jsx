import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import partners from "../data/partners.json";
import member from "../data/member.json";
import Chip from "../components/Chip";
import Modal from "../components/Modal";
import QRPass from "../components/QRPass";

const CATS = ["All Perks", "Food & Beverage", "Aviation & Travel", "Wellness & Spa", "Luxury Retail", "Clubs & Access"];

export default function Partners() {
  const [cat, setCat] = useState("All Perks");
  const [q, setQ] = useState("");
  const [qr, setQr] = useState(null);
  const [claimed, setClaimed] = useState(() => new Set(partners.filter((p) => p.claimed).map((p) => p.id)));

  const list = useMemo(() => {
    return partners.filter((p) => {
      const okCat = cat === "All Perks" || p.category === cat;
      const okQ = !q || (p.name + " " + p.benefit + " " + p.category).toLowerCase().includes(q.toLowerCase());
      return okCat && okQ;
    });
  }, [cat, q]);

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-fg">Partner Privileges</h1>
          <p className="mt-1 text-sm text-muted">Curated member concessions & tier perks</p>
        </div>
        <Chip tone="violet" icon="redeem">{claimed.size} claimed</Chip>
      </div>

      {/* Search */}
      <div className="mt-4 flex items-center gap-2 rounded-xl border border-hairline bg-card px-3.5">
        <span className="ms text-faint">search</span>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search partners"
          className="w-full bg-transparent py-3 text-sm text-fg outline-none placeholder:text-faint"
        />
      </div>

      {/* Category chips */}
      <div className="scroll-thin mt-3.5 flex gap-2 overflow-x-auto pb-1">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`shrink-0 rounded-lg border px-3.5 py-2 text-[12px] font-bold transition ${
              cat === c ? "border-transparent bg-indigo text-white" : "border-hairline bg-card text-muted"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="mt-4 space-y-3.5">
        {list.map((p) => (
          <div key={p.id} className="overflow-hidden rounded-2xl border border-hairline bg-card">
            <div className="relative">
              <img src={p.image} alt="" className="h-40 w-full object-cover" />
              <div className="absolute left-3 top-3">
                <Chip tone={p.tier.includes("Sovereign") ? "violet" : p.tier.includes("Apex") ? "gold" : "teal"} icon="workspace_premium">
                  {p.tier}
                </Chip>
              </div>
            </div>
            <div className="p-4">
              <p className="text-[15px] font-bold text-fg">{p.name}</p>
              <p className="mt-0.5 text-sm font-semibold text-indigo-bright">{p.benefit}</p>
              <p className="mt-1 text-xs text-muted">{p.detail}</p>
              <div className="mt-3.5 flex items-center gap-2.5">
                {claimed.has(p.id) ? (
                  <Link to={`/partners/${p.id}`} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-teal py-3 text-sm font-bold text-pine active:scale-[0.98]">
                    <span className="ms">qr_code_2</span> View Pass
                  </Link>
                ) : (
                  <button
                    onClick={() => setClaimed((s) => new Set(s).add(p.id))}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-indigo py-3 text-sm font-bold text-white active:scale-[0.98]"
                  >
                    <span className="ms">featured_seasonal_and_gifts</span>
                    {p.category === "Clubs & Access" ? "Claim Privilege" : "Claim Concession"}
                  </button>
                )}
                <button onClick={() => setQr(p)} aria-label="Quick QR" className="flex h-[46px] w-[46px] items-center justify-center rounded-xl border border-hairline bg-card-2 text-muted active:scale-[0.98]">
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

      {/* QR modal */}
      <Modal open={!!qr} onClose={() => setQr(null)} labelledBy="qr-title">
        {qr && (
          <div className="flex flex-col items-center text-center">
            <div className="flex w-full items-center justify-between">
              <h3 id="qr-title" className="text-lg font-bold text-fg">{qr.name}</h3>
              <button onClick={() => setQr(null)} className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint"><span className="ms">close</span></button>
            </div>
            <p className="mt-1 text-sm text-muted">{qr.benefit}</p>
            <div className="mt-5">
              <QRPass passId={claimed.has(qr.id) ? qr.passCode || "NX-" + qr.id.toUpperCase() : "NX-LOCKED-" + qr.id} />
            </div>
            {!claimed.has(qr.id) && (
              <p className="mt-3 rounded-xl border border-hairline-soft bg-card px-4 py-2.5 text-[12px] text-muted">
                Claim this perk to activate your member pass.
              </p>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}
