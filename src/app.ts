import express from 'express';
import locationRoutes from './routes/locationRoutes';
import { errorHandler } from './middlewares/errorHandler';
import dotenv from 'dotenv';

dotenv.config();
const app = express();

app.use(express.json());

// Connection to Mongodb
const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
    await mongoose.connect(process.env.MONGODB_URI);
}

// Routes
app.use('/', locationRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;