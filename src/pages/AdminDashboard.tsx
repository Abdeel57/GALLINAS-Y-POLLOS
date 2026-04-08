import React, { useState } from 'react';
import { LayoutDashboard, Ticket, Users, Link2, Plus, Copy, Check, LogOut, ShoppingBag, Edit2, X, Save, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminDashboard: React.FC = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [copiedLink, setCopiedLink] = useState<string | null>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // State for managing orders (Mock Data)
    const [orders, setOrders] = useState([
        { id: '1', name: 'Juan Pérez', phone: '987654321', rancheria: 'El Triunfo', tickets: ['05', '10'], date: '2024-04-07' },
        { id: '2', name: 'María García', phone: '912345678', rancheria: 'La Isla', tickets: ['23', '45'], date: '2024-04-06' },
        { id: '3', name: 'Roberto Díaz', phone: '955887744', rancheria: 'Pueblo Nuevo', tickets: ['88'], date: '2024-04-05' },
    ]);

    const [editingOrder, setEditingOrder] = useState<any>(null);

    // Mock stats
    const stats = [
        { label: 'Boletos Totales', value: '1000', icon: <Ticket /> },
        { label: 'Participantes', value: orders.length.toString(), icon: <Users /> },
        { label: 'Canjes Activos', value: '45', icon: <Link2 /> }
    ];

    const [codes] = useState([
        { id: '1', code: 'PROMO-2024-X1', maxTickets: 2, uses: 1, active: true },
        { id: '2', code: 'GRATIS-POLLO', maxTickets: 1, uses: 0, active: true },
        { id: '3', code: 'RESERVA-VIP', maxTickets: 5, uses: 5, active: false },
    ]);

    const handleCopyLink = (code: string) => {
        const link = `${window.location.origin}/?code=${code}`;
        navigator.clipboard.writeText(link);
        setCopiedLink(code);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem('is_admin_logged');
        window.location.href = '/admin/login';
    };

    const handleSaveEdit = (e: React.FormEvent) => {
        e.preventDefault();
        setOrders(orders.map(o => o.id === editingOrder.id ? editingOrder : o));
        setEditingOrder(null);
    };

    const NavItems = () => (
        <>
            <button
                onClick={() => { setActiveTab('dashboard'); setIsMobileMenuOpen(false); }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: activeTab === 'dashboard' ? 'var(--primary-glow)' : 'none',
                    border: 'none', color: activeTab === 'dashboard' ? 'var(--primary)' : '#666',
                    borderRadius: '12px', cursor: 'pointer', transition: '0.2s', width: '100%',
                    fontWeight: activeTab === 'dashboard' ? 700 : 500
                }}
            >
                <LayoutDashboard size={20} /> Dashboard
            </button>
            <button
                onClick={() => { setActiveTab('orders'); setIsMobileMenuOpen(false); }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: activeTab === 'orders' ? 'var(--primary-glow)' : 'none',
                    border: 'none', color: activeTab === 'orders' ? 'var(--primary)' : '#666',
                    borderRadius: '12px', cursor: 'pointer', transition: '0.2s', width: '100%',
                    fontWeight: activeTab === 'orders' ? 700 : 500
                }}
            >
                <ShoppingBag size={20} /> Órdenes
            </button>
            <button
                onClick={() => { setActiveTab('codes'); setIsMobileMenuOpen(false); }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: activeTab === 'codes' ? 'var(--primary-glow)' : 'none',
                    border: 'none', color: activeTab === 'codes' ? 'var(--primary)' : '#666',
                    borderRadius: '12px', cursor: 'pointer', transition: '0.2s', width: '100%',
                    fontWeight: activeTab === 'codes' ? 700 : 500
                }}
            >
                <Link2 size={20} /> Links de Canje
            </button>
        </>
    );

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', flexDirection: 'column' }}>

            {/* Mobile Header */}
            <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 24px', background: 'white', borderBottom: '1px solid #eee',
                position: 'sticky', top: 0, zIndex: 100, width: '100%'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '24px', height: '24px', background: 'var(--primary)', borderRadius: '6px' }} />
                    <h1 style={{ fontSize: '14px', fontWeight: 900, color: '#1a1a1a' }}>ADMIN</h1>
                </div>
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    style={{ background: 'none', border: 'none', color: '#1a1a1a', cursor: 'pointer' }}
                >
                    {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Layout Wrapper */}
            <div style={{ display: 'flex', flex: 1 }}>

                {/* Desktop Sidebar (Hidden on mobile via CSS) */}
                <style>{`
                    @media (max-width: 768px) {
                        .desktop-sidebar { display: none !important; }
                        .main-content { margin-left: 0 !important; padding: 20px !important; }
                        .stats-grid { grid-template-columns: 1fr !important; }
                        .table-container { overflow-x: auto !important; }
                        table { min-width: 600px; }
                        .modal-content { padding: 24px !important; }
                    }
                `}</style>

                <div className="desktop-sidebar" style={{
                    width: '280px', background: 'white', borderRight: '1px solid #eee',
                    padding: '32px 16px', display: 'flex', flexDirection: 'column', gap: '32px',
                    position: 'fixed', height: '100vh', zIndex: 50
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
                        <div style={{ width: '32px', height: '32px', background: 'var(--primary)', borderRadius: '8px' }} />
                        <h1 style={{ fontSize: '16px', fontWeight: 900 }}>ADMIN PANEL</h1>
                    </div>
                    <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                        <NavItems />
                    </nav>
                    <div style={{ padding: '16px', borderTop: '1px solid #eee' }}>
                        <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '14px', fontWeight: 600, width: '100%' }}>
                            <LogOut size={18} /> Cerrar Sesión
                        </button>
                    </div>
                </div>

                {/* Mobile Menu Overlay */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -100 }}
                            style={{
                                position: 'fixed', top: '57px', left: 0, right: 0, bottom: 0,
                                background: 'white', zIndex: 90, padding: '24px',
                                display: 'flex', flexDirection: 'column', gap: '8px'
                            }}
                        >
                            <NavItems />
                            <div style={{ marginTop: 'auto', borderTop: '1px solid #eee', paddingTop: '24px' }}>
                                <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: 'none', border: 'none', color: '#ff4d4d', cursor: 'pointer', fontSize: '14px', fontWeight: 600, width: '100%' }}>
                                    <LogOut size={18} /> Cerrar Sesión
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <div className="main-content" style={{ flex: 1, padding: '40px', marginLeft: '280px', width: '100%' }}>
                    {activeTab === 'dashboard' && (
                        <div>
                            <header style={{ marginBottom: '40px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#1a1a1a' }}>Panel de Control</h2>
                                <p style={{ color: '#666', marginTop: '4px' }}>Resumen de actividad</p>
                            </header>

                            <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
                                {stats.map(s => (
                                    <div key={s.label} className="premium-card" style={{ background: 'white', border: 'none' }}>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                            <div style={{ width: '32px', height: '32px', color: 'var(--primary)' }}>{s.icon}</div>
                                            <span style={{ color: '#999', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase' }}>{s.label}</span>
                                            <div style={{ fontSize: '28px', fontWeight: 900 }}>{s.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'orders' && (
                        <div>
                            <header style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 900 }}>Órdenes</h2>
                                <p style={{ color: '#666' }}>Gestionar participantes</p>
                            </header>

                            <div className="table-container premium-card" style={{ padding: 0, overflow: 'hidden', background: 'white', border: 'none' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                                            <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>CLIENTE</th>
                                            <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>UBICACIÓN</th>
                                            <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>BOLETOS</th>
                                            <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', textAlign: 'right' }}>EDITAR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map(o => (
                                            <tr key={o.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ fontWeight: 700, fontSize: '14px' }}>{o.name}</div>
                                                    <div style={{ fontSize: '12px', color: '#999' }}>{o.phone}</div>
                                                </td>
                                                <td style={{ padding: '16px 20px', fontSize: '13px', color: '#666' }}>{o.rancheria}</td>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ display: 'flex', gap: '4px' }}>
                                                        {o.tickets.map(t => (
                                                            <span key={t} style={{ padding: '2px 6px', background: 'var(--primary-glow)', color: 'var(--primary)', borderRadius: '4px', fontSize: '11px', fontWeight: 800 }}>#{t}</span>
                                                        ))}
                                                    </div>
                                                </td>
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <button onClick={() => setEditingOrder(o)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><Edit2 size={16} /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'codes' && (
                        <div>
                            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 900 }}>Links</h2>
                                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '12px' }}><Plus size={16} /> NUEVO</button>
                            </header>

                            <div className="table-container premium-card" style={{ padding: 0, overflow: 'hidden', background: 'white', border: 'none' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                    <thead>
                                        <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                                            <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>CÓDIGO</th>
                                            <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>USOS</th>
                                            <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', textAlign: 'right' }}>COPIAR</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {codes.map(c => (
                                            <tr key={c.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                                                <td style={{ padding: '16px 20px' }}>
                                                    <div style={{ fontWeight: 700 }}>{c.code}</div>
                                                </td>
                                                <td style={{ padding: '16px 20px' }}>{c.uses}/{c.maxTickets}</td>
                                                <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                    <button onClick={() => handleCopyLink(c.code)} style={{ background: 'none', border: 'none', color: copiedLink === c.code ? 'var(--success)' : '#666', cursor: 'pointer' }}>
                                                        {copiedLink === c.code ? <Check size={18} /> : <Copy size={18} />}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingOrder && (
                    <div style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center',
                        justifyContent: 'center', zIndex: 1000, padding: '20px'
                    }}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="modal-content"
                            style={{ background: 'white', borderRadius: '24px', width: '100%', maxWidth: '450px', padding: '32px', position: 'relative' }}
                        >
                            <button onClick={() => setEditingOrder(null)} style={{ position: 'absolute', top: '24px', right: '24px', background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}><X size={24} /></button>
                            <h3 style={{ fontSize: '20px', fontWeight: 900, marginBottom: '24px' }}>Editar Datos</h3>
                            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Nombre</label>
                                    <input type="text" className="glass-input" style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a' }} value={editingOrder.name} onChange={e => setEditingOrder({ ...editingOrder, name: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Teléfono</label>
                                    <input type="text" className="glass-input" style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a' }} value={editingOrder.phone} onChange={e => setEditingOrder({ ...editingOrder, phone: e.target.value })} />
                                </div>
                                <div>
                                    <label style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '4px', display: 'block' }}>Ranchería</label>
                                    <input type="text" className="glass-input" style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a' }} value={editingOrder.rancheria} onChange={e => setEditingOrder({ ...editingOrder, rancheria: e.target.value })} />
                                </div>
                                <button type="submit" className="btn-primary" style={{ width: '100%', height: '50px', marginTop: '8px' }}><Save size={18} /> GUARDAR</button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminDashboard;
