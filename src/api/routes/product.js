import { Router } from 'express';
import connection from '../mysql.js';
import series from '../../../index.js';

const router = Router();
const db = connection.promise();

router.get('/', async (req, res) => {
    try {
        const [rows] = await db.query(`
            SELECT *
            FROM \`${req.query.id}\`
            ORDER BY date DESC
        `);

        if (rows.length > 0) {
            res.json({
                name: series[req.query.id]?.name || req.query.id,
                unit: series[req.query.id]?.unit || 'unit',
                prices: rows.slice(0, 100).map(row => ({
                    date: row.date,
                    price: row.price
                }))
            });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;