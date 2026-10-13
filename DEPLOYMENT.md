# Deployment Guide for Bytexl Task 2

This repository is configured with automated **GitHub Actions CI/CD workflows** for deploying the frontend to **GitHub Pages**, validating the full stack, and building Docker images for the backend.

---

## 1. Automated GitHub Actions Workflows

We have configured 3 GitHub Actions workflows in `.github/workflows/`:

| Workflow File | Purpose | Trigger |
| :--- | :--- | :--- |
| [`.github/workflows/deploy-frontend.yml`](.github/workflows/deploy-frontend.yml) | Builds Vite React and deploys to **GitHub Pages** | Push to `main` (changes in `frontend2/`) or Manual Run |
| [`.github/workflows/ci.yml`](.github/workflows/ci.yml) | Lints & builds frontend, validates backend syntax | Push & Pull Request on `main` |
| [`.github/workflows/deploy-backend.yml`](.github/workflows/deploy-backend.yml) | Builds & publishes Docker container to GitHub Container Registry (`ghcr.io`) + triggers deploy hook | Push to `main` (changes in `backend2/`) or Manual Run |

---

## 2. Deploy Frontend to GitHub Pages

### Step 1: Enable GitHub Pages in your Repository Settings
1. Go to your repository on GitHub: `https://github.com/BLaZeXr-In/Bytexl_task2`
2. Click **Settings** (top tab) -> **Pages** (left sidebar).
3. Under **Build and deployment**:
   - **Source**: Select **GitHub Actions** (do NOT select "Deploy from a branch").
4. That's it! Any push to `main` will automatically build and publish your frontend.

### Step 2: Configure the Backend URL for Production (Optional but Recommended)
By default, the frontend points to `http://localhost:5000` for local development. When your backend is hosted online, point the frontend to it:
1. Go to **Settings** -> **Secrets and variables** -> **Actions**.
2. Under **Repository secrets** (or **Variables**), click **New repository secret**:
   - Name: `VITE_API_BASE_URL`
   - Value: `https://your-backend-domain.com` (e.g. `https://bytexl-backend.onrender.com`)
3. Rerun the **Deploy Frontend to GitHub Pages** workflow under the **Actions** tab.

Your site will be live at:
```
https://blazexr-in.github.io/Bytexl_task2/
```

---

## 3. Deploying the Backend (Node.js + Express + MySQL)

Because GitHub Pages only hosts static frontend files, your Node.js + MySQL backend should be hosted on a cloud platform (e.g., Render, Railway, Fly.io, or VPS).

### Option A: Free Hosting with Render.com (Recommended)

#### 1. Free Cloud MySQL Database:
1. Create a free MySQL database on **Aiven** ([aiven.io](https://aiven.io)) or **TiDB Cloud** ([tidbcloud.com](https://tidbcloud.com)) or **Clever Cloud**.
2. Note down your connection credentials (`Host`, `Port`, `User`, `Password`, `Database Name`).
3. Import the table schema using [backend2/schema.sql](backend2/schema.sql) (or the server will auto-create the table on initial connection).

#### 2. Deploy Web Service on Render:
1. Log in to [Render.com](https://render.com) with GitHub.
2. Click **New +** -> **Web Service**.
3. Connect your repository: `BLaZeXr-In/Bytexl_task2`.
4. Configure the settings:
   - **Root Directory**: `backend2`
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
5. Add Environment Variables:
   - `PORT`: `5000`
   - `DB_HOST`: `<your-mysql-host>`
   - `DB_PORT`: `3306`
   - `DB_USER`: `<your-mysql-user>`
   - `DB_PASSWORD`: `<your-mysql-password>`
   - `DB_NAME`: `studentdb2`
   - `DB_SSL`: `true` (if using cloud DB with SSL like Aiven/TiDB)
   - `CLIENT_URL`: `https://blazexr-in.github.io`
6. Click **Deploy Web Service**.
7. Copy your Render service URL (e.g., `https://bytexl-backend.onrender.com`) and set it as `VITE_API_BASE_URL` in your GitHub repository secrets!

---

## 4. All-in-One Cloud Deployment on Railway.app (Frontend + Backend + Private Database)

Railway allows you to run MySQL and the App together in the same project without managing cloud database networking:
1. Go to [railway.app](https://railway.app) and log in with GitHub.
2. Click **New Project** -> **Provision MySQL**.
3. In the same project, click **+ New** -> **GitHub Repo** -> select `Bytexl_task2`.
4. Railway will automatically detect the root `Dockerfile` (which builds both React frontend and Node backend).
5. Add the database environment variables in the App service settings by referencing the MySQL plugin:
   - `DB_HOST`: `${{MySQL.MYSQLHOST}}`
   - `DB_PORT`: `${{MySQL.MYSQLPORT}}`
   - `DB_USER`: `${{MySQL.MYSQLUSER}}`
   - `DB_PASSWORD`: `${{MySQL.MYSQLPASSWORD}}`
   - `DB_NAME`: `${{MySQL.MYSQLDATABASE}}`
6. Click **Generate Domain** under **Networking**.
7. Your full-stack app is instantly live with a public HTTPS URL accessible from anywhere in the world!

---

## 5. Instant Global Access for Local Container (Cloudflare Tunnel / Localtunnel)

If you run the app and MySQL in Docker on your machine and want to make it **accessible from anywhere in the world** with a live public HTTPS URL immediately without paying for any cloud hosting:

1. Start the stack locally:
   ```bash
   docker compose up --build -d
   ```
2. Expose port `5000` to the internet instantly using one of these free tools:

   **Using Free Cloudflare Tunnel (No account required):**
   ```bash
   cloudflared tunnel --url http://localhost:5000
   ```

   **OR Using Pinggy (Zero installation, works on any terminal):**
   ```bash
   ssh -p 443 -R0:localhost:5000 a.pinggy.io
   ```

   **OR Using Localtunnel:**
   ```bash
   npx localtunnel --port 5000
   ```

3. You will immediately get a live public HTTPS URL (e.g., `https://xyz.trycloudflare.com` or `https://xyz.a.pinggy.link`).
4. Anyone in the world on mobile or desktop can access the full React UI and submit data to the container's MySQL database!

---

## 6. Docker Compose Stack Details

```bash
docker compose up --build -d
```
- App container (React + Express) listens on `http://localhost:5000`.
- MySQL runs on port `3306` with volume persistence (`mysql_data`).
- Automatically initializes table via [backend2/schema.sql](backend2/schema.sql).
- To stop the containers: `docker compose down`.
