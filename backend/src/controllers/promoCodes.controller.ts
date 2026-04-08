import { Request, Response } from 'express';
import prisma from '../config/database';

export async function listPromoCodes(_req: Request, res: Response) {
    try {
        const codes = await prisma.promoCode.findMany({ orderBy: { createdAt: 'desc' } });
        res.json({ success: true, data: codes });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function createPromoCode(req: Request, res: Response) {
    try {
        const { code, maxUses } = req.body;
        if (!code || String(code).trim() === '') {
            return res.status(400).json({ success: false, error: 'El código es requerido' });
        }
        const normalized = String(code).trim().toUpperCase();
        const existing = await prisma.promoCode.findUnique({ where: { code: normalized } });
        if (existing) return res.status(409).json({ success: false, error: 'Ese código ya existe' });
        const promo = await prisma.promoCode.create({
            data: {
                code: normalized,
                maxUses: maxUses ? Number(maxUses) : 1,
                ticketsCount: req.body.ticketsCount ? Number(req.body.ticketsCount) : 1
            }
        });
        res.status(201).json({ success: true, data: promo });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function deletePromoCode(req: Request, res: Response) {
    try {
        await prisma.promoCode.delete({ where: { id: req.params.id } });
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function validatePromoCode(req: Request, res: Response) {
    try {
        const code = req.params.code.trim().toUpperCase();
        const promo = await prisma.promoCode.findUnique({ where: { code } });

        if (!promo) {
            return res.json({ valid: false, reason: 'not_found' });
        }

        if (!promo.active || promo.uses >= promo.maxUses) {
            // Ya se usó, buscamos qué boletos generó para mostrarlos de nuevo
            const tickets = await prisma.polleriaTicket.findMany({ where: { promoCodeId: promo.id } });
            return res.json({
                valid: false,
                reason: 'exhausted',
                canjeado: true,
                tickets: tickets.map(t => ({
                    number: t.number,
                    ownerName: t.ownerName,
                    ownerPhone: t.ownerPhone
                }))
            });
        }

        res.json({
            valid: true,
            code: promo.code,
            usesLeft: promo.maxUses - promo.uses,
            maxUses: promo.maxUses,
            ticketsCount: promo.ticketsCount
        });
    } catch (err: any) {
        res.status(500).json({ valid: false, reason: 'error' });
    }
}

export async function redeemPromoCode(req: Request, res: Response) {
    try {
        const code = req.params.code.trim().toUpperCase();
        const promo = await prisma.promoCode.findUnique({ where: { code } });
        if (!promo || !promo.active || promo.uses >= promo.maxUses) {
            return res.status(400).json({ success: false, error: 'Código inválido o agotado' });
        }
        const updated = await prisma.promoCode.update({ where: { code }, data: { uses: { increment: 1 } } });
        if (updated.uses >= updated.maxUses) {
            await prisma.promoCode.update({ where: { code }, data: { active: false } });
        }
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}
