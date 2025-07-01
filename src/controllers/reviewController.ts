import ReviewModel from '../models/review';
import asyncHandler from 'express-async-handler';
import {Request, Response, NextFunction} from 'express';
import {CustomRequest} from "../middlewares/auth";

const getAllReviews = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const allLocations = await ReviewModel.find({}).exec();
    res.send(allLocations);
});

// GET /reviews/user
const getReviewsByUser = async (req: CustomRequest, res: Response) => {
    if (!req.user) {
        return res.status(401).json({error: 'Unauthorized'});
    }

    const reviews = await ReviewModel.find({user: req.user._id});

    res.status(200).json(reviews);
};

// POST /reviews/add
const addReview = async (req: CustomRequest, res: Response) => {
    const {rating, comment, locationId} = req.body

    if (!req.user) {
        return res.status(401).json({error: 'Unauthorized'})
    }

    if (!req.user.visited_locations.includes(locationId)) {
        return res.status(400).json({error: 'You should visit the location first'})
    }

    if (!rating || !locationId) {
        return res.status(400).json({error: 'rating and locationId are required'})
    }

    // Optional: prevent duplicate reviews
    const existingReview = await ReviewModel.findOne({
        user: req.user._id,
        location: locationId,
    })

    if (existingReview) {
        return res.status(400).json({error: 'You have already reviewed this location'})
    }

    const review = await ReviewModel.create({
        user: req.user._id,
        location: locationId,
        rating,
        comment,
        createdAt: new Date(),
    })

    res.status(201).json(review)
}

export default {
    getAllReviews,
    addReview,
    getReviewsByUser,
};
