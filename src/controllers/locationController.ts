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

export default {
    getAllLocations,
    getLocationById,
};
