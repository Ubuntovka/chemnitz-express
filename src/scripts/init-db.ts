import mongoose, {connect} from 'mongoose';
import fs from 'fs';
import path from 'path';
import Location from '../models/location';
import config from "../config/config";

async function initializeDatabase() {
    try {
        // Connect to MongoDB
        run().catch(err => console.log(err));
        async function run() {
            await connect(config.mongodbUrl);
        }
        console.log('Connected to MongoDB');

        // Load GeoJSON file
        const filePath = path.resolve(__dirname, 'Chemnitz.geojson');
        const geoData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        if (!geoData.features || !Array.isArray(geoData.features)) {
            throw new Error('Invalid GeoJSON format: missing or invalid `features` array.');
        }

        // Clear existing locations
        await Location.deleteMany({});
        console.log('Cleared existing locations');

        // Insert new locations
        const result = await Location.insertMany(geoData.features);
        console.log(`Inserted ${result.length} locations`);

        process.exit(0);
    } catch (err) {
        console.error('Failed to initialize database:', err);
        process.exit(1);
    }
}

initializeDatabase();
