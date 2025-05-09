# UniKhata
A one-step platform for ledger mantainance and all e-commerce plus courier services platforms integration for e-store management.

# API Documentation

## Table of Contents

- [Authentication Routes (`authRoutes`)](#authentication-routes-authroutes)
- [User Routes (`userRoutes`)](#user-routes-userroutes)
- [Order Routes (`orderRoutes`)](#order-routes-orderroutes)
- [Store Routes (`storeRoutes`)](#store-routes-storeroutes)
- [Product Routes (`productRoutes`)](#product-routes-productroutes)
- [Integration Routes (`integrationRoutes`)](#integration-routes-integrationroutes)

---

## Authentication Routes (`authRoutes`)

| Method | Path                | Request Body         | URL Params | Query Params | Status Codes | Success Response | Error Responses | Description |
|--------|---------------------|---------------------|------------|--------------|--------------|------------------|----------------|-------------|
| GET    | `/auth/google`      | -                   | -          | -            | 302          | Redirect         | -              | Initiates Google OAuth login. |
| GET    | `/auth/google/callback` | -               | -          | -            | 302          | Redirect to frontend with tokens in URL | - | Handles Google OAuth callback, issues tokens, and redirects. |
| POST   | `/auth/login`       | `{ email, password }` | -        | -            | 200          | `{ message, tokens }` | 401: Invalid credentials | Manual login with email/password. |
| POST   | `/auth/register`    | `{ email, password, name }` | - | - | 201 | `{ message, tokens }` | 400: Missing fields, 400: User exists, 500: Server error | Register a new user. |
| POST   | `/auth/refresh`     | `{ refreshToken }`  | -          | -            | 200          | `{ message, accessToken }` | 400: Missing token, 401: Invalid token | Refresh access token. |
| GET    | `/auth/user-info`   | -                   | -          | -            | 200          | `{ message, id, email, name }` | 401: Unauthorized | Get info of the authenticated user. |

### Example Success Responses

- **Login/Register**
  ```json
  {
    "message": "Login successful",
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
  // or
  {
    "message": "User created successfully",
    "tokens": {
      "accessToken": "...",
      "refreshToken": "..."
    }
  }
  ```
- **Refresh Token**
  ```json
  {
    "message": "Token refreshed successfully",
    "accessToken": "..."
  }
  ```
- **User Info**
  ```json
  {
    "message": "User info fetched successfully",
    "id": "...",
    "email": "...",
    "name": "..."
  }
  ```

---

## User Routes (`userRoutes`)

| Method | Path                | Request Body         | URL Params | Query Params | Status Codes | Success Response | Error Responses | Description |
|--------|---------------------|---------------------|------------|--------------|--------------|------------------|----------------|-------------|
| GET    | `/users/`           | -                   | -          | -            | 200          | `{ message, user }` | 401: Unauthorized, 404: Not found | Get profile of authenticated user. |
| GET    | `/users/:uid`       | -                   | `uid`      | -            | 200          | `{ message, user }` | 400: Missing ID, 404: Not found | Get profile by user ID. |
| POST   | `/users/`           | `{ name, email, password, avatar?, googleId? }` | - | - | 201 | `{ message, user }` | 400: Missing fields, 409: Email in use, 500: Server error | Create a new user. |
| POST   | `/users/change-password` | `{ oldPassword, newPassword }` | - | - | 200 | `{ message }` | 400: Missing fields/incorrect password, 401: Unauthorized, 404: Not found | Change user password. |
| POST   | `/users/change-avatar` | `{ avatar }`      | -          | -            | 200          | `{ message, user }` | 400: Missing avatar, 401: Unauthorized, 404: Not found | Change user avatar. |
| DELETE | `/users/`           | -                   | -          | -            | 200          | `{ message }`    | 401: Unauthorized, 404: Not found | Soft delete user account. |
| PATCH  | `/users/`           | `{ name?, email?, avatar? }` | - | - | 200 | `{ message, user }` | 401: Unauthorized, 404: Not found, 409: Email in use | Update user profile. |

### Example Success Responses

- **Get User Profile / Get User by ID**
  ```json
  {
    "message": "User profile fetched successfully",
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "avatar": "..."
      // ...other user fields
    }
  }
  ```
- **Create User**
  ```json
  {
    "message": "User created successfully",
    "user": {
      "_id": "...",
      "name": "...",
      "email": "...",
      "avatar": "..."
      // ...other user fields
    }
  }
  ```
- **Change Password / Delete Account**
  ```json
  {
    "message": "Password updated successfully"
  }
  // or
  {
    "message": "Account deleted successfully"
  }
  ```
- **Change Avatar / Update Profile**
  ```json
  {
    "message": "Avatar updated successfully",
    "user": { /* updated user object */ }
  }
  // or
  {
    "message": "User profile updated successfully",
    "user": { /* updated user object */ }
  }
  ```

---

## Order Routes (`orderRoutes`)

| Method | Path                | Request Body         | URL Params | Query Params | Status Codes | Success Response | Error Responses | Description |
|--------|---------------------|---------------------|------------|--------------|--------------|------------------|----------------|-------------|
| GET    | `/orders/`          | `{ uid?, sid? }`    | -          | -            | 200          | `{ message, orders }` | 404: Not found, 500: Server error | Get all orders (optionally by user/store). |
| GET    | `/orders/:oid`      | -                   | `oid`      | -            | 200          | `{ message, order }` | 404: Not found, 500: Server error | Get order by ID. |
| GET    | `/orders/new`       | `{ sid }`           | -          | -            | 200          | `{ message, orders }` | 404: Store not found, 500: Server error | Fetch new orders from integrations for a store. |
| PATCH  | `/orders/:oid`      | `{ order }`         | `oid`      | -            | 200          | `{ message, order }` | 404: Not found, 500: Server error | Update order by ID. |
| DELETE | `/orders/:oid`      | -                   | `oid`      | -            | 200          | `{ message, order }` | 404: Not found, 500: Server error | Delete order by ID. |
| POST   | `/orders/`          | `{ oid, status }`   | -          | -            | 200          | `{ message, order }` | 404: Not found, 500: Server error | Change order status. |

### Example Success Responses

- **Get Orders / Get New Orders**
  ```json
  {
    "message": "Orders fetched successfully",
    "orders": [
      { /* order object */ },
      { /* order object */ }
    ]
  }
  ```
- **Get Order by ID / Update Order / Change Order Status**
  ```json
  {
    "message": "Order fetched successfully",
    "order": { /* order object */ }
  }
  // or
  {
    "message": "Order updated successfully",
    "order": { /* updated order object */ }
  }
  // or
  {
    "message": "Order status updated successfully",
    "order": { /* updated order object */ }
  }
  ```
- **Delete Order**
  ```json
  {
    "message": "Order deleted successfully",
    "order": { /* deleted order object */ }
  }
  ```

---

## Store Routes (`storeRoutes`)

| Method | Path                | Request Body         | URL Params | Query Params | Status Codes | Success Response | Error Responses | Description |
|--------|---------------------|---------------------|------------|--------------|--------------|------------------|----------------|-------------|
| GET    | `/stores/`          | `{ uid? }`          | -          | -            | 200          | `{ message, stores }` | 400: Invalid uid, 500: Server error | Get all stores (optionally by user). |
| GET    | `/stores/:sid`      | -                   | `sid`      | -            | 200          | `{ message, store }` | 400: Invalid id, 404: Not found, 500: Server error | Get store by ID. |
| POST   | `/stores/`          | `{ name, owner, eCommerceIntegrations?, courierIntegrations? }` | - | - | 201 | `{ message, store }` | 400: Missing/invalid fields, 404: Owner not found, 500: Server error | Create a new store. |
| PATCH  | `/stores/:sid`      | `{ ...fields }`     | `sid`      | -            | 200          | `{ message, store }` | 400: Invalid id, 404: Not found, 500: Server error | Update store by ID. |
| DELETE | `/stores/:sid`      | -                   | `sid`      | -            | 200          | `{ message, storeId }` | 400: Invalid id, 404: Not found, 500: Server error | Soft delete store by ID. |

### Example Success Responses

- **Get All Stores**
  ```json
  {
    "message": "Stores fetched successfully",
    "stores": [
      { /* store object */ },
      { /* store object */ }
    ]
  }
  ```
- **Get Store by ID / Create Store / Update Store**
  ```json
  {
    "message": "Store fetched successfully",
    "store": { /* store object */ }
  }
  // or
  {
    "message": "Store created successfully",
    "store": { /* store object */ }
  }
  // or
  {
    "message": "Store updated successfully",
    "store": { /* updated store object */ }
  }
  ```
- **Delete Store**
  ```json
  {
    "message": "Store deleted successfully",
    "storeId": "..."
  }
  ```

---

## Product Routes (`productRoutes`)

| Method | Path                | Request Body         | URL Params | Query Params | Status Codes | Success Response | Error Responses | Description |
|--------|---------------------|---------------------|------------|--------------|--------------|------------------|----------------|-------------|
| GET    | `/products/`        | `{ uid?, sid? }`    | -          | `name, lowPrice, highPrice` | 200 | `{ message, products }` | 404: Not found, 400: Invalid uid/sid, 501: Filters not supported, 500: Server error | Get all products (optionally by user/store, filters not yet supported). |
| GET    | `/products/:pid`    | -                   | `pid`      | -            | 200          | `{ message, product }` | 404: Not found, 500: Server error | Get product by ID. |
| POST   | `/products/`        | `{ name, price, ... }` | -        | -            | 201          | `{ message, product }` | 400: Invalid data, 500: Server error | Create a new product. |
| PATCH  | `/products/:pid`    | `{ ...fields }`     | `pid`      | -            | 200          | `{ message, product }` | 404: Not found, 500: Server error | Update product by ID. |
| DELETE | `/products/:pid`    | -                   | `pid`      | -            | 200          | `{ message, productId }` | 404: Not found, 500: Server error | Soft delete product by ID. |

### Example Success Responses

- **Get All Products**
  ```json
  {
    "message": "Products fetched successfully",
    "products": [
      { /* product object */ },
      { /* product object */ }
    ]
  }
  ```
- **Get Product by ID / Create Product / Update Product**
  ```json
  {
    "message": "Product fetched successfully",
    "product": { /* product object */ }
  }
  // or
  {
    "message": "Product created successfully",
    "product": { /* product object */ }
  }
  // or
  {
    "message": "Product updated successfully",
    "product": { /* updated product object */ }
  }
  ```
- **Delete Product**
  ```json
  {
    "message": "Product deleted successfully",
    "productId": "..."
  }
  ```

---

## Integration Routes (`integrationRoutes`)

> **Note:** No integration routes are currently implemented. This section is reserved for future endpoints related to third-party service integrations.

---

**Legend:**
- `uid` = User ID
- `sid` = Store ID
- `pid` = Product ID
- `oid` = Order ID

**All endpoints return JSON responses.**