import { motion } from 'framer-motion';
import { Ticket, Shuffle, AlertCircle, Loader } from 'lucide-react';
import { useNavigate, useSearchParams, useParams } from 'react-router-dom';
import logo from '../assets/logo.png';
import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL ?? '';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { code: paramCode } = useParams();
    const code = searchParams.get('code') || paramCode || '';

    const [prizeName, setPrizeName] = useState('Televisor Plasma 75 Pulgadas');

    useEffect(() => {
        fetch(`${API}/api/polleria/config`)
            .then(r => r.json())
            .then(json => { if (json.success) setPrizeName(json.data.prizeName); })
            .catch(() => { });
    }, []);

    const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
    const [codeError, setCodeError] = useState('');

    useEffect(() => {
        if (!code) return;
        setCodeStatus('loading');
        fetch(`${API}/api/promo-codes/validate/${encodeURIComponent(code)}`)
            .then(r => r.json())
            .then(json => {
                if (json.valid) {
                    setCodeStatus('valid');
                } else if (json.canjeado && json.tickets?.length > 0) {
                    // Si ya se usó, lo llevamos a ver su boleto digital
                    navigate('/ticket', {
                        state: {
                            name: json.tickets[0]?.ownerName || 'Cliente',
                            phone: json.tickets[0]?.ownerPhone || '',
                            tickets: json.tickets.map((t: any) => t.number),
                            date: new Date(json.tickets[0]?.createdAt || Date.now()).toLocaleDateString()
                        }
                    });
                } else if (json.canjeado) {
                    // Se canjeó pero no hay boletos (error de sincro)
                    setCodeStatus('invalid');
                    setCodeError('El link ya fue usado pero no se encontraron boletos.');
                } else {
                    setCodeStatus('invalid');
                    const msgs: Record<string, string> = {
                        not_found: 'Este link no existe.',
                        inactive: 'Este link ya fue usado.',
                        exhausted: 'Este link ya fue usado.',
                    };
                    setCodeError(msgs[json.reason] || 'Link inválido.');
                }
            })
            .catch(() => {
                // Si hay error de red, dejamos pasar (fail open)
                setCodeStatus('valid');
            });
    }, [code]);

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: '#ffffff'
        }}>
            {/* Professional Light Glows (Orange & Blue) */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 10% 10%, var(--secondary-glow) 0%, transparent 40%)',
                zIndex: 0,
                filter: 'blur(80px)',
                opacity: 0.8
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-20%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 90% 90%, var(--primary-glow) 0%, transparent 40%)',
                zIndex: 0,
                filter: 'blur(80px)',
                opacity: 0.6
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    zIndex: 1,
                    width: '100%',
                    maxWidth: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* Logo Section - Reduced size */}
                <div className="animate-float" style={{ marginBottom: '12px' }}>
                    <img
                        src={logo}
                        alt="Gallinas y Pollos Aliñados"
                        style={{
                            width: '160px',
                            height: 'auto',
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                        }}
                    />
                </div>

                {/* ── PREMIO: TV Plasma 75" ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '10px' }}
                >
                    {/* Badge PREMIO MAYOR */}
                    <div style={{
                        background: 'linear-gradient(135deg, #ff7a00, #ffb347)',
                        color: 'white',
                        fontSize: '10px',
                        fontWeight: 800,
                        letterSpacing: '2.5px',
                        padding: '4px 16px',
                        borderRadius: '20px',
                        marginBottom: '10px',
                        boxShadow: '0 4px 14px rgba(255,122,0,0.45)',
                        textTransform: 'uppercase'
                    }}>
                        🏆 PREMIO MAYOR
                    </div>

                    {/* TV con efecto naranja */}
                    <div style={{
                        filter: 'drop-shadow(0 0 18px rgba(255,122,0,0.7)) drop-shadow(0 4px 10px rgba(255,122,0,0.3))',
                        animation: 'float 4s ease-in-out infinite',
                    }}>
                        <svg width="230" height="138" viewBox="0 0 230 138" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <defs>
                                <linearGradient id="screenGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#1a0a00" />
                                    <stop offset="45%" stopColor="#0d0d1a" />
                                    <stop offset="100%" stopColor="#2a1200" />
                                </linearGradient>
                                <linearGradient id="screenGlow" x1="0" y1="1" x2="0" y2="0">
                                    <stop offset="0%" stopColor="#ff7a00" stopOpacity="0.55" />
                                    <stop offset="60%" stopColor="#ff7a00" stopOpacity="0" />
                                </linearGradient>
                                <linearGradient id="frameGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#2e2e2e" />
                                    <stop offset="100%" stopColor="#111111" />
                                </linearGradient>
                                <linearGradient id="shineGrad" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="white" stopOpacity="0.18" />
                                    <stop offset="100%" stopColor="white" stopOpacity="0" />
                                </linearGradient>
                                <radialGradient id="centerGlow" cx="50%" cy="70%" r="50%">
                                    <stop offset="0%" stopColor="#ff8c00" stopOpacity="0.5" />
                                    <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
                                </radialGradient>
                                <filter id="softGlow">
                                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                                    <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                                </filter>
                            </defs>
                            {/* Marco del TV */}
                            <rect x="4" y="4" width="222" height="114" rx="9" fill="url(#frameGrad)" />
                            {/* Pantalla */}
                            <rect x="12" y="12" width="206" height="98" rx="4" fill="url(#screenGrad)" />
                            {/* Glow naranja inferior */}
                            <rect x="12" y="12" width="206" height="98" rx="4" fill="url(#screenGlow)" />
                            {/* Brillo central */}
                            <rect x="12" y="12" width="206" height="98" rx="4" fill="url(#centerGlow)" />
                            {/* Brillo superior (shine) */}
                            <rect x="12" y="12" width="206" height="40" rx="4" fill="url(#shineGrad)" />
                            {/* Texto 75" en pantalla */}
                            <text x="115" y="52" textAnchor="middle" fill="#ff9f43" fontSize="30" fontWeight="900" fontFamily="Outfit, sans-serif" filter="url(#softGlow)">75"</text>
                            {/* Subtexto PLASMA */}
                            <text x="115" y="74" textAnchor="middle" fill="rgba(255,180,80,0.85)" fontSize="11" fontWeight="700" fontFamily="Outfit, sans-serif" letterSpacing="4">PLASMA</text>
                            {/* Líneas decorativas de la pantalla */}
                            <line x1="12" y1="88" x2="218" y2="88" stroke="rgba(255,122,0,0.15)" strokeWidth="1" />
                            <text x="115" y="100" textAnchor="middle" fill="rgba(255,150,50,0.6)" fontSize="8" fontFamily="Outfit, sans-serif" letterSpacing="2">TELEVISOR DE PLASMA</text>
                            {/* Pie izquierdo */}
                            <rect x="70" y="118" width="20" height="10" rx="2" fill="#1a1a1a" />
                            {/* Pie derecho */}
                            <rect x="140" y="118" width="20" height="10" rx="2" fill="#1a1a1a" />
                            {/* Base izquierda */}
                            <rect x="55" y="128" width="50" height="6" rx="3" fill="#111111" />
                            {/* Base derecha */}
                            <rect x="125" y="128" width="50" height="6" rx="3" fill="#111111" />
                            {/* Indicador LED naranja */}
                            <circle cx="205" cy="110" r="3" fill="#ff7a00" opacity="0.9" filter="url(#softGlow)" />
                        </svg>
                    </div>

                    {/* Nombre del premio */}
                    <p style={{
                        marginTop: '6px',
                        fontSize: '13px',
                        fontWeight: 900,
                        letterSpacing: '1px',
                        background: 'linear-gradient(135deg, #ff7a00, #ffb347)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase'
                    }}>
                        {prizeName}
                    </p>
                </motion.div>

                {/* Text Section - con degradado blanco para legibilidad */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        background: 'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,0.92) 18%, rgba(255,255,255,1) 45%)',
                        padding: '12px 24px 0',
                        borderRadius: '16px',
                        width: '100%',
                    }}
                >
                    <h1 style={{
                        fontSize: 'clamp(22px, 6vw, 30px)',
                        fontWeight: 900,
                        marginBottom: '6px',
                        color: 'var(--text-main)',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.1
                    }}>
                        ¡GRACIAS POR TU COMPRA!
                    </h1>

                    <p style={{
                        fontSize: '14px',
                        color: 'var(--text-muted)',
                        marginBottom: '28px',
                        lineHeight: 1.4
                    }}>
                        Canjea tus boletos para la gran <br />
                        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>RÍOS DE AGUA VIVA</span>
                    </p>
                </motion.div>

                {/* Buttons Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%', maxWidth: '280px' }}>
                    {codeStatus === 'loading' && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '16px' }}>
                            <Loader size={28} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    )}

                    {codeStatus === 'invalid' && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            background: '#fff0f0', border: '1px solid #fcc', borderRadius: '12px',
                            padding: '14px 16px', color: '#c0392b'
                        }}>
                            <AlertCircle size={20} style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '13px', fontWeight: 600 }}>{codeError}</span>
                        </div>
                    )}

                    {(codeStatus === 'valid' || codeStatus === 'idle') && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/picker?type=random&code=${code}`)}
                                className="btn-primary"
                                style={{ width: '100%', padding: '14px' }}
                            >
                                <Shuffle size={18} /> AL AZAR
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/picker?type=choose&code=${code}`)}
                                className="btn-secondary"
                                style={{ width: '100%', padding: '14px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Ticket size={18} /> ELEGIR BOLETOS
                            </motion.button>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Compact Footer */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                fontSize: '10px',
                color: 'rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                © 2024 GALLINAS Y POLLOS ALIÑADOS
            </div>

            {/* Animación del pollo saliendo del TV */}
        </div>
    );
};

export default LandingPage;
