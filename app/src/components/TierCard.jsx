export default function TierCard({ member }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-hairline bg-gradient-to-br from-[#151d36] via-[#10182c] to-[#0c1220] p-5" style={{ boxShadow: "var(--shadow-card)" }}>
      <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-indigo/25 blur-3xl" />
      <div className="pointer-events-none absolute -left-10 bottom-0 h-32 w-32 rounded-full bg-violet/15 blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Member</p>
          <p className="mt-1 text-lg font-bold tracking-tight text-fg">{member.name}</p>
          <p className="mt-0.5 text-xs text-muted tabular">{member.memberNo}</p>
        </div>
        <span className="ms text-[30px] text-violet">workspace_premium</span>
      </div>

      <div className="relative mt-6 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">{member.tier} Tier</p>
          <p className="mt-1 text-3xl font-bold tracking-tight text-fg tabular">
            {member.points.toLocaleString()}
            <span className="ml-1.5 text-sm font-semibold text-muted">pts</span>
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Level</p>
          <p className="mt-1 text-2xl font-bold text-gold tabular">{member.level}</p>
        </div>
      </div>

      <div className="relative mt-4">
        <div className="flex items-center justify-between text-[11px] text-muted">
          <span>{member.pointsToNext.toLocaleString()} pts to {member.nextTier}</span>
          <span className="tabular">{Math.round(member.levelProgress * 100)}%</span>
        </div>
        <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-hairline-soft">
          <div
            className="h-full rounded-full bg-gradient-to-r from-indigo to-violet"
            style={{ width: `${member.levelProgress * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
