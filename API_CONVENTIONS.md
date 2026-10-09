# API Conventions

- Base path: `/api/v1`.
- Timestamps: ISO 8601 UTC strings.
- Pagination: `page` and `pageSize` query parameters; responses use `items`, `page`, `pageSize`, and `total`.
- Sorting: `sort` and optional `direction=asc|desc`.
- Filtering: resource-specific query parameters; unknown filters return `400`.
- Money: `{ "amountMinor": 1250, "currency": "USD" }`.
- Ownership: every query filters by the authenticated owner and excludes `deleted_at` records.
- Errors use one shape:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request is invalid.",
    "details": [],
    "requestId": "request-id"
  }
}
```

OpenAPI is defined in `openapi.yaml`.
