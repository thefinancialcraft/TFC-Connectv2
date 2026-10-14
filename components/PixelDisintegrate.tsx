import React, { useEffect, useRef } from 'react';

interface PixelDisintegrateProps {
    active: boolean;
    duration?: number;
    origin?: { x: number; y: number };
    onComplete?: () => void;
}

interface Particle {
    x: number;
    y: number;
    size: number;
    vx: number;
    vy: number;
    alpha: number;
    color: string;
    rotation: number;
    vRot: number;
    scale: number;
    delay: number;
    born: boolean;
}

const PIXEL_PALETTE = [
    '#4b33e8', // Brand Purple
    '#6366f1', // Indigo
    '#818cf8', // Light Indigo
    '#10b981', // Emerald Active
    '#34d399', // Mint
    '#3b82f6', // Asset Blue
    '#60a5fa', // Sky Blue
    '#a855f7', // Violet
    '#e2e8f0', // Surface Light
    '#ffffff', // Sparkle White
];

export const PixelDisintegrate: React.FC<PixelDisintegrateProps> = ({
    active,
    duration = 750,
    origin,
    onComplete,
}) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);

    useEffect(() => {
        if (!active) return;

        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const rect = canvas.getBoundingClientRect();
        const dpr = window.devicePixelRatio || 1;
        const width = rect.width;
        const height = rect.height;

        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.scale(dpr, dpr);
        ctx.imageSmoothingEnabled = false;

        // Origin for the pixel break wave (default: top-right toggle switch)
        const originX = origin?.x ?? (width - 36);
        const originY = origin?.y ?? 25;
        const maxDist = Math.hypot(width, height) || 400;

        // Generate grid of bold square particles
        const particles: Particle[] = [];
        const cols = 20;
        const rows = 14;
        const cellW = width / cols;
        const cellH = height / rows;

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const px = c * cellW + Math.random() * cellW;
                const py = r * cellH + Math.random() * cellH;

                const dist = Math.hypot(px - originX, py - originY);
                // Wave propagation delay from toggle origin
                const waveDelay = (dist / maxDist) * 160;

                // Scatter vector pointing away from origin
                const angle = Math.atan2(py - originY, px - originX);
                const speed = 1.5 + Math.random() * 3.5;

                // Bold square sizes (7px to 14px) so they are unmistakably square
                const squareSize = Math.floor(Math.random() * 7) + 7;

                particles.push({
                    x: px,
                    y: py,
                    size: squareSize,
                    vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 2 - 0.7,
                    vy: Math.sin(angle) * speed - (1.2 + Math.random() * 2.8),
                    alpha: 1,
                    color: PIXEL_PALETTE[Math.floor(Math.random() * PIXEL_PALETTE.length)],
                    rotation: 0,
                    vRot: 0,
                    scale: 1,
                    delay: waveDelay,
                    born: false,
                });
            }
        }

        let animationFrameId: number;
        const startTime = performance.now();

        const render = (now: number) => {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);

            ctx.clearRect(0, 0, width, height);

            let allDead = true;

            particles.forEach((p) => {
                if (elapsed < p.delay) {
                    allDead = false;
                    return;
                }

                if (!p.born) {
                    p.born = true;
                }

                const particleElapsed = elapsed - p.delay;
                const particleDuration = Math.max(duration - p.delay, 350);
                const pProgress = Math.min(particleElapsed / particleDuration, 1);

                if (pProgress >= 1) return;
                allDead = false;

                // Physics update
                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.05; // slight gravity
                p.vx *= 0.985; // air friction

                // Fade alpha cleanly without turning into tiny dots
                p.alpha = Math.max(0, 1 - Math.pow(pProgress, 1.2));
                // Keep scale bold: from 1 down to min 0.5 (never becomes a 1px blurry speck)
                p.scale = Math.max(0.5, 1 - pProgress * 0.5);

                const s = Math.max(4, Math.round(p.size * p.scale));
                const drawX = Math.round(p.x - s / 2);
                const drawY = Math.round(p.y - s / 2);

                ctx.save();
                ctx.globalAlpha = p.alpha;

                // 1. Solid square base
                ctx.fillStyle = p.color;
                ctx.fillRect(drawX, drawY, s, s);

                // 2. Crisp 3D square cube highlights & shadows for authentic pixel geometry
                if (s >= 6) {
                    // Top & Left highlight
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
                    ctx.fillRect(drawX, drawY, s, 1.5);
                    ctx.fillRect(drawX, drawY, 1.5, s);

                    // Bottom & Right shadow
                    ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
                    ctx.fillRect(drawX, drawY + s - 1.5, s, 1.5);
                    ctx.fillRect(drawX + s - 1.5, drawY, 1.5, s);
                }

                ctx.restore();
            });

            if (!allDead && progress < 1) {
                animationFrameId = requestAnimationFrame(render);
            } else {
                if (onComplete) onComplete();
            }
        };

        animationFrameId = requestAnimationFrame(render);

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [active, duration, origin, onComplete]);

    if (!active) return null;

    return (
        <canvas
            ref={canvasRef}
            className="pointer-events-none absolute inset-0 z-50 w-full h-full overflow-visible rounded-2xl"
            style={{ width: '100%', height: '100%', imageRendering: 'pixelated' }}
        />
    );
};

export default PixelDisintegrate;
