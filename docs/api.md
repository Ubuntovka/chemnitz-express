# API Reference

Complete API documentation for the Chemnitz Express REST API.

## Base URL

```
http://localhost:3000
```

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

🔒 = Protected endpoint (requires authentication)

---

## Users

### Register User

Create a new user account.

**Endpoint**: `POST /api/users/register`

**Request Body**:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Validation**:
- `name`: Required, string
- `email`: Required, valid email format
- `password`: Required, minimum 8 characters

**Response**: `201 Created`
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "email": "john@example.com",
  "ranking": 0,
  "favorite_locations": [],
  "visited_locations": [],
  "tokens": [
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ]
}
```

**Error Response**: `400 Bad Request`
```json
{
  "error": "Email already exists"
}
```

---

### Login User

Authenticate and receive a JWT token.

**Endpoint**: `POST /api/users/login`

**Request Body**:
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response**: `200 OK`
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "email": "john@example.com",
  "ranking": 15,
  "tokens": [
    {
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  ]
}
```

**Error Response**: `400 Bad Request`
```json
{
  "error": "Invalid login credentials"
}
```

---

### Get Current User 🔒

Retrieve the authenticated user's profile.

**Endpoint**: `GET /api/users/me`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Doe",
  "email": "john@example.com",
  "ranking": 15,
  "favorite_locations": ["loc1", "loc2"],
  "visited_locations": ["loc3", "loc4"]
}
```

**Error Response**: `401 Unauthorized`
```json
{
  "error": "Authentication token missing"
}
```

---

### Get All Users and Rankings

Retrieve all users with their ranking information.

**Endpoint**: `GET /api/users/rankings`

**Response**: `200 OK`
```json
[
  {
    "_id": "user_id_1",
    "name": "John Doe",
    "email": "john@example.com",
    "ranking": 25
  },
  {
    "_id": "user_id_2",
    "name": "Jane Smith",
    "email": "jane@example.com",
    "ranking": 18
  }
]
```

---

### Update User 🔒

Update the authenticated user's profile.

**Endpoint**: `PATCH /api/users/update`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body** (all fields optional):
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "favorite_locations": ["loc1", "loc2", "loc3"]
}
```

**Response**: `200 OK`
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "name": "John Updated",
  "email": "john.new@example.com",
  "ranking": 15,
  "favorite_locations": ["loc1", "loc2", "loc3"]
}
```

---

### Update User Ranking 🔒

Update the user's ranking score.

**Endpoint**: `PATCH /api/users/ranking`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "ranking": 20
}
```

**Response**: `200 OK`
```json
{
  "message": "Ranking updated successfully",
  "ranking": 20
}
```

---

### Delete User 🔒

Delete the authenticated user's account.

**Endpoint**: `DELETE /api/users/delete`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
{
  "message": "User deleted successfully"
}
```

---

## Locations

### Get All Locations

Retrieve all locations in Chemnitz.

**Endpoint**: `GET /locations`

**Query Parameters** (optional):
- `limit`: Number of results (default: all)
- `skip`: Number of results to skip (pagination)

**Response**: `200 OK`
```json
[
  {
    "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
    "type": "Feature",
    "geometry": {
      "type": "Point",
      "coordinates": [12.9213697, 50.8357678]
    },
    "properties": {
      "@id": "node/123456789",
      "name": "Chemnitz Opera House",
      "amenity": "theatre",
      "addr:city": "Chemnitz",
      "addr:street": "Theaterplatz",
      "addr:housenumber": "2",
      "addr:postcode": "09111"
    }
  }
]
```

**Example**:
```bash
curl http://localhost:3000/locations
```

---

### Get Location by ID

Retrieve a specific location by its ID.

**Endpoint**: `GET /locations/:id`

**Parameters**:
- `id`: Location ID (MongoDB ObjectId)

**Response**: `200 OK`
```json
{
  "_id": "65f1a2b3c4d5e6f7g8h9i0j1",
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [12.9213697, 50.8357678]
  },
  "properties": {
    "name": "Chemnitz Opera House",
    "amenity": "theatre",
    "addr:city": "Chemnitz",
    "addr:street": "Theaterplatz"
  }
}
```

**Error Response**: `404 Not Found`
```json
{
  "error": "Location not found"
}
```

**Example**:
```bash
curl http://localhost:3000/locations/65f1a2b3c4d5e6f7g8h9i0j1
```

---

### Search Locations by Name

Search for locations by name.

**Endpoint**: `GET /search/location`

**Query Parameters**:
- `name`: Search term (partial match, case-insensitive)

**Response**: `200 OK`
```json
[
  {
    "_id": "location_id",
    "properties": {
      "name": "Chemnitz Opera House",
      "amenity": "theatre"
    },
    "geometry": {
      "coordinates": [12.9213697, 50.8357678]
    }
  }
]
```

**Example**:
```bash
curl "http://localhost:3000/search/location?name=opera"
```

---

### Populate Missing Addresses

Fetch and populate missing address data for locations using external geocoding services.

**Endpoint**: `PATCH /populate/address`

**⚠️ Note**: This operation may take several minutes depending on the number of locations with missing data.

**Response**: `200 OK`
```json
{
  "message": "Successfully updated 45 locations"
}
```

**Example**:
```bash
curl -X PATCH http://localhost:3000/populate/address
```

---

## Reviews

### Get All Reviews

Retrieve all reviews in the system.

**Endpoint**: `GET /reviews/all`

**Response**: `200 OK`
```json
[
  {
    "_id": "review_id",
    "user": "user_id",
    "location": "location_id",
    "rating": 5,
    "comment": "Amazing place to visit!",
    "createdAt": "2026-02-10T12:00:00.000Z"
  }
]
```

**Example**:
```bash
curl http://localhost:3000/reviews/all
```

---

### Add Review 🔒

Create a new review for a location.

**Endpoint**: `POST /reviews/add`

**Headers**:
```
Authorization: Bearer <token>
```

**Request Body**:
```json
{
  "location": "65f1a2b3c4d5e6f7g8h9i0j1",
  "rating": 5,
  "comment": "Great experience! Highly recommend."
}
```

**Validation**:
- `location`: Required, valid location ID
- `rating`: Required, number (typically 1-5)
- `comment`: Optional, string (default: empty)

**Response**: `201 Created`
```json
{
  "_id": "review_id",
  "user": "user_id",
  "location": "65f1a2b3c4d5e6f7g8h9i0j1",
  "rating": 5,
  "comment": "Great experience! Highly recommend.",
  "createdAt": "2026-02-10T12:00:00.000Z"
}
```

**Example**:
```bash
curl -X POST http://localhost:3000/reviews/add \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "65f1a2b3c4d5e6f7g8h9i0j1",
    "rating": 5,
    "comment": "Excellent location!"
  }'
