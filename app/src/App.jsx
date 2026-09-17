import { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes, useLocation, useNavigationType } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import AppHeader from "./components/AppHeader";
import StreaksModal from "./components/StreaksModal";
import { store } from "./lib/store";
import Home from "./screens/Home";
import Competitions from "./screens/Competitions";
import CompetitionDetails from "./screens/CompetitionDetails";
import Partners from "./screens/Partners";
import ClaimQR from "./screens/ClaimQR";
import Leaderboard from "./screens/Leaderboard";
import Account from "./screens/Account";
import Plans from "./screens/Plans";
import Spins from "./screens/Spins";
import Tickets from "./screens/Tickets";
import Discounts from "./screens/Discounts";
import Points from "./screens/Points";
import AccountDetails from "./screens/AccountDetails";
import Subscription from "./screens/Subscription";

function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType();
  useEffect(() => {
    if (navType === "POP") {
      const y = Number(sessionStorage.getItem(`scroll:${location.pathname}`) || 0);
      requestAnimationFrame(() => window.scrollTo(0, y));
    } else {
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);
  useEffect(() => {
    const save = () => {
      try {
        sessionStorage.setItem(`scroll:${location.pathname}`, String(window.scrollY));
      } catch {}
    };
    window.addEventListener("pagehide", save);
    return () => {
      save();
      window.removeEventListener("pagehide", save);
    };
  }, [location.pathname]);
  return null;
}

export default function App() {
  // Pop-up auto-opens at most once per day; always available via the header pill.
  const [streaksOpen, setStreaksOpen] = useState(() => !store.seenStreaksToday);
  const closeStreaks = () => {
    store.markStreaksSeen();
    setStreaksOpen(false);
  };

  return (
    <BrowserRouter>
      <ScrollManager />
      <div className="mx-auto min-h-[100dvh] max-w-md bg-ink">
        <AppHeader onStreaks={() => setStreaksOpen(true)} />
        <main className="pb-28">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/:id" element={<CompetitionDetails />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/:id" element={<ClaimQR />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="/plans" element={<Plans />} />
            <Route path="/spins" element={<Spins />} />
            <Route path="/account/tickets" element={<Tickets />} />
            <Route path="/account/discounts" element={<Discounts />} />
            <Route path="/account/points" element={<Points />} />
            <Route path="/account/details" element={<AccountDetails />} />
            <Route path="/account/subscription" element={<Subscription />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </main>
        <BottomNav />
        <StreaksModal open={streaksOpen} onClose={closeStreaks} onClaim={(xp) => store.addXp(xp)} />
      </div>
    </BrowserRouter>
  );
}
