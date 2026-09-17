# PulseBoard API

Express/MongoDB backend for PulseBoard.

## Setup

```bash
npm install
```

Create `.env` from `.env.example`, then run:

```bash
npm run dev
```

The API listens on `PORT` and uses `CLIENT_URL` for credentialed CORS.

## Data

Users own Projects. Project queries are always scoped through the authenticated user's owner id.
