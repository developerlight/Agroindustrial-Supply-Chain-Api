# Middleware & Error Handling

This document describes the project's middleware, validation, and standard API response/error formats.

## `authMiddleware` (middlewares/authMiddleware.js)

- Purpose: Verify JWT from `Authorization: Bearer <token>` header and attach decoded user info to `req.user`.
- Requirements: `process.env.JWT_SECRET` must be set.
- Behavior:
  - If header missing or not Bearer → returns 401 via `APIResponse.unauthorized(res, 'No token provided')`.
  - Verifies token using `jwt.verify(token, JWT_SECRET)`.
  - On success: sets `req.user = decoded` (expected fields: `id`, `role`) and calls `next()`.
  - On failure: logs and returns 401 with message `Invalid or expired token`.

## `authorizeRoles(...roles)`

- Purpose: Role-based access control middleware factory.
- Usage: `authorizeRoles('admin')` or `authorizeRoles('admin', 'farmer')`.
- Behavior:
  - Checks `req.user.role` and returns 403 via `APIResponse.forbidden` if role not in allowed list.
  - Assumes `authMiddleware` ran before so `req.user` exists.

## Validation middleware (`middlewares/validateMiddleware.js`)

- Exported helpers:
  - `validate(validations)` — runs `express-validator` validations and returns 422 with structured errors when validation fails.
  - `validateObjectIdParam(paramName)` — validator for MongoDB ObjectId path params.
  - `validateProduct`, `validateFarmer`, `validateDistributor`, `validateOrder`, `validateShipment` — prebuilt validators for common payloads.

- Validation error format (HTTP 422):
```json
{
  "success": false,
  "message": "Validation Error",
  "errors": [ { "field": "name", "message": "Name is required" } ]
}
```

## Global error handler (`middlewares/errorMiddleware.js`)

- Logs full error stack via `logger.error`.
- Special handling:
  - Mongoose `ValidationError` → returns 422 with array of messages.
  - Mongoose `CastError` (invalid ObjectId) → returns 400 with message indicating invalid id.
- Fallback: `APIResponse.serverError(res, err.message)` (500)

## API response helpers (`utils/apiResponse.js`)

All API endpoints use `APIResponse` for consistent JSON responses.

- Success with data (default 200):
```json
{ "success": true, "message": "Success", "data": <any> }
```

- Success message only:
```json
{ "success": true, "message": "Deleted successfully" }
```

- Error response (client/server):
```json
{ "success": false, "message": "Error message", "errors": <optional> }
```

- Paginated response:
```json
{ "success": true, "message": "Success", "data": [ ... ], "meta": { "page":1, "limit":10, "total":100 } }
```

## Best practices / Notes

- Always protect sensitive routes with `authMiddleware` and `authorizeRoles` as appropriate.
- Use validators from `validateMiddleware` to provide consistent 422 responses for user input errors.
- Controller functions should `throw` or `next(err)` so `errorMiddleware` can centralize error formatting and logging.

References:
- `middlewares/authMiddleware.js`
- `middlewares/validateMiddleware.js`
- `middlewares/errorMiddleware.js`
- `utils/apiResponse.js`
