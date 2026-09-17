import { useState } from "react";
import { Link } from "react-router-dom";
import member from "../data/member.json";
import { store } from "../lib/store";
import { getMembership, statusMeta, PLANS } from "../lib/membership";
import Chip from "../components/Chip";
import DemoControls from "../components/DemoControls";

export default function Account() {
  const [demo, setDemo] = useState(false);
  const [, bump] = useState(0);
  const m = getMembership();
  const plan = PLANS.find((p) => p.id === m.plan);
  const meta = statusMeta(m.status);
  const profile = store.profile;

  const rows = [
    ["badge", "Membership & tier", "/account/subscription"],
    ["receipt_long", "Billing & subscription", "/account/subscription"],
    ["confirmation_number", "My Tickets", "/account/tickets"],
    ["redeem", "My Discounts", "/account/discounts"],
    ["military_tech", "Reward Points", "/account/points"],
    ["person", "Account details", "/account/details"],
    ["support_agent", "Concierge", "/account"],
  ];

  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex flex-col items-center pt-4 text-center">
        <img src={member.avatarUrl} alt={`${profile?.firstName || member.name} profile photo`} className="h-20 w-20 rounded-full border-2 border-hairline object-cover" />
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-fg">
          {profile ? `${profile.firstName} ${profile.lastName}` : member.name}
        </h1>
        <div className="mt-3">
          <Chip tone={m.status === "active" ? "teal" : m.status === "unsubscribed" || m.status === "inactive" ? "neutral" : "gold"} icon={meta.icon}>
            {plan ? `${plan.name} · ` : ""}{meta.label}
          </Chip>
        </div>
      </div>

      <div className="mt-6 space-y-1.5">
        {rows.map(([icon, label, to]) => (
          <Link key={label} to={to} className="flex w-full items-center gap-3.5 rounded-xl border border-hairline-soft bg-card px-4 py-4 text-left active:scale-[0.99]">
            <span className="ms text-muted">{icon}</span>
            <span className="flex-1 text-sm font-semibold text-fg">{label}</span>
            <span className="ms text-faint">chevron_right</span>
          </Link>
        ))}
        <button onClick={() => setDemo(true)} className="flex w-full items-center gap-3.5 rounded-xl border border-dashed border-hairline bg-card px-4 py-4 text-left active:scale-[0.99]">
          <span className="ms text-muted">tune</span>
          <span className="flex-1 text-sm font-semibold text-fg">Demo controls</span>
          <span className="ms text-faint">chevron_right</span>
        </button>
      </div>

      <DemoControls open={demo} onClose={() => { setDemo(false); bump((v) => v + 1); }} />
    </div>
  );
}
