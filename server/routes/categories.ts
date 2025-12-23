import express from 'express';
import type { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
        return res.status(500).json({ error: 'API_TOKEN not configured' });
    }
    try {
        const fetchRes = await fetch('https://data.cityofnewyork.us/api/v3/views/kpav-sd4t/query.json', {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "X-App-Token": apiToken },
            body: JSON.stringify({ query: 'SELECT job_category GROUP BY job_category ORDER BY job_category ASC', includeSynthetic: false })
        });

        const data = await fetchRes.json();

        res.json(data);
    } catch (err) {
        res.status(500).send({ status: 500, message: "Failed to fetch categories" });

    }
});

export default router