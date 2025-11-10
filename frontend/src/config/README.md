# API Configuration

This folder contains the centralized API configuration for the VendeTuAutoYa frontend application.

## Files

### `api.ts`
- Contains API endpoints configuration
- Environment-based URL resolution
- Default headers configuration
- Centralized constants for all API calls

### `apiClient.ts`
- HTTP client wrapper around Axios
- Automatic authentication token handling
- Request/response interceptors
- Error handling and retry logic
- File upload/download utilities
- Singleton pattern for consistent usage

## Usage

Import the required modules in your services:

```typescript
import { API_ENDPOINTS } from './config/api';
import { apiClient } from './config/apiClient';

// Example usage
const userData = await apiClient.get(API_ENDPOINTS.USER.PROFILE);
```

## Environment Configuration

The API client automatically detects the environment and uses the appropriate backend URL:
- Development: `http://localhost:5000/api`
- Production: Set via environment variables

## Authentication

The API client automatically:
- Adds Bearer tokens to requests
- Handles token refresh
- Redirects to login on 401 errors
- Stores/retrieves tokens from localStorage

## Best Practices

1. Always use the centralized endpoints from `API_ENDPOINTS`
2. Use the `apiClient` for all HTTP requests
3. Handle errors at the service level
4. Use TypeScript interfaces for request/response types