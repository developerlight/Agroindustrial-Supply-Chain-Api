# Models & Payloads

This document summarizes the main Mongoose models, their fields, required attributes, relationships, and example request/response payloads.

## Farmer
Model: `models/Farmer.js`

Schema fields:
- `_id`: ObjectId
- `name`: string (required)
- `farmName`: string (required)
- `location` (object): `address`, `city`, `province`, `country`, `coordinates { lat, lng }`
- `contact` (object): `phone`, `email`
- `password`: string (required, stored hashed)
- `role`: enum ['farmer','distributor','admin'] (default 'farmer')
- `products`: [ObjectId] refs to `Product`
- `createdAt`, `updatedAt`

Create request example (admin creates farmer):
```json
{
  "name": "Budi Farmer",
  "farmName": "Tani Budi",
  "location": { "address": "Jl. Raya 1", "city": "Malang" },
  "contact": { "phone": "+628123456789", "email": "budi@example.com" },
  "password": "secret123"
}
```

Response example (omit password):
```json
{
  "success": true,
  "data": {
    "_id": "60...",
    "name": "Budi Farmer",
    "farmName": "Tani Budi",
    "location": { "city": "Malang" },
    "contact": { "phone": "+628..." },
    "role": "farmer",
    "products": []
  }
}
```

---

## Distributor
Model: `models/Distributor.js`

Schema fields:
- `_id`: ObjectId
- `name`: string (required)
- `type`: enum ['Distributor','Retailer'] (default 'Distributor')
- `location`: `address`, `city`, `province`, `country`
- `contact`: `phone`, `email`
- `orders`: [ObjectId] refs to `Order`
- `password`: string (required, hashed)
- `role`: enum ['farmer','distributor','admin'] (default 'farmer')
- `createdAt`, `updatedAt`

Create request example:
```json
{
  "name": "PT Distribusi",
  "type": "Distributor",
  "location": { "city": "Jakarta" },
  "contact": { "phone": "+628...", "email": "dist@example.com" },
  "password": "securepass"
}
```

Response example (no password):
```json
{ "success": true, "data": { "_id": "60...", "name": "PT Distribusi", "type": "Distributor" } }
```

---

## Product
Model: `models/Product.js`

Schema fields:
- `_id`: ObjectId
- `name`: string (required)
- `category`: string (required)
- `unit`: string (default 'kg')
- `pricePerUnit`: number (required)
- `quantityAvailable`: number (default 0)
- `harvestDate`: Date (optional)
- `farmerId`: ObjectId ref `Farmer` (required)
- `createdAt`, `updatedAt`

Create request (farmer can omit `farmerId`, it's taken from JWT):
```json
{
  "name":"Tomat Merah",
  "category":"Vegetables",
  "unit":"kg",
  "pricePerUnit":12000,
  "quantityAvailable":150,
  "harvestDate":"2026-04-20T00:00:00.000Z"
}
```

Response example:
```json
{ "success": true, "data": { "_id":"...","name":"Tomat Merah","pricePerUnit":12000 } }
```

---

## Order
Model: `models/Order.js`

Schema fields:
- `_id`: ObjectId
- `productId`: ObjectId ref `Product` (required)
- `buyerId`: ObjectId ref `Distributor` (required)
- `quantity`: number (required)
- `totalPrice`: number (required, computed by service)
- `status`: enum ['pending','shipped','delivered','cancelled'] (default 'pending')
- `orderDate`: Date
- `deliveryDate`: Date (optional)
- `createdAt`, `updatedAt`

Create request (distributor):
```json
{
  "productId":"60...",
  "quantity":10,
  "deliveryDate":"2026-05-20T00:00:00.000Z"
}
```

Response example:
```json
{ "success": true, "data": { "_id":"...","productId":"...","buyerId":"...","quantity":10,"totalPrice":120000 } }
```

---

## Shipment
Model: `models/Shipment.js`

Schema fields:
- `_id`: ObjectId
- `orderId`: ObjectId ref `Order` (required)
- `distributorId`: ObjectId ref `Distributor` (required)
- `status`: enum ['pending','in_transit','delivered'] (default 'pending')
- `pickupDate`: Date (optional)
- `deliveryDate`: Date (optional)
- `vehicleInfo`: { `vehicleType`, `plateNumber` }
- `createdAt`, `updatedAt`

Create request (distributor may omit `distributorId`):
```json
{
  "orderId":"60...",
  "pickupDate":"2026-05-10T08:00:00.000Z",
  "deliveryDate":"2026-05-12T16:00:00.000Z",
  "vehicleInfo": { "vehicleType": "Truck", "plateNumber": "B 1234 CD" }
}
```

Response example:
```json
{ "success": true, "data": { "_id":"...","orderId":"...","distributorId":"...","status":"pending" } }
```

---

## General notes
- For create/update requests, do NOT include `password` in response payloads.
- All ObjectId fields must be valid MongoDB ObjectId strings (validators enforce this).
- `totalPrice` is calculated by service logic and returned by order endpoints.
- Use timestamps (`createdAt`/`updatedAt`) for auditing and sorting.

References: `models/*.js` and validators in `middlewares/validateMiddleware.js`.