```

---

### Get Reviews by User 🔒

Retrieve all reviews created by the authenticated user.

**Endpoint**: `GET /reviews/user`

**Headers**:
```
Authorization: Bearer <token>
```

**Response**: `200 OK`
```json
[
  {
    "_id": "review_id_1",
    "user": "user_id",
    "location": "location_id_1",
    "rating": 5,
    "comment": "Amazing!",
    "createdAt": "2026-02-10T12:00:00.000Z"
  },
  {
    "_id": "review_id_2",
    "user": "user_id",
    "location": "location_id_2",
    "rating": 4,
    "comment": "Very nice",
    "createdAt": "2026-02-09T10:00:00.000Z"
  }
]
```

**Example**:
```bash
curl http://localhost:3000/reviews/user \
  -H "Authorization: Bearer <token>"
```

---

### Get Reviews by Location

Retrieve all reviews for a specific location.

**Endpoint**: `GET /reviews/location/:locationId`

**Parameters**:
- `locationId`: Location ID (MongoDB ObjectId)

**Response**: `200 OK`
```json
[
  {
    "_id": "review_id",
    "user": {
      "_id": "user_id",
      "name": "John Doe"
    },
    "location": "location_id",
    "rating": 5,
    "comment": "Great place!",
    "createdAt": "2026-02-10T12:00:00.000Z"
  }
]
```

**Example**:
```bash
curl http://localhost:3000/reviews/location/65f1a2b3c4d5e6f7g8h9i0j1
```

---

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "Validation error message"
}
```

### 401 Unauthorized
```json
{
  "error": "Authentication token missing"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Error description"
}
```

---

## Rate Limiting

Currently, no rate limiting is implemented. Consider adding rate limiting middleware for production:

```bash
npm install express-rate-limit
```

---

## CORS Configuration

The API accepts requests from all origins (configured with `cors()`). For production, restrict allowed origins:

```typescript
app.use(cors({
  origin: 'https://your-frontend-domain.com'
}));
```

---

## Postman Collection

You can import the following endpoints into Postman for testing:

1. Create a new collection named "Chemnitz Express"
2. Add environment variables:
   - `base_url`: `http://localhost:3000`
   - `token`: Your JWT token (set after login)
3. Import endpoints from this documentation

---

## Testing with cURL

### Complete Workflow Example

```bash
# 1. Register a new user
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123"
  }'

# 2. Save the token from the response, then login
curl -X POST http://localhost:3000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'

# 3. Get all locations
curl http://localhost:3000/locations

# 4. Get a specific location (replace with actual ID)
curl http://localhost:3000/locations/<location_id>

# 5. Add a review (use token from login)
curl -X POST http://localhost:3000/reviews/add \
  -H "Authorization: Bearer <your_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "location": "<location_id>",
    "rating": 5,
    "comment": "Great place!"
  }'

# 6. Get your reviews
curl http://localhost:3000/reviews/user \
  -H "Authorization: Bearer <your_token>"

# 7. Get your profile
curl http://localhost:3000/api/users/me \
  -H "Authorization: Bearer <your_token>"
```

---

## Pagination

For endpoints that return large datasets, implement pagination:

**Example**:
```bash
# Get first 10 locations
curl "http://localhost:3000/locations?limit=10&skip=0"

# Get next 10 locations
curl "http://localhost:3000/locations?limit=10&skip=10"
```

**Note**: Pagination implementation may vary by endpoint.
