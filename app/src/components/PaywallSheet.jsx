import Modal from "./Modal";

const COPY = {
  participate: {
    title: "Members participate here",
    body: "Competition entries are a member benefit. View plans to unlock entries, bundles, and automatic allocations.",
  },
  claim: {
    title: "Members claim here",
    body: "Partner offers unlock with membership. View plans to claim this privilege and generate your pass.",
  },
  spin: {
    title: "Daily Spin is for members",
    body: "One free spin every day comes with membership. View plans to start spinning.",
  },
  default: {
    title: "A member benefit",
    body: "This action needs an active membership. View plans to unlock it.",
  },
};

export default function PaywallSheet({ open, onClose, onPlans, reason = "default" }) {
  const c = COPY[reason] || COPY.default;
  return (
    <Modal open={open} onClose={onClose} labelledBy="paywall-title">
      <div className="flex flex-col items-center text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-soft">
          <span className="ms fill text-[24px] text-violet-pale">lock</span>
        </span>
        <h3 id="paywall-title" className="mt-3 text-lg font-bold text-fg">{c.title}</h3>
        <p className="mt-1.5 max-w-[280px] text-[13px] leading-relaxed text-muted">{c.body}</p>
        <button onClick={onPlans} className="mt-4 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white active:scale-[0.98]">
          View plans
        </button>
        <button onClick={onClose} className="mt-2 w-full rounded-xl border border-hairline py-3 text-sm font-bold text-muted">
          Keep browsing
        </button>
      </div>
    </Modal>
  );
}
