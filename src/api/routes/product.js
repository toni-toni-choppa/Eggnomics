import { Router } from 'express';
import connection from '../mysql.js';
import series from '../../../index.js';

const router = Router();
const db = connection.promise();

router.get('/', async (req, res) => {
    try {
        // Validate table name against allowed series
        const tableId = req.query.id;
        if (!series[tableId]) {
            return res.status(400).json({ status: 400, error: 'Invalid product ID' });
        }
        
        // Use mysql escapeId to safely escape table name
        const [rows] = await db.query(`
            SELECT *
            FROM ?? 
            ORDER BY STR_TO_DATE(CONCAT('01-', date), '%d-%m-%Y') DESC
        `, [tableId]);

        res.json({
            name: series[req.query.id]?.name || req.query.id,
            unit: series[req.query.id]?.unit || 'unit',
            prices: rows.slice(0, 120).map(row => ({
                date: row.date,
                price: row.price
            }))
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: 500, error: 'Internal Server Error', details: error });
    }
});

export default router;