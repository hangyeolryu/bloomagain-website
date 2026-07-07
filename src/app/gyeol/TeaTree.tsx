"use client";

// 차나무 성장 애니메이션 (웹 포트) — 앱 TeaTreeView(CustomPaint)와 동일한
// 스켈레톤/수학을 <canvas>로 그린다. 결 테스트 결과 페이지에서 "앱에서는
// 답할수록 이 나무가 자란다"를 미리 보여주는 다운로드 훅.
// 화면에 보일 때(IntersectionObserver) 새싹→만개(답 30개 상당)까지 자란다.

import { useEffect, useRef } from "react";

// ── 스켈레톤 (앱과 동일 값) ──
type Branch = [attach: number, angleDeg: number, lenFrac: number, birth: number];
type Leaf = [branch: number, along: number, angleDeg: number, size: number, birth: number];
type Flower = [branch: number, along: number, birth: number];

const BRANCHES: Branch[] = [
  [0.30, 152, 0.38, 0.14],
  [0.46, 30, 0.34, 0.20],
  [0.62, 148, 0.28, 0.34],
  [0.76, 38, 0.24, 0.44],
];
const LEAVES: Leaf[] = [
  [-1, 0.20, 165, 11, 0.045], [-1, 0.22, 15, 11, 0.06],
  [0, 0.55, 175, 10, 0.16], [0, 1.0, 135, 12, 0.175],
  [1, 0.55, 5, 10, 0.22], [1, 1.0, 45, 12, 0.24],
  [-1, 0.52, 160, 10, 0.26], [-1, 0.56, 20, 10, 0.28],
  [2, 0.55, 170, 10, 0.37], [2, 1.0, 128, 11, 0.40],
  [-1, 0.70, 150, 11, 0.42], [3, 0.55, 12, 9, 0.46], [3, 1.0, 55, 11, 0.48],
  [-1, 0.86, 150, 12, 0.60], [-1, 0.90, 30, 12, 0.66],
  [-1, 0.97, 70, 13, 0.72], [-1, 1.0, 110, 13, 0.78],
  [0, 0.80, 155, 10, 0.84], [1, 0.80, 25, 10, 0.88],
];
const FLOWERS: Flower[] = [[0, 1.12, 0.50], [1, 1.12, 0.58], [-1, 1.04, 0.78]];

const C = {
  soil: "#B9A28A", soilDark: "#9C8368", trunk: "#7A5A3C",
  leaves: ["#1F4E3D", "#3E7D5F", "#6FA98A"],
  petal: "#F7E9EC", petalEdge: "#E9C9D2", stamen: "#E0B84E",
};

const rad = (d: number) => (d * Math.PI) / 180;
const pop = (m: number, birth: number, span = 0.10) =>
  Math.min(1, Math.max(0, (m - birth) / span));
const spring = (p: number) =>
  p >= 1 ? 1 : 1 - Math.pow(2, -10 * p) * Math.cos(p * Math.PI * 3.5) * (1 - p);

