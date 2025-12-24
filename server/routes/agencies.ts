import express from 'express';
import type { Request, Response, Router } from 'express';
import { API_DATA } from './api.js';


const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
        return res.status(500).json({ error: 'API_TOKEN not configured' });
    }

    try {
        const fetchResponse = await fetch(API_DATA.endpoint, {
            method: "POST",
            headers: { 'Content-Type': 'application/json', "X-App-Token": apiToken },
            body: JSON.stringify({ query: `SELECT agency GROUP BY agency ORDER BY agency ASC` })
        })

        const data = await fetchResponse.json();
        res.json(data)
    } catch (err) {
        res.status(500).json({ error: `Failed to fetch agencies` })
    }

});

export default router;