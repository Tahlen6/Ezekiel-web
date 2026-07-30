'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import {
  EDGES,
  LAYERS,
  MAX_DEGREE,
  POSITIONED_NODES,
  degree,
  type EdgeKind,
  type LayerId,
  type SignalId,
} from '@/lib/model';
import {
  approach,
  clamp01,
  dpr,
  easeOutCubic,
  lerp,
  range,
  readToken,
  resizeCanvas,
  rgba,
  type RGB,
} from '@/lib/canvas';
import { useDensity, usePrefersReducedMotion, type Density } from '@/lib/hooks';

export interface GraphCameraSpec {
  x?: number;
  y?: number;
  zoom?: number;
}

export interface GraphCanvasProps {
  /**
   * Assembly progress, read once per frame. 0 = abstract point cloud,
   * 1 = fully connected model. A callback rather than a prop so scroll-driven
   * values never trigger a React render.
   */
  getProgress?: () => number;
  /** Fixed progress for sections that are not scroll-driven. */
  progress?: number;
  /** Layers currently switched on. Omit for all layers. */
  visibleLayers?: readonly LayerId[];
  /**
   * Nodes to bring forward, in propagation order — index drives the arrival
   * delay, which is what makes a change look like it spreads through the model.
   */
  highlight?: readonly string[];
  /** Push everything that is not highlighted into the background. */
  dim?: boolean;
  selectedId?: string | null;
  labels?: 'none' | 'key' | 'all';
  /**
   * Region where labels must not be drawn, in normalised canvas coordinates.
   * The hero passes the area its copy occupies, so node labels never compete
   * with the headline instead of relying on a scrim to hide the collision.
   */
  labelSafeArea?: { x0: number; y0: number; x1: number; y1: number };
  camera?: GraphCameraSpec;
  /** Per-frame camera, for scroll-driven push-in. Takes precedence over `camera`. */
  getCamera?: () => GraphCameraSpec;
  /** `cover` bleeds past the edges (hero), `contain` fits the box (explorer). */
  fit?: 'cover' | 'contain';
  /** Pointer hit-testing and selection. */
  interactive?: boolean;
  onSelect?: (id: string | null) => void;
  onHover?: (id: string | null) => void;
  /** Data pulses travelling along the connections. */
  pulses?: boolean;
  /** Describes the current state for screen readers. */
  ariaLabel: string;
  className?: string;
}

const FOV = 2.7;

/** How many detail tiers each density shows. */
const MAX_TIER: Record<Density, number> = { mobile: 1, tablet: 2, desktop: 3 };
const PULSE_BUDGET: Record<Density, number> = { mobile: 4, tablet: 8, desktop: 14 };

const EDGE_ALPHA: Record<EdgeKind, number> = {
  structure: 0.4,
  flow: 0.62,
  support: 0.34,
  accountability: 0.42,
  cost: 0.44,
  exposure: 0.5,
};

/** Edge kinds that carry something — only these get data pulses. */
const PULSING_KINDS: ReadonlySet<EdgeKind> = new Set<EdgeKind>(['flow', 'support']);

interface Palette {
  blue: RGB;
  blueBright: RGB;
  blueDeep: RGB;
  ice: RGB;
  base: RGB;
  fg: RGB;
  signal: Record<SignalId, RGB>;
}

function readPalette(): Palette {
  return {
    blue: readToken('--color-blue-400', [79, 163, 255]),
    blueBright: readToken('--color-blue-300', [127, 192, 255]),
    blueDeep: readToken('--color-blue-700', [23, 69, 127]),
    ice: readToken('--color-blue-100', [211, 230, 251]),
    base: readToken('--color-base', [10, 13, 18]),
    fg: readToken('--color-fg', [247, 249, 252]),
    signal: {
      gap: readToken('--color-signal-gap', [232, 163, 61]),
      conflict: readToken('--color-signal-conflict', [199, 125, 255]),
      risk: readToken('--color-signal-risk', [229, 89, 94]),
      loss: readToken('--color-signal-loss', [242, 193, 78]),
    },
  };
}

/**
 * Soft radial sprite, cached per colour. Pre-rendering the glow and scaling it
 * with drawImage is what keeps ~50 nodes inside the frame budget — building a
 * gradient per node per frame is not affordable.
 */
