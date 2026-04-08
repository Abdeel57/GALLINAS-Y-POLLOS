import { Router } from 'express';
import { getConfig, updateConfig, getTakenTickets, claimTickets, getAllOrders } from '../controllers/polleria.controller.js';

const router = Router();
const SECRET = process.env.ADMIN_SECRET || 'pollos-admin-2024';

const checkAdmin = (req: any, res: any, next: any) => {
    if (req.headers['x-admin-key'] !== SECRET) return res.status(401).json({ success: false, error: 'No autorizado' });
    next();
};

router.get('/config', getConfig);
router.put('/config', checkAdmin, updateConfig);
router.get('/tickets', getTakenTickets);
router.post('/tickets', claimTickets);
router.get('/orders', checkAdmin, getAllOrders);

export default router;
