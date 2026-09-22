import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

// Mock concierge chat (prototype only): canned virtual-assistant replies plus
// a handoff CTA that simulates connecting a real support member.
const QUICK_REPLIES = ["My entries", "Claim a pass", "Billing question"];

function botReply(text) {
  const t = text.toLowerCase();
  if (t.includes("entr")) return "Your automatic entries land on every active draw each month. Open any competition to see your per-draw count, or add entries from the competition page.";
  if (t.includes("claim") || t.includes("pass") || t.includes("qr")) return "To claim a perk, open Partners, tap Claim, and present the QR pass with its code at the venue. Claimed passes live under Partners > Claimed.";
  if (t.includes("bill") || t.includes("payment") || t.includes("plan") || t.includes("subscri")) return "Billing and plan changes live under Account > Membership & billing. Anything looks off there? I can bring in a support member.";
  if (t.includes("spin") || t.includes("streak")) return "Daily Spin resets at midnight and streaks grow across 7 days. Spin from Home or the Daily Spin page.";
  if (t.includes("human") || t.includes("real") || t.includes("agent") || t.includes("support")) return "Of course. Tap 'Connect a real support member' below and I'll hand this chat over.";
  return "Got it. For entries, passes, spins, or billing I can help right away. Otherwise, connect a real support member and they'll pick this up.";
}

export default function ConciergeChat({ open, onClose }) {
  const [messages, setMessages] = useState(() => [
    { from: "bot", text: "Hi, I'm the club assistant (demo). Ask about entries, passes, spins, or billing." },
  ]);
  const [draft, setDraft] = useState("");
  const [handoff, setHandoff] = useState("idle");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, open ]);

  if (!open) return null;

  const send = (text) => {
    const clean = text.trim();
    if (!clean) return;
    setMessages((m) => [...m, { from: "you", text: clean }]);
    setDraft("");
    window.setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: botReply(clean) }]);
    }, 600);
  };

  const connectHuman = () => {
    if (handoff !== "idle") return;
    setHandoff("connecting");
    setMessages((m) => [...m, { from: "you", text: "Please connect a real support member." }]);
    window.setTimeout(() => {
      setHandoff("connected");
      setMessages((m) => [...m, { from: "bot", text: "You're in the queue (demo). A support member typically replies within a few minutes. This chat stays open." }]);
    }, 1400);
  };

  return (
    <Modal open={open} onClose={onClose} labelledBy="concierge-title">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-teal-soft">
            <span className="ms text-[20px] text-teal-pale">support_agent</span>
          </span>
          <div>
            <h3 id="concierge-title" className="text-[16px] font-bold text-fg">Concierge live chat</h3>
            <p className="flex items-center gap-1 text-[11px] text-teal-pale">
              <span className="h-1.5 w-1.5 rounded-full bg-teal" /> Online · replies instantly (demo)
            </p>
          </div>
        </div>
        <button onClick={onClose} aria-label="Close chat" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-hairline text-faint">
          <span className="ms">close</span>
        </button>
      </div>

      <div className="mt-4 max-h-[38dvh] space-y-2 overflow-y-auto rounded-2xl border border-hairline-soft bg-card p-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
            <p className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${m.from === "you" ? "bg-cta text-white" : "bg-card-2 text-fg"}`}>
              {m.text}
            </p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="scroll-thin mt-3 flex gap-2 overflow-x-auto pb-1">
        {QUICK_REPLIES.map((q) => (
          <button key={q} onClick={() => send(q)} className="shrink-0 rounded-full border border-hairline bg-card px-3.5 py-2 text-[12px] font-bold text-muted active:scale-[0.98]">
            {q}
          </button>
        ))}
      </div>

      <form
        className="mt-2.5 flex items-center gap-2"
        onSubmit={(e) => {
          e.preventDefault();
          send(draft);
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          aria-label="Message concierge"
          placeholder="Ask about entries, passes, billing..."
          className="w-full rounded-xl border border-hairline bg-card px-3.5 py-3 text-sm text-fg outline-none placeholder:text-faint focus:border-indigo-bright"
        />
        <button type="submit" aria-label="Send message" className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-xl bg-cta text-white active:scale-[0.98]">
          <span className="ms">send</span>
        </button>
      </form>

      <button
        onClick={connectHuman}
        disabled={handoff !== "idle"}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-teal/40 bg-teal-soft/40 py-3.5 text-sm font-bold text-teal-pale active:scale-[0.98] disabled:opacity-70"
      >
        <span className="ms text-[19px]">headset_mic</span>
        {handoff === "idle" && "Connect a real support member"}
        {handoff === "connecting" && "Connecting you..."}
        {handoff === "connected" && "Support member notified"}
      </button>
    </Modal>
  );
}
