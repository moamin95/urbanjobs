import express from 'express';
import type { Router, Request, Response } from 'express';

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {

    const apiToken = process.env.API_TOKEN;

    if (!apiToken) {
        return res.status(500).send({ status: 500, message: 'API_TOKEN not configured' })
    }

    const { search = '' } = req.query;

    const whereClause = search
        ? `WHERE business_title LIKE '${search}%'`
        : '';

    try {

        const fetchCount = await fetch('https://data.cityofnewyork.us/api/v3/views/kpav-sd4t/query.json', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-App-Token': apiToken },
            body: JSON.stringify({ query: `SELECT COUNT(*) ${whereClause}` })
        })

        const data = await fetchCount.json();
        res.json(data);
    } catch (err) {
        console.error(err);
        res.status(500).send({ status: 500, message: 'Failed to fetch data count' })
    }

});

export default router
