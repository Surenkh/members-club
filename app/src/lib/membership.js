// Membership state machine for the prototype (spec sections 2, 13, 15).
// Statuses: unsubscribed | active | retry | semi | inactive | cancelled
// cancelled = renewal cancelled, paid benefits remain until accessEnd.
import { store } from "./store";

export const PLANS = [
  {
    id: "pro",
    name: "Pro",
    icon: "military_tech",
    monthly: 19,
    yearly: 190,
    blurb: "Weekly draws, partner essentials, daily spin.",
    entries: 8,
    perks: ["8 automatic entries per draw", "Daily spin", "Essential partner perks"],
  },
  {
    id: "platinum",
    name: "Platinum",
    icon: "workspace_premium",
    monthly: 39,
    yearly: 390,
    blurb: "Bigger pools, premium partners, priority draws.",
    entries: 15,
    perks: ["15 automatic entries per draw", "Daily spin + streaks", "Premium partner perks", "Leaderboard boosts"],
    recommended: true,
  },
  {
    id: "elite",
    name: "Elite",
    icon: "crown",
    monthly: 79,
    yearly: 790,
    blurb: "Top pools, concierge access, first refusal.",
    entries: 30,
    perks: ["30 automatic entries per draw", "Everything in Platinum", "Concierge access", "First refusal on allocations"],
  },
];

const KEY = "member-membership";

export function getMembership() {
  try {
    const v = JSON.parse(localStorage.getItem(KEY));
    if (v && v.status) return v;
  } catch {}
  return { status: "unsubscribed", plan: null, period: null, startedAt: null, renewalDate: null, accessEnd: null };
}

export function setMembership(m) {
  try {
    localStorage.setItem(KEY, JSON.stringify(m));
  } catch {}
  window.dispatchEvent(new CustomEvent("membership-changed"));
}

export function useMembershipTick() {
  // Returns a bump function version; components re-read via their own state.
  return () => window.dispatchEvent(new CustomEvent("membership-changed"));
}

export function subscribe(planId, period) {
  const plan = PLANS.find((p) => p.id === planId);
  const now = new Date();
  const renewal = new Date(now);
  if (period === "yearly") renewal.setFullYear(renewal.getFullYear() + 1);
  else renewal.setMonth(renewal.getMonth() + 1);
  const amount = period === "yearly" ? plan.yearly : plan.monthly;
  const record = {
    date: now.toISOString().slice(0, 10),
    plan: plan.name,
    period,
    amount,
    currency: "USD",
    method: "Member Card ···· 9012",
    status: "Paid",
    ref: `MB-${String(Math.floor(100000 + Math.random() * 900000))}`,
  };
  const history = store.billing;
  history.push(record);
  store.setBilling(history);
  setMembership({
    status: "active",
    plan: plan.id,
    period,
    startedAt: now.toISOString(),
    renewalDate: renewal.toISOString().slice(0, 10),
    accessEnd: null,
  });
  // Seed one reserved allocation on the upcoming draw (cutoff rule: upcoming only).
  const reserved = store.reserved;
  if (!reserved.find((r) => r.competitionId === "stmoritz")) {
    reserved.push({ competitionId: "stmoritz", entries: plan.entries, source: "Automatic entries", status: "Reserved" });
    store.setReserved(reserved);
  }
  return record;
}

export function planPrice(plan, period) {
  return period === "yearly" ? plan.yearly : plan.monthly;
}

export function statusMeta(status) {
  switch (status) {
    case "active":
      return { label: "Active plan", tone: "teal", icon: "verified" };
    case "retry":
      return { label: "Payment needs attention", tone: "gold", icon: "warning" };
    case "semi":
      return { label: "Limited access", tone: "gold", icon: "info" };
    case "inactive":
      return { label: "No active membership", tone: "neutral", icon: "info" };
    case "cancelled":
      return { label: "Active until access-end date", tone: "gold", icon: "event" };
    default:
      return { label: "No active plan", tone: "neutral", icon: "info" };
  }
}

export function resetDemo() {
  ["member-streak-seen", "member-xp-bonus", "member-claims", "member-saved", "member-points",
   "member-spins", "member-tickets", "member-reserved", "member-billing", "member-profile",
   KEY,
  ].forEach((k) => {
    try {
      localStorage.removeItem(k);
    } catch {}
  });
  window.dispatchEvent(new CustomEvent("membership-changed"));
}
