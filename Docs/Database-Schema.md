# Kruder 1 -- Database Schema

## Overview

Kruder 1 uses a Supabase-hosted PostgreSQL database (v14.1) as its persistent data store. The database manages user accounts, credit balances, device tracking, purchase records, and authentication tokens for the AI photo booth platform. All data access is mediated through Cloudflare Workers using a service_role key -- neither the desktop application nor the website ever connect to Supabase directly.

---

## Tables

### `accounts`

Central user account table. Each registered user has one row. Stores credentials, email verification status, and the current credit balance.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | **Primary Key.** Unique account identifier. |
| `email` | `text` | NOT NULL | -- | User email address. Used for login and communication. |
| `password_hash` | `text` | NOT NULL | -- | PBKDF2-SHA256 password hash. |
| `email_verified` | `boolean` | NOT NULL | `false` | Whether the user has verified their email address. |
| `credits` | `integer` | NOT NULL | `0` | Current credit balance. 1 credit = 1 AI-generated image. |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Account creation timestamp. |
| `updated_at` | `timestamptz` | NOT NULL | `now()` | Last account modification timestamp. |

---

### `account_devices`

Tracks hardware devices (HWIDs) associated with each account. Used to identify which physical machines a user has logged in from.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `account_id` | `uuid` | NOT NULL | -- | **Primary Key (composite).** Foreign key to `accounts.id`. |
| `hwid` | `text` | NOT NULL | -- | **Primary Key (composite).** Hardware identifier string of the device. |
| `first_seen_at` | `timestamptz` | NOT NULL | `now()` | Timestamp when this device was first used with this account. |
| `last_seen_at` | `timestamptz` | NOT NULL | `now()` | Timestamp of the most recent login from this device. |

**Foreign Keys:** `account_id` references `accounts(id)`.

---

### `purchases`

Records every credit purchase made through Stripe. One row per completed payment.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | **Primary Key.** Unique purchase identifier. |
| `account_id` | `uuid` | NOT NULL | -- | Foreign key to `accounts.id`. The buyer. |
| `credits_added` | `integer` | NOT NULL | -- | Number of credits added by this purchase (e.g., 150, 300, 600). |
| `stripe_payment_id` | `text` | nullable | -- | Stripe Payment Intent or Checkout Session ID. Null for non-Stripe credits (e.g., demo). |
| `created_at` | `timestamptz` | NOT NULL | `now()` | Purchase timestamp. |
| `amount_paid` | `integer` | NOT NULL | `0` | Amount paid in smallest currency unit (e.g., cents). |
| `currency` | `text` | NOT NULL | `'usd'` | ISO 4217 currency code. |

**Foreign Keys:** `account_id` references `accounts(id)`.

---

### `verification_tokens`

Stores email verification tokens. Created when a user registers and needs to confirm their email address.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | **Primary Key.** Unique token record identifier. |
| `account_id` | `uuid` | NOT NULL | -- | Foreign key to `accounts.id`. The account being verified. |
| `token` | `text` | NOT NULL | -- | The verification token value (sent via email link). |
| `expires_at` | `timestamptz` | NOT NULL | -- | Token expiration timestamp. Token is invalid after this time. |

**Foreign Keys:** `account_id` references `accounts(id)`.

---

### `password_reset_tokens`

Stores hashed password reset tokens. Created when a user requests a password reset.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `id` | `uuid` | NOT NULL | `gen_random_uuid()` | **Primary Key.** Unique token record identifier. |
| `account_id` | `uuid` | NOT NULL | -- | Foreign key to `accounts.id`. The account requesting reset. |
| `token_hash` | `text` | NOT NULL | -- | Hashed reset token. The raw token is sent via email; only the hash is stored. |
| `expires_at` | `timestamptz` | NOT NULL | -- | Token expiration timestamp. Token is invalid after this time. |

**Foreign Keys:** `account_id` references `accounts(id)`.

---

### `hwid_demo_claimed`

