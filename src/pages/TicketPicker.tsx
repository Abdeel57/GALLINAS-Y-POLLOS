import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronLeft, Info, CheckCircle2 } from 'lucide-react';

const API = import.meta.env.VITE_API_URL ?? '';



const TicketPicker: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const type = searchParams.get('type') || 'choose';
    const code = searchParams.get('code') || '';

    const [maxTickets, setMaxTickets] = useState(2);
    const [selectedTickets, setSelectedTickets] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [totalTickets, setTotalTickets] = useState(100);
    // Cambiamos Set por Map para guardar { numero: nombre }
    const [takenData, setTakenData] = useState<Map<string, string>>(new Map());

    // Auxiliar para formatear nombre (1 Nombre + 1 Apellido)
    const formatName = (fullName: string) => {
        if (!fullName || fullName === 'Anónimo' || fullName === 'Cliente') return 'Ocupado';
        const parts = fullName.trim().split(/\s+/);
        if (parts.length === 1) return parts[0];
        return `${parts[0]} ${parts[1]}`;
    };

    // Fetch config + taken tickets
    useEffect(() => {
        fetch(`${API}/api/polleria/config`)
            .then(r => r.json())
            .then(json => { if (json.success) setTotalTickets(json.data.totalTickets); })
            .catch(() => { });

        fetch(`${API}/api/polleria/tickets`)
            .then(r => r.json())
            .then(json => {
                if (json.success) {
                    const map = new Map();
                    json.data.forEach((t: any) => map.set(t.number, t.ownerName));
                    setTakenData(map);
                }
            })
            .catch(() => { });

        if (code) {
            fetch(`${API}/api/promo-codes/validate/${encodeURIComponent(code)}`)
                .then(r => r.json())
                .then(json => {
                    if (json.valid) {
                        setMaxTickets(json.ticketsCount || 2);
                    } else if (json.reason === 'exhausted' && json.canjeado && json.tickets?.length > 0) {
                        // El código ya se usó, mandar directo al boleto digital
                        const firstTicket = json.tickets[0];
                        navigate('/success', {
                            state: {
                                name: firstTicket.ownerName,
                                phone: firstTicket.ownerPhone,
                                rancheria: firstTicket.ownerRancheria || '',
                                tickets: json.tickets.map((t: any) => t.number)
                            }
                        });
                    }
                })
                .catch(() => { });
        }
    }, [code, navigate]);

    const allTickets = React.useMemo(() => {
        const padSize = totalTickets > 0 ? (totalTickets - 1).toString().length : 2;
        // Aseguramos al menos 2 o 3 dígitos según el estándar de rifas
        const finalPad = Math.max(padSize, 3);
        return Array.from({ length: totalTickets }, (_, i) => i.toString().padStart(finalPad, '0'));
    }, [totalTickets]);

    // Random: excluir tomados, asignar disponibles al azar
    useEffect(() => {
        if (type !== 'random' || totalTickets === 100) return;
        const available = allTickets.filter(n => !takenData.has(n));
        const shuffled = [...available].sort(() => 0.5 - Math.random());
        const selected = shuffled.slice(0, maxTickets);
        setSelectedTickets(selected);
        const timer = setTimeout(() => {
            navigate('/registration', { state: { tickets: selected, code } });
        }, 1500);
        return () => clearTimeout(timer);
    }, [type, totalTickets, takenData, code, navigate, maxTickets, allTickets]);

    const toggleTicket = (number: string) => {
        if (takenData.has(number)) return;
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
                        Selecciona {maxTickets} boletos para tu registro.
                    </p>
                </div>

                <div style={{ position: 'relative' }}>
                    <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#666' }} size={18} />
                    <input
                        type="text"
                        placeholder="Buscar número (ej. 005)..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="glass-input"
                        style={{ paddingLeft: '48px', height: '50px', background: '#f8f9fa' }}
                    />
                </div>
            </div>

            {/* Grid de boletos */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(70px, 1fr))', gap: '8px', paddingBottom: '120px' }}>
                {filteredTickets.map(number => {
                    const isSelected = selectedTickets.includes(number);
                    const ownerName = takenData.get(number);
                    const isTaken = !!ownerName;
                    const isFull = selectedTickets.length >= maxTickets && !isSelected;
                    const isDisabled = isTaken || (isFull && !isSelected);

                    return (
                        <motion.button
                            key={number}
                            whileTap={!isDisabled ? { scale: 0.92 } : {}}
                            onClick={() => toggleTicket(number)}
                            disabled={isDisabled}
                            style={{
                                aspectRatio: '1.1/1',
                                border: isTaken ? '1.5px solid #ffccbc' : isSelected ? '2px solid var(--primary)' : '1px solid #edf2f7',
                                borderRadius: '14px',
                                background: isTaken
                                    ? '#fff5f2'
                                    : isSelected ? 'var(--primary)' : '#f8fafc',
                                color: isTaken ? '#d84315' : isSelected ? 'white' : isFull ? '#cbd5e0' : '#2d3748',
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                position: 'relative',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                padding: '6px 2px',
                                boxShadow: isSelected ? '0 8px 16px var(--primary-glow)' : 'none',
                                opacity: isFull && !isTaken ? 0.6 : 1,
                            }}
                        >
                            {isTaken ? (
                                <>
                                    <span style={{ fontSize: '14px', fontWeight: 900, marginBottom: '2px' }}>{number}</span>
                                    <span style={{
                                        fontSize: '7.5px',
                                        fontWeight: 700,
                                        lineHeight: 1,
                                        textAlign: 'center',
                                        maxWidth: '92%',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                        textTransform: 'uppercase',
                                        opacity: 0.9
                                    }}>
                                        {formatName(ownerName)}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <span style={{ fontSize: '20px', fontWeight: 900 }}>{number}</span>
                                    {isSelected && (
                                        <div style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'white', borderRadius: '50%', color: 'var(--primary)', display: 'flex', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
                                            <CheckCircle2 size={16} fill="white" />
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
                            onClick={() => navigate(`/registration?code=${code}`, { state: { tickets: selectedTickets, code } })}
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
