import { Link } from "react-router-dom";
import { store } from "../lib/store";

export default function Points() {
  const balance = store.points;
  const xp = store.xpBonus;
  return (
    <div className="px-4 pt-2 pb-4">
      <div className="flex items-center gap-3">
        <Link to="/account" aria-label="Back" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-hairline bg-card text-fg">
          <span className="ms">arrow_back</span>
        </Link>
        <h1 className="font-display text-[22px] font-bold tracking-tight text-fg">Reward Points</h1>
      </div>

      <div className="mt-4 rounded-2xl border border-hairline bg-gradient-to-br from-[#151d36] to-[#0e1524] p-5 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-muted">Balance</p>
        <p className="mt-1 font-display text-4xl font-bold tabular text-fg">{balance.toLocaleString()}</p>
        <p className="mt-1 text-[11px] text-muted">Reward Points are separate from ranking XP ({xp.toLocaleString()} XP earned).</p>
      </div>

      <div className="mt-3 rounded-2xl border border-hairline bg-card p-4 text-[12px] leading-relaxed text-muted">
        <p>Spins, streak finales, and leaderboard results add to this balance once. Membership changes never erase it.</p>
        <p className="mt-2">This is a read-only demo balance. Spending, transfers, and withdrawals are out of scope for the prototype.</p>
      </div>
    </div>
  );
}
