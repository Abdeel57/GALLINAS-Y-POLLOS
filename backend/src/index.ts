import express from 'express';
import cors from 'cors';
import path from 'path';
import polleriaRoutes from './routes/polleria.routes';
import promoCodesRoutes from './routes/promoCodes.routes';

const app = express();

app.use(cors({
    origin: (origin, callback) => {
        // Permite mismo dominio, localhost, y el dominio de producción
        if (!origin) return callback(null, true);
        const allowed = [
            'http://localhost:5173',
            'http://localhost:3000',
            'https://gallinasypollosalinados.com',
            'https://www.gallinasypollosalinados.com',
        ];
        if (allowed.includes(origin) || origin.endsWith('.railway.app')) {
            return callback(null, true);
        }
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    allowedHeaders: ['Content-Type', 'x-admin-key', 'Authorization'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '5mb' }));

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

// Log requests
app.use((req, res, next) => {
    console.log(`[API] ${req.method} ${req.url}`);
    next();
});

// API routes
app.use('/api/polleria', polleriaRoutes);
app.use('/api/admin-canje', promoCodesRoutes);
app.use('/api/promo-codes', promoCodesRoutes); // Mantener por compatibilidad con público

// Servir el frontend React (build estático)
const frontendDist = path.join(__dirname, '..', '..', 'dist');
app.use(express.static(frontendDist));
app.get('*', (_req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'));
});

const PORT = Number(process.env.PORT) || 3001;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
