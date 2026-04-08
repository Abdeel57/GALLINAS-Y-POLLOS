import { motion } from 'framer-motion';
import { Ticket, Shuffle } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import logo from '../assets/logo.png';

const LandingPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const code = searchParams.get('code') || '';

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            background: '#ffffff'
        }}>
            {/* Professional Light Glows (Orange & Blue) */}
            <div style={{
                position: 'absolute',
                top: '-10%',
                left: '-10%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 10% 10%, var(--secondary-glow) 0%, transparent 40%)',
                zIndex: 0,
                filter: 'blur(80px)',
                opacity: 0.8
            }} />
            <div style={{
                position: 'absolute',
                bottom: '-20%',
                right: '-20%',
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle at 90% 90%, var(--primary-glow) 0%, transparent 40%)',
                zIndex: 0,
                filter: 'blur(80px)',
                opacity: 0.6
            }} />

            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                    zIndex: 1,
                    width: '100%',
                    maxWidth: '450px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}
            >
                {/* Logo Section - Reduced size */}
                <div className="animate-float" style={{ marginBottom: '20px' }}>
                    <img
                        src={logo}
                        alt="Gallinas y Pollos Aliñados"
                        style={{
                            width: '200px',
                            height: 'auto',
                            filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))'
                        }}
                    />
                </div>

                {/* Text Section - Tighter spacing */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <h1 style={{
                        fontSize: 'clamp(24px, 6vw, 32px)',
                        fontWeight: 900,
                        marginBottom: '8px',
                        color: 'var(--text-main)',
                        letterSpacing: '-0.5px',
                        lineHeight: 1.1
                    }}>
                        ¡GRACIAS POR TU COMPRA!
                    </h1>

                    <p style={{
                        fontSize: '15px',
                        color: 'var(--text-muted)',
                        marginBottom: '32px',
                        lineHeight: 1.4
                    }}>
                        Canjea tus boletos para la gran <br />
                        <span style={{ color: 'var(--primary)', fontWeight: 800 }}>RÍOS DE AGUA VIVA</span>
                    </p>
                </motion.div>

                {/* Buttons Section - Tighter layout */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    width: '100%',
                    maxWidth: '280px'
                }}>
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/picker?type=random&code=${code}`)}
                        className="btn-primary"
                        style={{ width: '100%', padding: '14px' }}
                    >
                        <Shuffle size={18} />
                        AL AZAR
                    </motion.button>

                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => navigate(`/picker?type=choose&code=${code}`)}
                        className="btn-secondary"
                        style={{
                            width: '100%',
                            padding: '14px',
                            display: 'flex',
                            gap: '10px',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <Ticket size={18} />
                        ELEGIR BOLETOS
                    </motion.button>
                </div>
            </motion.div>

            {/* Compact Footer */}
            <div style={{
                position: 'absolute',
                bottom: '16px',
                fontSize: '10px',
                color: 'rgba(0,0,0,0.3)',
                textTransform: 'uppercase',
                letterSpacing: '1px'
            }}>
                © 2024 GALLINAS Y POLLOS ALIÑADOS
            </div>
        </div>
    );
};

export default LandingPage;
