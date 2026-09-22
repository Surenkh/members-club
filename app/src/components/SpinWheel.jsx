import { useRef, useState } from "react";

// Casino reference styling (user-supplied image): dark metallic rim with purple
// LED dots, gold pointer, saturated jewel segments, neon-ringed SPIN hub.
// Segment ORDER matches the reference clockwise from the top. Prize mapping
// preserves the Stitch outcome set 1:1 (5 XP amounts, 3x $10 cash, 2x retry
// rendered as ONE MORE SPIN, 2x no-win rendered as LOSE).
const SLICES = [
  { label: ["XP"], icon: "bolt", type: "xp", value: 50, color: "url(#segPurple)" },
  { label: ["$"], icon: "paid", type: "cash", value: 10, color: "url(#segGreen)" },
  { label: ["LOSE"], icon: "close", type: "none", color: "url(#segDark)" },
  { label: ["XP"], icon: "bolt", type: "xp", value: 100, color: "url(#segPurple)" },
  { label: ["ONE", "MORE SPIN"], icon: "refresh", type: "retry", color: "url(#segBlue)" },
  { label: ["XP"], icon: "bolt", type: "xp", value: 150, color: "url(#segPurple)" },
  { label: ["$"], icon: "paid", type: "cash", value: 10, color: "url(#segGreen)" },
  { label: ["LOSE"], icon: "close", type: "none", color: "url(#segDark)" },
  { label: ["XP"], icon: "bolt", type: "xp", value: 200, color: "url(#segPurple)" },
  { label: ["ONE", "MORE SPIN"], icon: "refresh", type: "retry", color: "url(#segBlue)" },
  { label: ["$"], icon: "paid", type: "cash", value: 10, color: "url(#segGreen)" },
  { label: ["XP"], icon: "bolt", type: "xp", value: 75, color: "url(#segPurple)" },
];

const ICON_FILL = { bolt: "#e9d5ff", paid: "#ffd75e", close: "#f1f2f6", refresh: "#d7e9ff" };

const SIZE = 320;

