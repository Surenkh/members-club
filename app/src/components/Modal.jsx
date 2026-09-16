export default function Modal({ open, onClose, children, labelledBy }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={labelledBy}
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-[rgba(4,7,15,0.66)] backdrop-blur-[4px]"
      />
      <div className="relative w-full max-w-md rounded-t-3xl sm:rounded-3xl border border-hairline bg-card-2 p-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)] shadow-[var(--shadow-pop)] max-h-[88dvh] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
