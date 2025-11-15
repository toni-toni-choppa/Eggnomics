import { Router } from 'express';
import connection from '../mysql.js';
import series from '../../../index.js';

const router = Router();
const db = connection.promise();

router.get('/', async (req, res) => {
    try {
        const [tables] = await db.query(`SHOW TABLES`);
        const tableNames = tables.map(row => Object.values(row)[0]);

        const latestData = {};

        for (const tableName of tableNames) {
            const [rows] = await db.query(`
                SELECT *
                FROM \`${tableName}\`
                ORDER BY STR_TO_DATE(CONCAT('01-', date), '%d-%m-%Y') DESC
                LIMIT 2
            `);

            if (rows.length > 0) {
                latestData[tableName] = {
                    name: series[tableName]?.name || tableName,
                    price: rows[0].price,
                    unit: series[tableName]?.unit || 'unit',
                    change: ((rows[0].price - rows[1].price)).toFixed(2)
                };
            }
        }

        res.json(latestData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;