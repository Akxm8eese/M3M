import type { LayerId } from "./types";

const STYLE: Record<LayerId, { fill: string; stroke: string; width: number; dash?: string }> = {
  skin: { fill: "#E4C4AB", stroke: "#16181C", width: 1.8 },
  muscle: { fill: "#C45A4A", stroke: "#5C241C", width: 1.8 },
  bone: { fill: "#F7F3EB", stroke: "#16181C", width: 2.2 },
  fascia: { fill: "rgba(94,124,108,0.08)", stroke: "#2F4A3E", width: 1.8, dash: "7 5" },
};

export function BodyFigure({ face, layer }: { face: "front" | "back"; layer: LayerId }) {
  const style = STYLE[layer];
  return (
    <svg viewBox="0 0 240 600" className="figure" aria-hidden="true">
      <ellipse cx="120" cy="578" rx="70" ry="7" fill="rgba(22,24,28,0.08)" stroke="none" />
      <g
        fill={style.fill}
        stroke={style.stroke}
        strokeWidth={style.width}
        strokeDasharray={style.dash}
        strokeLinejoin="round"
        strokeLinecap="round"
      >
        <ellipse cx="120" cy="34" rx="24" ry="22" />
        <path d="M107 50 h26 v58 h-26 Z" />
        <path d="M86 108 C70 112 36 122 16 132 C20 146 48 150 84 138 C78 200 84 280 90 340 C96 372 88 392 96 408 H144 C152 392 144 372 150 340 C156 280 162 200 156 138 C192 150 220 146 224 132 C204 122 170 112 154 108 C144 100 96 100 86 108 Z" />
        <path d="M98 404 C92 450 90 500 96 546 H118 C122 500 116 450 112 404 Z" />
        <path d="M128 404 C124 450 118 500 122 546 H144 C150 500 148 450 142 404 Z" />
        <ellipse cx="104" cy="566" rx="20" ry="12" />
        <ellipse cx="136" cy="566" rx="20" ry="12" />
      </g>
      {layer === "muscle" ? <MuscleMarks /> : null}
      {layer === "bone" ? <BoneMarks face={face} /> : null}
      {layer === "fascia" ? <FasciaMarks /> : null}
      {layer !== "fascia" ? <OrientationMarks face={face} /> : null}
    </svg>
  );
}

function OrientationMarks({ face }: { face: "front" | "back" }) {
  if (face === "front") {
    return (
      <g fill="none" stroke="#16181C" strokeWidth="1.5" strokeLinecap="round">
        <path d="M120 16 v10" />
        <path d="M108 214 c8 8 8 16 0 24 c8 8 8 16 0 24" />
        <circle cx="102" cy="468" r="5" fill="#F7F3EB" />
        <circle cx="138" cy="468" r="5" fill="#F7F3EB" />
      </g>
    );
  }
  return (
    <g fill="none" stroke="#16181C" strokeWidth="1.5" strokeLinecap="round">
      <path d="M120 78 V390" />
      <path d="M96 150 q14 8 0 28 q14 8 0 28" />
      <path d="M144 150 q-14 8 0 28 q-14 8 0 28" />
      <ellipse cx="104" cy="328" rx="7" ry="11" />
      <ellipse cx="136" cy="328" rx="7" ry="11" />
    </g>
  );
}

function MuscleMarks() {
  return (
    <g fill="none" stroke="#5C241C" strokeWidth="1.2" opacity="0.8">
      <path d="M104 180 V300" />
      <path d="M136 180 V300" />
      <path d="M108 430 V520" />
      <path d="M132 430 V520" />
    </g>
  );
}

function BoneMarks({ face }: { face: "front" | "back" }) {
  return (
    <g fill="none" stroke="#16181C" strokeWidth="1.3">
      <path d="M120 70 V400" />
      <path d="M98 176 H142" />
      <path d="M100 198 H140" />
      <path d="M102 220 H138" />
      <path d="M92 360 Q120 378 148 360" />
      {face === "front" ? <path d="M112 210 c6 8 6 14 0 22 c6 8 6 14 0 22" /> : null}
    </g>
  );
}

function FasciaMarks() {
  return (
    <g fill="none" stroke="#2F4A3E" strokeWidth="1.2" strokeDasharray="4 4">
      <path d="M70 150 C120 190 120 250 168 310" />
      <path d="M168 160 C112 220 128 280 78 340" />
      <path d="M100 430 C120 470 120 510 146 548" />
    </g>
  );
}
