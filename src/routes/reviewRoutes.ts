import express from 'express';
import reviewController from '../controllers/reviewController';
import auth from "../middlewares/auth";

const router = express.Router();

router.get('/reviews/all', reviewController.getAllReviews)

router.post('/reviews/add', auth, reviewController.addReview)

router.get('/reviews/user', auth, reviewController.getReviewsByUser);


export default router;