import { getMembership, resetDemo, setMembership } from "../lib/membership";
import Modal from "./Modal";

const SCENARIOS = [
  { status: "unsubscribed", label: "Fresh nonmember", desc: "No plan, full browsing" },
  { status: "active", label: "Active subscriber", desc: "Plan kept, records kept" },
  { status: "retry", label: "Payment retry", desc: "Browsing + records kept; new benefits paused" },
  { status: "semi", label: "Limited access", desc: "Existing entries valid; nothing new" },
  { status: "inactive", label: "Inactive / expired", desc: "History and balances kept" },
  { status: "cancelled", label: "Renewal cancelled", desc: "Benefits until access-end date" },
];

export default function DemoControls({ open, onClose }) {
  const current = getMembership().status;
  const apply = (status) => {
    const m = getMembership();
    setMembership({ ...m, status, plan: status === "unsubscribed" || status === "inactive" ? null : m.plan || "platinum" });
    onClose();
  };
  return (
    <Modal open={open} onClose={onClose} labelledBy="demo-title">
      <div className="flex items-center justify-between">
        <div>
          <h3 id="demo-title" className="text-lg font-bold text-fg">Demo controls</h3>
          <p className="mt-0.5 text-[12px] text-muted">Presenter scenarios. Records are preserved unless reset.</p>
        </div>
        <button onClick={onClose} aria-label="Close" className="flex h-9 w-9 items-center justify-center rounded-full border border-hairline text-faint">
          <span className="ms">close</span>
        </button>
      </div>
      <div className="mt-4 space-y-2">
        {SCENARIOS.map((s) => (
          <button
            key={s.status}
            onClick={() => apply(s.status)}
            className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 text-left active:scale-[0.99] ${
              current === s.status ? "border-indigo-bright bg-indigo-soft" : "border-hairline bg-card"
            }`}
          >
            <div>
              <p className="text-sm font-bold text-fg">{s.label}</p>
              <p className="mt-0.5 text-[11px] text-muted">{s.desc}</p>
            </div>
            {current === s.status && <span className="ms fill text-[18px] text-indigo-bright">check_circle</span>}
          </button>
        ))}
      </div>
      <button
        onClick={() => { resetDemo(); onClose(); }}
        className="mt-3 w-full rounded-xl border border-red-400/40 bg-red-400/10 py-3 text-sm font-bold text-red-300"
      >
        Reset demo data
      </button>
    </Modal>
  );
}
