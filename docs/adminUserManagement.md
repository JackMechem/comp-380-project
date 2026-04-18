# Admin User Management — Frontend Integration Guide

This guide covers building an admin UI for listing, editing, and deleting accounts and users. All operations here require the requesting account to have `STAFF` or `ADMIN` role.

---

## Overview

There are two related but separate entities:

- **Account** — login credentials, role, and email. Created via `/auth/register`.
- **User** — personal info (name, phone, address, driver's license). Linked to an account via `userId`.

An account may or may not have a linked user. The admin panel will typically need to manage both.

---

## Auth Requirements

Every request must include:

```
Authorization: Bearer <session-token>
X-API-Key: <api-key>        (if API_KEY is set on the server)
Content-Type: application/json   (for PATCH requests)
```

Role requirements per operation:

| Operation | Minimum Role |
|-----------|-------------|
| List / view accounts or users | `CUSTOMER` |
| Edit account or user fields | `STAFF` |
| Change account role | `STAFF` |
| Delete account or user | `ADMIN` |

---

## Data Shapes

### Account
```
acctId              number
name                string
email               string
dateCreated         ISO-8601 string
dateEmailConfirmed  ISO-8601 string | null
user                number (userId) | null
role                "CUSTOMER" | "STAFF" | "ADMIN"
```

### User
```
userId          number
firstName       string
lastName        string
email           string
phoneNumber     string
dateCreated     ISO-8601 string
address: {
  buildingNumber  string
  streetName      string
  city            string
  state           string   (2-letter abbreviation)
  zipCode         string
}
driversLicense: {
  driversLicense  string   (license number)
  state           string   (issuing state)
  expirationDate  number   (Unix epoch seconds)
  dateOfBirth     number   (Unix epoch seconds)
}
reservations    number[]   (reservation IDs)
reviews         number[]   (review IDs)
```

---

## Endpoints

---

### `GET /accounts` — List All Accounts

Returns a paginated list of all accounts.

**Query parameters (all optional):**

| Param | Example | Description |
|-------|---------|-------------|
| `page` | `?page=2` | Page number (default: 1) |
| `pageSize` | `?pageSize=25` | Items per page |
| `search` | `?search=jane` | Search by name or email |
| `sort` | `?sort=name` | Field to sort by |
| `order` | `?order=asc` | `asc` or `desc` |
| `select` | `?select=acctId&select=name&select=role` | Return only specific fields |

**Example request:**
```js
fetch("/accounts?page=1&pageSize=20", {
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
  }
})
```

**Example response `200`:**
```json
{
  "data": [
    {
      "acctId": 1,
      "name": "Jane Doe",
      "email": "jane@example.com",
      "dateCreated": "2025-11-01T14:30:00Z",
      "dateEmailConfirmed": "2025-11-01T14:45:00Z",
      "user": 42,
      "role": "CUSTOMER"
    },
    {
      "acctId": 2,
      "name": "Bob Staff",
      "email": "bob@example.com",
      "dateCreated": "2025-10-15T09:00:00Z",
      "dateEmailConfirmed": "2025-10-15T09:12:00Z",
      "user": null,
      "role": "STAFF"
    }
  ],
  "currentPage": 1,
  "totalPages": 5,
  "totalItems": 97
}
```

---

### `GET /accounts/{id}` — Get Single Account

**Example request:**
```js
fetch(`/accounts/${acctId}`, {
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
  }
})
```

**Example response `200`:**
```json
{
  "acctId": 1,
  "name": "Jane Doe",
  "email": "jane@example.com",
  "dateCreated": "2025-11-01T14:30:00Z",
  "dateEmailConfirmed": "2025-11-01T14:45:00Z",
  "user": 42,
  "role": "CUSTOMER"
}
```

**Errors:**
| Status | Cause |
|--------|-------|
| `404` | Account not found |

---

### `PATCH /accounts/{id}` — Update Account

Performs a **shallow merge** — only the fields you send are changed. Send only the fields you want to update.

**Requires `STAFF` or `ADMIN` role.**

**Editable fields:**

| Field | Type | Notes |
|-------|------|-------|
| `name` | string | Display name |
| `email` | string | Login email |
| `role` | `"CUSTOMER"` \| `"STAFF"` \| `"ADMIN"` | Permission role |
| `dateEmailConfirmed` | ISO-8601 string \| null | Mark email as confirmed/unconfirmed |

**Example — change role to STAFF:**
```js
fetch(`/accounts/${acctId}`, {
  method: "PATCH",
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    role: "STAFF"
  })
})
```

**Example — update name and email:**
```js
body: JSON.stringify({
  name: "Jane Smith",
  email: "janesmith@example.com"
})
```

**Example — promote to admin:**
```js
body: JSON.stringify({
  role: "ADMIN"
})
```

**Success `201`:** No body returned.

**Errors:**
| Status | Cause |
|--------|-------|
| `404` | Account not found |
| `401` | Not authenticated |
| `403` | Role insufficient (need STAFF+) |

---

### `DELETE /accounts/{id}` — Delete Account

**Requires `ADMIN` role.**

> Warning: This permanently deletes the account. The linked user record (if any) is NOT automatically deleted — delete it separately if needed.

**Example request:**
```js
fetch(`/accounts/${acctId}`, {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
  }
})
```

**Success `204`:** No body returned.

**Errors:**
| Status | Cause |
|--------|-------|
| `404` | Account not found |
| `401` | Not authenticated |
| `403` | Role insufficient (need ADMIN) |

---

### `GET /users` — List All Users

**No auth required**, but good practice to include it anyway.

**Query parameters:** same pagination/search/sort/select params as `/accounts`.

**Example request:**
```js
fetch("/users?page=1&pageSize=20", {
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
  }
})
```

**Example response `200`:**
```json
{
  "data": [
    {
      "userId": 42,
      "firstName": "Jane",
      "lastName": "Doe",
      "email": "jane@example.com",
      "phoneNumber": "555-1234",
      "dateCreated": "2025-11-01T14:30:00Z",
      "address": {
        "buildingNumber": "123",
        "streetName": "Main St",
        "city": "Chicago",
        "state": "IL",
        "zipCode": "60601"
      },
      "driversLicense": {
        "driversLicense": "D1234567",
        "state": "IL",
        "expirationDate": 1893456000,
        "dateOfBirth": 725846400
      },
      "reservations": [10, 11],
      "reviews": [3]
    }
  ],
  "currentPage": 1,
  "totalPages": 3,
  "totalItems": 42
}
```

---

### `GET /users/{id}` — Get Single User

**Example request:**
```js
fetch(`/users/${userId}`, {
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
  }
})
```

**Example response `200`:**
```json
{
  "userId": 42,
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phoneNumber": "555-1234",
  "dateCreated": "2025-11-01T14:30:00Z",
  "address": {
    "buildingNumber": "123",
    "streetName": "Main St",
    "city": "Chicago",
    "state": "IL",
    "zipCode": "60601"
  },
  "driversLicense": {
    "driversLicense": "D1234567",
    "state": "IL",
    "expirationDate": 1893456000,
    "dateOfBirth": 725846400
  },
  "reservations": [10, 11],
  "reviews": [3]
}
```

---

### `PATCH /users/{id}` — Update User

Performs a **shallow merge**. Send only the fields you want to change.

**Requires `STAFF` or `ADMIN` role.**

> **Important:** `address` and `driversLicense` are nested objects. Because the merge is shallow, if you send either of these fields you must include **all** sub-fields — partial nested updates are not supported. Omit the field entirely if you don't want to change it.

**Editable fields:**

| Field | Type |
|-------|------|
| `firstName` | string |
| `lastName` | string |
| `email` | string |
| `phoneNumber` | string |
| `address` | full Address object (all sub-fields required) |
| `driversLicense` | full DriversLicense object (all sub-fields required) |

**Example — update name and phone:**
```js
fetch(`/users/${userId}`, {
  method: "PATCH",
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    firstName: "Janet",
    phoneNumber: "555-9999"
  })
})
```

**Example — update full address:**
```js
body: JSON.stringify({
  address: {
    buildingNumber: "456",
    streetName: "Oak Ave",
    city: "Springfield",
    state: "IL",
    zipCode: "62701"
  }
})
```

**Example — update driver's license:**
```js
body: JSON.stringify({
  driversLicense: {
    driversLicense: "D9876543",
    state: "IL",
    expirationDate: 1956528000,
    dateOfBirth: 725846400
  }
})
```

**Success `201`:** No body returned.

**Errors:**
| Status | Cause |
|--------|-------|
| `404` | User not found |
| `401` | Not authenticated |
| `403` | Role insufficient (need STAFF+) |

---

### `DELETE /users/{id}` — Delete User

**Requires `ADMIN` role.**

> Warning: Deleting a user does not automatically delete the linked account. If you want to fully remove someone, delete both the account (`DELETE /accounts/{id}`) and the user (`DELETE /users/{id}`).

**Example request:**
```js
fetch(`/users/${userId}`, {
  method: "DELETE",
  headers: {
    "Authorization": `Bearer ${sessionToken}`,
    "X-API-Key": API_KEY,
  }
})
```

**Success `204`:** No body returned.

**Errors:**
| Status | Cause |
|--------|-------|
| `404` | User not found |
| `401` | Not authenticated |
| `403` | Role insufficient (need ADMIN) |

---

## Common Patterns

### Loading an account with its full user details

The account's `user` field returns only the `userId` by default. Fetch the user separately:

```js
async function getAccountWithUser(acctId) {
  const acct = await fetch(`/accounts/${acctId}`, { headers }).then(r => r.json());

  if (acct.user) {
    const user = await fetch(`/users/${acct.user}`, { headers }).then(r => r.json());
    return { ...acct, userDetails: user };
  }

  return { ...acct, userDetails: null };
}
```

### Changing a user's role (full admin edit form)

```js
async function updateAccountRole(acctId, newRole) {
  const res = await fetch(`/accounts/${acctId}`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${sessionToken}`,
      "X-API-Key": API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role: newRole }),
  });

  if (!res.ok) throw new Error(`Failed to update role: ${res.status}`);
}
```

### Fully deleting an account + user

```js
async function deleteAccountAndUser(acctId, userId) {
  // Delete account first (it holds the FK to user)
  await fetch(`/accounts/${acctId}`, {
    method: "DELETE",
    headers: { "Authorization": `Bearer ${sessionToken}`, "X-API-Key": API_KEY },
  });

  // Then delete the user record if one exists
  if (userId) {
    await fetch(`/users/${userId}`, {
      method: "DELETE",
      headers: { "Authorization": `Bearer ${sessionToken}`, "X-API-Key": API_KEY },
    });
  }
}
```

### Converting Unix timestamps (driversLicense dates)

`expirationDate` and `dateOfBirth` on `driversLicense` are **Unix epoch seconds**:

```js
// Display
const expiry = new Date(user.driversLicense.expirationDate * 1000).toLocaleDateString();

// Convert a date string to epoch seconds for PATCH body
const epochSeconds = Math.floor(new Date("2031-06-15").getTime() / 1000);
```

---

## Error Response Shape

All error responses return JSON in this format:

```json
{
  "status": 403,
  "message": "Forbidden"
}
```

Handle errors by checking `response.ok` or the status code before reading the body.
