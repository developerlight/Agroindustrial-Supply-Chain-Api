# Analytics API Documentation

Base path: `/api/analytics`

## Summary of endpoints

- GET `/api/analytics/sales` — Sales analytics (admin only)
- GET `/api/analytics/stock` — Stock analytics (admin only)
- GET `/api/analytics/delivery-time` — Delivery time analytics (admin only)

All analytics endpoints require admin role and return aggregated metrics.

---

## GET /api/analytics/sales
- Auth: Bearer token (admin only)
- Query params: optional (e.g., `startDate`, `endDate`, `groupBy` if implemented)

Success (200) sample:
```json
{
  "success": true,
  "data": {
    "totalOrders": 120,
    "totalRevenue": 15000000,
    "revenuePerProduct": [ { "productId":"...","revenue":5000000 } ],
    "ordersPerStatus": { "pending": 10, "shipped": 50, "delivered": 60 }
  }
}
```

Errors: 401 Unauthorized, 403 Forbidden, 500 Server Error

---

## GET /api/analytics/stock
- Auth: Bearer token (admin only)

Success (200) sample:
```json
{
  "success": true,
  "data": {
    "totalStock": 5000,
    "stockPerProduct": [ { "productId":"...","quantity":300 } ],
    "stockPerFarmer": [ { "farmerId":"...","quantity":1200 } ]
  }
}
```

---

## GET /api/analytics/delivery-time
- Auth: Bearer token (admin only)

Success (200) sample:
```json
{
  "success": true,
  "data": {
    "totalShipments": 200,
    "avgDeliveryTimeDays": 3.4,
    "avgPerDistributor": [ { "distributorId":"...","avgDays":2.7 } ]
  }
}
```

---

## Notes
- Aggregations are implemented in `services/analyticsService.js`.
- Consider adding query filters (date ranges, groupings) if needed.
