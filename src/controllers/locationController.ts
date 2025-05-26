import LocationModel from '../models/location';
import asyncHandler from 'express-async-handler';
import { Request, Response, NextFunction } from 'express';

const getAllLocations = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const allLocations = await LocationModel.find({}).exec();
    res.send(allLocations);
});

export default {
    getAllLocations,
};
