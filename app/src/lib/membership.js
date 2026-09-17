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
    id: "premium",
    name: "Premium",
    icon: "workspace_premium",
    monthly: 39,
    yearly: 390,
    blurb: "Bigger pools, premium partners, priority draws.",
    entries: 15,
    perks: ["15 automatic entries per draw", "Daily spin + streaks", "Premium partner perks", "Leaderboard boosts"],
    recommended: true,
  },
  {
    id: "diamond",
    name: "Diamond",
    icon: "crown",
    monthly: 79,
    yearly: 790,
    blurb: "Top pools, concierge access, first refusal.",
    entries: 30,
    perks: ["30 automatic entries per draw", "Everything in Premium", "Concierge access", "First refusal on allocations"],
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

export function subscribe(planId, period, methodLabel) {
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
    method: methodLabel || "Member Card ···· 9012",
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

const TIER_ORDER = ["pro", "premium", "diamond"];

// Computes a plan change preview. Upgrades activate immediately with a mock
// charge; downgrades and yearly-to-monthly moves schedule for paid-period end.
export function previewPlanChange(current, planId, period) {
  const plan = PLANS.find((p) => p.id === planId);
  const toTier = TIER_ORDER.indexOf(planId);
  const fromTier = TIER_ORDER.indexOf(current.plan);
  const end = new Date();
  end.setMonth(end.getMonth() + 1);
  const effectiveDate = end.toISOString().slice(0, 10);
  if (toTier > fromTier && period === current.period) {
    return { kind: "upgrade", amountDue: planPrice(plan, period), effectiveDate: new Date().toISOString().slice(0, 10), note: "Activates immediately after mock payment." };
  }
  if (period === "yearly" && current.period === "monthly") {
    const credit = 19;
    return { kind: "upgrade", amountDue: Math.max(0, planPrice(plan, period) - credit), effectiveDate: new Date().toISOString().slice(0, 10), note: `Includes $${credit} unused-month credit (demo).` };
  }
  return { kind: "scheduled", amountDue: 0, effectiveDate, note: `Takes effect ${effectiveDate}. Present benefits stay until then.` };
}

export function applyPlanChange(planId, period, preview) {
  const m = getMembership();
  if (preview.kind === "upgrade") {
    const history = store.billing;
    history.push({
      date: new Date().toISOString().slice(0, 10),
      plan: PLANS.find((p) => p.id === planId).name,
      period,
      amount: preview.amountDue,
      currency: "USD",
      method: "Member Card ···· 9012",
      status: "Paid",
      ref: `MB-${String(Math.floor(100000 + Math.random() * 900000))}`,
    });
    store.setBilling(history);
    setMembership({ ...m, status: "active", plan: planId, period, scheduledChange: null });
  } else {
    setMembership({ ...m, scheduledChange: { toPlan: planId, toPeriod: period, effectiveDate: preview.effectiveDate, amountDue: planPrice(PLANS.find((p) => p.id === planId), period) } });
  }
}

export function cancelScheduledChange() {
  const m = getMembership();
  const next = { ...m };
  delete next.scheduledChange;
  setMembership(next);
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
