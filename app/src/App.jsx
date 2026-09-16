import { useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import AppHeader from "./components/AppHeader";
import StreaksModal from "./components/StreaksModal";
import Home from "./screens/Home";
import Competitions from "./screens/Competitions";
import CompetitionDetails from "./screens/CompetitionDetails";
import Partners from "./screens/Partners";
import ClaimQR from "./screens/ClaimQR";
import Leaderboard from "./screens/Leaderboard";
import Account from "./screens/Account";

export default function App() {
  const [streaksOpen, setStreaksOpen] = useState(true);

  return (
    <BrowserRouter>
      <div className="mx-auto min-h-[100dvh] max-w-md bg-ink">
        <AppHeader onStreaks={() => setStreaksOpen(true)} />
        <main className="pb-28">
          <Routes>
            <Route path="/" element={<Home onStreaks={() => setStreaksOpen(true)} />} />
            <Route path="/competitions" element={<Competitions />} />
            <Route path="/competitions/:id" element={<CompetitionDetails />} />
            <Route path="/partners" element={<Partners />} />
            <Route path="/partners/:id" element={<ClaimQR />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="/account" element={<Account />} />
            <Route path="*" element={<Home onStreaks={() => setStreaksOpen(true)} />} />
          </Routes>
        </main>
        <BottomNav />
        <StreaksModal open={streaksOpen} onClose={() => setStreaksOpen(false)} />
      </div>
    </BrowserRouter>
  );
}
