import express from 'express'
import cors from 'cors';
import dotenv from 'dotenv';
import type { Express } from 'express';

import jobsRouter from './routes/jobs.js';
import categoriesRouter from './routes/categories.js';
import agencyRouter from './routes/agencies.js';


dotenv.config();
dotenv.config({ path: '.env.local', override: true });

const app: Express = express();
const PORT = 8080;

app.use(cors());

app.use(express.static('public'));

app.use('/jobs', jobsRouter);
app.use('/categories', categoriesRouter)
app.use('/agencies', agencyRouter);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
})