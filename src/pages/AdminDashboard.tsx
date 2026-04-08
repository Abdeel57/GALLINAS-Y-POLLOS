import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Ticket, Users, Link2, Plus, Copy, Check, LogOut, ShoppingBag, Edit2, X, Save, Menu, Trash2, Loader, Settings, Trophy, CalendarDays, Hash } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import logo from '../assets/logo.png';

const API = import.meta.env.VITE_API_URL ?? '';
const PROMO_SECRET = import.meta.env.VITE_PROMO_SECRET || 'pollos-admin-2024';
const adminHeaders = { 'Content-Type': 'application/json', 'x-admin-key': PROMO_SECRET };
const promoHeaders = adminHeaders;

interface PromoCode { id: string; code: string; maxUses: number; uses: number; active: boolean; ticketsCount: number; }

interface AdminDashboardProps { onLogout?: () => void; }

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
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

    // Promo codes — API real
    const [codes, setCodes] = useState<PromoCode[]>([]);
    const [codesLoading, setCodesLoading] = useState(false);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [newCode, setNewCode] = useState('');
    const [newMaxUses, setNewMaxUses] = useState(1);
    const [newTicketsCount, setNewTicketsCount] = useState(2);
    const [createError, setCreateError] = useState('');
    const [createLoading, setCreateLoading] = useState(false);

    const loadCodes = async () => {
        setCodesLoading(true);
        try {
            const res = await fetch(`${API}/actions/list-v2`, { headers: promoHeaders });
            const json = await res.json();
            if (json.success) setCodes(json.data);
        } catch { /* noop */ } finally { setCodesLoading(false); }
    };

    useEffect(() => { if (activeTab === 'codes') loadCodes(); }, [activeTab]);

    const handleCreateCode = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');
        setCreateLoading(true);
        try {
            const res = await fetch(`${API}/actions/create-v2`, {
                method: 'POST',
                headers: promoHeaders,
                body: JSON.stringify({ maxUses: newMaxUses, ticketsCount: newTicketsCount }),
            });
            const json = await res.json();
            if (!json.success) { setCreateError(json.error || 'Error al crear'); return; }
            setCodes(prev => [json.data, ...prev]);
            setNewCode('');
            setNewMaxUses(1);
            setShowCreateForm(false);
        } catch (err: any) {
            console.error('Create code error:', err);
            setCreateError('Error de conexión: ' + (err.message || 'No se pudo contactar con el servidor'));
        } finally { setCreateLoading(false); }
    };

    const handleDeleteCode = async (id: string) => {
        if (!confirm('¿Eliminar este código?')) return;
        try {
            await fetch(`${API}/actions/delete-v2/${id}`, { method: 'DELETE', headers: promoHeaders });
            setCodes(prev => prev.filter(c => c.id !== id));
        } catch { /* noop */ }
    };

    // ── Raffle Config ──────────────────────────────────────
    const [config, setConfig] = useState({ prizeName: '', prizeImage: '', drawDate: '', totalTickets: 100 });
    const [configLoading, setConfigLoading] = useState(false);
    const [configSaving, setConfigSaving] = useState(false);
    const [configError, setConfigError] = useState('');
    const [configSuccess, setConfigSuccess] = useState(false);
    const [minTickets, setMinTickets] = useState(100);

    const loadConfig = async () => {
        setConfigLoading(true);
        try {
            const res = await fetch(`${API}/api/polleria/config`);
            const json = await res.json();
            if (json.success) {
                const d = json.data;
                setConfig({
                    prizeName: d.prizeName,
                    prizeImage: d.prizeImage || '',
                    drawDate: d.drawDate ? d.drawDate.split('T')[0] : '',
                    totalTickets: d.totalTickets,
                });
                setMinTickets(d.totalTickets);
            }
        } catch { /* noop */ } finally { setConfigLoading(false); }
    };

    useEffect(() => { if (activeTab === 'config') loadConfig(); }, [activeTab]);

    const handleSaveConfig = async (e: React.FormEvent) => {
        e.preventDefault();
        setConfigError('');
        setConfigSaving(true);
        try {
            const res = await fetch(`${API}/api/polleria/config`, {
                method: 'PUT',
                headers: adminHeaders,
                body: JSON.stringify(config),
            });
            const json = await res.json();
            if (!json.success) { setConfigError(json.error || 'Error al guardar'); return; }
            setMinTickets(json.data.totalTickets);
            setConfigSuccess(true);
            setTimeout(() => setConfigSuccess(false), 3000);
        } catch { setConfigError('Error de conexión'); } finally { setConfigSaving(false); }
    };

    // Stats
    const stats = [
        { label: 'Boletos Totales', value: config.totalTickets.toString(), icon: <Ticket /> },
        { label: 'Participantes', value: orders.length.toString(), icon: <Users /> },
        { label: 'Links Activos', value: codes.filter(c => c.active).length.toString(), icon: <Link2 /> }
    ];

    const handleCopyLink = (code: string, count: number) => {
        const slug = `${count}-boletos-de-regalo`;
        const link = `${window.location.origin}/${slug}/${code}`;
        navigator.clipboard.writeText(link);
        setCopiedLink(code);
        setTimeout(() => setCopiedLink(null), 2000);
    };

    const handleLogout = () => {
        localStorage.removeItem('is_admin_logged');
        onLogout?.();
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
            <button
                onClick={() => { setActiveTab('config'); setIsMobileMenuOpen(false); }}
                style={{
                    display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px',
                    background: activeTab === 'config' ? 'var(--primary-glow)' : 'none',
                    border: 'none', color: activeTab === 'config' ? 'var(--primary)' : '#666',
                    borderRadius: '12px', cursor: 'pointer', transition: '0.2s', width: '100%',
                    fontWeight: activeTab === 'config' ? 700 : 500
                }}
            >
                <Settings size={20} /> Configuración
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                        <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%' }} />
                    </div>
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
                        <div style={{ width: '52px', height: '52px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, boxShadow: '0 3px 12px rgba(0,0,0,0.18)' }}>
                            <img src={logo} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 12%' }} />
                        </div>
                        <div>
                            <h1 style={{ fontSize: '15px', fontWeight: 900, margin: 0 }}>Gallinas y Pollos</h1>
                            <p style={{ fontSize: '11px', color: '#999', margin: 0, fontWeight: 500 }}>Panel de Control</p>
                        </div>
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
                                <div>
                                    <h2 style={{ fontSize: '28px', fontWeight: 900 }}>Links de Canje</h2>
                                    <p style={{ color: '#666', marginTop: '4px' }}>Links de uso único para boletos gratis</p>
                                </div>
                                <button className="btn-primary" style={{ padding: '10px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={() => { setShowCreateForm(true); setCreateError(''); }}>
                                    <Plus size={16} /> NUEVO
                                </button>
                            </header>

                            {/* Formulario de creación */}
                            <AnimatePresence>
                                {showCreateForm && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                                        className="premium-card" style={{ background: 'white', border: '2px solid var(--primary-glow)', marginBottom: '24px', padding: '24px' }}>
                                        <h3 style={{ fontWeight: 800, marginBottom: '16px', fontSize: '15px' }}>Generar nuevo link de regalo</h3>
                                        <form onSubmit={handleCreateCode} style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                                            <div style={{ flex: 1, minWidth: '120px' }}>
                                                <label style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Boletos</label>
                                                <input
                                                    required
                                                    type="number"
                                                    min={1}
                                                    className="glass-input"
                                                    style={{ background: '#f8f9fa', border: '1px solid #eee' }}
                                                    value={newTicketsCount}
                                                    onChange={e => setNewTicketsCount(Number(e.target.value))}
                                                />
                                            </div>
                                            <div style={{ flex: 1, minWidth: '100px' }}>
                                                <label style={{ fontSize: '10px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '6px', display: 'block' }}>Usos máx.</label>
                                                <input
                                                    required
                                                    type="number"
                                                    min={1}
                                                    className="glass-input"
                                                    style={{ background: '#f8f9fa', border: '1px solid #eee' }}
                                                    value={newMaxUses}
                                                    onChange={e => setNewMaxUses(Number(e.target.value))}
                                                />
                                            </div>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button type="submit" className="btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap', minWidth: '160px' }} disabled={createLoading}>
                                                    {createLoading ? <Loader size={16} style={{ animation: 'spin 1s linear infinite' }} /> : 'GENERAR LINK'}
                                                </button>
                                                <button type="button" onClick={() => setShowCreateForm(false)} style={{ padding: '12px 16px', background: '#f1f3f5', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: 700 }}>
                                                    <X size={16} />
                                                </button>
                                            </div>
                                        </form>
                                        {createError && <p style={{ color: '#e74c3c', fontSize: '12px', marginTop: '8px' }}>{createError}</p>}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="table-container premium-card" style={{ padding: 0, overflow: 'hidden', background: 'white', border: 'none' }}>
                                {codesLoading ? (
                                    <div style={{ padding: '40px', textAlign: 'center', color: '#999' }}>
                                        <Loader size={24} style={{ animation: 'spin 1s linear infinite' }} />
                                    </div>
                                ) : (
                                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                        <thead>
                                            <tr style={{ background: '#f8f9fa', borderBottom: '1px solid #eee' }}>
                                                <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>CÓDIGO / TIPO</th>
                                                <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>BOLETOS</th>
                                                <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>USOS</th>
                                                <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase' }}>ESTADO</th>
                                                <th style={{ padding: '16px 20px', color: '#999', fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', textAlign: 'right' }}>ACCIONES</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {codes.length === 0 && (
                                                <tr><td colSpan={4} style={{ padding: '40px', textAlign: 'center', color: '#aaa', fontSize: '14px' }}>No hay links creados aún</td></tr>
                                            )}
                                            {codes.map(c => (
                                                <tr key={c.id} style={{ borderBottom: '1px solid #f1f3f5' }}>
                                                    <td style={{ padding: '16px 20px' }}>
                                                        <div style={{ fontWeight: 800, letterSpacing: '0.5px' }}>{c.code}</div>
                                                        <div style={{ fontSize: '10px', color: '#999' }}>Link de Regalo</div>
                                                    </td>
                                                    <td style={{ padding: '16px 20px' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                            <Ticket size={14} color="var(--primary)" />
                                                            <span style={{ fontWeight: 800 }}>{c.ticketsCount}</span>
                                                        </div>
                                                    </td>
                                                    <td style={{ padding: '16px 20px' }}>
                                                        <span style={{ fontWeight: 700 }}>{c.uses}</span>
                                                        <span style={{ color: '#999' }}>/{c.maxUses}</span>
                                                    </td>
                                                    <td style={{ padding: '16px 20px' }}>
                                                        <span style={{
                                                            padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 700,
                                                            background: c.active ? '#e8f8f0' : '#f8f9fa',
                                                            color: c.active ? '#27ae60' : '#999'
                                                        }}>
                                                            {c.active ? 'Activo' : 'Agotado'}
                                                        </span>
                                                    </td>
                                                    <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                                                            <button onClick={() => handleCopyLink(c.code, c.ticketsCount)} title="Copiar link"
                                                                style={{ background: 'none', border: 'none', color: copiedLink === c.code ? '#27ae60' : '#666', cursor: 'pointer', padding: '4px' }}>
                                                                {copiedLink === c.code ? <Check size={18} /> : <Copy size={18} />}
                                                            </button>
                                                            <button onClick={() => handleDeleteCode(c.id)} title="Eliminar"
                                                                style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '4px' }}>
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ── Tab: Configuración ── */}
                    {activeTab === 'config' && (
                        <div style={{ maxWidth: '600px' }}>
                            <header style={{ marginBottom: '32px' }}>
                                <h2 style={{ fontSize: '28px', fontWeight: 900 }}>Configuración de la Rifa</h2>
                                <p style={{ color: '#666', marginTop: '4px' }}>Ajusta el premio, la fecha y la cantidad de boletos</p>
                            </header>

                            {configLoading ? (
                                <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
                                    <Loader size={32} color="var(--primary)" style={{ animation: 'spin 1s linear infinite' }} />
                                </div>
                            ) : (
                                <form onSubmit={handleSaveConfig} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                                    {/* Premio */}
                                    <div className="premium-card" style={{ background: 'white', border: 'none', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Premio</h3>

                                        <div>
                                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Trophy size={14} /> Nombre del Premio
                                            </label>
                                            <input
                                                required
                                                type="text"
                                                className="glass-input"
                                                placeholder="ej: Televisor Plasma 75 Pulgadas"
                                                style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a', height: '50px' }}
                                                value={config.prizeName}
                                                onChange={e => setConfig(c => ({ ...c, prizeName: e.target.value }))}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'block' }}>
                                                URL Imagen del Premio (opcional)
                                            </label>
                                            <input
                                                type="url"
                                                className="glass-input"
                                                placeholder="https://..."
                                                style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a', height: '50px' }}
                                                value={config.prizeImage}
                                                onChange={e => setConfig(c => ({ ...c, prizeImage: e.target.value }))}
                                            />
                                        </div>
                                    </div>

                                    {/* Fecha y boletos */}
                                    <div className="premium-card" style={{ background: 'white', border: 'none', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                        <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Sorteo</h3>

                                        <div>
                                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <CalendarDays size={14} /> Fecha del Sorteo
                                            </label>
                                            <input
                                                required
                                                type="date"
                                                className="glass-input"
                                                style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a', height: '50px' }}
                                                value={config.drawDate}
                                                onChange={e => setConfig(c => ({ ...c, drawDate: e.target.value }))}
                                            />
                                        </div>

                                        <div>
                                            <label style={{ fontSize: '11px', fontWeight: 800, color: '#999', textTransform: 'uppercase', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <Hash size={14} /> Total de Boletos
                                                <span style={{ fontSize: '10px', color: '#aaa', fontWeight: 500, marginLeft: '4px' }}>(mín. {minTickets})</span>
                                            </label>
                                            <input
                                                required
                                                type="number"
                                                min={minTickets}
                                                className="glass-input"
                                                style={{ background: '#f8f9fa', border: '1px solid #eee', color: '#1a1a1a', height: '50px' }}
                                                value={config.totalTickets}
                                                onChange={e => setConfig(c => ({ ...c, totalTickets: Number(e.target.value) }))}
                                            />
                                            <p style={{ fontSize: '11px', color: '#aaa', marginTop: '6px' }}>Solo puedes aumentar la cantidad, no reducirla.</p>
                                        </div>
                                    </div>

                                    {configError && (
                                        <p style={{ color: '#e74c3c', fontSize: '13px', fontWeight: 600, padding: '12px 16px', background: '#fff0f0', borderRadius: '10px' }}>
                                            {configError}
                                        </p>
                                    )}

                                    {configSuccess && (
                                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            style={{ color: '#27ae60', fontSize: '13px', fontWeight: 600, padding: '12px 16px', background: '#e8f8f0', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <Check size={16} /> Configuración guardada correctamente
                                        </motion.p>
                                    )}

                                    <button type="submit" className="btn-primary" style={{ height: '54px', fontSize: '14px' }} disabled={configSaving}>
                                        {configSaving ? <Loader size={18} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={18} />}
                                        {configSaving ? 'GUARDANDO...' : 'GUARDAR CAMBIOS'}
                                    </button>
                                </form>
                            )}
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
        </div >
    );
};

export default AdminDashboard;
