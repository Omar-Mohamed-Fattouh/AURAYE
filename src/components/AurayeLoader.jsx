// src/components/AurayeLoader.jsx
import React from "react";

export function AurayeSpinner({ size = 48, thickness = 4, ariaLabel = "loading" }) {
  const s = Number(size);
  const r = (s - thickness) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * 0.25;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={s}
      height={s}
      viewBox={`0 0 ${s} ${s}`}
      style={{ display: "block" }}
    >
      <defs>
        <linearGradient id="aurayeGrad" x1="0" x2="1">
          <stop offset="0%" stopOpacity="1" stopColor="#7c3aed" />
          <stop offset="100%" stopOpacity="1" stopColor="#06b6d4" />
        </linearGradient>
      </defs>

      <circle
        cx={s/2}
        cy={s/2}
        r={r}
        stroke="rgba(0,0,0,0.08)"
        strokeWidth={thickness}
        fill="none"
      />
      <circle
        cx={s/2}
        cy={s/2}
        r={r}
        stroke="url(#aurayeGrad)"
        strokeWidth={thickness}
        strokeLinecap="round"
        fill="none"
        strokeDasharray={`${dash} ${circ - dash}`}
        transform={`rotate(-90 ${s/2} ${s/2})`}
        style={{ animation: "auraye-rotate 1s linear infinite" }}
      />
      <style>{`
        @keyframes auraye-rotate {
          0% { transform: rotate(-90deg); }
          100% { transform: rotate(270deg); }
        }
      `}</style>
    </svg>
  );
}

export function AurayePulse({ size = 40, ariaLabel = "loading" }) {
  const s = Number(size);
  return (
    <div role="img" aria-label={ariaLabel} style={{ width: s, height: s, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{
        width: s * 0.5,
        height: s * 0.5,
        borderRadius: "50%",
        background: "linear-gradient(90deg,#7c3aed,#06b6d4)",
        boxShadow: "0 0 0 0 rgba(124,58,237,0.6)",
        animation: "auraye-pulse 1.6s infinite"
      }}/>
      <style>{`
        @keyframes auraye-pulse {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(124,58,237,0.35); opacity: 1; }
          70% { transform: scale(1.9); box-shadow: 0 0 0 12px rgba(6,182,212,0); opacity: 0; }
          100% { transform: scale(1.0); box-shadow: 0 0 0 0 rgba(124,58,237,0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

export default AurayeSpinner;
