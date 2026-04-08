import { Request, Response } from 'express';
import prisma from '../config/database.js';

export async function getConfig(_req: Request, res: Response) {
    try {
        let config = await prisma.polleriaConfig.findUnique({ where: { id: 'default' } });
        if (!config) {
            config = await prisma.polleriaConfig.create({ data: { id: 'default', updatedAt: new Date() } });
        }
        res.json({ success: true, data: config });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function updateConfig(req: Request, res: Response) {
    try {
        const { prizeName, prizeImage, drawDate, totalTickets } = req.body;
        if (totalTickets !== undefined) {
            const current = await prisma.polleriaConfig.findUnique({ where: { id: 'default' } });
            if (current && Number(totalTickets) < current.totalTickets) {
                return res.status(400).json({ success: false, error: `No puedes reducir boletos. Mínimo: ${current.totalTickets}` });
            }
        }
        const data: any = { updatedAt: new Date() };
        if (prizeName !== undefined) data.prizeName = prizeName;
        if (prizeImage !== undefined) data.prizeImage = prizeImage;
        if (drawDate !== undefined) data.drawDate = new Date(drawDate);
        if (totalTickets !== undefined) data.totalTickets = Number(totalTickets);
        const config = await prisma.polleriaConfig.upsert({
            where: { id: 'default' },
            update: data,
            create: { id: 'default', ...data },
        });
        res.json({ success: true, data: config });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getTakenTickets(_req: Request, res: Response) {
    try {
        const tickets = await prisma.polleriaTicket.findMany({
            select: { number: true, ownerName: true },
            orderBy: { number: 'asc' },
        });
        res.json({ success: true, data: tickets });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function claimTickets(req: Request, res: Response) {
    try {
        const { tickets, ownerName, ownerPhone, ownerRancheria, promoCode } = req.body;
        if (!Array.isArray(tickets) || tickets.length === 0) {
            return res.status(400).json({ success: false, error: 'Se requieren boletos' });
        }

        let promoId: string | undefined = undefined;
        if (promoCode) {
            const promo = await prisma.promoCode.findUnique({ where: { code: String(promoCode).toUpperCase() } });
            if (promo) promoId = promo.id;
        }

        await prisma.$transaction(
            tickets.map((number: string) =>
                prisma.polleriaTicket.upsert({
                    where: { number },
                    create: {
                        number,
                        ownerName: ownerName || 'Anónimo',
                        ownerPhone: ownerPhone || '',
                        ownerRancheria: ownerRancheria || '',
                        promoCodeId: promoId
                    },
                    update: {},
                })
            )
        );
        res.json({ success: true });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}

export async function getAllOrders(_req: Request, res: Response) {
    try {
        const tickets = await prisma.polleriaTicket.findMany({
            orderBy: { createdAt: 'desc' },
        });

        // Agrupar boletos por cliente (nombre + teléfono)
        const ordersMap = new Map();
        tickets.forEach((t: any) => {
            const key = `${t.ownerName || 'Unknown'}-${t.ownerPhone || 'NoPhone'}`;
            if (!ordersMap.has(key)) {
                ordersMap.set(key, {
                    id: t.id,
                    name: t.ownerName || 'Reservado (Sin Nombre)',
                    phone: t.ownerPhone || 'Sin Teléfono',
                    rancheria: t.ownerRancheria || 'No especificada',
                    tickets: [],
                    date: t.createdAt
                });
            }
            ordersMap.get(key).tickets.push(t.number);
        });

        res.json({ success: true, data: Array.from(ordersMap.values()) });
    } catch (err: any) {
        res.status(500).json({ success: false, error: err.message });
    }
}
