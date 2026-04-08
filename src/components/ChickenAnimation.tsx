import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ── Sonido: tres "co-co-co" rápidos via Web Audio API ──
function playCluck() {
    try {
        const AC = window.AudioContext || (window as any).webkitAudioContext;
        if (!AC) return;
        const ctx = new AC();
        for (let i = 0; i < 3; i++) {
            const t = ctx.currentTime + i * 0.17;

            // Oscilador principal (sawtooth → cluck)
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filt = ctx.createBiquadFilter();
            filt.type = 'bandpass';
            filt.frequency.value = 680;
            filt.Q.value = 3.5;
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1100, t);
            osc.frequency.exponentialRampToValueAtTime(370, t + 0.11);
            gain.gain.setValueAtTime(0, t);
            gain.gain.linearRampToValueAtTime(0.3, t + 0.018);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.13);
            osc.connect(filt);
            filt.connect(gain);
            gain.connect(ctx.destination);
            osc.start(t);
            osc.stop(t + 0.14);

            // Armónico secundario para textura
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(550, t);
            osc2.frequency.exponentialRampToValueAtTime(220, t + 0.1);
            gain2.gain.setValueAtTime(0.12, t);
            gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.start(t);
            osc2.stop(t + 0.13);
        }
    } catch { /* noop: algunos browsers bloquean audio sin interacción previa */ }
}

// ── Plumas: posiciones y trayectorias ──
const FEATHERS = [
    { id: 1, l: 50, t: 39, r: 22,  dx: 12,  delay: 0.02 },
    { id: 2, l: 55, t: 33, r: -35, dx: -10, delay: 0.08 },
    { id: 3, l: 61, t: 27, r: 50,  dx: 15,  delay: 0.15 },
    { id: 4, l: 66, t: 22, r: -18, dx: -5,  delay: 0.22 },
    { id: 5, l: 53, t: 36, r: 68,  dx: 11,  delay: 0.05 },
    { id: 6, l: 58, t: 30, r: -52, dx: -14, delay: 0.19 },
    { id: 7, l: 70, t: 18, r: 33,  dx: 7,   delay: 0.29 },
];

// ── Pollo SVG: cartoon profesional, alas abiertas, pico abierto ──
const ChickenSVG: React.FC = () => (
    <svg width="115" height="115" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Ala izquierda */}
        <path d="M29 57 Q2 36 10 15 Q17 36 26 50 Z" fill="#e8a800" />
        <path d="M29 57 Q-1 46 4 25 Q14 43 24 52 Z" fill="#c88a00" />
        <path d="M29 57 Q5 28 18 10 Q21 34 26 49 Z" fill="#ffc107" opacity="0.55" />
        {/* Ala derecha */}
        <path d="M71 57 Q98 36 90 15 Q83 36 74 50 Z" fill="#e8a800" />
        <path d="M71 57 Q101 46 96 25 Q86 43 76 52 Z" fill="#c88a00" />
        <path d="M71 57 Q95 28 82 10 Q79 34 74 49 Z" fill="#ffc107" opacity="0.55" />
        {/* Cuerpo */}
        <ellipse cx="50" cy="66" rx="22" ry="19" fill="#f5c518" />
        {/* Cuello */}
        <path d="M43 50 Q50 46 57 50 L55 60 Q50 62 45 60 Z" fill="#f5c518" />
        {/* Cabeza */}
        <circle cx="50" cy="36" r="17" fill="#f5c518" />
        {/* Cresta */}
        <path d="M40 22 Q43 10 46 20 Q48 8 50 17 Q52 8 54 20 Q57 10 60 22" fill="#e74c3c" />
        {/* Papada */}
        <ellipse cx="50" cy="49" rx="5" ry="6" fill="#e74c3c" />
        {/* Ojo izquierdo (abierto de susto) */}
        <circle cx="41" cy="31" r="8.5" fill="white" />
        <circle cx="41" cy="32.5" r="5" fill="#111" />
        <circle cx="43" cy="30" r="2.2" fill="white" />
        <circle cx="40.2" cy="34" r="0.8" fill="white" opacity="0.5" />
        {/* Ojo derecho */}
        <circle cx="59" cy="31" r="7" fill="white" />
        <circle cx="59" cy="32.5" r="4" fill="#111" />
        <circle cx="60.5" cy="30" r="1.5" fill="white" />
        {/* Cejas arqueadas (asustado) */}
        <path d="M34 22 Q40 16 47 21" stroke="#c8960a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        <path d="M53 21 Q59 16 66 21" stroke="#c8960a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        {/* Pico abierto (gritando) */}
        <path d="M43 40 Q50 36 57 40 L50 39 Z" fill="#ff9500" />
        <path d="M43 41 Q50 55 57 41 Q50 48 43 41 Z" fill="#ff7700" />
        <path d="M44 43 Q50 53 56 43 Q50 54 44 43 Z" fill="#b02a1e" />
        <ellipse cx="50" cy="50" rx="3.5" ry="2.5" fill="#e74c3c" />
        {/* Pata izquierda */}
        <line x1="41" y1="83" x2="34" y2="93" stroke="#ff9500" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="34" y1="93" x2="26" y2="92" stroke="#ff9500" strokeWidth="3" strokeLinecap="round" />
        <line x1="34" y1="93" x2="33" y2="99" stroke="#ff9500" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="93" x2="40" y2="98" stroke="#ff9500" strokeWidth="2.5" strokeLinecap="round" />
        {/* Pata derecha */}
        <line x1="59" y1="83" x2="66" y2="93" stroke="#ff9500" strokeWidth="3.5" strokeLinecap="round" />
        <line x1="66" y1="93" x2="74" y2="92" stroke="#ff9500" strokeWidth="3" strokeLinecap="round" />
        <line x1="66" y1="93" x2="67" y2="99" stroke="#ff9500" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="66" y1="93" x2="60" y2="98" stroke="#ff9500" strokeWidth="2.5" strokeLinecap="round" />
        {/* Líneas de velocidad (izquierda del pollo) */}
        <line x1="2"  y1="43" x2="19" y2="41" stroke="rgba(80,80,80,0.28)" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="0"  y1="54" x2="16" y2="57" stroke="rgba(80,80,80,0.2)"  strokeWidth="2"   strokeLinecap="round" />
        <line x1="4"  y1="32" x2="17" y2="32" stroke="rgba(80,80,80,0.18)" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="1"  y1="62" x2="12" y2="65" stroke="rgba(80,80,80,0.14)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
);

