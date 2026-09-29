# Deployment Guide

Backend to **Render**, frontend to **Vercel**. Follow in this order — the
frontend needs the backend URL, and the backend needs the frontend URL for CORS.

---

## 1. Push to GitHub

Both hosting services build from a Git repository.

```bash
git init
git add .
git commit -m "SRS: full-stack app with demo data"
git branch -M main
git remote add origin https://github.com/<you>/<repo>.git
git push -u origin main
```

`.gitignore` already excludes `node_modules/`, `dist/`, `.env` and `*.log`, so
your Atlas password and JWT secrets will not be committed. Verify before pushing:

```bash
git check-ignore -v srs-backend/.env
```

---

## 2. Backend → Render

Go to <https://render.com> → **New** → **Blueprint** (Render reads
`render.yaml` from the repo root) or **New** → **Web Service**.

Using the blueprint:

1. Connect the repository. Render detects `render.yaml`.
2. It will prompt for the env vars marked `sync: false`. Fill in:

| Variable            | Value |
| ------------------- | ----- |
| `MONGODB_URI`       | your Atlas connection string, `/srs` database |
| `CORS_ORIGINS`      | leave for now, add your Vercel URL in step 3 |
| `CLOUDINARY_*`      | optional, only for avatar uploads |

`JWT_SECRET` and `JWT_REFRESH_SECRET` are auto-generated — but **replace them
with your own random values.** They are secrets for a real school system.

Manual configuration instead of the blueprint:

| Setting            | Value |
| ------------------ | ----- |
| Root Directory     | `srs-backend` |
| Build Command      | `npm ci && npm run build` |
| Start Command      | `npm run start:prod` |
| Health Check Path  | `/api/health` |
| Region             | Frankfurt (closest to your Atlas cluster) |

Render injects `PORT` automatically; the app binds `0.0.0.0` to read it.

When it deploys you get a URL like `https://srs-backend-xxxx.onrender.com`.
Verify it:

```
https://srs-backend-xxxx.onrender.com/api/health
-> {"status":"ok","service":"srs-backend","database":"connected",...}
```

`database: connected` matters. If it says `degraded`, Atlas is unreachable —
check the IP access list, not the code.

---

## 3. Frontend → Vercel

Go to <https://vercel.com> → **Add New** → **Project** → import the repo.

Vercel reads `srs-frontend/vercel.json`, so:

| Setting           | Value                 |
| ----------------- | --------------------- |
| Root Directory    | `srs-frontend`        |
| Framework Preset  | Vite (auto-detected) |
| Build Command     | `npm run build`       |
| Output Directory  | `dist`                |

Then **Settings → Environment Variables** and add:

| Name            | Value |
| --------------- | ----- |
| `VITE_API_URL`  | `https://srs-backend-xxxx.onrender.com/api` |

Deploy. You get `https://srs-frontend-xxxx.vercel.app`.

The `rewrites` rule in `vercel.json` sends unknown paths to `index.html`, so
deep links like `/student/results` work on refresh instead of 404ing.

---

## 4. Close the CORS loop

Now that you have the Vercel URL, go back to Render and set:

```
CORS_ORIGINS=https://srs-frontend-xxxx.vercel.app
```

Multiple origins are comma separated. Save, and Render redeploys. Add your
custom domain too if you use one.

**Order matters.** Without this the frontend loads but every API call is blocked
by the browser, which looks like a broken app rather than a CORS problem.

---

## 5. Check it

1. Open the Vercel URL. The landing page should load with the dark theme.
2. Click **Director** in the demo panel. You should land on `/admin` with real
   counts (12 teachers, 113 students).
3. Log out, try **Teacher** and **Student**.
4. Open browser DevTools → Network. Requests should go to
   `srs-backend-xxxx.onrender.com/api/...` with status 200.
5. Refresh on `/student/results` — this is the test that `vercel.json`
   rewrites are working.

---

## Two things that will bite you

**Render's free plan sleeps and has an ephemeral filesystem.** Requests to a
sleeping instance take 30-50 seconds to wake, and uploaded files in `uploads/`
are wiped on every deploy or restart. For a demo that is fine. For real use,
upgrade to `starter` (no cold starts) and move file storage to Cloudinary, which
is already wired up in `files/cloudinary.service.ts` — it just needs credentials.

**Atlas must allow Render's outbound IPs.** Your machine's IP is on the access
list now; Render's are not, because they are dynamic. Set the Atlas network
access list to `0.0.0.0/0` (allow from anywhere) to get the demo running, or
use Atlas's "Render" provider preset if you prefer to lock it down. Tighten this
before the system handles real student data.

---

## Troubleshooting

| Symptom | Cause |
| ------- | ----- |
| Backend deploys, frontend calls fail, console says CORS | `CORS_ORIGINS` missing or misspelled |
| `database: degraded` on `/api/health` | Atlas network access list, or wrong `MONGODB_URI` |
| Frontend loads but all data empty | `VITE_API_URL` wrong, or missing the trailing `/api` |
| Deep link refresh 404s | `vercel.json` rewrites not applied — check Root Directory |
| First request very slow | Render free plan cold start |
| Login works locally, fails deployed | `MONGODB_URI` on Render is missing the `/srs` database name |

---

## Rolling back a bad deploy

Render keeps every previous build. **Dashboard → srs-backend → Events** and
redeploy a working build. Vercel: **Deployments** → pick a previous one →
**Promote to Production**. Neither requires a rebuild.
