import { NavLink } from "react-router-dom";

const tabs = [
  { to: "/", icon: "home", label: "Home", end: true },
  { to: "/competitions", icon: "emoji_events", label: "Competitions" },
  { to: "/partners", icon: "loyalty", label: "Partners" },
  { to: "/leaderboard", icon: "leaderboard", label: "Leaderboard" },
  { to: "/account", icon: "account_circle", label: "Account" },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 border-t border-hairline bg-ink" aria-label="Primary">
      <div className="mx-auto max-w-md bg-ink px-4 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-2">
        <div
          className="liquid-glass-strong flex items-stretch justify-between rounded-[1.4rem] px-2"
        >
          {tabs.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              end={t.end}
              className={({ isActive }) =>
                `group flex flex-1 flex-col items-center justify-center gap-1 py-2.5 min-h-[56px] rounded-2xl transition-all ${
                  isActive ? "bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]" : ""
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={`ms text-[24px] transition-colors ${
                      isActive ? "fill text-indigo-bright" : "text-faint group-hover:text-muted"
                    }`}
                  >
                    {t.icon}
                  </span>
                  <span
                    className={`text-[10px] font-semibold tracking-wide ${
                      isActive ? "text-indigo-bright" : "text-faint"
                    }`}
                  >
                    {t.label}
                  </span>
                  <span
                    className={`h-1 w-1 rounded-full transition-opacity ${
                      isActive ? "bg-indigo-bright opacity-100" : "opacity-0"
                    }`}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
}
