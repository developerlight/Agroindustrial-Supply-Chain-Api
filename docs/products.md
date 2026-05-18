# Products API Documentation

Base path: `/api/products`

## Summary of endpoints

- GET `/api/products` — List all products (public)
- GET `/api/products/:id` — Get product by id (public)
- POST `/api/products` — Create a new product (admin or farmer)
- PUT `/api/products/:id` — Update product (admin or farmer)
- DELETE `/api/products/:id` — Delete product (admin or farmer)

---

## Model / Payload

Product object fields (see `models/Product.js`):
- `_id`: string (ObjectId)
- `name`: string (required)
- `category`: string (required)
- `unit`: string (default `kg`)
- `pricePerUnit`: number (required)
- `quantityAvailable`: number (default 0)
- `harvestDate`: Date (optional)
- `farmerId`: ObjectId reference to `Farmer` (required)
- `createdAt`, `updatedAt`

Validation (from `validateProduct`):
- `name` (required)
- `category` (required)
- `unit` optional string
- `pricePerUnit` required numeric
- `quantityAvailable` required integer >= 0
- `harvestDate` optional ISO8601 date

---

## GET /api/products
- Auth: none (public)
- Query parameters: (not required) could include filters, pagination (if implemented)

Success (200):
```json
{ "success": true, "data": [ { "_id":"...", "name":"Tomat Merah", "pricePerUnit":12000, "quantityAvailable":150 } ] }
```

Errors: 500 Server Error

---

## GET /api/products/:id
- Auth: none (public)
- Path params: `id` (ObjectId)

Success (200):
```json
{ "success": true, "data": { "_id":"...","name":"Tomat Merah","category":"Vegetables","unit":"kg","pricePerUnit":12000 } }
```

Errors:
- 400/422 invalid id
- 404 product not found

---

## POST /api/products
- Auth: Bearer token (role `admin` or `farmer`)
- Request headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Request body example:
```json
{
  "name":"Tomat Merah",
  "category":"Vegetables",
  "unit":"kg",
  "pricePerUnit":12000,
  "quantityAvailable":150,
  "harvestDate":"2026-04-20T00:00:00.000Z",
  "farmerId":"60c72b2f9b1e8a5f3d4c1a01" // optional for farmer role
}
```

Notes:
- If the requester has role `farmer`, the controller will attach `farmerId` from the JWT (`req.user.id`).
- Admin may provide `farmerId` in the body.

Success (201): returns created product object

Errors:
- 401 Unauthorized — missing/invalid token
- 403 Forbidden — role not allowed
- 422 Validation error
- 500 Server Error

---

## PUT /api/products/:id
- Auth: Bearer token (role `admin` or `farmer`)
- Path param: `id` (ObjectId)
- Body: fields to update (same schema as create)

Notes:
- If role is `farmer`, the controller ensures `farmerId` equals `req.user.id` to prevent farmers editing others' products.

Success (200): updated product object

Errors:
- 401/403/422/404 as applicable

---

## DELETE /api/products/:id
- Auth: Bearer token (role `admin` or `farmer`)
- Path param: `id` (ObjectId)

Success (200): deleted product object or confirmation

Errors: 401/403/404

---

## References
- Routes: `routes/productRoutes.js`
- Controller: `controllers/productController.js`
- Validation: `middlewares/validateMiddleware.js` (`validateProduct`)
- Model: `models/Product.js`

You can use these examples to produce OpenAPI schemas or a Postman collection.