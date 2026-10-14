/**
 * Custom monochrome map of central Đà Nẵng — stylised, not to scale.
 * Pure SVG: crisp at any size, no third-party iframe or tracking.
 */
export function MapGraphic() {
  const ink = "#0A0B0A";
  const verticals = [
    { x: 250, label: "Phan Châu Trinh" },
    { x: 340, label: "Lê Lợi" },
    { x: 438, label: "Trần Phú", main: true },
    { x: 522, label: "Bạch Đằng" },
  ];
  const horizontals = [
    { y: 92, label: "Lý Tự Trọng" },
    { y: 178, label: "Quang Trung" },
    { y: 262, label: "Lê Duẩn" },
    { y: 352, label: "Hùng Vương" },
    { y: 446, label: "Phan Đình Phùng" },
    { y: 534, label: "Nguyễn Văn Linh" },
  ];

  return (
    <svg
      viewBox="0 0 800 620"
      className="h-full w-full"
      role="img"
      aria-labelledby="map-title map-desc"
      preserveAspectRatio="xMidYMid slice"
    >
      <title id="map-title">Bản đồ vị trí OSTRA</title>
      <desc id="map-desc">
        OSTRA nằm tại số 12 Trần Phú, gần giao lộ Lê Duẩn, cách sông Hàn một dãy phố, Đà Nẵng.
      </desc>
      <defs>
        <pattern id="hatch" width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="7" stroke={ink} strokeOpacity="0.14" strokeWidth="1" />
        </pattern>
        <pattern id="dots" width="14" height="14" patternUnits="userSpaceOnUse">
          <circle cx="2" cy="2" r="0.9" fill={ink} fillOpacity="0.12" />
        </pattern>
      </defs>

      {/* city blocks texture */}
      <rect x="0" y="0" width="560" height="620" fill="url(#dots)" />

      {/* Sông Hàn */}
      <path
        d="M560 -10 C 590 120, 572 220, 590 330 S 620 520, 600 640 L 700 640 C 716 520, 690 420, 684 320 S 676 110, 655 -10 Z"
        fill={ink}
        fillOpacity="0.07"
        stroke={ink}
        strokeOpacity="0.35"
        strokeWidth="1"
      />
      {/* East bank / toward the sea */}
      <path d="M700 640 C 716 520, 690 420, 684 320 S 676 110, 655 -10 L 820 -10 L 820 640 Z" fill="url(#hatch)" />

      {/* Streets */}
      <g stroke={ink} fill="none">
        {horizontals.map((h) => (
          <line key={h.y} x1="0" y1={h.y} x2="575" y2={h.y + 6} strokeOpacity="0.22" strokeWidth="1" />
        ))}
        {verticals.map((v) => (
          <line
            key={v.x}
            x1={v.x}
            y1="-10"
            x2={v.x + 14}
            y2="640"
            strokeOpacity={v.main ? 0.9 : 0.28}
            strokeWidth={v.main ? 2 : 1}
          />
        ))}
        {/* Bridges */}
        <line x1="575" y1="184" x2="690" y2="190" strokeOpacity="0.5" strokeWidth="3" />
        <line x1="595" y1="452" x2="705" y2="458" strokeOpacity="0.5" strokeWidth="3" />
      </g>

      {/* Labels */}
      <g fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="1.6" fill={ink}>
        {horizontals.map((h) => (
          <text key={h.y} x="16" y={h.y - 7} fillOpacity="0.45">
            {h.label.toUpperCase()}
          </text>
        ))}
        {verticals.map((v) => (
          <text
            key={v.x}
            x={v.x + 10}
            y="604"
            transform={`rotate(-90 ${v.x + 10} 604)`}
            fillOpacity={v.main ? 0.95 : 0.45}
            fontWeight={v.main ? 600 : 400}
          >
            {v.label.toUpperCase()}
          </text>
        ))}
        <text x="612" y="300" transform="rotate(84 612 300)" fillOpacity="0.55" letterSpacing="5">
          SÔNG HÀN
        </text>
        <text x="612" y="176" fillOpacity="0.5">CẦU SÔNG HÀN</text>
        <text x="628" y="444" fillOpacity="0.5">CẦU RỒNG</text>
        <text x="726" y="590" fillOpacity="0.45">BIỂN ĐÔNG →</text>
      </g>

      {/* Marker — 12 Trần Phú, near Lê Duẩn */}
      <g transform="translate(444 238)">
        <circle r="7" fill="#C4471D" className="map-pulse" />
        <circle r="6" fill="#C4471D" />
        <circle r="2" fill="#E9E5DC" />
        <line x1="0" y1="0" x2="-110" y2="-86" stroke={ink} strokeWidth="1" />
        <rect x="-262" y="-118" width="152" height="40" fill={ink} />
        <text x="-250" y="-100" fill="#E9E5DC" fontFamily="var(--font-be-vietnam), sans-serif" fontSize="14" fontWeight="600" letterSpacing="-0.3">
          OSTRA
        </text>
        <text x="-250" y="-86" fill="#AAA79E" fontFamily="var(--font-plex-mono), monospace" fontSize="9" letterSpacing="1.4">
          12 TRẦN PHÚ
        </text>
      </g>

      {/* North + scale */}
      <g transform="translate(36 560)" fill={ink} fontFamily="var(--font-plex-mono), monospace" fontSize="10" letterSpacing="1.6">
        <path d="M0 -26 L6 -8 L0 -12 L-6 -8 Z" fillOpacity="0.85" />
        <text x="-4" y="6" fillOpacity="0.7">B</text>
        <line x1="30" y1="0" x2="110" y2="0" stroke={ink} strokeOpacity="0.6" />
        <line x1="30" y1="-4" x2="30" y2="4" stroke={ink} strokeOpacity="0.6" />
        <line x1="110" y1="-4" x2="110" y2="4" stroke={ink} strokeOpacity="0.6" />
        <text x="54" y="-8" fillOpacity="0.55">200 M</text>
      </g>
    </svg>
  );
}
