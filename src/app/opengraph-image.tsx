import { ImageResponse } from 'next/og';

export const alt = 'Ezekiel — A szervezet digitális modellje';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Share card, generated at build time. Same idea as the hero in static form: a
 * connected model on graphite, no stock imagery. Uses the renderer's default
 * sans so the build needs no font fetch.
 */
export default function OpengraphImage() {
  // A small deterministic constellation — the wordmark's idea at scale.
  const nodes = [
    { x: 760, y: 130, r: 9, o: 0.95 },
    { x: 900, y: 210, r: 6, o: 0.7 },
    { x: 690, y: 280, r: 13, o: 1 },
    { x: 1020, y: 300, r: 5, o: 0.5 },
    { x: 830, y: 380, r: 8, o: 0.8 },
    { x: 620, y: 430, r: 6, o: 0.6 },
    { x: 960, y: 470, r: 10, o: 0.85 },
    { x: 750, y: 520, r: 5, o: 0.45 },
    { x: 1090, y: 180, r: 4, o: 0.35 },
    { x: 1110, y: 420, r: 7, o: 0.55 },
  ];
  const edges: [number, number][] = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 4],
    [2, 5],
    [4, 6],
    [4, 7],
    [1, 8],
    [6, 9],
    [3, 9],
    [0, 4],
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          position: 'relative',
          background: '#0a0d12',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Connections */}
        <svg width={1200} height={630} style={{ position: 'absolute', inset: 0 }}>
          {edges.map(([a, b], i) => {
            const from = nodes[a]!;
            const to = nodes[b]!;
            return (
              <line
                key={i}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                stroke="#4fa3ff"
                strokeOpacity={0.32}
                strokeWidth={1.4}
              />
            );
          })}
          {nodes.map((n, i) => (
            <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="#4fa3ff" fillOpacity={n.o} />
          ))}
        </svg>

        {/* Readability well behind the copy */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'radial-gradient(70% 90% at 12% 50%, rgba(10,13,18,0.97) 0%, rgba(10,13,18,0.8) 45%, rgba(10,13,18,0) 100%)',
          }}
        />

        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 72px',
            width: 760,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <svg width="24" height="24" viewBox="0 0 20 20">
              <path d="M5.6 6.4 14.4 13.6" stroke="#4fa3ff" strokeWidth="1.2" />
              <circle cx="5.6" cy="6.4" r="2.6" fill="#4fa3ff" />
              <circle cx="14.4" cy="13.6" r="2.2" fill="#7fc0ff" />
            </svg>
            <span style={{ color: '#f7f9fc', fontSize: 22, letterSpacing: 4 }}>EZEKIEL</span>
          </div>

          <div
            style={{
              marginTop: 40,
              color: '#f7f9fc',
              fontSize: 62,
              lineHeight: 1.06,
              letterSpacing: -1.6,
            }}
          >
            A szervezet digitális modellje.
          </div>

          <div style={{ marginTop: 28, color: '#a8b3c2', fontSize: 27, lineHeight: 1.4 }}>
            Nem csak megmutatja, mi történik. Megmutatja, miért.
          </div>
        </div>
      </div>
    ),
    size,
  );
}
