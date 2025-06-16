import LocationModel from '../models/location';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';
import axios from 'axios';

const getAllLocations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const allLocations = await LocationModel.find({}).exec();
    res.send(allLocations);
});

const getLocationById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const oneLocation = await LocationModel.findById(req.params.id);
    res.send(oneLocation);
})

const getLocationBySearch = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const searchedLocation = await LocationModel.find({
        'properties.name': { $regex: req.query.search, $options: 'i' }
    });
    res.send(searchedLocation);
})

const populateLocation = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const locations = await LocationModel.find({
        'properties.addr:street': { $in: [null, '', undefined]}
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

    res.send({ message: `${updatedCount} locations updated.` });
})


export default {
    getAllLocations,
    getLocationById,
    getLocationBySearch,
    populateLocation,
};
