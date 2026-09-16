import member from "../data/member.json";
import Chip from "../components/Chip";

export default function Account() {
  return (
    <div className="px-4 pt-5 pb-4">
      <div className="flex flex-col items-center pt-4 text-center">
        <img src={member.avatarUrl} alt={member.name} className="h-20 w-20 rounded-full border-2 border-hairline object-cover" />
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-fg">{member.name}</h1>
        <p className="mt-0.5 text-sm text-muted tabular">{member.memberNo}</p>
        <div className="mt-3">
          <Chip tone="violet" icon="workspace_premium">{member.tier} member since {member.memberSince}</Chip>
        </div>
      </div>

      <div className="mt-6 space-y-1.5">
        {[
          ["badge", "Membership & tier"],
          ["qr_code_2", "Member pass"],
          ["confirmation_number", "Entry history"],
          ["redeem", "Claimed perks"],
          ["notifications", "Notifications"],
          ["shield", "Privacy & security"],
          ["support_agent", "Concierge"],
        ].map(([icon, label]) => (
          <button key={label} className="flex w-full items-center gap-3.5 rounded-xl border border-hairline-soft bg-card px-4 py-4 text-left active:scale-[0.99]">
            <span className="ms text-muted">{icon}</span>
            <span className="flex-1 text-sm font-semibold text-fg">{label}</span>
            <span className="ms text-faint">chevron_right</span>
          </button>
        ))}
      </div>
    </div>
  );
}
