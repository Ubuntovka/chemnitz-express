# Database Setup

This document describes the MongoDB database setup, schema design, and data initialization process for Chemnitz Express.

## MongoDB Configuration

### Prerequisites

- MongoDB installed locally or access to a MongoDB Atlas cluster
- MongoDB connection URI with appropriate credentials

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/chemnitz-express
JWT_KEY=your_jwt_secret_key_here
```

**Important**: 
- Replace `MONGODB_URI` with your actual MongoDB connection string
- Generate a secure random string for `JWT_KEY` (e.g., using `openssl rand -base64 32`)
- Never commit `.env` file to version control

## Database Collections

The application uses three main collections:

### 1. Locations

Stores geographic data about places in Chemnitz, imported from GeoJSON format.

**Schema Highlights**:
```typescript
{
  type: string,
  geometry: {
    type: 'Point',
    coordinates: [longitude, latitude]
  },
  properties: {
    '@id': string,
    'addr:city': string,
    'addr:street': string,
    'addr:housenumber': string,
    'addr:postcode': string,
    amenity: string,
    name: string,
    // ... many other OSM properties
  }
}
```

### 2. Users

Stores user account information, authentication tokens, and rankings.

**Schema**:
```typescript
{
  name: string (required),
  email: string (required, unique),
  password: string (required, hashed, min 8 chars),
  favorite_locations: string[],
  visited_locations: string[],
  ranking: number,
  tokens: [{ token: string }]
}
```

**Features**:
- Password hashing with bcrypt (10 rounds)
- JWT token storage for session management
- User ranking system based on activity

### 3. Reviews

Stores user reviews for locations.

**Schema**:
```typescript
{
  user: ObjectId (ref: 'User'),
  location: ObjectId (ref: 'Location'),
  rating: number (required),
  comment: string (default: ""),
  createdAt: Date (required)
}
```

## Data Initialization

### Step 1: Download GeoJSON Data

Place the `Chemnitz.geojson` file in the `src/scripts/` directory. This file contains OpenStreetMap data for Chemnitz locations.

### Step 2: Run the Initialization Script

```bash
npm run init:db
```

This command executes `src/scripts/init-db.ts`, which:
1. Connects to MongoDB using the `MONGODB_URI` from `.env`
2. Reads the `Chemnitz.geojson` file
3. Parses and validates location data
4. Inserts locations into the database
5. Prints the count of inserted locations

**Expected Output**:
```
Inserted X locations into the database
```

### Step 3: Populate Missing Address Data

Some locations may have incomplete address information. To fill in missing data using external geocoding:

```bash
curl -X PATCH http://localhost:3000/populate/address
```

**Note**: This operation may take several minutes as it queries external services for each location with missing data.

## Database Connection

The database connection is established in `src/app.ts`:

```typescript
import { connect } from 'mongoose';
import config from './config/config.js';

async function run() {
    await connect(config.mongodbUrl);
}

run().catch(err => console.log(err));
```

The connection:
- Automatically reconnects on failure
- Uses Mongoose for schema validation and queries
- Logs errors to console

## Indexes

For optimal performance, consider adding indexes:

```javascript
// Location searches by name
db.locations.createIndex({ "properties.name": "text" })

// User email lookup
db.users.createIndex({ "email": 1 }, { unique: true })

// Reviews by location
db.reviews.createIndex({ "location": 1 })

// Reviews by user
db.reviews.createIndex({ "user": 1 })
```