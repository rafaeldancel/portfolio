"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useReducedMotion } from "@/lib/useReducedMotion";

const finePointer = "(hover: hover) and (pointer: fine)";
const grid = 24;
// The body's radial-gradient tile centres each dot in its 24px cell.
const cellOffset = grid / 2;
const radius = 240;
const push = 6;
const dotMin = 0.5;
const dotMax = 1.6;
const ripple = { duration: 700, reach: 400, band: 28 };
const levels = 24;
// Per-frame lerp factor at 60fps; scaled by frame time below.
const ease = 0.18;

function subscribePointer(onChange: () => void) {
  const media = window.matchMedia(finePointer);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

function readColor(name: string) {
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim().replace(/^#/, "");
  return [0, 2, 4].map((offset) => parseInt(value.slice(offset, offset + 2), 16));
}

function smoothstep(value: number) {
  const t = Math.min(1, Math.max(0, value));
  return t * t * (3 - 2 * t);
}

// The body's dot grid redrawn on a fixed canvas: dots near the (lerped) cursor
// grow, warm toward amber and drift outward; clicks send out a ripple ring.
// Frames run only while something moves, then the loop stops.
export function CursorDots() {
  const reducedMotion = useReducedMotion();
  const fine = useSyncExternalStore(subscribePointer, () => window.matchMedia(finePointer).matches, () => false);
  const enabled = fine && reducedMotion === false;
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!enabled || !canvas || !context) return;

    const line = readColor("--line");
    const accent = readColor("--accent");
    // Quantised colours, so dots batch into a few fills per frame.
    const palette = Array.from({ length: levels + 1 }, (_, level) => {
      const mix = level / levels;
      return `rgb(${line.map((channel, index) => Math.round(channel + (accent[index] - channel) * mix)).join(" ")})`;
    });
    const buckets: number[][] = Array.from({ length: levels + 1 }, () => []);

    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };
    let presence = 0;
    let present = false;
    let ripples: { x: number; y: number; start: number }[] = [];
    let width = 0;
    let height = 0;
    let frame = 0;
    let last = 0;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (now: number) => {
      ripples = ripples.filter((wave) => now - wave.start < ripple.duration);
      context.clearRect(0, 0, width, height);
      buckets.forEach((bucket) => { bucket.length = 0; });

      const originX = cellOffset - (window.scrollX % grid);
      const originY = cellOffset - (window.scrollY % grid);
      const waves = ripples.map((wave) => {
        const t = Math.min(1, Math.max(0, (now - wave.start) / ripple.duration));
        return { x: wave.x, y: wave.y, r: ripple.reach * (1 - (1 - t) ** 3), fade: 1 - t };
      });

      for (let y = originY - grid; y < height + grid; y += grid) {
        for (let x = originX - grid; x < width + grid; x += grid) {
          let dx = x - current.x;
          let dy = y - current.y;
          const distance = Math.hypot(dx, dy);
          const near = presence * smoothstep(1 - distance / radius);
          let glow = near;
          for (const wave of waves) {
            const d = Math.hypot(x - wave.x, y - wave.y);
            glow = Math.max(glow, wave.fade * smoothstep(1 - Math.abs(d - wave.r) / ripple.band));
          }
          if (glow < 0.01) {
            buckets[0].push(x, y, dotMin);
            continue;
          }
          if (distance > 0.001) {
            dx /= distance;
            dy /= distance;
          }
          const offset = near * push;
          buckets[Math.round(glow * levels)].push(x + dx * offset, y + dy * offset, dotMin + (dotMax - dotMin) * glow);
        }
      }

      buckets.forEach((bucket, level) => {
        if (!bucket.length) return;
        context.fillStyle = palette[level];
        context.beginPath();
        for (let i = 0; i < bucket.length; i += 3) {
          context.moveTo(bucket[i] + bucket[i + 2], bucket[i + 1]);
          context.arc(bucket[i], bucket[i + 1], bucket[i + 2], 0, Math.PI * 2);
        }
        context.fill();
      });

      context.lineWidth = 1;
      for (const wave of waves) {
        context.strokeStyle = `rgb(${accent.join(" ")} / ${0.55 * wave.fade})`;
        context.beginPath();
        context.arc(wave.x, wave.y, Math.max(0, wave.r), 0, Math.PI * 2);
        context.stroke();
      }
    };

    const tick = (now: number) => {
      const step = 1 - (1 - ease) ** (Math.min(now - last, 64) / (1000 / 60));
      last = now;
      current.x += (target.x - current.x) * step;
      current.y += (target.y - current.y) * step;
      presence += ((present ? 1 : 0) - presence) * step;
      draw(now);
      const moving = Math.abs(target.x - current.x) + Math.abs(target.y - current.y) > 0.1
        || Math.abs((present ? 1 : 0) - presence) > 0.005
        || ripples.length > 0;
      frame = moving ? requestAnimationFrame(tick) : 0;
    };
    const request = () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };

    const onMove = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      target.x = event.clientX;
      target.y = event.clientY;
      if (!present) {
        // Appear where the cursor is instead of trailing in from the corner.
        current.x = target.x;
        current.y = target.y;
        present = true;
      }
      request();
    };
    const onDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse" || event.button !== 0) return;
      ripples.push({ x: event.clientX, y: event.clientY, start: performance.now() });
      request();
    };
    const onLeave = () => {
      present = false;
      request();
    };
    const onResize = () => {
      resize();
      draw(performance.now());
    };

    resize();
    draw(performance.now());
    // The canvas now draws every dot, so the body's CSS grid steps aside.
    document.documentElement.dataset.cursorCanvas = "";

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("scroll", request, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("blur", onLeave);
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      delete document.documentElement.dataset.cursorCanvas;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("scroll", request);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("blur", onLeave);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [enabled]);

  if (!enabled) return null;
  return <canvas ref={canvasRef} className="cursor-dots" aria-hidden="true" />;
}
