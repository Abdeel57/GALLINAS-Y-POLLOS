import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Download, Check, Ticket, Home, MapPin, Share2, Loader } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Confetti from 'react-confetti';
import logo from '../assets/logo.png';

const RAFFLE_NAME = 'RÍOS DE AGUA VIVA';

const SuccessPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { name, rancheria, tickets } = location.state || { name: 'Participante', rancheria: '', tickets: [] };
    const ticketRef = useRef<HTMLDivElement>(null);

    const [copied, setCopied] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

    useEffect(() => {
        const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Generar link único del boleto con los datos codificados en base64
    const ticketData = btoa(JSON.stringify({
        name,
        rancheria,
        tickets,
        date: new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' })
    }));
    const ticketUrl = `${window.location.origin}/ticket?data=${ticketData}`;

    // Copiar link con mensaje de comprobante
    const copyTicketLink = () => {
        const message = `🎟️ Este es mi comprobante de participación en el sorteo por (${RAFFLE_NAME}):\n${ticketUrl}`;
        navigator.clipboard.writeText(message);
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
    };

    // Descargar PDF del boleto
    const downloadPDF = async () => {
        if (!ticketRef.current) return;
        setIsDownloading(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const { jsPDF } = await import('jspdf');

            const canvas = await html2canvas(ticketRef.current, {
                scale: 3,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'px',
                format: [canvas.width / 3, canvas.height / 3],
            });

            pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3);
            pdf.save(`boleto-${name.replace(/\s+/g, '-').toLowerCase()}-${tickets.join('-')}.pdf`);
        } catch (err) {
            console.error('Error generando PDF:', err);
        } finally {
            setIsDownloading(false);
        }
    };

    const today = new Date().toLocaleDateString('es-PE', { year: 'numeric', month: 'long', day: 'numeric' });

    return (
        <div style={{ padding: '24px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff' }}>
            <Confetti
                width={windowSize.width}
                height={windowSize.height}
                recycle={false}
                numberOfPieces={220}
                gravity={0.1}
                colors={['#ff7a00', '#0054a6', '#fcd600', '#1dd1a1']}
            />

            <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', maxWidth: '400px' }}
            >
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <div style={{
                        width: '72px', height: '72px', borderRadius: '50%',
                        background: '#1dd1a1', color: 'white',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        margin: '0 auto 16px',
                        boxShadow: '0 8px 24px rgba(29,209,161,0.25)'
                    }}>
                        <Check size={36} strokeWidth={3} />
                    </div>
                    <h2 style={{ fontSize: '26px', fontWeight: 900, marginBottom: '6px', color: '#1a1a1a' }}>
                        ¡Ya estás participando!
                    </h2>
                    <p style={{ color: '#888', fontSize: '15px' }}>
                        Mucha suerte, <strong style={{ color: '#1a1a1a' }}>{name.split(' ')[0]}</strong> 🎉
                    </p>
                </div>

                {/* ─── TICKET CARD (capturado para el PDF) ─── */}
                <div ref={ticketRef} style={{
                    background: 'white',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    border: '1px solid #eee',
                    marginBottom: '20px',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.08)'
                }}>
                    {/* Color stripe */}
                    <div style={{ background: 'linear-gradient(90deg, #ff7a00, #ff9f43)', padding: '5px' }} />

                    {/* Top section */}
                    <div style={{ padding: '28px 28px 24px', position: 'relative' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                            <div>
                                <p style={{ fontSize: '9px', color: '#aaa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                                    COMPROBANTE · GRAN SORTEO
                                </p>
                                <img src={logo} alt="Logo" style={{ height: '44px', width: 'auto' }} />
                                <h3 style={{ fontSize: '12px', fontWeight: 900, color: '#ff7a00', marginTop: '6px' }}>
                                    {RAFFLE_NAME}
                                </h3>
                            </div>
                            <div style={{ background: 'rgba(255,122,0,0.08)', padding: '10px', borderRadius: '12px' }}>
                                <Ticket size={20} color="#ff7a00" />
                            </div>
                        </div>

                        {/* Ticket numbers */}
                        <p style={{ fontSize: '9px', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1.5px', marginBottom: '10px' }}>
                            Nº de Boleto(s)
                        </p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {tickets.map((t: string) => (
                                <div key={t} style={{
                                    background: '#f8f9fa',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    border: '2px solid #eee',
                                    minWidth: '56px',
                                    textAlign: 'center'
                                }}>
                                    <p style={{ fontSize: '9px', color: '#bbb', marginBottom: '2px' }}>N°</p>
                                    <p style={{ fontSize: '22px', fontWeight: 900, color: '#1a1a1a', margin: 0 }}>{t}</p>
                                </div>
                            ))}
                        </div>

                        {/* Notch divider */}
                        <div style={{ position: 'relative', margin: '24px -28px 0' }}>
                            <div style={{ borderTop: '2px dashed #eee' }} />
                            <div style={{ position: 'absolute', top: '-10px', left: '-10px', width: '20px', height: '20px', background: 'white', border: '1px solid #eee', borderRadius: '50%' }} />
                            <div style={{ position: 'absolute', top: '-10px', right: '-10px', width: '20px', height: '20px', background: 'white', border: '1px solid #eee', borderRadius: '50%' }} />
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div style={{ padding: '20px 28px 28px', background: '#fafafa' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '18px' }}>
                            <div>
                                <p style={{ fontSize: '9px', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Participante</p>
                                <p style={{ fontWeight: 800, color: '#1a1a1a', fontSize: '15px', margin: 0 }}>{name}</p>
                                {rancheria && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '5px', color: '#999' }}>
                                        <MapPin size={10} />
                                        <span style={{ fontSize: '11px' }}>{rancheria}</span>
                                    </div>
                                )}
                            </div>
                            <div style={{ textAlign: 'right' }}>
                                <p style={{ fontSize: '9px', color: '#bbb', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>Fecha</p>
                                <p style={{ fontWeight: 700, color: '#1a1a1a', fontSize: '13px', margin: 0 }}>{today}</p>
                            </div>
                        </div>

                        {/* QR apunta al link del boleto */}
                        <div style={{
                            padding: '14px',
                            background: 'white',
                            borderRadius: '14px',
                            border: '1px solid #eee',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '8px'
                        }}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=90x90&data=${encodeURIComponent(ticketUrl)}`}
                                alt="QR del boleto"
                                style={{ width: '80px', height: '80px', borderRadius: '6px' }}
                                crossOrigin="anonymous"
                            />
                            <span style={{ fontSize: '9px', color: '#ccc', letterSpacing: '1px' }}>ESCANEA PARA VERIFICAR</span>
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', width: '100%' }}>
                    {/* DESCARGAR PDF */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="btn-secondary"
                        onClick={downloadPDF}
                        disabled={isDownloading}
                        style={{
                            width: '100%',
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: 'white',
                            height: '52px',
                            opacity: isDownloading ? 0.7 : 1
                        }}
                    >
                        {isDownloading
                            ? <><Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> Generando...</>
                            : <><Download size={16} /> DESCARGAR</>
                        }
                    </motion.button>

                    {/* COPIAR LINK */}
                    <motion.button
                        whileTap={{ scale: 0.97 }}
                        className="btn-secondary"
                        onClick={copyTicketLink}
                        style={{
                            width: '100%',
                            display: 'flex',
                            gap: '8px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            background: copied ? 'rgba(29,209,161,0.08)' : 'white',
                            borderColor: copied ? '#1dd1a1' : '',
                            color: copied ? '#1dd1a1' : '',
                            height: '52px',
                            transition: 'all 0.3s ease'
                        }}
                    >
                        {copied
                            ? <><Check size={16} /> ¡COPIADO!</>
                            : <><Share2 size={16} /> COMPARTIR</>
                        }
                    </motion.button>
                </div>

                {/* Mensaje informativo del copy */}
                {copied && (
                    <motion.div
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{
                            marginTop: '12px',
                            padding: '12px 16px',
                            background: 'rgba(29,209,161,0.08)',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: '#1dd1a1',
                            fontWeight: 600,
                            textAlign: 'center',
                            border: '1px solid rgba(29,209,161,0.2)'
                        }}
                    >
                        📋 Mensaje copiado: "Este es mi comprobante de participación en el sorteo por ({RAFFLE_NAME}): [link]"
                    </motion.div>
                )}

                <button
                    onClick={() => navigate('/')}
                    style={{
                        marginTop: '20px',
                        background: 'none', border: 'none', color: '#bbb',
                        cursor: 'pointer', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', width: '100%', gap: '8px',
                        fontSize: '13px', textDecoration: 'underline'
                    }}
                >
                    <Home size={13} /> Volver al Inicio
                </button>
            </motion.div>

            <style>{`
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default SuccessPage;
