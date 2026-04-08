import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Info, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? '';

const ChickenLeg = () => (
    <span style={{ fontSize: '18px', lineHeight: 1 }}>🍗</span>
);

const TicketPicker: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'choose';
    const code = searchParams.get('code') || '';

    const [maxTickets, setMaxTickets] = useState(2);
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalTickets, setTotalTickets] = useState(100);
    const [takenNumbers, setTakenNumbers] = useState<Set<string>>(new Set());

    // Fetch config + taken tickets
    useEffect(() => {
        fetch(`${API}/api/polleria/config`)
            .then(r => r.json())
            .then(json => { if (json.success) setTotalTickets(json.data.totalTickets); })
            .catch(() => { });

        fetch(`${API}/api/polleria/tickets`)
            .then(r => r.json())
            .then(json => {
                if (json.success) setTakenNumbers(new Set(json.data.map((t: any) => t.number)));
            })
            .catch(() => { });

        if (code) {
            fetch(`${API}/api/promo-codes/validate/${encodeURIComponent(code)}`)
                .then(r => r.json())
                .then(json => {
                    if (json.valid) setMaxTickets(json.ticketsCount || 2);
                })
                .catch(() => { });
        }
    }, [code]);

    const allTickets = Array.from({ length: totalTickets }, (_, i) => i.toString().padStart(2, '0'));

    // Random: excluir tomados, asignar disponibles al azar
    useEffect(() => {
        if (type !== 'random' || totalTickets === 100) return; // espera a que cargue config
        const available = allTickets.filter(n => !takenNumbers.has(n));
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, maxTickets);
        setSelectedTickets(selected);
        const timer = setTimeout(() => {
            navigate('/registration', { state: { tickets: selected, code } });
        }, 1500);
        return () => clearTimeout(timer);
    }, [type, totalTickets, takenNumbers]);

    // Random con datos ya cargados desde el inicio
    useEffect(() => {
        if (type !== 'random') return;
        const available = allTickets.filter(n => !takenNumbers.has(n));
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, maxTickets);
        setSelectedTickets(selected);
        const timer = setTimeout(() => {
            navigate('/registration', { state: { tickets: selected, code } });
        }, 1500);
        return () => clearTimeout(timer);
        // Solo cuando type es random y la primera vez
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [type]);

    const toggleTicket = (number: string) => {
        if (takenNumbers.has(number)) return;
        if (selectedTickets.includes(number)) {
            setSelectedTickets(selectedTickets.filter(t => t !== number));
        } else if (selectedTickets.length < maxTickets) {
            setSelectedTickets([...selectedTickets, number]);
        }
    };

    const filteredTickets = allTickets.filter(t => t.includes(searchTerm));

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', background: '#ffffff', position: 'relative', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '16px', background: 'white', borderBottom: '1px solid #f0f0f0', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                        <ChevronLeft size={24} color="#1a1a1a" />
                    </button>
                    <h2 style={{ fontSize: '20px', fontWeight: 900, margin: 0, color: '#1a1a1a' }}>Elegir Boletos</h2>
                </div>

                <div style={{ background: 'var(--primary-glow)', padding: '12px 16px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', border: '1px solid rgba(255, 122, 0, 0.1)' }}>
                    <Info size={18} color="var(--primary)" />
                    <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--primary)', margin: 0 }}>
                        Puedes seleccionar {maxTickets} boletos gratis · 🍗 = ocupado
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

            {/* Grid de boletos */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(65px, 1fr))', gap: '10px', paddingBottom: '120px' }}>
                {filteredTickets.map(number => {
                    const isSelected = selectedTickets.includes(number);
                    const isTaken = takenNumbers.has(number);
                    const isFull = selectedTickets.length >= maxTickets && !isSelected;
                    const isDisabled = isTaken || (isFull && !isSelected);

                    return (
                        <motion.button
                            key={number}
                            whileTap={!isDisabled ? { scale: 0.9 } : {}}
                            onClick={() => toggleTicket(number)}
                            disabled={isDisabled}
                            style={{
                                aspectRatio: '1/1',
                                border: isTaken ? '2px solid #ffe0b2' : 'none',
                                borderRadius: '16px',
                                background: isTaken
                                    ? '#fff8f0'
                                    : isSelected ? 'var(--primary)' : '#f1f3f5',
                                color: isTaken ? '#e67e22' : isSelected ? 'white' : isFull ? '#ced4da' : '#1a1a1a',
                                fontSize: isTaken ? '14px' : '22px',
                                fontWeight: 900,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s ease',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '2px',
                                boxShadow: isSelected ? '0 8px 16px var(--primary-glow)' : 'none',
                                opacity: isFull && !isTaken ? 0.6 : 1,
                            }}
                        >
                            {isTaken ? (
                                <>
                                    <ChickenLeg />
                                    <span style={{ fontSize: '10px', fontWeight: 700 }}>{number}</span>
                                </>
                            ) : (
                                <>
                                    {number}
                                    {isSelected && (
                                        <div style={{ position: 'absolute', top: '-4px', right: '-4px', background: 'white', borderRadius: '50%', color: 'var(--primary)', display: 'flex' }}>
                                            <CheckCircle2 size={18} fill="white" />
                                        </div>
                                    )}
                                </>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            {/* Barra inferior */}
            <AnimatePresence>
                {selectedTickets.length > 0 && (
                    <motion.div
                        initial={{ y: 150 }} animate={{ y: 0 }} exit={{ y: 150 }}
                        style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '24px', background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #f0f0f0', display: 'flex', flexDirection: 'column', gap: '16px', zIndex: 100, boxShadow: '0 -10px 40px rgba(0,0,0,0.08)' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '14px', fontWeight: 600, color: '#666' }}>
                                {selectedTickets.length} de {maxTickets} seleccionados
                            </span>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                {selectedTickets.map(t => (
                                    <span key={t} style={{ fontWeight: 900, color: 'var(--primary)', fontSize: '18px', background: 'var(--primary-glow)', padding: '4px 8px', borderRadius: '8px' }}>#{t}</span>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={() => navigate('/registration', { state: { tickets: selectedTickets, code } })}
                            disabled={selectedTickets.length < maxTickets}
                            className="btn-primary"
                            style={{ width: '100%', height: '56px', fontSize: '16px', opacity: selectedTickets.length === maxTickets ? 1 : 0.5 }}
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
