import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, LogIn, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        // Credenciales estáticas para el demo
        if (user === 'admin' && password === 'admin123') {
            localStorage.setItem('is_admin_logged', 'true');
            navigate('/admin');
        } else {
            setError('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            background: '#ffffff'
        }}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card"
                style={{ width: '100%', maxWidth: '400px', padding: '32px' }}
            >
                <button
                    onClick={() => navigate('/')}
                    style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', color: '#999', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                    <ChevronLeft size={16} /> Volver
                </button>

                <div style={{ textAlign: 'center', marginBottom: '32px', marginTop: '16px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '12px',
                        background: 'var(--primary-glow)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px'
                    }}>
                        <Lock size={32} />
                    </div>
                    <h2 style={{ fontSize: '24px', fontWeight: 900, marginBottom: '8px' }}>Panel de Control</h2>
                    <p style={{ color: '#666', fontSize: '14px' }}>Acceso exclusivo para administradores</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Usuario</label>
                        <div style={{ position: 'relative' }}>
                            <User style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
                            <input
                                required
                                type="text"
                                className="glass-input"
                                style={{ paddingLeft: '48px', height: '54px', background: '#f8f9fa', border: '1px solid #eee' }}
                                value={user}
                                onChange={(e) => setUser(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '12px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>Contraseña</label>
                        <div style={{ position: 'relative' }}>
                            <Lock style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} size={18} />
                            <input
                                required
                                type="password"
                                className="glass-input"
                                style={{ paddingLeft: '48px', height: '54px', background: '#f8f9fa', border: '1px solid #eee' }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--primary)', fontSize: '12px', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-primary" style={{ width: '100%', height: '56px', marginTop: '12px' }}>
                        <LogIn size={18} />
                        INGRESAR
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default AdminLogin;
