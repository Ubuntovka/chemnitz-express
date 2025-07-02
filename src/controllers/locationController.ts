import LocationModel from '../models/location';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import mongoose from "mongoose";

const getAllLocations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const allLocations = await LocationModel.find({}).exec();
    res.status(200).json(allLocations);
});

const getLocationById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        res.status(400).json({ error: 'Invalid location ID' });
    }

    const oneLocation = await LocationModel.findById(id);
    if (!oneLocation) {
        res.status(404).json({ error: 'Location not found' });
    }

    res.status(200).json(oneLocation);
})

const getLocationBySearch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const search = req.query.search as string;

    if (!search) {
        res.status(400).json({ error: 'Missing search query parameter' });
    }

    const searchedLocation = await LocationModel.find({
        'properties.name': { $regex: search, $options: 'i' }
    });

    res.status(200).json(searchedLocation);
})

const populateLocation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const locations = await LocationModel.find({
        $or: [
            { 'properties.addr:street': { $in: [null, '', undefined] } },
            { 'properties.addr:city': { $in: [null, '', undefined] } },
            { 'properties.addr:housenumber': { $in: [null, '', undefined] } },
            { 'properties.addr:postcode': { $in: [null, '', undefined] } },
        ]
    });

    let updatedCount = 0;

    for (const location of locations) {
        const [lon, lat] = location.geometry.coordinates;

        try {
            const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
                params: {
                    format: 'json',
                    lat,
                    lon,
                    addressdetails: 18
                }
            });

            const address = response.data.address;

            const updatedProperties: Record<string, any> = {};
            if (address.city) updatedProperties['addr:city'] = address.city;
            if (address.country) updatedProperties['addr:country'] = address.country;
            if (address.road) updatedProperties['addr:street'] = address.road;
            if (address.postcode) updatedProperties['addr:postcode'] = address.postcode;
            if (address.house_number) updatedProperties['addr:housenumber'] = address.house_number;
            if (address.suburb) updatedProperties['addr:suburb'] = address.suburb;

            if (Object.keys(updatedProperties).length > 0) {
                await LocationModel.findByIdAndUpdate(location._id, {
                    $set: Object.fromEntries(
                        Object.entries(updatedProperties).map(([k, v]) => [`properties.${k}`, v])
                    )
                });
                updatedCount++;
            }
        } catch (error) {
            console.error(`Failed to reverse geocode for location ${location._id}:`, error);
        }
    }

    res.status(200).json({ message: `${updatedCount} locations updated.` });
})


export default {
    getAllLocations,
    getLocationById,
    getLocationBySearch,
    populateLocation,
};
