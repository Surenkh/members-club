import { Link, useNavigate } from "react-router-dom";
import member from "../data/member.json";
import { store } from "../lib/store";

export default function AppHeader({ onStreaks }) {
  const navigate = useNavigate();
  const goSpin = () => navigate("/spins");
  const dot = !store.spunToday();
  return (
    <header className="flex items-center justify-between px-4 pt-4">
      <div className="flex items-center gap-2">
        <button
          onClick={onStreaks}
          className="flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-[11px] font-bold text-gold active:scale-[0.97]"
        >
          <span className="ms fill text-[15px]">local_fire_department</span>
          14d Streak
        </button>
        <button
          onClick={goSpin}
          className="relative flex items-center gap-1.5 rounded-full border border-violet/40 bg-violet-soft px-3 py-1.5 text-[11px] font-bold text-violet-pale active:scale-[0.97]"
        >
          <span className="ms text-[15px]">casino</span>
          Spin
          {dot && <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-violet-pale" />}
        </button>
      </div>
      <Link to="/account" aria-label="Account" className="relative">
        <img src={member.avatarUrl} alt="Member profile" className="h-9 w-9 rounded-full border border-hairline object-cover" />
        <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-ink bg-teal" />
      </Link>
    </header>
  );
}
