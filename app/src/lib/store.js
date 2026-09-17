// Minimal localStorage-backed member state (prototype persistence).
// Keys are brand-neutral. All values are mock prototype data.
const get = (k, fb) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return v === null || v === undefined ? fb : v;
  } catch {
    return fb;
  }
};
const set = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v));
  } catch {}
};

const DAY = () => new Date().toDateString();

export const store = {
  get seenStreaksToday() {
    return get("member-streak-seen", null) === DAY();
  },
  markStreaksSeen() {
    set("member-streak-seen", DAY());
  },
  get xpBonus() {
    return get("member-xp-bonus", 0);
  },
  addXp(n) {
    set("member-xp-bonus", this.xpBonus + n);
    return this.xpBonus;
  },
  get claims() {
    return new Set(get("member-claims", []));
  },
  addClaim(id) {
    const s = this.claims;
    s.add(id);
    set("member-claims", [...s]);
    return s;
  },
  get saved() {
    return new Set(get("member-saved", []));
  },
  toggleSaved(id) {
    const s = this.saved;
    if (s.has(id)) s.delete(id);
    else s.add(id);
    set("member-saved", [...s]);
    return s;
  },
  get points() {
    return get("member-points", 0);
  },
  addPoints(n) {
    set("member-points", this.points + n);
    return this.points;
  },
  get lastSpin() {
    return get("member-spins", null);
  },
  setLastSpin(result) {
    set("member-spins", { date: DAY(), result });
  },
  spunToday() {
    const s = this.lastSpin;
    return Boolean(s && s.date === DAY());
  },
  get tickets() {
    return get("member-tickets", []);
  },
  addTickets(entry) {
    const t = this.tickets;
    t.push(entry);
    set("member-tickets", t);
    return t;
  },
  get reserved() {
    return get("member-reserved", []);
  },
  setReserved(list) {
    set("member-reserved", list);
  },
  get billing() {
    return get("member-billing", []);
  },
  setBilling(list) {
    set("member-billing", list);
  },
  get profile() {
    return get("member-profile", null);
  },
  setProfile(p) {
    set("member-profile", p);
  },
  get activations() {
    return get("member-activations", {});
  },
  setActivation(id, rec) {
    const a = this.activations;
    a[id] = rec;
    set("member-activations", a);
    return a;
  },
};
