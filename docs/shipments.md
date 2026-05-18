# Shipments API Documentation

Base path: `/api/shipments`

## Summary of endpoints

- GET `/api/shipments` — List shipments (admin, distributor)
- GET `/api/shipments/:id` — Get shipment by id (admin, distributor)
- POST `/api/shipments` — Create a new shipment (admin or distributor)
- PUT `/api/shipments/:id` — Update shipment (admin or distributor; distributor may only update status)
- DELETE `/api/shipments/:id` — Delete shipment (admin or distributor)

---

## Model / Payload (`models/Shipment.js`)

Shipment object fields:
- `_id`: ObjectId
- `orderId`: ObjectId (required) — reference to `Order`
- `distributorId`: ObjectId (required) — reference to `Distributor`
- `status`: `pending` | `in_transit` | `delivered` (default `pending`)
- `pickupDate`: Date (optional)
- `deliveryDate`: Date (optional)
- `vehicleInfo`: object (optional):
  - `vehicleType`: string
  - `plateNumber`: string
- `createdAt`, `updatedAt`

Validation (from `validateShipment`):
- `orderId` required, MongoId
- `distributorId` required, MongoId
- `status` optional, must be one of allowed values
- `pickupDate` / `deliveryDate` optional ISO8601 date

---

## GET /api/shipments
- Auth: Bearer token (admin or distributor)
- Query: optional filters (by status, distributorId, date ranges) — if implemented

Success (200):
```json
{ "success": true, "data": [ { "_id":"...","orderId":"...","distributorId":"...","status":"pending" } ] }
```

Errors: 401 Unauthorized, 403 Forbidden, 500 Server Error

---

## GET /api/shipments/:id
- Auth: Bearer token (admin or distributor)
- Path param: `id` (ObjectId)

Success (200):
```json
{ "success": true, "data": { "_id":"...","orderId":"...","distributorId":"...","status":"in_transit","pickupDate":"2026-05-10T..." } }
```

Errors:
- 400/422 invalid id
- 404 not found

---

## POST /api/shipments
- Auth: Bearer token (admin or distributor)
- Request headers: `Authorization: Bearer <token>`, `Content-Type: application/json`
- Request body example:
```json
{
  "orderId": "60...",
  "distributorId": "60...", // not required when requester is distributor
  "status": "pending",
  "pickupDate": "2026-05-10T08:00:00.000Z",
  "deliveryDate": "2026-05-12T16:00:00.000Z",
  "vehicleInfo": { "vehicleType": "Truck", "plateNumber": "B 1234 CD" }
}
```

Notes:
- If requester role is `distributor`, controller attaches `distributorId` from JWT (`req.user.id`). Admin may provide `distributorId` in body.

Success (201): created shipment object

Errors: 401/403/422

---

## PUT /api/shipments/:id
- Auth: Bearer token (admin or distributor)
- Path param: `id` (ObjectId)
- Body: fields to update

Notes:
- If role is `distributor`, controller currently allows only updating `status`. Attempting other updates returns unauthorized.

Success (200): updated shipment object

Errors: 401/403/404

---

## DELETE /api/shipments/:id
- Auth: Bearer token (admin or distributor)
- Path param: `id`

Success (200): deleted shipment object or confirmation

Errors: 401/403/404

---

## References
- Routes: `routes/shipmentRoutes.js`
- Controller: `controllers/shipmentController.js`
- Validation: `middlewares/validateMiddleware.js` (`validateShipment`)
- Model: `models/Shipment.js`
