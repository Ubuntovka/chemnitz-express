import express from 'express';
import locationRoutes from './routes/locationRoutes';
import { errorHandler } from './middlewares/errorHandler';
import { connect } from 'mongoose';
import config from './config/config';
const app = express();

app.use(express.json());

run().catch(err => console.log(err));

// Connection to MongoDB
async function run() {
    await connect(config.mongodbUrl);
}

// Routes
app.use('/', locationRoutes);

// Global error handler (should be after routes)
app.use(errorHandler);

export default app;