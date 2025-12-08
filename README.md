# Audit Embed App

A Next.js application for displaying audit logs in an embeddable iframe with a minimal table interface.

## Features

- Displays audit data in a clean, minimal table
- Embeddable as an iframe in other applications
- Fetches data from backend API with flexible filtering
- Shows 7 key audit fields: timestamp, actor, action, eventType, objectType, objectId, description
- Responsive and optimized for iframe embedding

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8081
# Set to 'true' to skip authentication during development
NEXT_PUBLIC_DEV_MODE=false
```

3. Run the development server:

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Authentication

The app integrates with the account server for authentication:

- On page load, it checks `{API_BASE_URL}/session/status` to verify if the user is logged in
- If not authenticated, it redirects to `{API_BASE_URL}/session/login?domainName=increff&loginNextUrl={currentUrl}`
- All API requests include credentials (cookies) for session management
- Session is automatically refreshed every 5 minutes

### Development Mode

To skip authentication during development, set `NEXT_PUBLIC_DEV_MODE=true` in your `.env.local` file. This allows you to test the UI without needing to authenticate.

## Usage

### Query Parameters

The application requires the following query parameters:

**Required:**
- `tenant` - Tenant name (e.g., "myorg")
- `table` - Table name (e.g., "audits")

**Optional:**
- `objectId` - Filter by primary object ID
- `objectType` - Filter by primary object type
- `actor` - Filter by actor
- `eventType` - Filter by event type
- `action` - Filter by action
- `timestampFrom` - Filter by start timestamp (ISO 8601 format)
- `timestampTo` - Filter by end timestamp (ISO 8601 format)
- `limit` - Number of records to return (default: 20)
- `offset` - Number of records to skip (default: 0)

### Example URLs

Basic usage:
```
http://localhost:3000?tenant=myorg&table=audits
```

With filters:
```
http://localhost:3000?tenant=myorg&table=audits&actor=user123&limit=50
```

With date range:
```
http://localhost:3000?tenant=myorg&table=audits&timestampFrom=2024-01-01T00:00:00Z&timestampTo=2024-12-31T23:59:59Z
```

## Embedding as Iframe

Use the following HTML to embed the audit viewer in your application:

```html
<iframe 
  src="http://localhost:3000?tenant=myorg&table=audits"
  width="100%"
  height="600"
  style="border: 1px solid #e5e7eb; border-radius: 8px;"
  title="Audit Log Viewer">
</iframe>
```

For production, replace `localhost:3000` with your deployed URL.

## API Endpoint

The app fetches data from:
```
GET {API_BASE_URL}/audit/list
```

The backend endpoint should return an array of audit objects with the following structure:

```typescript
{
  timestamp: string;
  actor: string;
  action: string;
  eventType: string;
  objectType: string;
  objectId: string;
  description: string;
}
```

## Build for Production

```bash
npm run build
npm start
```

## Technologies Used

- Next.js 14+ (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui (Table component)
- React Server Components