export default function SpinWheel({ onResult, gated, onGate, hideButton, claimAction, disabled = false, cooldown = null }) {
  const [rot, setRot] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const wheelRef = useRef(null);
  const n = SLICES.length;
  const seg = 360 / n;

  const spin = () => {
    if (disabled) return;
    if (gated) {
      onGate?.();
      return;
    }
    if (spinning) return;
    setSpinning(true);
    setResult(null);
    const target = Math.floor(Math.random() * n);
    const targetAngle = 360 * 5 + (360 - target * seg - seg / 2);
    setRot((r) => r - (r % 360) + targetAngle);
    setTimeout(() => {
      setSpinning(false);
      setResult(SLICES[target]);
      onResult?.(SLICES[target]);
    }, 4200);
  };

  const cx = 160;
  const cy = 160;
  const RIM_R = 158;
  const SEG_R = 136;
  const polar = (a, rad) => [
    cx + rad * Math.cos(((a - 90) * Math.PI) / 180),
    cy + rad * Math.sin(((a - 90) * Math.PI) / 180),
  ];
  const leds = Array.from({ length: 16 });

  return (
    <div className="spin-stagger flex flex-col items-center">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* pointer: large cream triangle per reference */}
        <div className="absolute left-1/2 top-[-14px] z-10 -translate-x-1/2">
          <div className="h-0 w-0 border-l-[16px] border-r-[16px] border-t-[28px] border-l-transparent border-r-transparent border-t-[#f6e3b4] drop-shadow-[0_3px_12px_rgba(246,227,180,0.7)]" />
        </div>
        <svg
          ref={wheelRef}
          width={SIZE}
          height={SIZE}
          viewBox="0 0 320 320"
          className={`block transition duration-500 ${disabled ? "opacity-45 grayscale-[0.35]" : ""}`}
          role="img"
          aria-label="Prize wheel"
        >
          <defs>
            <radialGradient id="rimMetal" cx="50%" cy="38%" r="75%">
              <stop offset="0%" stopColor="#4a505c" />
              <stop offset="45%" stopColor="#23262e" />
              <stop offset="80%" stopColor="#101218" />
              <stop offset="100%" stopColor="#05060a" />
            </radialGradient>
            <radialGradient id="segPurple" cx="50%" cy="30%" r="90%">
              <stop offset="0%" stopColor="#8b3ff5" />
              <stop offset="60%" stopColor="#5b1ec4" />
              <stop offset="100%" stopColor="#2e0a63" />
            </radialGradient>
            <radialGradient id="segGreen" cx="50%" cy="30%" r="90%">
              <stop offset="0%" stopColor="#17b978" />
              <stop offset="60%" stopColor="#0a7a4e" />
              <stop offset="100%" stopColor="#033a26" />
            </radialGradient>
            <radialGradient id="segDark" cx="50%" cy="30%" r="90%">
              <stop offset="0%" stopColor="#333945" />
              <stop offset="60%" stopColor="#1b1e25" />
              <stop offset="100%" stopColor="#0c0e12" />
            </radialGradient>
            <radialGradient id="segBlue" cx="50%" cy="30%" r="90%">
              <stop offset="0%" stopColor="#2f7bff" />
              <stop offset="60%" stopColor="#12479f" />
              <stop offset="100%" stopColor="#071c48" />
            </radialGradient>
            <radialGradient id="hubDark" cx="50%" cy="35%" r="80%">
              <stop offset="0%" stopColor="#2c2c34" />
              <stop offset="100%" stopColor="#0a0a0e" />
            </radialGradient>
            <radialGradient id="coinGold" cx="38%" cy="32%" r="85%">
              <stop offset="0%" stopColor="#ffedb0" />
              <stop offset="45%" stopColor="#f7bd45" />
              <stop offset="80%" stopColor="#c07f10" />
              <stop offset="100%" stopColor="#7a4a00" />
            </radialGradient>
            <radialGradient id="gloss" cx="50%" cy="12%" r="65%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.28" />
              <stop offset="55%" stopColor="#ffffff" stopOpacity="0.05" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>
            <filter id="ledGlow" x="-80%" y="-80%" width="260%" height="260%">
              <feGaussianBlur stdDeviation="3.2" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="neonGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="4" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <clipPath id="faceClip">
              <circle cx={cx} cy={cy} r={SEG_R} />
            </clipPath>
          </defs>

          {/* metallic rim */}
          <circle cx={cx} cy={cy} r={RIM_R} fill="url(#rimMetal)" />
          <circle cx={cx} cy={cy} r={RIM_R} fill="none" stroke="#000" strokeOpacity="0.6" strokeWidth="2" />
          <circle cx={cx} cy={cy} r={RIM_R - 3} fill="none" stroke="#6b7280" strokeOpacity="0.35" strokeWidth="1" />

          {/* LED dots */}
          {leds.map((_, i) => {
            const a = (i * 360) / leds.length;
            const [x, y] = polar(a, RIM_R - 11);
            return (
              <g key={i} filter="url(#ledGlow)">
                <circle cx={x} cy={y} r="4" fill="#c084fc" />
                <circle cx={x} cy={y} r="1.8" fill="#f3e8ff" />
              </g>
            );
          })}
          <circle cx={cx} cy={cy} r={SEG_R + 4} fill="none" stroke="#0a0b10" strokeWidth="5" />
          {/* neon face ring per reference */}
          <circle cx={cx} cy={cy} r={SEG_R - 1} fill="none" stroke="#c084fc" strokeWidth="2.5" filter="url(#neonGlow)" />

          {/* rotating face */}
          <g
            style={{
              transform: `rotate(${rot}deg)`,
              transformOrigin: "160px 160px",
              transition: spinning ? "transform 4.2s cubic-bezier(0.12, 0.8, 0.08, 1)" : "none",
            }}
          >
            {SLICES.map((s, i) => {
              const a0 = i * seg;
              const a1 = a0 + seg;
              const [x0, y0] = polar(a0, SEG_R);
              const [x1, y1] = polar(a1, SEG_R);
              const mid = a0 + seg / 2;
              // Icons only: centered in each slice at mid-radius, all on one
              // radius so they sit right per the reference wheel.
              const [ix, iy] = polar(mid, 100);
              return (
                <g key={i}>
                  <path
                    d={`M ${cx} ${cy} L ${x0} ${y0} A ${SEG_R} ${SEG_R} 0 0 1 ${x1} ${y1} Z`}
                    fill={s.color}
                    stroke="#d9cdf3"
                    strokeWidth="1.2"
                    strokeOpacity="0.85"
                  />
                  {s.type === "cash" ? (
                    <g>
                      <circle cx={ix} cy={iy} r="17" fill="url(#coinGold)" stroke="#7a4a00" strokeWidth="1.5" />
                      <circle cx={ix} cy={iy} r="12.5" fill="none" stroke="#a86e00" strokeWidth="1.5" strokeOpacity="0.8" />
                      <text
                        x={ix}
                        y={iy + 1}
                        fill="#6b3d00"
                        fontSize="20"
                        fontWeight="800"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        style={{ fontFamily: "'Space Grotesk', sans-serif" }}
                      >
                        $
                      </text>
                    </g>
                  ) : (
                    <text
                      x={ix}
                      y={iy}
                      fill={ICON_FILL[s.icon]}
                      fontSize="34"
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontFamily: "'Material Symbols Outlined'" }}
                    >
                      {s.icon}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* gloss sweep */}
          <g clipPath="url(#faceClip)" pointerEvents="none">
            <ellipse cx={cx} cy={cy - 78} rx="150" ry="90" fill="url(#gloss)" />
          </g>

          {/* hub */}
          <circle cx={cx} cy={cy} r="48" fill="url(#hubDark)" stroke="#000" strokeOpacity="0.7" strokeWidth="2" />
          <circle cx={cx} cy={cy} r="44" fill="none" stroke="#b06bff" strokeWidth="3" filter="url(#neonGlow)" />
          <circle cx={cx} cy={cy} r="44" fill="none" stroke="#e9d5ff" strokeOpacity="0.5" strokeWidth="1" />
          <polygon points="152,138 152,162 172,150" fill="#efe9ff" />
          <text
            x={cx}
            y={cy + 26}
            fill="#ffffff"
            fontSize="21"
            fontWeight="800"
            letterSpacing="3"
            textAnchor="middle"
            style={{ fontFamily: "'Space Grotesk', sans-serif" }}
          >
            SPIN
          </text>
        </svg>
      </div>

      <p className={`mt-4 flex items-center justify-center gap-1.5 text-[12px] font-semibold tabular ${disabled ? "text-muted" : "text-teal-pale"}`}>
        <span className="ms fill text-[15px]">stars</span>
        {disabled ? `Next spin available in ${cooldown}` : "1 Free Daily Spin Ready! (12 Prizes)"}
      </p>
      <button
        onClick={spin}
        disabled={spinning || disabled}
        className={`${hideButton ? "hidden" : ""} liquid-press mt-3 w-full rounded-xl bg-cta py-3.5 text-sm font-bold text-white shadow-[var(--shadow-card)] hover:bg-indigo-bright disabled:opacity-60`}
      >
        {spinning ? "Spinning the prize wheel..." : disabled ? "Spin used today" : "Spin Wheel"}
      </button>

      {result && (
        <div className="result-in mt-3 w-full rounded-xl border border-gold/40 bg-gold/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="ms fill text-[24px] text-gold">
              {result.type === "xp" ? "military_tech" : result.type === "cash" ? "payments" : result.type === "retry" ? "refresh" : "info"}
            </span>
          <p className="text-sm font-bold text-fg">
            {result.type === "xp" && <>+{result.value} XP{claimAction ? "" : " added to your balance"}</>}
            {result.type === "cash" && <>${result.value} WIN · CASH{claimAction ? "" : " added to your balance"}</>}
            {result.type === "retry" && <>One more spin</>}
            {result.type === "none" && <>No win this time</>}
          </p>
          </div>
          {claimAction && (result.type === "xp" || result.type === "cash") && (
            <button onClick={() => claimAction(result)} className="liquid-press mt-3 w-full rounded-xl bg-cta py-3 text-sm font-bold text-white">
              Claim prize
            </button>
          )}
        </div>
      )}
    </div>
  );
}
