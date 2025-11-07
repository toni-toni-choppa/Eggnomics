import express from "express";
import next from "next";
import cors from "cors";
import api from "./src/api/index.js";

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