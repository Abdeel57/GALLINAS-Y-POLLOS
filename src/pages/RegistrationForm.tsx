import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Phone, MapPin, Send, ChevronLeft, UserPlus, RefreshCcw } from 'lucide-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

const API = import.meta.env.VITE_API_URL ?? '';

const RegistrationForm: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const tickets = location.state?.tickets || [];
    const code: string = searchParams.get('code') || location.state?.code || '';

    const [form, setForm] = useState({ name: '', phone: '', rancheria: '' });
    const [isSavedUser, setIsSavedUser] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('pollos_aliñados_user');
        if (savedData) {
            setForm(JSON.parse(savedData));
            setIsSavedUser(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        localStorage.setItem('pollos_aliñados_user', JSON.stringify(form));

        // Guardar boletos tomados en el backend
        try {
            await fetch(`${API}/api/polleria/tickets`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tickets,
                    ownerName: form.name,
                    ownerPhone: form.phone,
                    ownerRancheria: form.rancheria,
                    promoCode: code
                }),
            });
        } catch { /* noop */ }

        navigate('/success', { state: { ...form, tickets } });
        setSubmitting(false);
    };

    const clearForm = () => {
        setForm({ name: '', phone: '', rancheria: '' });
        setIsSavedUser(false);
    };

    return (
        <div style={{
            minHeight: '100vh',
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            background: '#ffffff',
            alignItems: 'center'
        }}>
            <header style={{ width: '100%', maxWidth: '450px', display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '40px' }}>
                <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                    <ChevronLeft size={24} color="#1a1a1a" />
                </button>
                <h2 style={{ fontSize: '24px', fontWeight: 900, margin: 0 }}>Tus Datos</h2>
            </header>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card"
                style={{ width: '100%', maxWidth: '450px', padding: '32px', background: 'white' }}
            >
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '16px',
                        background: 'var(--primary-glow)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        {isSavedUser ? <User size={32} /> : <UserPlus size={32} />}
                    </div>
                    <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', color: '#1a1a1a' }}>
                        {isSavedUser ? '¡Hola de nuevo!' : 'Completa tu registro'}
                    </h3>
                    <p style={{ color: '#666', fontSize: '14px' }}>
                        Boletos: <strong style={{ color: 'var(--primary)' }}>{tickets.join(', ')}</strong>
                    </p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Nombre Completo</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
                            <input
                                required
                                type="text"
                                placeholder="Ej. Juan Pérez"
                                className="glass-input"
                                style={{ paddingLeft: '48px', height: '54px', background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a' }}
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Teléfono / WhatsApp</label>
                        <div style={{ position: 'relative' }}>
                            <Phone style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
                            <input
                                required
                                type="tel"
                                placeholder="Ej. 987654321"
                                className="glass-input"
                                style={{ paddingLeft: '48px', height: '54px', background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a' }}
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Ranchería / Localidad</label>
                        <div style={{ position: 'relative' }}>
                            <MapPin style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
                            <input
                                required
                                type="text"
                                placeholder="Ej. Ranchería El Triunfo"
                                className="glass-input"
                                style={{ paddingLeft: '48px', height: '54px', background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a' }}
                                value={form.rancheria}
                                onChange={(e) => setForm({ ...form, rancheria: e.target.value })}
                            />
                        </div>
                    </div>

                    <div style={{ marginTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <button type="submit" className="btn-primary" style={{ width: '100%', height: '56px' }} disabled={submitting}>
                            <Send size={18} />
                            {submitting ? 'REGISTRANDO...' : '¡PARTICIPAR AHORA!'}
                        </button>

                        {isSavedUser && (
                            <button
                                type="button"
                                onClick={clearForm}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#999',
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px',
                                    marginTop: '8px'
                                }}
                            >
                                <RefreshCcw size={14} />
                                Usar otros datos
                            </button>
                        )}
                    </div>
                </form>
            </motion.div>

            <p style={{ marginTop: '32px', fontSize: '12px', color: '#999', textAlign: 'center', maxWidth: '300px', lineHeight: 1.5 }}>
                Tus datos están seguros y se usarán únicamente para contactarte si resultas ganador.
            </p>
        </div>
    );
};

export default RegistrationForm;
