# Distributors API Documentation

Base path: `/api/distributors`

## Summary of endpoints

- GET `/api/distributors` — List all distributors (admin only)
- GET `/api/distributors/:id` — Get distributor by id (admin only)
- POST `/api/distributors` — Create a new distributor (admin only)
- PUT `/api/distributors/:id` — Update distributor (admin only)
- DELETE `/api/distributors/:id` — Delete distributor (admin only)

---

## Model / Payload

Distributor object:
- `_id`: string (ObjectId)
- `name`: string (required)
- `type`: string (`Distributor` | `Retailer`)
- `location`: object (address, city, province, country)
- `contact`: object (phone, email)
- `orders`: array of `Order` ObjectId
- `role`: enum (`farmer`|`distributor`|`admin`)
- `createdAt`, `updatedAt`

Validator fields (from `validateDistributor`):
- `name` (required)
- `type` optional, must be `Distributor` or `Retailer`
- `location.*` optional strings
- `contact.phone` optional mobile phone
- `contact.email` optional email

---

## GET /api/distributors
- Auth: Bearer token (admin only)
- Query: optional pagination/filtering

Success (200):
```json
{
  "success": true,
  "data": [ { "_id":"...", "name":"PT Distribusi", "type":"Distributor", "contact":{}, "location":{} } ]
}
```

Errors: 401 Unauthorized, 403 Forbidden, 500 Server Error

---

## GET /api/distributors/:id
- Auth: Bearer token (admin only)
- Path param: `id` (ObjectId)

Success (200):
```json
{ "success": true, "data": { "_id":"...", "name":"...", "orders":[] } }
```

Errors: 400/422 invalid id, 401, 403, 404

---

## POST /api/distributors
- Auth: Bearer token (admin only)
- Request body example:
```json
{
  "name": "PT Distribusi",
  "type": "Distributor",
  "location": { "address": "Jl. Raya 1", "city": "Jakarta" },
  "contact": { "phone": "+628...", "email": "dist@example.com" },
  "password": "securepass"
}
```

Success (201): returns created distributor (without password)

Errors: 400/422 validation, 401 unauthorized, 500

---

## PUT /api/distributors/:id
- Auth: Bearer token (admin only)
- Path param: `id`
- Body: fields to update

Success (200): updated distributor object

Errors: 400/422, 401, 403, 404

---

## DELETE /api/distributors/:id
- Auth: Bearer token (admin only)
- Path param: `id`

Success (200): { "success": true, "message": "Distributor deleted" }

Errors: 401, 403, 404

---

## References
- Route implementation: `routes/distributorRoutes.js`
- Model: `models/Distributor.js`
- Validation: `middlewares/validateMiddleware.js` (`validateDistributor`)
- Controllers: `controllers/distributorController.js`
