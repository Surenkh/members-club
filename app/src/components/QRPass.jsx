import { useEffect, useState } from "react";

// Mock rotating QR token graphic (placeholder for a real QR generator)
export default function QRPass({ passId, size = 168 }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick((v) => v + 1), 60000);
    return () => clearInterval(t);
  }, []);
  const [count, setCount] = useState(60);
  useEffect(() => {
    const t = setInterval(() => setCount((c) => (c <= 1 ? 60 : c - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  // Deterministic pseudo-QR cell grid from passId + rotation tick
  const cells = 21;
  let seed = 0;
  const key = passId + ":" + tick;
  for (let i = 0; i < key.length; i++) seed = (seed * 31 + key.charCodeAt(i)) >>> 0;
  const rand = (i, j) => {
    let x = (seed + i * 73856093 + j * 19349663) >>> 0;
    x = (x ^ (x >> 13)) * 1274126177;
    return ((x ^ (x >> 16)) >>> 0) % 100 < 42;
  };
  const isFinder = (i, j) => (i < 7 && j < 7) || (i < 7 && j >= cells - 7) || (i >= cells - 7 && j < 7);

  return (
    <div className="flex flex-col items-center">
      <div className="rounded-2xl bg-white p-3" style={{ width: size + 24 }}>
        <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} shapeRendering="crispEdges" aria-label="Access QR">
          <rect width={cells} height={cells} fill="#fff" />
          {Array.from({ length: cells * cells }).map((_, idx) => {
            const i = idx % cells;
            const j = Math.floor(idx / cells);
            if (isFinder(i, j)) return null;
            return rand(i, j) ? <rect key={idx} x={i} y={j} width={1} height={1} fill="#0a0e1a" /> : null;
          })}
          {[[0, 0], [cells - 7, 0], [0, cells - 7]].map(([x, y], k) => (
            <g key={k}>
              <rect x={x} y={y} width={7} height={7} fill="#0a0e1a" />
              <rect x={x + 1} y={y + 1} width={5} height={5} fill="#fff" />
              <rect x={x + 2} y={y + 2} width={3} height={3} fill="#0a0e1a" />
            </g>
          ))}
        </svg>
      </div>
      <p className="mt-2.5 text-[11px] font-semibold text-muted">
        Refreshes in <span className="tabular text-indigo-bright">{count}s</span>
      </p>
    </div>
  );
}
