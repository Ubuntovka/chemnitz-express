import LocationModel from '../models/location';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

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

export default {
    getAllLocations,
    getLocationById,
    getLocationBySearch,
};
