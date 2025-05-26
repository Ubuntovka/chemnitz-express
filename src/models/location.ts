import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
    type: string;
    properties: {
        '@id'?: string;
        landuse?: string;
        museum?: string;
        name?: string;
        operator?: string;
        tourism?: string;
        website?: string;
        wheelchair?: string;
        wikidata?: string;
        '@geometry'?: string;
    };
    geometry: {
        type: 'Point';
        coordinates: [number, number];
    };
    id?: string;
}

const locationSchema: Schema = new Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    type: {
        type: String,
        default: 'Feature',
    },
    properties: {
        '@id': String,
        landuse: String,
        museum: String,
        name: String,
        operator: String,
        tourism: String,
        website: String,
        wheelchair: String,
        wikidata: String,
        '@geometry': String,
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        },
    },
    id: String,
});

// The third argument ('locations') sets the MongoDB collection name
export default mongoose.model<ILocation>('location', locationSchema, 'locations');
