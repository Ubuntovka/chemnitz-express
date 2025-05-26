import express from 'express';
import getAllLocations from '../controllers/locationController';

const router = express.Router();

// GET request for list of all Book items.
router.get("/", getAllLocations.getAllLocations);

export default router;
