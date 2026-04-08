import React from 'react';
import { motion } from 'framer-motion';
import { Ticket, MapPin, CheckCircle } from 'lucide-react';
import { useSearchParams, useLocation } from 'react-router-dom';
import logo from '../assets/logo.png';

const RAFFLE_NAME = 'RÍOS DE AGUA VIVA';

const TicketView: React.FC = () => {
    const [searchParams] = useSearchParams();
    const raw = searchParams.get('data');

    const location = useLocation();
    const stateData = location.state as any;

    let name = '';
    let rancheria = '';
    let tickets: string[] = [];
    let date = '';

    if (stateData) {
        name = stateData.name || '';
        rancheria = stateData.rancheria || '';
        tickets = stateData.tickets || [];
        date = stateData.date || new Date().toLocaleDateString();
    } else if (raw) {
        try {
            const decoded = JSON.parse(atob(raw));
            name = decoded.name || '';
            rancheria = decoded.rancheria || '';
            tickets = decoded.tickets || [];
            date = decoded.date || '';
        } catch {
            // bad data
        }
    }

    const isValid = name && tickets.length > 0;

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #fff7f0 0%, #ffffff 50%, #f0f5ff 100%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>
            {isValid ? (
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    style={{ width: '100%', maxWidth: '420px' }}
                >
                    {/* Header badge */}
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: 'rgba(29, 209, 161, 0.1)',
                            color: '#1dd1a1',
                            padding: '8px 16px',
                            borderRadius: '100px',
                            fontSize: '13px',
                            fontWeight: 700,
                            marginBottom: '12px'
                        }}>
                            <CheckCircle size={16} />
                            Comprobante Verificado
                        </div>
                        <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
                            Este es el comprobante de participación en el sorteo
                        </p>
                    </div>

                    {/* Ticket Card */}
                    <div id="ticket-card" style={{
                        background: 'white',
                        borderRadius: '28px',
                        overflow: 'hidden',
                        boxShadow: '0 24px 60px rgba(0,0,0,0.12)',
                        border: '1px solid rgba(0,0,0,0.06)'
                    }}>
                        {/* Ticket Top stripe */}
                        <div style={{
                            background: 'linear-gradient(135deg, var(--primary, #ff7a00) 0%, #ff9f43 100%)',
                            padding: '6px',
                        }} />

                        {/* Ticket Top */}
                        <div style={{ padding: '32px 32px 28px', position: 'relative' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
                                <div>
                                    <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                        COMPROBANTE DE PARTICIPACIÓN
                                    </p>
                                    <img src={logo} alt="Logo" style={{ height: '44px', width: 'auto' }} />
                                    <h3 style={{ fontSize: '13px', fontWeight: 900, color: 'var(--primary, #ff7a00)', marginTop: '6px', letterSpacing: '0.5px' }}>
                                        {RAFFLE_NAME}
                                    </h3>
                                </div>
                                <div style={{
                                    background: 'var(--primary-glow, rgba(255,122,0,0.1))',
                                    padding: '12px',
                                    borderRadius: '14px'
                                }}>
                                    <Ticket size={22} color="var(--primary, #ff7a00)" />
                                </div>
                            </div>

                            {/* Ticket Numbers */}
                            <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '12px' }}>
                                Boleto(s) asignado(s)
                            </p>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {tickets.map((t: string) => (
                                    <div key={t} style={{
                                        background: '#f8f9fa',
                                        padding: '12px 16px',
                                        borderRadius: '14px',
                                        textAlign: 'center',
                                        border: '2px solid #eee',
                                        minWidth: '64px'
                                    }}>
                                        <p style={{ fontSize: '10px', color: '#bbb', marginBottom: '4px' }}>Nº</p>
                                        <p style={{ fontSize: '26px', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>{t}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Dashed separator */}
                            <div style={{ position: 'relative', margin: '28px -32px 0' }}>
                                <div style={{ borderTop: '2px dashed #eee' }} />
                                <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px', background: '#f5f7fa', borderRadius: '50%', border: '1px solid #eee' }} />
                                <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '20px', height: '20px', background: '#f5f7fa', borderRadius: '50%', border: '1px solid #eee' }} />
                            </div>
                        </div>

                        {/* Ticket Bottom */}
                        <div style={{ padding: '24px 32px 32px', background: '#fafafa' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '20px' }}>
                                <div>
                                    <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Participante</p>
                                    <p style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '16px', margin: 0 }}>{name}</p>
                                    {rancheria && (
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '6px', color: '#888' }}>
                                            <MapPin size={11} />
                                            <span style={{ fontSize: '12px' }}>{rancheria}</span>
                                        </div>
                                    )}
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '10px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Fecha</p>
                                    <p style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '14px', margin: 0 }}>{date}</p>
                                </div>
                            </div>

                            {/* QR */}
                            <div style={{
                                padding: '16px',
                                background: 'white',
                                borderRadius: '16px',
                                border: '1px solid #eee',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                gap: '8px'
                            }}>
                                <img
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(window.location.href)}`}
                                    alt="QR"
                                    style={{ width: '90px', height: '90px', borderRadius: '8px' }}
                                />
                                <span style={{ fontSize: '10px', color: '#bbb', letterSpacing: '1px' }}>ESCANEA PARA VERIFICAR</span>
                            </div>
                        </div>
                    </div>

                    <p style={{ textAlign: 'center', fontSize: '12px', color: '#bbb', marginTop: '20px', lineHeight: 1.6 }}>
                        Comprobante generado por Gallinas y Pollos Aliñados
                    </p>
                </motion.div>
            ) : (
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#999', fontSize: '16px' }}>Boleto no válido o enlace incorrecto.</p>
                </div>
            )}
        </div>
    );
};

export default TicketView;
