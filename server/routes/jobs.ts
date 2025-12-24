import express from 'express';
import type { Request, Response } from 'express';
import type { Job } from '../../shared/types/job.js';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
    const apiToken = process.env.API_TOKEN;
    if (!apiToken) {
        return res.status(500).json({ error: 'API_TOKEN not configured' });
    }

    const {pageNumber = '1', pageSize = '12', job = "", keyWords = "" } = req.query;

    // Normalize agencies to always be an array
    let agenciesArray: string[] = [];
    if (req.query.agencies) {
        agenciesArray = Array.isArray(req.query.agencies)
            ? req.query.agencies as string[]
            : [req.query.agencies as string];
    }

    const conditions = [];

    if (job) {
        const escapedJob = String(job).replace(/'/g, "''");
        conditions.push(`business_title LIKE '%${escapedJob}%'`);
    }

    if (keyWords) {
        const escapedKeyWords = String(keyWords).replace(/'/g, "''");
        conditions.push(`job_category LIKE '%${escapedKeyWords}%'`);
    }

    // Add agencies filter if any are selected
    if (agenciesArray.length > 0) {
        const escapedAgencies = agenciesArray.map(agency =>
            `'${String(agency).replace(/'/g, "''")}'`
        ).join(', ');
        conditions.push(`agency IN (${escapedAgencies})`);
    }

    const whereClause = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';


    try {
        // Fetch jobs
        const fetchRes = await fetch('https://data.cityofnewyork.us/api/v3/views/kpav-sd4t/query.json', {
            method: 'POST',
            headers: { 'Content-Type': "application/json", 'X-App-Token': apiToken },
            body: JSON.stringify({ query: `SELECT * ${whereClause} ORDER BY posting_date DESC`, page: { pageNumber, pageSize} })
        });

        // Fetch count
        const fetchCount = await fetch('https://data.cityofnewyork.us/api/v3/views/kpav-sd4t/query.json', {
            method: 'POST',
            headers: { 'Content-Type': "application/json", 'X-App-Token': apiToken },
            body: JSON.stringify({ query: `SELECT COUNT(*) ${whereClause}` })
        });

        const jobs: Job[] = await fetchRes.json();
        const countData = await fetchCount.json();
        const totalCount = countData && countData.length > 0 ? parseInt(countData[0].COUNT) : 0;

        res.json({ jobs, totalCount })
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: 'Failed to fetch jobs' })
    }
});

export default router;
