import { useEffect, useRef, useState } from 'react';

/**
 * Animated hero backdrop.
 *
 * Two layers:
 *  1. A canvas particle field + aurora gradient that always runs. This is the
 *     baseline and needs no assets, so the page never looks broken.
 *  2. An optional video layer that fades in on top when a file is placed at
 *     /media/hero.mp4 (or .webm). Drop in your own school footage and it
 *     upgrades automatically; if the file is missing, nothing breaks.
 *
 * Respects prefers-reduced-motion by freezing the animation.
 */

const VIDEO_CANDIDATES = [
  '/media/hero.mp4',
  '/media/hero.webm',
  '/media/hero.mov',
];

export default function HeroBackdrop() {
  const canvasRef = useRef(null);
  const [videoSrc, setVideoSrc] = useState(null);

  // Probe for an optional local video. 404s resolve to null and we stay on canvas.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      for (const src of VIDEO_CANDIDATES) {
        try {
          const res = await fetch(src, { method: 'HEAD' });
          if (res.ok && (res.headers.get('content-type') || '').startsWith('video')) {
            if (!cancelled) setVideoSrc(src);
            return;
          }
        } catch (e) {
          // Not present - keep probing.
        }
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      build();
    };

    // Particles sized relative to the viewport so density stays sane on mobile.
    let particles = [];
    const build = () => {
      const count = Math.round(Math.min(90, Math.max(28, (width * height) / 20000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        r: Math.random() * 2.2 + 0.6,
        a: Math.random() * 0.5 + 0.2,
      }));
    };

    const pointer = { x: -9999, y: -9999 };
    const onPointerMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
    };
    const onPointerLeave = () => { pointer.x = -9999; pointer.y = -9999; };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Soft aurora blobs drifting behind the particles.
      const t = performance.now() / 6000;
      const blobs = [
        { cx: 0.25 + 0.12 * Math.sin(t), cy: 0.32 + 0.1 * Math.cos(t * 0.8), r: 0.42, c: '34,197,94' },
        { cx: 0.74 + 0.1 * Math.cos(t * 1.1), cy: 0.28 + 0.14 * Math.sin(t * 0.7), r: 0.38, c: '74,222,128' },
        { cx: 0.52 + 0.16 * Math.sin(t * 0.6), cy: 0.78 + 0.08 * Math.cos(t * 0.9), r: 0.46, c: '22,163,74' },
      ];
      for (const b of blobs) {
        const g = ctx.createRadialGradient(
          b.cx * width, b.cy * height, 0,
          b.cx * width, b.cy * height, b.r * Math.max(width, height),
        );
        g.addColorStop(0, `rgba(${b.c},0.30)`);
        g.addColorStop(1, `rgba(${b.c},0)`);
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, width, height);
      }

      // Particle links: connect neighbours, gives the constellation look.
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 15000) {
            ctx.strokeStyle = `rgba(134,239,172,${0.14 * (1 - d2 / 15000)})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // Gentle wrap at the edges.
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Nudge away from the cursor for a subtle interactive pull.
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 20000 && d2 > 1) {
          const f = (1 - d2 / 20000) * 0.6;
          const d = Math.sqrt(d2);
          p.x += (dx / d) * f;
          p.y += (dy / d) * f;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(190,255,215,${p.a})`;
        ctx.fill();
      }

      if (running) raf = requestAnimationFrame(draw);
    };

    resize();
    draw();

    if (reduceMotion) {
      // Single static frame is enough; stop the loop.
      running = false;
    } else {
      window.addEventListener('pointermove', onPointerMove);
      canvas.addEventListener('pointerleave', onPointerLeave);
    }

    const onResize = () => resize();
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
    };
  }, []);

  return (
    <div className="hero-backdrop" aria-hidden="true">
      <canvas ref={canvasRef} className="hero-backdrop-canvas" />
      {videoSrc && (
        <video className="hero-backdrop-video" autoPlay muted loop playsInline preload="metadata">
          <source src={videoSrc} type={videoSrc.endsWith('.webm') ? 'video/webm' : 'video/mp4'} />
        </video>
      )}
      <div className="hero-backdrop-scrim" />
      <div className="hero-backdrop-grid" />
    </div>
  );
}
