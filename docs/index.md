# API Root & Route Mounting

All endpoints are mounted under the base path `/api` in `index.js` (the main Express router is mounted at `app.use('/api', routes)`).

## Mounted sub-routers

- `/api/auth` → Authentication endpoints
  - See: `routes/authRoutes.js`, docs: `docs/auth.md` (created earlier)
- `/api/farmers` → Farmer management endpoints
  - See: `routes/farmerRoutes.js`, docs: `docs/farmers.md`
- `/api/products` → Product catalog endpoints
  - See: `routes/productRoutes.js`, docs: `docs/products.md`
- `/api/distributors` → Distributor management
  - See: `routes/distributorRoutes.js`, docs: `docs/distributors.md`
- `/api/orders` → Order management
  - See: `routes/orderRoutes.js`, docs: `docs/orders.md`
- `/api/shipments` → Shipment tracking
  - See: `routes/shipmentRoutes.js`, docs: `docs/shipments.md`
- `/api/analytics` → Aggregated analytics (admin)
  - See: `routes/analyticsRoutes.js`, docs: `docs/analytics.md`

## Default root

- `GET /` — Health / running message (defined in `index.js`)

## Notes
- All sub-routers apply their own auth/validation middleware as defined in each router file.
- To generate a full OpenAPI/Swagger spec, use these docs as source for paths and schemas.
