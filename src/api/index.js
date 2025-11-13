import { Router } from 'express';
import latestRouter from './routes/latest.js';
import productRouter from './routes/product.js';
import connection from './mysql.js';
const router = Router();

router.get('/', (req, res) => {
    res.json({ status: 200, message: 'OK', details: null });
});

router.get('/status', (req, res) => {
    try {
        connection.ping((error) => {
            if (error) {
                return res.status(500).json({ status: 500, message: 'Internal Server Error', details: error.message });
            }
            res.json({ status: 200, message: 'OK', details: null });
        });
    } catch (error) {
        res.status(500).json({ status: 500, message: 'Internal Server Error', details: error.message });
    }
});

router.use('/latest', latestRouter);
router.use('/product', productRouter);

export default router;