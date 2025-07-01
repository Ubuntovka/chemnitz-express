import {Schema, model, Document, Model, HydratedDocument, Types} from 'mongoose'

export interface IReview extends Document {
    _id: Types.ObjectId
    user: Types.ObjectId
    location: Types.ObjectId
    rating: number
    comment: string
    createdAt: Date
}

interface ReviewModel extends Model<IReview, {}> {
    findByCredentials(email: string, password: string): Promise<HydratedDocument<IReview>>
}

const reviewSchema = new Schema<IReview, ReviewModel>({
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    location: {type: Schema.Types.ObjectId, ref: 'Location'},
    rating: {type: Schema.Types.Number, required: true},
    comment: {type: Schema.Types.String, default: ""},
    createdAt: {type: Date, required: true},
})

const Review = model<IReview, ReviewModel>('Review', reviewSchema);

export default Review;

