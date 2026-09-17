import { useEffect, useState } from "react";

export function useNow(step = 1000) {
  // This hook is kept in a non-component module so Fast Refresh only sees component exports.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), step);
    return () => clearInterval(t);
  }, [step]);
  return now;
}

export function nextSunday2100UTC(from = new Date()) {
  const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate(), 21, 0, 0));
  let add = (7 - d.getUTCDay()) % 7;
  if (add === 0 && d.getTime() <= from.getTime()) add = 7;
  d.setUTCDate(d.getUTCDate() + add);
  return d;
}

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function formatDrawDate(date) {
  const d = new Date(date);
  return `${DAYS[d.getUTCDay()]}, ${MONTHS[d.getUTCMonth()]} ${d.getUTCDate()}, ${d.getUTCFullYear()}`;
}