// ── Pluma SVG ──
const Feather: React.FC<{ alt?: boolean }> = ({ alt }) => (
    <svg width="13" height="21" viewBox="0 0 13 21" fill="none">
        <path d="M6.5 1 Q12 7 10 13.5 Q8.5 18.5 6.5 21 Q4.5 18.5 3 13.5 Q1 7 6.5 1 Z"
            fill={alt ? '#e8a800' : '#f5c518'} />
        <line x1="6.5" y1="2"  x2="6.5" y2="20.5" stroke="#a87000" strokeWidth="0.9" />
        {[5.5, 9, 12.5].map(y => (
            <React.Fragment key={y}>
                <line x1="6.5" y1={y} x2={6.5 + 3.5} y2={y + 2.2} stroke="#a87000" strokeWidth="0.55" />
                <line x1="6.5" y1={y} x2={6.5 - 3.5} y2={y + 2.2} stroke="#a87000" strokeWidth="0.55" />
            </React.Fragment>
        ))}
    </svg>
);

type Phase = 'idle' | 'flash' | 'burst' | 'fly' | 'done';

export default function ChickenAnimation() {
    const [phase, setPhase] = useState<Phase>('idle');

    useEffect(() => {
        const timers = [
            setTimeout(() => setPhase('flash'),                     500),
            setTimeout(() => { setPhase('burst'); playCluck(); },   820),
            setTimeout(() => setPhase('fly'),                      1120),
            setTimeout(() => setPhase('done'),                     2600),
        ];
        return () => timers.forEach(clearTimeout);
    }, []);

    if (phase === 'idle' || phase === 'done') return null;

    const W = typeof window !== 'undefined' ? window.innerWidth  : 400;
    const H = typeof window !== 'undefined' ? window.innerHeight : 800;

    return (
        <>
            {/* ── Flash de pantalla del TV ── */}
            <AnimatePresence>
                {phase === 'flash' && (
                    <motion.div
                        key="tv-flash"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 1, 0.05, 0.85, 0] }}
                        transition={{ duration: 0.32, times: [0, 0.18, 0.45, 0.68, 1] }}
                        style={{
                            position: 'fixed',
                            top: '40%',
                            left: '50%',
                            width: 244,
                            height: 150,
                            transform: 'translate(-50%, 0)',
                            background: 'radial-gradient(ellipse at center, #ffffff 25%, rgba(255,140,0,0.55) 100%)',
                            borderRadius: 9,
                            zIndex: 999,
                            pointerEvents: 'none',
                            boxShadow: '0 0 70px 24px rgba(255,140,0,0.45)',
                        }}
                    />
                )}
            </AnimatePresence>

            {/* ── Pollo ── */}
            {(phase === 'burst' || phase === 'fly') && (
                <motion.div
                    key="chicken"
                    style={{
                        position: 'fixed',
                        top:        '42%',
                        left:       '50%',
                        marginLeft: -57,
                        marginTop:  -57,
                        zIndex:     1002,
                        pointerEvents: 'none',
                        filter: 'drop-shadow(0 6px 16px rgba(0,0,0,0.32))',
                    }}
                    initial={{ scale: 0, opacity: 0, rotate: 0, x: 0, y: 0 }}
                    animate={
                        phase === 'burst'
                            ? { scale: [0, 1.65, 1.15], opacity: 1, rotate: [-7, 6, -3, 0] }
                            : {
                                x:       W * 0.52,
                                y:       -H * 0.62,
                                scale:   [1.15, 0.85, 0.55],
                                rotate:  -24,
                                opacity: [1, 1, 0.65, 0],
                            }
                    }
                    transition={
                        phase === 'burst'
                            ? { duration: 0.26, ease: 'backOut' }
                            : { duration: 1.1, ease: [0.22, 0.82, 0.6, 1.0] }
                    }
                >
                    <ChickenSVG />
                </motion.div>
            )}

            {/* ── Plumas ── */}
            <AnimatePresence>
                {phase === 'fly' && FEATHERS.map(f => (
                    <motion.div
                        key={`feather-${f.id}`}
                        style={{
                            position:      'fixed',
                            left:          `${f.l}%`,
                            top:           `${f.t}%`,
                            zIndex:        1000,
                            pointerEvents: 'none',
                        }}
                        initial={{ opacity: 0, scale: 0, rotate: f.r, y: 0, x: 0 }}
                        animate={{
                            opacity: [0, 1, 0.85, 0.4, 0],
                            scale:   [0, 1.15, 0.9, 0.6],
                            y:       [0, H * 0.09, H * 0.23],
                            x:       [0, f.dx,     f.dx * 1.7],
                            rotate:  [f.r, f.r + 110, f.r + 240],
                        }}
                        transition={{ duration: 1.9, delay: f.delay, ease: 'easeIn' }}
                    >
                        <Feather alt={f.id % 2 === 0} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </>
    );
}
