import { Router } from 'express';
import { listPromoCodes, createPromoCode, deletePromoCode, validatePromoCode, redeemPromoCode } from '../controllers/promoCodes.controller';

const router = Router();
const SECRET = process.env.ADMIN_SECRET || 'pollos-admin-2024';

const checkAdmin = (req: any, res: any, next: any) => {
    if (req.headers['x-admin-key'] !== SECRET) return res.status(401).json({ success: false, error: 'No autorizado' });
    next();
};

// Admin
router.get('/', checkAdmin, listPromoCodes);
router.post('/', checkAdmin, createPromoCode);
router.delete('/:id', checkAdmin, deletePromoCode);

// Público
router.get('/validate/:code', validatePromoCode);
router.post('/redeem/:code', redeemPromoCode);

export default router;
