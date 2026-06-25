export default function SpecialtyIcon({ name }) {
  const n = (name || "").toLowerCase();
  const style = { color: "#e8a020", display: "block", marginBottom: "15px" };
  const size = 40;
  const p = {
    width: size, height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    style,
  };

  if (n.includes("family")) return (
    <svg {...p}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      <path d="M3.22 12H9.5l1.5-3 2 6 1.5-3h4.78" />
    </svg>
  );

  if (n.includes("dental")) return (
    <svg {...p}>
      <path d="M12 2C9 2 6 4 6 7c0 1.5.5 2.5.5 2.5S5 14 5 17c0 2 1 3 2.5 3S10 18 12 18s2.5 2 4.5 2S20 19 20 17c0-3-1.5-7.5-1.5-7.5S19 8.5 19 7c0-3-3-5-7-5Z" />
    </svg>
  );

  if (n.includes("facial")) return (
    <svg {...p}>
      <circle cx="12" cy="12" r="5" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );

  if (n.includes("preventive")) return (
    <svg {...p}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  );

  if (n.includes("pediatric")) return (
    <svg {...p}>
      <circle cx="12" cy="5" r="2" />
      <path d="M12 7v6" />
      <path d="M8 11l4 2 4-2" />
      <path d="M9 17l3 2 3-2" />
      <path d="M9 17v-4" /><path d="M15 17v-4" />
    </svg>
  );

  if (n.includes("women")) return (
    <svg {...p}>
      <circle cx="12" cy="9" r="6" />
      <path d="M12 15v6" />
      <path d="M9 19h6" />
    </svg>
  );

  if (n.includes("surgery")) return (
    <svg {...p}>
      <circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" />
      <line x1="20" y1="4" x2="8.12" y2="15.88" />
      <line x1="14.47" y1="14.48" x2="20" y2="20" />
      <line x1="8.12" y1="8.12" x2="12" y2="12" />
    </svg>
  );

  // Default — Stethoscope
  return (
    <svg {...p}>
      <path d="M4.8 2.3A.3.3 0 1 0 5 2H4a2 2 0 0 0-2 2v5a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6V4a2 2 0 0 0-2-2h-1a.2.2 0 1 0 .3.3" />
      <path d="M8 15v1a6 6 0 0 0 6 6v0a6 6 0 0 0 6-6v-4" />
      <circle cx="20" cy="10" r="2" />
    </svg>
  );
}