Tracks which hardware IDs have already claimed the free demo credits (10 credits per unique HWID). Prevents the same physical machine from claiming demo credits more than once.

| Column | Type | Nullable | Default | Description |
|---|---|---|---|---|
| `hwid` | `text` | NOT NULL | -- | **Primary Key.** Hardware identifier string of the device that claimed. |
| `account_id` | `uuid` | NOT NULL | -- | Foreign key to `accounts.id`. The account that received the demo credits. |
| `claimed_at` | `timestamptz` | NOT NULL | `now()` | Timestamp when demo credits were claimed. |

**Foreign Keys:** `account_id` references `accounts(id)`.

---

## RPC Functions

All three RPC functions operate atomically on the `accounts.credits` column to prevent race conditions and ensure credit balance integrity.

### `deduct_credit(p_account_id UUID)`

Atomically deducts 1 credit from the specified account. Called by the generation worker each time an AI image is requested.

- **Parameter:** `p_account_id` (UUID) -- the account to deduct from.
- **Returns:** The new credit balance (integer) after deduction.
- **Error:** Raises a PostgreSQL exception if the account has insufficient credits (balance < 1). The calling worker catches this to return an error to the client.

### `refund_credit(p_account_id UUID)`

Atomically adds 1 credit back to the specified account. Used when an AI generation fails (e.g., Segmind API error, timeout) so the user is not charged for a failed attempt.

- **Parameter:** `p_account_id` (UUID) -- the account to refund.
- **Returns:** The new credit balance (integer) after refund.

### `add_credits(p_account_id UUID, p_credits INT)`

Atomically adds N credits to the specified account. Used in two scenarios: (1) by the Stripe webhook handler after a successful payment, and (2) when granting the 10 free demo credits on first login from a new HWID.

- **Parameters:**
  - `p_account_id` (UUID) -- the account to credit.
  - `p_credits` (integer) -- the number of credits to add.
- **Returns:** The new credit balance (integer) after addition.

---

## RLS Policies

Row Level Security (RLS) is enabled on all 6 tables. The policy configuration enforces a strict zero-trust model for the public-facing Supabase API:

- **All tables block `anon` role** for INSERT, UPDATE, and DELETE operations.
- **All tables block `anon` role** for SELECT (queries return empty result sets).
- **`service_role` bypasses RLS entirely.** This is the role used by the Cloudflare Workers, which hold the service_role key in their environment variables.

This means that even if someone obtains the public anon API key (which is embedded in Supabase client URLs by design), they cannot read, write, or modify any data. All meaningful database operations must go through the Workers.

---

## RPC Permissions

All 3 RPC functions (`deduct_credit`, `refund_credit`, `add_credits`) have their execute permissions locked down:

- **REVOKED** from `anon` role.
- **REVOKED** from `authenticated` role.
- **REVOKED** from `public` role.
- **GRANTED** only to `service_role`.

This prevents anyone with the public anon key from calling credit-manipulation functions directly through the Supabase REST API (`/rpc/add_credits`, etc.). Only the Cloudflare Workers, authenticating as `service_role`, can invoke these functions.

---

## Access Pattern

```
Desktop App / Website
        |
        | HTTPS (JWT in Authorization header)
        v
Cloudflare Workers
  - kruder1-auth.js   (registration, login, email verification, password reset, purchases)
  - kruder1-gen.js    (AI generation, credit deduction/refund, prompt sync)
        |
        | service_role key (in Worker env vars)
        v
Supabase PostgreSQL
```

1. **Desktop app and website never talk to Supabase directly.** All requests go through the two Cloudflare Workers.
2. **Workers validate JWTs** (HS256, signed with a shared secret) on every request before performing any database operation. Desktop tokens are long-lived with HWID validation; web tokens expire after 7 days.
3. **Workers use the `service_role` key** to authenticate with Supabase, bypassing RLS and gaining full read/write access.
4. **The public anon key is never used** by any part of the system. Even if exposed, it provides zero access due to RLS policies and revoked RPC permissions.
