import { forwardRef, type SVGProps } from 'react';

/**
 * La ruota della biga del logo: cerchione, 8 raggi a fuso, mozzo.
 * Disegnata in codice (non ricalcata) per poterla animare raggio per raggio.
 * Coordinate: centro (0,0), raggio esterno 100.
 */
const PROFILE: [number, number][] = [
  [3, -17],
  [5.5, -27],
  [9.5, -47],
  [8.5, -60],
  [4.5, -72],
  [3.6, -80],
  [6.5, -88],
  [3.5, -93],
];

export const SPOKE_PATH = (() => {
  const right = PROFILE.map(([w, y]) => `${w},${y}`);
  const left = [...PROFILE].reverse().map(([w, y]) => `${-w},${y}`);
  return `M0,-14 L${right.join(' L')} L0,-95 L${left.join(' L')} Z`;
})();

type Props = SVGProps<SVGSVGElement> & {
  /** raggio evidenziato (0..7), in giallo */
  active?: number;
  rimColor?: string;
  spokeColor?: string;
  lineColor?: string;
};

export const WheelGlyph = forwardRef<SVGSVGElement, Props & { outline?: boolean }>(function WheelGlyph(
  { active = -1, rimColor = 'var(--wt-logo-cyan)', spokeColor = 'var(--wt-logo-cyan)', lineColor = 'var(--wt-logo-navy)', outline, ...rest },
  ref,
) {
  // versione a filo: solo contorni, per usi discreti (sfondi, filigrane)
  if (outline)
    return (
      <svg ref={ref} viewBox="-104 -104 208 208" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.2" {...rest}>
        <circle r="100" />
        <circle r="93" />
        {Array.from({ length: 8 }, (_, i) => (
          <path key={i} d={SPOKE_PATH} transform={`rotate(${i * 45})`} />
        ))}
        <circle r="17" />
        <circle r="9" />
      </svg>
    );
  return (
    <svg ref={ref} viewBox="-104 -104 208 208" aria-hidden {...rest}>
      <circle r="100" fill="none" stroke={lineColor} strokeWidth="9" />
      <circle r="100" fill="none" stroke={rimColor} strokeWidth="6" />
      <circle r="93" fill="none" stroke={lineColor} strokeWidth="2" />
      {Array.from({ length: 8 }, (_, i) => (
        <path
          key={i}
          d={SPOKE_PATH}
          transform={`rotate(${i * 45})`}
          fill={i === active ? 'var(--wt-yellow)' : spokeColor}
          stroke={lineColor}
          strokeWidth="1.6"
          style={{ transition: 'fill .35s ease' }}
        />
      ))}
      <circle r="17" fill={rimColor} stroke={lineColor} strokeWidth="2.5" />
      <circle r="9" fill="none" stroke={lineColor} strokeWidth="2.5" />
      <circle r="3.5" fill={lineColor} />
    </svg>
  );
});
