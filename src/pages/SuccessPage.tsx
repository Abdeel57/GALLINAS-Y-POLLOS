import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Copy, Check, Ticket, Home, MapPin } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import logo from '../assets/logo.png';

const SuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, rancheria, tickets } = location.state || { name: 'Participante', rancheria: '', phone: '', tickets: [] };

    const [copied, setCopied] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const copyToClipboard = () => {
        const text = `🎉 ¡Ya estoy participando! Mis boletos para la rifa Ríos de Agua Viva son: ${tickets.join(', ')}. Nombre: ${name}, Localidad: ${rancheria}`;
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
            <Confetti width={windowSize.width} height={windowSize.height} recycle={false} numberOfPieces={200} gravity={0.1} colors={['#ff7a00', '#0054a6', '#fcd600']} />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                style={{ width: '100%', maxWidth: '400px' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        background: 'var(--success)',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 20px',
                        boxShadow: '0 8px 16px rgba(29, 209, 161, 0.2)'
                    }}>
                        <Check size={40} strokeWidth={3} />
                    </div>
                    <h2 style={{ fontSize: '28px', fontWeight: 900, marginBottom: '8px', color: '#1a1a1a' }}>¡Ya estás participando!</h2>
                    <p style={{ color: '#666' }}>Mucha suerte, {name.split(' ')[0]}</p>
                </div>

                {/* Digital Ticket Card */}
                <div style={{
                    background: 'white',
                    borderRadius: '24px',
                    border: '1px solid #eee',
                    overflow: 'hidden',
                    position: 'relative',
                    marginBottom: '32px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.08)'
                }}>
                    {/* Ticket Top */}
                    <div style={{ padding: '32px', borderBottom: '2px dashed #eee', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase', letterSpacing: '2px' }}>GRAN RIFA DE</p>
                                <img src={logo} alt="Logo" style={{ height: '50px', width: 'auto', marginTop: '8px' }} />
                                <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--primary)', marginTop: '4px' }}>RÍOS DE AGUA VIVA</h3>
                            </div>
                            <Ticket size={24} color="var(--primary)" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                            {tickets.map((t: string) => (
                                <div key={t} style={{ background: '#f8f9fa', padding: '12px', borderRadius: '12px', textAlign: 'center', border: '1px solid #eee' }}>
                                    <p style={{ fontSize: '10px', color: '#999', marginBottom: '4px' }}>NÚMERO</p>
                                    <p style={{ fontSize: '24px', fontWeight: 900, color: '#1a1a1a' }}>{t}</p>
                                </div>
                            ))}
                        </div>

                        {/* Decorative Notch circles */}
                        <div style={{ position: 'absolute', bottom: '-10px', left: '-10px', width: '20px', height: '20px', background: '#ffffff', border: '1px solid #eee', borderRadius: '50%' }} />
                        <div style={{ position: 'absolute', bottom: '-10px', right: '-10px', width: '20px', height: '20px', background: '#ffffff', border: '1px solid #eee', borderRadius: '50%' }} />
                    </div>

                    {/* Ticket Bottom */}
                    <div style={{ padding: '24px', background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                            <div>
                                <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>PARTICIPANTE</p>
                                <p style={{ fontWeight: 700, color: '#1a1a1a' }}>{name}</p>
                                {rancheria && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px', color: '#666' }}>
                                        <MapPin size={10} />
                                        <span style={{ fontSize: '11px' }}>{rancheria}</span>
                                    </div>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '10px', color: '#999', textTransform: 'uppercase' }}>FECHA</p>
                                <p style={{ fontWeight: 700, color: '#1a1a1a' }}>{new Date().toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div style={{
                            marginTop: '20px',
                            padding: '12px',
                            background: 'white',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'center',
                            border: '1px solid #eee'
                        }}>
                            {/* Fake QR for aesthetic */}
                            <div style={{ width: '80px', height: '80px', background: 'url(https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=RIFA-POLLERIA) center/cover' }} />
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                    <button className="btn-secondary" style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', background: 'white' }}>
                        <Download size={18} />
                        DESCARGAR
                    </button>
                    <button
                        className="btn-secondary"
                        onClick={copyToClipboard}
                        style={{ width: '100%', display: 'flex', gap: '8px', justifyContent: 'center', background: 'white', borderColor: copied ? 'var(--success)' : '' }}
                    >
                        {copied ? <Check size={18} color="var(--success)" /> : <Copy size={18} />}
                        COPIAR
                    </button>
                </div>

                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '24px',
                        background: 'none',
                        border: 'none',
                        color: '#999',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100%',
                        gap: '8px',
                        fontSize: '14px',
                        textDecoration: 'underline'
                    }}
                >
                    <Home size={14} />
                    Volver al Inicio
                </button>
            </motion.div>
        </div>
    );
};

export default SuccessPage;
