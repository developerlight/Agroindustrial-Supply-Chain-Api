# Farmers API Documentation

Base path: `/api/farmers`

## Summary of endpoints

- GET `/api/farmers` — List all farmers (admin only)
- GET `/api/farmers/:id` — Get farmer by id (admin or farmer themself)
- POST `/api/farmers` — Create a new farmer (admin only)
- PUT `/api/farmers/:id` — Update farmer (admin or farmer themself)
- DELETE `/api/farmers/:id` — Delete farmer (admin only)

---

## Models / Payloads

Farmer object (stored fields):

- `_id`: string (Mongo ObjectId)
- `name`: string (required)
- `farmName`: string (required)
- `location` (object, optional):
  - `address`: string
  - `city`: string
  - `province`: string
  - `country`: string
  - `coordinates`: { `lat`: number, `lng`: number }
- `contact` (object, optional):
  - `phone`: string
  - `email`: string
- `role`: string (`farmer` | `distributor` | `admin`)
- `products`: array of product ObjectId
- `createdAt`, `updatedAt`: timestamps

Validator for create/update (fields accepted in request body):
- `name` (required)
- `farmName` (required)
- `location.address`, `location.city`, `location.province`, `location.country` (optional)
- `contact.phone` (optional, mobile phone)
- `contact.email` (optional, email)

---

## GET /api/farmers

- Auth: Bearer token (admin only)
- Query parameters: optional pagination/filtering if implemented (not required here)

Success (200):
```json
{
  "success": true,
  "data": [
    {
      "_id": "60...",
      "name": "Budi Farmer",
      "farmName": "Tani Budi",
      "location": { "city": "Malang", "province": "Jawa Timur" },
      "contact": { "phone": "+628...", "email": "budi@example.com" },
      "role": "farmer",
      "products": [],
      "createdAt": "2026-04-01T...",
      "updatedAt": "2026-04-01T..."
    }
  ]
}
```

Errors:
- 401 Unauthorized — missing/invalid token
- 403 Forbidden — if token is valid but role is not `admin`

---

## GET /api/farmers/:id

- Auth: Bearer token (admin or owner farmer)
- Path params:
  - `id` (required) — farmer ObjectId

Success (200):
```json
{
  "success": true,
  "data": {
    "_id": "60...",
    "name": "Budi Farmer",
    "farmName": "Tani Budi",
    "location": {},
    "contact": {},
    "role": "farmer",
    "products": []
  }
}
```

Errors:
- 400/422 — invalid id format (validator)
- 401 — missing/invalid token
- 403 — forbidden (farmer trying to access other farmer's data)
- 404 — farmer not found

---

## POST /api/farmers

- Auth: Bearer token (admin only)
- Request Body (JSON):
```json
{
  "name": "Budi Farmer",
  "farmName": "Tani Budi",
  "location": { "address": "Jl. Raya 1", "city": "Malang" },
  "contact": { "phone": "+628123456789", "email": "budi@example.com" },
  "password": "secret123"
}
```

- Note: The `validateFarmer` validator requires `name` and `farmName`; `password` is required by model.

Success (201 or 200):
```json
{
  "success": true,
  "data": {
    "_id": "60...",
    "name": "Budi Farmer",
    "farmName": "Tani Budi",
    "location": { },
    "contact": { },
    "role": "farmer"
  }
}
```

Errors:
- 400/422 — validation errors (missing required fields)
- 401 — missing/invalid admin token
- 500 — internal error

---

## PUT /api/farmers/:id

- Auth: Bearer token (admin or owner farmer)
- Path params:
  - `id` (required) — farmer ObjectId
- Request Body: same shape as create (only include fields to update)

Success (200):
```json
{
  "success": true,
  "data": {
    "_id": "60...",
    "name": "Budi Farmer Updated",
    "farmName": "Tani Budi",
    "location": { },
    "contact": { }
  }
}
```

Errors:
- 400/422 — validation errors
- 401 — missing/invalid token
- 403 — forbidden (attempt to update other farmer without admin role)
- 404 — farmer not found

---

## DELETE /api/farmers/:id

- Auth: Bearer token (admin only)
- Path params:
  - `id` — farmer ObjectId

Success (200):
```json
{ "success": true, "message": "Farmer deleted" }
```

Errors:
- 401 — missing/invalid token
- 403 — forbidden (non-admin)
- 404 — farmer not found

---

## Notes & Implementation references

- Route implementation: `routes/farmerRoutes.js`
- Validation rules: `middlewares/validateMiddleware.js` (`validateFarmer`)
- Controller behavior and responses: `controllers/farmerController.js`
- Auth & authorization: `middlewares/authMiddleware.js` (`authMiddleware`, `authorizeRoles`)

You can use examples above to add to Postman or generate OpenAPI specs.
