# Quick Start Guide

Get the Audit Embed App running in 3 steps:

## Step 1: Create Environment File

Create a file named `.env.local` in this directory with:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Run the App

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

## Testing

### Direct Browser Access

Open in browser with required parameters:
```
http://localhost:3000?tenant=myorg&table=audits
```

### Test in Iframe

Open `test-iframe.html` in your browser to see the app embedded as an iframe.

## Requirements

- Node.js 18+ 
- Backend API running on port 8080
- Valid tenant and table name in ClickHouse

## Example Usage

```
http://localhost:3000?tenant=myorg&table=audits&limit=50
```

Replace `myorg` with your actual tenant name.

## Need Help?

See the full [README.md](./README.md) for detailed documentation.