function glowSprite(cache: Map<string, HTMLCanvasElement>, color: RGB): HTMLCanvasElement {
  const key = color.join(',');
  const hit = cache.get(key);
  if (hit) return hit;

  const size = 64;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d')!;
  const grad = g.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  grad.addColorStop(0, rgba(color, 1));
  grad.addColorStop(0.22, rgba(color, 0.75));
  grad.addColorStop(0.55, rgba(color, 0.18));
  grad.addColorStop(1, rgba(color, 0));
  g.fillStyle = grad;
  g.fillRect(0, 0, size, size);

  cache.set(key, c);
  return c;
}

interface NodeRuntime {
  vis: number;
  hi: number;
}

export function GraphCanvas({
  getProgress,
  progress = 1,
  visibleLayers,
  highlight,
  dim = false,
  selectedId = null,
  labels = 'none',
  labelSafeArea,
  camera,
  getCamera,
  fit = 'contain',
  interactive = false,
  onSelect,
  onHover,
  pulses = true,
  ariaLabel,
  className = '',
}: GraphCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reduced = usePrefersReducedMotion();
  const density = useDensity();

  // Latest props, read by the render loop. Synced before paint so a state
  // change never shows a stale frame.
  const propsRef = useRef({
    getProgress,
    progress,
    visibleLayers,
    highlight,
    dim,
    selectedId,
    labels,
    labelSafeArea,
    camera,
    getCamera,
    fit,
    pulses,
    reduced,
    density,
  });

  useLayoutEffect(() => {
    propsRef.current = {
      getProgress,
      progress,
      visibleLayers,
      highlight,
      dim,
      selectedId,
      labels,
      labelSafeArea,
      camera,
      getCamera,
      fit,
      pulses,
      reduced,
      density,
    };
  });

  const onSelectRef = useRef(onSelect);
  const onHoverRef = useRef(onHover);
  useLayoutEffect(() => {
    onSelectRef.current = onSelect;
    onHoverRef.current = onHover;
  });

  /* Static, geometry-only precomputation. Depth order never changes because z
     is fixed, so it is sorted once instead of every frame. */
  const geom = useMemo(() => {
    const indexById = new Map(POSITIONED_NODES.map((n, i) => [n.id, i]));
    const weights = POSITIONED_NODES.map((n) => degree(n.id) / MAX_DEGREE);

    const edges = EDGES.map((e) => ({
      a: indexById.get(e.from)!,
      b: indexById.get(e.to)!,
      kind: e.kind,
      tier: e.tier,
    })).filter((e) => e.a !== undefined && e.b !== undefined);

    // Far edges first, so nearer connections overlay them.
    const edgeOrder = edges
      .map((_, i) => i)
      .sort((i, j) => {
        const zi = (POSITIONED_NODES[edges[i]!.a]!.z + POSITIONED_NODES[edges[i]!.b]!.z) / 2;
        const zj = (POSITIONED_NODES[edges[j]!.a]!.z + POSITIONED_NODES[edges[j]!.b]!.z) / 2;
        return zi - zj;
      });

    const nodeOrder = POSITIONED_NODES.map((_, i) => i).sort(
      (i, j) => POSITIONED_NODES[i]!.z - POSITIONED_NODES[j]!.z,
    );

    // Deterministic reveal threshold per edge: connections draw in over the
    // second half of assembly rather than all snapping on at once.
    const edgeThreshold = edges.map((_, i) => 0.42 + ((i * 37) % 100) / 100 * 0.4);

    const pulseEdges = edges
      .map((e, i) => ({ e, i }))
      .filter(({ e }) => PULSING_KINDS.has(e.kind))
      .map(({ i }) => i);

    const labelNodes = new Set(
      POSITIONED_NODES.filter(
        (n, i) => n.layer === 'org' || weights[i]! > 0.42 || n.layer === 'costs',
      ).map((n) => n.id),
    );

    return { edges, edgeOrder, nodeOrder, edgeThreshold, weights, pulseEdges, labelNodes, indexById };
  }, []);

  /** Live per-node visual state, eased toward its target every frame. */
  const runtime = useRef<NodeRuntime[]>(
    POSITIONED_NODES.map(() => ({ vis: 0, hi: 0 })),
  );

  /** Projected screen positions from the last frame, for pointer hit-testing. */
  const projected = useRef({
    x: new Float32Array(POSITIONED_NODES.length),
    y: new Float32Array(POSITIONED_NODES.length),
    r: new Float32Array(POSITIONED_NODES.length),
    on: new Uint8Array(POSITIONED_NODES.length),
  });

  const hoverRef = useRef<number>(-1);

  /** Restarts the render loop after it has parked itself (reduced motion). */
  const wakeRef = useRef<() => void>(() => {});

  const hitTest = useCallback((px: number, py: number): number => {
    const p = projected.current;
    let best = -1;
    let bestDist = Infinity;
    for (let i = 0; i < p.x.length; i += 1) {
      if (!p.on[i]) continue;
      const dx = p.x[i]! - px;
      const dy = p.y[i]! - py;
      const d = dx * dx + dy * dy;
      // Generous target: node radius plus a 14px ring.
      const reach = (p.r[i]! + 14) ** 2;
      if (d < reach && d < bestDist) {
        bestDist = d;
        best = i;
      }
    }
    return best;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const palette = readPalette();
    const sprites = new Map<string, HTMLCanvasElement>();
    const ratio = dpr();

    let box = { width: 0, height: 0 };
    let frame = 0;
    let last = performance.now();
    let onScreen = false;
    let idle = false;
    let frameCost = 8; // EMA of draw time, drives adaptive quality
    let quality = 1;

    // Pulse state: position along its edge, plus a speed so they desynchronise.
    const pulseState = geom.pulseEdges.map((edgeIndex, i) => ({
      edgeIndex,
      t: (i * 0.137) % 1,
      speed: 0.10 + ((i * 53) % 40) / 400,
    }));

    const measure = () => {
      const next = resizeCanvas(canvas, ratio);
      if (next) box = next;
    };

    const draw = (now: number) => {
      const p = propsRef.current;
      const dt = Math.min(now - last, 64);
      last = now;

      const started = performance.now();
      const { width: w, height: h } = box;
      if (w === 0 || h === 0) return;

      const maxTier = MAX_TIER[p.density];
      const activeLayers: ReadonlySet<LayerId> = p.visibleLayers
        ? new Set(p.visibleLayers)
        : new Set(LAYERS.map((l) => l.id));

      const rawProgress = p.reduced ? 1 : (p.getProgress?.() ?? p.progress);
      const prog = clamp01(rawProgress);

      const highlightIndex = new Map<string, number>();
      p.highlight?.forEach((id, i) => highlightIndex.set(id, i));
      const hasHighlight = highlightIndex.size > 0;

      // Ease per-node visibility and highlight toward their targets.
      const settleHalfLife = p.reduced ? 0.0001 : 110;
      let settling = false;
      for (let i = 0; i < POSITIONED_NODES.length; i += 1) {
        const node = POSITIONED_NODES[i]!;
        const rt = runtime.current[i]!;
        const inTier = node.tier <= maxTier;
        const targetVis = inTier && activeLayers.has(node.layer) ? 1 : 0;

        const hIdx = highlightIndex.get(node.id);
        // Propagation: each step in the highlight order joins slightly later.
        const propagationDelay = hIdx === undefined ? 0 : Math.min(hIdx, 8) * 90;
        const targetHi = hIdx === undefined ? 0 : 1;

        rt.vis = approach(rt.vis, targetVis, dt, settleHalfLife);
        rt.hi = approach(
          rt.hi,
          targetHi,
          Math.max(0, dt - (targetHi > rt.hi ? propagationDelay * 0.014 : 0)),
          p.reduced ? 0.0001 : 150,
        );
        if (rt.vis !== targetVis || rt.hi !== targetHi) settling = true;
      }

      const cam = p.getCamera?.() ?? p.camera ?? {};
      const camX = cam.x ?? 0;
      const camY = cam.y ?? 0;
      const zoom = cam.zoom ?? 1;

      // Model space is ±1 in x and roughly ±0.9 in y.
      const scaleX = w * 0.46;
      const scaleY = h * 0.5;
      /*
       * `cover` takes the larger scale so the model bleeds past the frame. In a
       * tall narrow box — a phone in portrait — the height term dominates so
       * hard that the model draws several times wider than the canvas and most
       * of it lands off-screen. The clamp keeps the bleed to something the
       * viewer can still read as a whole; it never binds on landscape screens.
       */
      const cover = Math.min(Math.max(scaleX, scaleY), w * 0.6);
      const baseScale = (p.fit === 'cover' ? cover : Math.min(scaleX, scaleY)) * zoom;

      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const proj = projected.current;

      // ---- project ----
      const sx = new Float32Array(POSITIONED_NODES.length);
      const sy = new Float32Array(POSITIONED_NODES.length);
      const sr = new Float32Array(POSITIONED_NODES.length);
      const sDepth = new Float32Array(POSITIONED_NODES.length);

      for (let i = 0; i < POSITIONED_NODES.length; i += 1) {
        const n = POSITIONED_NODES[i]!;
        // Per-node arrival: nodes with a larger delay resolve later.
        const t = easeOutCubic(range(prog, n.delay * 0.55, 0.55 + n.delay * 0.45));
        const x = lerp(n.ax, n.x, t);
        const y = lerp(n.ay, n.y, t);
        const z = lerp(n.az, n.z, t);

        // Slow ambient drift keeps the model alive without reading as motion.
        const driftAmp = p.reduced ? 0 : 0.006 * (1 - t * 0.55);
        const drift = Math.sin(now * 0.00022 + n.phase) * driftAmp;

        const persp = FOV / (FOV - z);
        sDepth[i] = persp;
        sx[i] = w / 2 + (x + camX + drift) * baseScale * persp;
        sy[i] = h / 2 + (y + camY + drift * 0.6) * baseScale * persp;

        const weight = geom.weights[i]!;
        sr[i] = (2.2 + weight * 5.4) * persp * (p.density === 'mobile' ? 0.85 : 1);
      }

      // ---- edges ----
      ctx.lineCap = 'round';
      for (const ei of geom.edgeOrder) {
        const e = geom.edges[ei]!;
        if (e.tier > maxTier) continue;

        const va = runtime.current[e.a]!;
        const vb = runtime.current[e.b]!;
        const vis = Math.min(va.vis, vb.vis);
        if (vis < 0.02) continue;

        // Connections resolve after the points do — first you see dots, then
        // you see that they were always related.
        const reveal = easeOutCubic(range(prog, geom.edgeThreshold[ei]!, geom.edgeThreshold[ei]! + 0.34));
        if (reveal < 0.02) continue;

        const bothHi = Math.min(va.hi, vb.hi);
        const depth = (sDepth[e.a]! + sDepth[e.b]!) / 2;
        const depthFade = clamp01((depth - 0.6) / 1.1) * 0.75 + 0.25;

        let alpha = EDGE_ALPHA[e.kind] * vis * reveal * depthFade;
        if (hasHighlight && p.dim) alpha *= 0.18 + bothHi * 0.82;

        const ax = sx[e.a]!;
        const ay = sy[e.a]!;
        const bx = lerp(ax, sx[e.b]!, reveal);
        const by = lerp(ay, sy[e.b]!, reveal);

        const colour = bothHi > 0.15 ? palette.blueBright : palette.blue;
        ctx.strokeStyle = rgba(colour, alpha * (bothHi > 0.15 ? 0.95 : 0.55));
        ctx.lineWidth = (bothHi > 0.15 ? 1.3 : 0.85) * Math.min(depth, 1.4);
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(bx, by);
        ctx.stroke();
      }

      // ---- pulses ----
      if (p.pulses && !p.reduced && prog > 0.6) {
        const budget = Math.round(PULSE_BUDGET[p.density] * quality);
        let drawn = 0;
        for (const pulse of pulseState) {
          pulse.t = (pulse.t + (pulse.speed * dt) / 1000) % 1;
          if (drawn >= budget) continue;
          const e = geom.edges[pulse.edgeIndex]!;
          if (e.tier > maxTier) continue;
          const vis = Math.min(runtime.current[e.a]!.vis, runtime.current[e.b]!.vis);
          if (vis < 0.5) continue;

          const t = pulse.t;
          // Fade in and out at the ends so pulses don't pop at the nodes.
          const edgeFade = Math.sin(t * Math.PI);
          const px = lerp(sx[e.a]!, sx[e.b]!, t);
          const py = lerp(sy[e.a]!, sy[e.b]!, t);
          const sprite = glowSprite(sprites, palette.ice);
          const size = 7;
          ctx.globalAlpha = 0.5 * edgeFade * vis * (prog - 0.6) / 0.4;
          ctx.drawImage(sprite, px - size / 2, py - size / 2, size, size);
          ctx.globalAlpha = 1;
          drawn += 1;
        }
      }

      // ---- nodes ----
      const hover = hoverRef.current;
      for (const i of geom.nodeOrder) {
        const n = POSITIONED_NODES[i]!;
        const rt = runtime.current[i]!;
        if (rt.vis < 0.02) {
          proj.on[i] = 0;
          continue;
        }

        const depth = sDepth[i]!;
        const isSelected = p.selectedId === n.id;
        const isHover = hover === i;

        // Depth of field: distant nodes lose their crisp core and read as blur.
        const hardness = clamp01((depth - 0.68) / 0.8);
        const depthAlpha = 0.3 + hardness * 0.7;

        let alpha = rt.vis * depthAlpha;
        if (hasHighlight && p.dim) alpha *= 0.2 + rt.hi * 0.8;

        const signalColour = n.signal ? palette.signal[n.signal] : null;
        const showSignal = signalColour && (rt.hi > 0.1 || !hasHighlight);
        const colour = showSignal
          ? signalColour
          : rt.hi > 0.15 || isSelected
            ? palette.blueBright
            : palette.blue;

        const r = sr[i]! * (1 + rt.hi * 0.35 + (isSelected ? 0.5 : 0) + (isHover ? 0.25 : 0));

        // Glow
        const sprite = glowSprite(sprites, colour);
        const glowSize = r * (8.4 - hardness * 3);
        ctx.globalAlpha = alpha * (0.6 + rt.hi * 0.4);
        ctx.drawImage(sprite, sx[i]! - glowSize / 2, sy[i]! - glowSize / 2, glowSize, glowSize);

        // Crisp core, only where the node is in focus
        if (hardness > 0.05) {
          ctx.globalAlpha = alpha * hardness;
          ctx.fillStyle = rgba(colour, 1);
          ctx.beginPath();
          ctx.arc(sx[i]!, sy[i]!, r * 0.62, 0, Math.PI * 2);
          ctx.fill();
        }

        // Selection ring
        if ((isSelected || isHover) && hardness > 0.2) {
          ctx.globalAlpha = alpha * (isSelected ? 0.95 : 0.55);
          ctx.strokeStyle = rgba(palette.ice, 1);
          ctx.lineWidth = 1.1;
          ctx.beginPath();
          ctx.arc(sx[i]!, sy[i]!, r * 1.9, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;

        proj.x[i] = sx[i]!;
        proj.y[i] = sy[i]!;
        proj.r[i] = r;
        proj.on[i] = rt.vis > 0.5 ? 1 : 0;
      }

      // ---- labels ----
      if (p.labels !== 'none' && prog > 0.55) {
        const fontFamily = getComputedStyle(canvas).fontFamily;
        const labelAlpha = range(prog, 0.55, 0.9);
        ctx.textBaseline = 'middle';

        /* Nearest-first, so when two labels compete the node in focus keeps
           its own. Overlapping labels are dropped rather than stacked — an
           unreadable pile says less than one clear name. */
        const placed: { x0: number; y0: number; x1: number; y1: number }[] = [];

        for (let k = geom.nodeOrder.length - 1; k >= 0; k -= 1) {
          const i = geom.nodeOrder[k]!;
          const n = POSITIONED_NODES[i]!;
          const rt = runtime.current[i]!;
          if (rt.vis < 0.6) continue;
          if (p.labels === 'key' && !geom.labelNodes.has(n.id) && rt.hi < 0.3) continue;

          const depth = sDepth[i]!;
          if (depth < 0.9 && rt.hi < 0.3 && p.selectedId !== n.id) continue;
          if (sx[i]! < 0 || sx[i]! > w || sy[i]! < 12 || sy[i]! > h - 12) continue;

          let alpha = labelAlpha * rt.vis * clamp01((depth - 0.85) / 0.5);
          if (hasHighlight && p.dim) alpha *= 0.25 + rt.hi * 0.75;
          if (alpha < 0.06) continue;

          const size = Math.round(Math.min(13, 10.5 + depth * 1.6));
          ctx.font = `500 ${size}px ${fontFamily}`;
          const text = n.label;
          const tw = ctx.measureText(text).width;
          const gap = sr[i]! * 2.4;
          // Flip to the left of the node when the label would run off the edge.
          const flip = sx[i]! + gap + tw > w - 10;
          const lx = Math.min(flip ? sx[i]! - gap - tw : sx[i]! + gap, w - tw - 8);
          const ly = sy[i]!;
          if (lx < 8) continue;

          const safe = p.labelSafeArea;
          if (
            safe &&
            lx < safe.x1 * w &&
            lx + tw > safe.x0 * w &&
            ly < safe.y1 * h &&
            ly > safe.y0 * h
          ) {
            continue;
          }

          const padX = 5;
          const padY = size * 0.62;

          const box = { x0: lx - padX, y0: ly - padY, x1: lx + tw + padX, y1: ly + padY };
          const collides = placed.some(
            (r) => box.x0 < r.x1 && box.x1 > r.x0 && box.y0 < r.y1 && box.y1 > r.y0,
          );
          if (collides) continue;
          placed.push(box);

          // Plate keeps labels legible where they cross dense connections.
          ctx.globalAlpha = alpha * 0.72;
          ctx.fillStyle = rgba(palette.base, 0.82);
          ctx.beginPath();
          ctx.roundRect(lx - padX, ly - padY, tw + padX * 2, padY * 2, 3);
          ctx.fill();

          ctx.globalAlpha = alpha;
          ctx.fillStyle = rgba(rt.hi > 0.2 ? palette.ice : palette.fg, 1);
          ctx.fillText(text, lx, ly + 0.5);
          ctx.globalAlpha = 1;
        }
      }

      // Adaptive quality: if frames get expensive, spend less on pulses.
      const cost = performance.now() - started;
      frameCost = frameCost * 0.9 + cost * 0.1;
      quality = frameCost > 11 ? Math.max(0.25, quality - 0.02) : Math.min(1, quality + 0.01);

      // With reduced motion there is nothing left to animate once the frame has
      // settled, so the loop parks itself instead of redrawing an identical
      // frame forever. Respecting the preference means not spending the frames.
      if (p.reduced && !settling) idle = true;
    }

    const loop = (now: number) => {
      if (!onScreen) return;
      draw(now);
      if (idle) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(loop);
    }

    const start = () => {
      if (frame) return;
      idle = false;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    }

    // Lets a prop change restart the loop after it has parked itself.
    wakeRef.current = () => {
      if (onScreen) start();
    }

    const stop = () => {
      if (frame) cancelAnimationFrame(frame);
      frame = 0;
    }

    measure();

    // Only animate what the viewer can actually see. With several graphs on the
    // page this is the difference between a smooth scroll and a hot laptop.
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          onScreen = entry.isIntersecting;
          if (onScreen) {
            measure();
            start();
          } else {
            stop();
          }
        }
      },
      { rootMargin: '120px' },
    );
    io.observe(canvas);

    const ro = new ResizeObserver(() => {
      measure();
      if (onScreen) draw(performance.now());
    });
    ro.observe(canvas);

    return () => {
      stop();
      io.disconnect();
      ro.disconnect();
    };
  }, [geom]);

  /* A serialised key is the cheapest reliable way to notice that any view
     input changed, given several of them are arrays. */
  const stateKey = [
    progress,
    visibleLayers?.join(','),
    highlight?.join(','),
    dim,
    selectedId,
    labels,
    density,
    reduced,
    camera?.zoom,
    camera?.x,
    camera?.y,
  ].join('|');

  useEffect(() => {
    wakeRef.current();
  }, [stateKey]);

  /* ---- pointer interaction ---- */

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const hit = hitTest(event.clientX - rect.left, event.clientY - rect.top);
      if (hit === hoverRef.current) return;
      hoverRef.current = hit;
      event.currentTarget.style.cursor = hit >= 0 ? 'pointer' : 'default';
      onHoverRef.current?.(hit >= 0 ? POSITIONED_NODES[hit]!.id : null);
    },
    [interactive, hitTest],
  );

  const handlePointerLeave = useCallback(() => {
    if (hoverRef.current === -1) return;
    hoverRef.current = -1;
    onHoverRef.current?.(null);
  }, []);

  const handleClick = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!interactive) return;
      const rect = event.currentTarget.getBoundingClientRect();
      const hit = hitTest(event.clientX - rect.left, event.clientY - rect.top);
      onSelectRef.current?.(hit >= 0 ? POSITIONED_NODES[hit]!.id : null);
    },
    [interactive, hitTest],
  );

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={ariaLabel}
      className={`h-full w-full ${className}`}
      onPointerMove={interactive ? handlePointerMove : undefined}
      onPointerLeave={interactive ? handlePointerLeave : undefined}
      onPointerUp={interactive ? handleClick : undefined}
    />
  );
}
