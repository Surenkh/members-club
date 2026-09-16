import { useEffect, useState } from "react";

export default function Toast({ message, open, onDone }) {
  const [show, setShow] = useState(open);
  useEffect(() => {
    setShow(open);
    if (!open) return;
    const t = setTimeout(() => {
      setShow(false);
      onDone && onDone();
    }, 2600);
    return () => clearTimeout(t);
  }, [open]);
  if (!show) return null;
  return (
    <div className="fixed left-1/2 top-4 z-[70] -translate-x-1/2">
      <div className="flex items-center gap-2 rounded-full border border-hairline bg-card-2 px-4 py-2.5 shadow-[var(--shadow-pop)]">
        <span className="ms fill text-teal text-[18px]">check_circle</span>
        <span className="text-sm font-semibold text-fg">{message}</span>
      </div>
    </div>
  );
}
