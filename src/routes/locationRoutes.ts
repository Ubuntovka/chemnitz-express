import express from 'express';
import locationController from '../controllers/locationController';

const router = express.Router();

// GET request for list of all Book items
router.get("/locations", locationController.getAllLocations);

// GET request for location by id
router.get("/locations/:id", locationController.getLocationById);

// GET request fot locations by name search
router.get("/search/location", locationController.getLocationBySearch);

export default router;
