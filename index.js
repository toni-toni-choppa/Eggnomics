import express from "express";
import next from "next";
import cors from "cors";
import cron from "node-cron";
import api from "./src/api/index.js";
import connection from "./src/api/mysql.js";

const series = {
    "grade_a_eggs": {
        name: "Grade A Eggs",
        id: "APU0000708111",
        unit: "dozen"
    },
    "whole_milk": {
        name: "Whole Milk",
        id: "APU0000709112",
        unit: "gallon"
    }
};

const db = connection.promise();

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev, dir: "./src" });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(cors());
    server.use(express.json());

    server.use('/api', api);

    server.all(/(.*)/, (req, res) => handle(req, res));

    const PORT = process.env.PORT || 3000;
    server.listen(PORT, (error) => {
        if (error) throw error;
        console.log(`> Ready on http://localhost:${PORT}`);
    });
}).catch ((error) => {
    console.error(error);
});

cron.schedule('0 0 * * *', async () => {
    try {
        const payload = {
            seriesid: Object.values(series).map(item => item.id),
            startyear: `${new Date().getFullYear() - 10}`,
            endyear: new Date().getFullYear().toString(),
            registrationkey: process.env.BLS_API_KEY
        };

        const apiResponse = await fetch('https://api.bls.gov/publicAPI/v2/timeseries/data/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await apiResponse.json();

        if (!data.Results?.series) {
            console.error('No series data found in API response');
            return;
        }

        for (const seriesData of data.Results.series) {
            const seriesInfo = Object.values(series).find(item => item.id === seriesData.seriesID);
            if (!seriesInfo) continue;
            console.log(`Updating data for ${seriesInfo.name}`);

            const tableName = seriesInfo.name.replace(/\s+/g, '_').toLowerCase();

            // Create table if it doesn't exist
            await db.query(`
               CREATE TABLE IF NOT EXISTS \`${tableName}\` (
                      date VARCHAR(20) PRIMARY KEY,
                      price DECIMAL(10, 2)
               )
            `);

            for (const item of seriesData.data) {
                const month = new Date(`${item.periodName}-01-${item.year}`).getMonth() + 1;
                const date = `${month.toString().padStart(2, '0')}-${item.year}`;
                const price = item.value;

                // Insert or update price data
                await db.query(`
                    INSERT INTO \`${tableName}\` (date, price)
                    VALUES (?, ?)
                    ON DUPLICATE KEY UPDATE price = VALUES(price)
                `, [date, price]);
            }

            console.log(`Data for ${seriesInfo.name} updated successfully.`);
        }
    } catch (error) {
        console.error('Error fetching price data:', error);
    }
});

export default series;