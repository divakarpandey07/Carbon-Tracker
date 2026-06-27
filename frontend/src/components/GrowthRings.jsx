const GrowthRings = ({ className = "", stroke = "#8FB08C", opacity = 0.35 }) => (
  <svg viewBox="0 0 400 400" className={className} fill="none">
    {[40, 80, 120, 160, 195].map((r, i) => (
      <circle
        key={r}
        cx="200"
        cy="200"
        r={r}
        stroke={stroke}
        strokeWidth={i === 4 ? 1.5 : 1}
        opacity={opacity - i * 0.04}
      />
    ))}
  </svg>
);

export default GrowthRings;