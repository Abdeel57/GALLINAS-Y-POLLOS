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

    const [config, setConfig] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

    useEffect(() => {
        fetch(`${API}/api/polleria/config`)
            .then(r => r.json())
            .then(json => {
                if (json.success) {
                    setConfig(json.data);
                }
            })
            .catch(() => { });
    }, []);

    useEffect(() => {
        if (!config?.drawDate || !config?.showCountdown) return;

        const timer = setInterval(() => {
            const now = new Date().getTime();
            const target = new Date(config.drawDate).getTime();
            const diff = target - now;

            if (diff <= 0) {
                setTimeLeft(null);
                clearInterval(timer);
                return;
            }

            setTimeLeft({
                d: Math.floor(diff / (1000 * 60 * 60 * 24)),
                h: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                m: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
                s: Math.floor((diff % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [config]);

    const [codeStatus, setCodeStatus] = useState<'idle' | 'loading' | 'valid' | 'invalid'>('idle');
    const [codeError, setCodeError] = useState('');

    useEffect(() => {
        // Bloquear carga desde caché (bfcache) para evitar botones fantasma al ir atrás
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) window.location.reload();
        };
        window.addEventListener('pageshow', handlePageShow);
        return () => window.removeEventListener('pageshow', handlePageShow);
    }, []);

    useEffect(() => {
        if (!code) return;
        setCodeStatus('loading');
        // Obligamos al navegador a validar siempre contra el servidor (sin caché)
        fetch(`${API}/api/promo-codes/validate/${encodeURIComponent(code)}`, {
            cache: 'no-store',
            headers: { 'Cache-Control': 'no-cache', 'Pragma': 'no-cache' }
        })
            .then(r => r.json())
            .then(json => {
                if (json.valid) {
                    setCodeStatus('valid');
                } else if (json.canjeado && json.tickets?.length > 0) {
                    navigate('/success', {
                        state: {
                            name: json.tickets[0]?.ownerName || 'Cliente',
                            phone: json.tickets[0]?.ownerPhone || '',
                            rancheria: json.tickets[0]?.ownerRancheria || '',
                            tickets: json.tickets.map((t: any) => t.number),
                            date: new Date(json.tickets[0]?.createdAt || Date.now()).toLocaleDateString()
                        },
                        replace: true // Reemplaza historial para evitar bucles de navegación
                    });
                } else if (json.canjeado) {
                    setCodeStatus('invalid');
                    setCodeError('Este link ya fue canjeado anteriormente.');
                } else {
                    setCodeStatus('invalid');
                    const msgs: Record<string, string> = {
                        not_found: 'Este link no es válido.',
                        inactive: 'Este link ya se encuentra inactivo.',
                        exhausted: 'Este link ha superado el límite de usos.',
                    };
                    setCodeError(msgs[json.reason] || 'Link no válido.');
                }
            })
            .catch(() => {
                setCodeStatus('idle'); // Reintentar si falla la red
            });
    }, [code, navigate]);

    return (
        <div style={{
            minHeight: '100dvh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '12px',
            textAlign: 'center',
            position: 'relative',
            overflowX: 'hidden',
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
                    alignItems: 'center',
                    padding: '10px 0'
                }}
            >
                {/* Logo Section - Intelligent & Larger */}
                <div className="animate-float" style={{ marginBottom: '-10px', marginTop: '-15px', zIndex: 10 }}>
                    <img
                        src={logo}
                        alt="Gallinas y Pollos Aliñados"
                        style={{
                            width: '150px',
                            height: 'auto',
                            display: 'block',
                            filter: 'drop-shadow(0 15px 25px rgba(255,122,0,0.25))',
                            transform: 'scale(1.05)',
                            pointerEvents: 'none'
                        }}
                    />
                </div>

                {/* ── SECCIÓN PREMIO REAL ── */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '12px' }}
                >
                    <div style={{
                        background: 'linear-gradient(135deg, #ff7a00, #ffb347)',
                        color: 'white',
                        fontSize: '8px',
                        fontWeight: 900,
                        letterSpacing: '2px',
                        padding: '3px 14px',
                        borderRadius: '20px',
                        marginBottom: '8px',
                        boxShadow: '0 4px 14px rgba(255,122,0,0.45)',
                        textTransform: 'uppercase'
                    }}>
                        🏆 PREMIO MAYOR
                    </div>

                    {/* Imagen del premio real en 1:1 - Slightly smaller */}
                    <div style={{
                        width: '180px',
                        height: '180px',
                        borderRadius: '20px',
                        overflow: 'hidden',
                        position: 'relative',
                        boxShadow: '0 20px 40px rgba(255,122,0,0.25), 0 0 25px rgba(255,122,0,0.4)',
                        border: '2px solid rgba(255,122,0,0.3)',
                        animation: 'float 4s ease-in-out infinite',
                        background: '#f8f9fa'
                    }}>
                        {config?.prizeImage ? (
                            <img src={config.prizeImage} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#111' }}>
                                <Shuffle size={40} color="rgba(255,122,0,0.2)" />
                            </div>
                        )}
                        <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 40%)'
                        }} />
                    </div>

                    <h2 style={{
                        marginTop: '10px',
                        fontSize: '15px',
                        lineHeight: 1.2,
                        fontWeight: 900,
                        letterSpacing: '-0.3px',
                        background: 'linear-gradient(135deg, #ff7a00, #ffb347)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textTransform: 'uppercase'
                    }}>
                        {config?.prizeName || 'Nombre del Premio'}
                    </h2>

                    {/* ── CONTADOR DE TIEMPO - Compact ── */}
                    {config?.showCountdown && timeLeft && (
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                            {[
                                { v: timeLeft.d, l: 'DÍAS' },
                                { v: timeLeft.h, l: 'HORAS' },
                                { v: timeLeft.m, l: 'MIN' },
                                { v: timeLeft.s, l: 'SEG' }
                            ].map((t, idx) => (
                                <div key={idx} style={{ textAlign: 'center' }}>
                                    <div style={{
                                        width: '38px', height: '38px',
                                        background: '#1a1a1a', borderRadius: '8px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '14px', fontWeight: 900, color: 'white',
                                        boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                                    }}>
                                        {t.v.toString().padStart(2, '0')}
                                    </div>
                                    <div style={{ fontSize: '7px', fontWeight: 800, color: '#999', marginTop: '2px', letterSpacing: '0.5px' }}>{t.l}</div>
                                </div>
                            ))}
                        </div>
                    )}
                </motion.div>

                {/* Text Section - Mas compacto */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{
                        padding: '0 24px',
                        borderRadius: '16px',
                        width: '100%',
                    }}
                >
                    <h1 style={{
                        fontSize: 'clamp(18px, 5vw, 24px)',
                        fontWeight: 900,
                        marginBottom: '4px',
                        color: 'var(--text-main)',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.1
                    }}>
                        ¡GRACIAS POR TU COMPRA!
                    </h1>

                    <p style={{
                        fontSize: '13px',
                        color: 'var(--text-muted)',
                        marginBottom: '16px',
                        lineHeight: 1.3
                    }}>
                        Canjea tus boletos para la gran <br />
                        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>RÍOS DE AGUA VIVA</span>
                    </p>
                </motion.div>

                {/* Buttons Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%', maxWidth: '280px', marginTop: '4px' }}>
                    {codeStatus === 'loading' && (
                        <div style={{ display: 'flex', justifyContent: 'center', padding: '12px' }}>
                            <Loader size={24} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                        </div>
                    )}

                    {codeStatus === 'invalid' && (
                        <div style={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: '#fff0f0', border: '1px solid #fcc', borderRadius: '12px',
                            padding: '12px 16px', color: '#c0392b'
                        }}>
                            <AlertCircle size={18} style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '12px', fontWeight: 600 }}>{codeError}</span>
                        </div>
                    )}

                    {(codeStatus === 'valid' || codeStatus === 'idle') && (
                        <>
                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/picker?type=random&code=${code}`)}
                                className="btn-primary"
                                style={{ width: '100%', padding: '12px', fontSize: '14px' }}
                            >
                                <Shuffle size={16} /> AL AZAR
                            </motion.button>

                            <motion.button
                                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                                onClick={() => navigate(`/picker?type=choose&code=${code}`)}
                                className="btn-secondary"
                                style={{ width: '100%', padding: '12px', fontSize: '14px', display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}
                            >
                                <Ticket size={16} /> ELEGIR BOLETOS
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
