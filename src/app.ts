import express from 'express';
import locationRoutes from './routes/locationRoutes';
import {errorHandler} from './middlewares/errorHandler';
import {connect} from 'mongoose';
import config from './config/config';
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import reviewRoutes from "./routes/reviewRoutes";

const app = express();
app.use(express.json());

run().catch(err => console.log(err));

// Connection to MongoDB
async function run() {
    await connect(config.mongodbUrl);
}

app.use(cors());

// Routes
app.use('/', locationRoutes);
app.use('/api/users/', userRoutes);
app.use('/', reviewRoutes)

// Global error handler
app.use(errorHandler);

export default app;