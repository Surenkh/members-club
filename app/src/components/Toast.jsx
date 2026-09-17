import { useEffect } from "react";
import { Link } from "react-router-dom";

export default function Toast({ message, action, open, onDone }) {
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => {
      onDone?.();
    }, 3200);
    return () => clearTimeout(t);
  }, [open, onDone]);
  if (!open) return null;
  return (
    <div className="fixed left-1/2 top-4 z-[70] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-hairline bg-card-2 py-2 pl-4 pr-2 shadow-[var(--shadow-pop)]">
        <span className="ms fill text-teal-pale text-[18px]">check_circle</span>
        <span className="text-sm font-semibold text-fg">{message}</span>
        {action && (
          <Link
            to={action.to}
            onClick={onDone}
            className="rounded-full bg-cta px-3 py-1.5 text-[12px] font-bold text-white"
          >
            {action.label}
          </Link>
        )}
      </div>
    </div>
  );
}
