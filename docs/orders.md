# Orders API Documentation

Base path: `/api/orders`

## Summary of endpoints

- GET `/api/orders` — List orders (admin, distributor)
- GET `/api/orders/:id` — Get order by id (admin, distributor)
- POST `/api/orders` — Create a new order (distributor only)
- PUT `/api/orders/:id` — Update order (admin, distributor - distributor can update status)
- DELETE `/api/orders/:id` — Delete order (admin, distributor)

---

## Model / Payload

Order object (`models/Order.js`):
- `_id`: ObjectId
- `productId`: ObjectId (required)
- `buyerId`: ObjectId (Distributor) (required)
- `quantity`: number (required)
- `totalPrice`: number (required)
- `status`: `pending` | `shipped` | `delivered` | `cancelled` (default `pending`)
- `orderDate`: Date
- `deliveryDate`: Date
- `createdAt`, `updatedAt`

Validation (from `validateOrder`):
- `productId` (required, MongoId)
- `buyerId` (required, MongoId)
- `quantity` required integer >= 1
- `deliveryDate` optional ISO8601 date

---

## GET /api/orders
- Auth: Bearer token (admin or distributor)
- Query: optional filters/pagination

Success (200):
```json
{ "success": true, "data": [ { "_id":"...", "productId":"...","buyerId":"...","quantity":10,"totalPrice":120000 } ] }
```

Errors: 401, 403, 500

---

## GET /api/orders/:id
- Auth: Bearer token (admin or distributor)
- Path param: `id` (ObjectId)

Success (200):
```json
{ "success": true, "data": { "_id":"...","productId":"...","buyerId":"...","quantity":10,"status":"pending" } }
```

Errors: 400/422 invalid id, 404 not found

---

## POST /api/orders
- Auth: Bearer token (distributor only)
- Request headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Request body example:
```json
{
  "productId":"60...",
  "quantity": 10,
  "deliveryDate": "2026-05-20T00:00:00.000Z"
}
```

Notes:
- `buyerId` is taken from the authenticated distributor (`req.user.id`).
- `totalPrice` is calculated by service logic (product.pricePerUnit * quantity).

Success (201): created order object

Errors: 401 Unauthorized, 403 Forbidden, 422 Validation error

---

## PUT /api/orders/:id
- Auth: Bearer token (admin or distributor)
- Path param: `id`
- Body: fields to update

Notes:
- If role is `distributor`, controller allows only updating `status` (other updates will return unauthorized in current controller logic).

Success (200): updated order object

Errors: 401/403/404

---

## DELETE /api/orders/:id
- Auth: Bearer token (admin or distributor)
- Path param: `id`

Success (200): deleted order object or confirmation

Errors: 401/403/404

---

## References
- Routes: `routes/orderRoutes.js`
- Controller: `controllers/orderController.js`
- Service: `services/orderService.js` (calculates `totalPrice`)
- Validation: `middlewares/validateMiddleware.js` (`validateOrder`)