function drawTree(ctx: CanvasRenderingContext2D, w: number, h: number, m: number) {
  ctx.clearRect(0, 0, w, h);
  const k = h / 120;
  const gy = h - 10 * k;
  const bx = w / 2;

  // 흙
  const sp = pop(m, 0, 0.04);
  if (sp > 0) {
    ctx.globalAlpha = 0.9 * sp;
    ctx.fillStyle = C.soil;
    ctx.beginPath();
    ctx.ellipse(bx, gy + 3 * k, ((46 + 14 * m) * k * sp) / 2, (13 * k * sp) / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.55 * sp;
    ctx.fillStyle = C.soilDark;
    ctx.beginPath();
    ctx.ellipse(bx, gy + 1.5 * k, ((30 + 10 * m) * k * sp) / 2, (8 * k * sp) / 2, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }

  // 줄기
  const tp = pop(m, 0.02, 0.9);
  const tl = 86 * k * (0.18 + 0.82 * tp);
  const topY = gy - tl;
  const sway = 7 * k * tp;
  const trunkAt = (s: number): [number, number] => {
    const u = 1 - s;
    return [
      u * u * bx + 2 * u * s * (bx - sway) + s * s * (bx + sway * 0.4),
      u * u * gy + 2 * u * s * (gy - tl * 0.55) + s * s * topY,
    ];
  };
  if (tp > 0) {
    ctx.strokeStyle = C.trunk;
    ctx.lineCap = "round";
    ctx.lineWidth = (2.0 + 2.6 * m) * k;
    ctx.beginPath();
    ctx.moveTo(bx, gy);
    ctx.quadraticCurveTo(bx - sway, gy - tl * 0.55, bx + sway * 0.4, topY);
    ctx.stroke();
  }

  // 가지
  const starts: [number, number][] = [];
  const tips: [number, number][] = [];
  for (const [attach, ang, lenFrac, birth] of BRANCHES) {
    const p = pop(m, birth, 0.14);
    const s = trunkAt(attach);
    starts.push(s);
    if (p <= 0) { tips.push(s); continue; }
    const ease = 1 - (1 - p) * (1 - p);
    const len = tl * lenFrac * ease;
    const dx = Math.cos(rad(ang)), dy = -Math.sin(rad(ang));
    const tip: [number, number] = [s[0] + dx * len, s[1] + dy * len];
    ctx.strokeStyle = C.trunk;
    ctx.lineWidth = (1.2 + 1.0 * m) * k;
    ctx.beginPath();
    ctx.moveTo(s[0], s[1]);
    ctx.quadraticCurveTo(s[0] + dx * len * 0.5, s[1] + dy * len * 0.5 - 3.5 * k, tip[0], tip[1]);
    ctx.stroke();
    tips.push(tip);
  }
  const anchor = (b: number, along: number): [number, number] => {
    if (b === -1) return trunkAt(Math.min(1, Math.max(0, along)));
    const s = starts[b], e = tips[b];
    return [s[0] + (e[0] - s[0]) * along, s[1] + (e[1] - s[1]) * along];
  };

  // 잎 (티어드롭 + 잎맥)
  LEAVES.forEach(([b, along, ang, size, birth], i) => {
    const p = pop(m, birth, 0.09);
    if (p <= 0) return;
    const len = size * k * spring(p);
    if (len <= 0.5) return;
    const [px, py] = anchor(b, along);
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(-rad(ang));
    const wHalf = len * 0.36;
    ctx.fillStyle = C.leaves[i % 3];
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.quadraticCurveTo(len * 0.45, -wHalf, len, 0);
    ctx.quadraticCurveTo(len * 0.45, wHalf, 0, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.lineWidth = 0.9;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(len * 0.82, 0);
    ctx.stroke();
    ctx.restore();
  });

  // 차꽃 (흰 꽃잎 5장 + 노란 수술)
  for (const [b, along, birth] of FLOWERS) {
    const p = pop(m, birth, 0.08);
    if (p <= 0) continue;
    const r = 6.5 * k * spring(p);
    if (r <= 0.5) continue;
    const [cx, cy] = anchor(b, along);
    for (let i = 0; i < 5; i++) {
      const a = rad(90 + i * 72);
      const pcx = cx + Math.cos(a) * r * 0.62;
      const pcy = cy - Math.sin(a) * r * 0.62;
      ctx.fillStyle = C.petal;
      ctx.strokeStyle = C.petalEdge;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.ellipse(pcx, pcy, r * 0.52, r * 0.42, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
    ctx.fillStyle = C.stamen;
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2);
    ctx.fill();
  }
}

export function TeaTree({ height = 150 }: { height?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const cssW = height * 1.3;
    const cssH = height;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    ctx.scale(dpr, dpr);

    let raf = 0;
    let started = false;

    const run = () => {
      if (started) return;
      started = true;
      const DURATION = 3200; // 새싹→만개 전체 서사를 천천히
      const t0 = performance.now();
      const frame = (now: number) => {
        const t = Math.min(1, (now - t0) / DURATION);
        const eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        drawTree(ctx, cssW, cssH, eased * 1.0); // 만개(답 30개 상당)까지
        if (t < 1) raf = requestAnimationFrame(frame);
      };
      raf = requestAnimationFrame(frame);
    };

    // 화면에 들어올 때 자라기 시작 — 결과 페이지 하단이라 스크롤로 만난다.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          run();
          io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(canvas);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [height]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: height * 1.3, height, display: "block", margin: "0 auto" }}
      aria-label="답할수록 자라는 차나무 애니메이션"
    />
  );
}
