import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Info, CheckCircle2 } from 'lucide-react';

const TicketPicker: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'choose';

    const maxTickets = 2; // Default para demo
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    const allTickets = Array.from({ length: 100 }, (_, i) => i.toString().padStart(2, '0'));

    useEffect(() => {
        if (type === 'random') {
            const shuffled = [...allTickets].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, maxTickets);
            setSelectedTickets(selected);
            const timer = setTimeout(() => {
                navigate('/registration', { state: { tickets: selected } });
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [type, maxTickets]);

    const toggleTicket = (number: string) => {
        if (selectedTickets.includes(number)) {
            setSelectedTickets(selectedTickets.filter(t => t !== number));
        } else if (selectedTickets.length < maxTickets) {
            setSelectedTickets([...selectedTickets, number]);
        }
    };

    const filteredTickets = allTickets.filter(t => t.includes(searchTerm));

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Header Fijo / Sticky */}
            <div style={{
                padding: '16px',
                background: 'white',
                borderBottom: '1px solid #f0f0f0',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(0,0,0,0.03)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                        <ChevronLeft size={24} color="#1a1a1a" />
                    </button>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#1a1a1a' }}>Elegir Boletos</h2>
                </div>

                <div style={{
                    background: 'var(--primary-glow)',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    marginBottom: '16px',
                    border: '1px solid rgba(255, 122, 0, 0.1)'
                }}>
                    <Info size={18} color="var(--primary)" />
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                        Puedes seleccionar {maxTickets} boletos gratis
                    </p>
                </div>

                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
                    <input
                        type="text"
                        placeholder="Buscar número (ej. 05)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input"
                        style={{ paddingLeft: '48px', height: '50px', background: '#f8f9fa' }}
                    />
                </div>
            </div>

            {/* Cuadrícula de Boletos - Ocupa todo el espacio restante */}
            <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))',
                gap: '10px',
                paddingBottom: '120px'
            }}>
                {filteredTickets.map(number => {
                    const isSelected = selectedTickets.includes(number);
                    const isFull = selectedTickets.length >= maxTickets && !isSelected;

                    return (
                        <motion.button
                            key={number}
                            whileTap={!isFull ? { scale: 0.9 } : {}}
                            onClick={() => toggleTicket(number)}
                            disabled={isFull}
                            style={{
                                aspectRatio: '1/1',
                                border: 'none',
                                borderRadius: '16px',
                                background: isSelected ? 'var(--primary)' : '#f1f3f5',
                                color: isSelected ? 'white' : isFull ? '#ced4da' : '#1a1a1a',
                                fontSize: '22px',
                                fontWeight: 900,
                                cursor: isFull ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: isSelected ? '0 8px 16px var(--primary-glow)' : 'none',
                                opacity: isFull ? 0.6 : 1
                            }}
                        >
                            {number}
                            {isSelected && (
                                <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'white', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }}>
                                    <CheckCircle2 size={18} fill="white" />
                                </div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Barra Inferior Flotante */}
            <AnimatePresence>
                {selectedTickets.length > 0 && (
                    <motion.div
                        initial={{ y: 150 }}
                        animate={{ y: 0 }}
                        exit={{ y: 150 }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            padding: '24px',
                            background: 'rgba(255,255,255,0.95)',
                            backdropFilter: 'blur(20px)',
                            borderTop: '1px solid #f0f0f0',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '16px',
                            zIndex: 100,
                            boxShadow: '0 -10px 40px rgba(0,0,0,0.08)'
                        }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>
                                {selectedTickets.length} de {maxTickets} seleccionados
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {selectedTickets.map(t => (
                                    <span key={t} style={{
                                        fontWeight: 900,
                                        color: 'var(--primary)',
                                        fontSize: '18px',
                                        background: 'var(--primary-glow)',
                                        padding: '4px 8px',
                                        borderRadius: '8px'
                                    }}>#{t}</span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/registration', { state: { tickets: selectedTickets } })}
                            disabled={selectedTickets.length < maxTickets}
                            className="btn-primary"
                            style={{
                                width: '100%',
                                height: '56px',
                                fontSize: '16px',
                                opacity: selectedTickets.length === maxTickets ? 1 : 0.5
                            }}
                        >
                            CONTINUAR AL REGISTRO
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TicketPicker;
