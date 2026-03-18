# Wednesday Darts League Production Starter

This is a real Next.js starter that deploys on Vercel.

## Run locally

```bash
npm install
npm run dev
```

## Required environment variables

Copy `.env.example` to `.env.local` and add:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Deploy

Push to GitHub and import the repo into Vercel.

## Supabase

Run `supabase/schema.sql` in the Supabase SQL Editor.

## Notes

- This package includes a valid `app` directory so Vercel can build it.
- Public pages are ready.
- Admin page is a starter and should be wired to live Supabase auth/data next.
