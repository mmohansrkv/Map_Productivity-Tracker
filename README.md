# Map Productivity Tracker

A single-file web app for logging daily employee productivity — no server required. Runs entirely in the browser and optionally syncs to a Google Sheet.

**Live app:** `https://<your-username>.github.io/Map_Productivity-Tracker/` (once GitHub Pages is enabled — see below)

## What it does

- **Admin login** — manage Employees (ID, Name, Band, Email, Password), manage Processes (Name, Target hours, Target 100%, Target count/hour), and view/delete every employee's productivity log.
- **Employee login** — sign in with the email/password an admin set up, log a daily entry (date, process rows with hours/count, notes with hours), see a live Productive / Non-productive / Total-vs-8h breakdown, and view/edit/delete today's submissions.
- **Google Sheet sync** — pushes employees, processes, and log entries to a connected Google Sheet via a small Apps Script Web app (see `SheetSync-AppsScript.gs`).
- **JSON export** — Admin → Sync → Export data (JSON) downloads a full backup.

## Files

| File | Purpose |
|---|---|
| `index.html` | The whole app (HTML/CSS/JS, no build step, no dependencies) |
| `SheetSync-AppsScript.gs` | Paste into your Google Sheet's Apps Script editor to receive synced data |

## Setup

### 1. Host the app
Pick one:

**Option A — GitHub Pages (simplest, free, no config)**
1. Repo **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)`
3. Save, wait a minute, then use the URL shown there.

**Option B — Render**
1. On Render: **New → Static Site** (not "Web Service" — that expects a Dockerfile, which this repo doesn't have and will fail to build)
2. Connect this repo
3. Build Command: leave blank
4. Publish Directory: `.` if `index.html` is at the repo root (or the subfolder name if it's nested)
5. Create — Render gives you a URL like `https://map-productivity-tracker.onrender.com`

Either way, open the live URL directly — don't rely on a chat-hosted preview link, since those sandbox outbound network requests and Sheet sync won't work from them.

### 2. Connect Google Sheets
1. Open your target Google Sheet → **Extensions → Apps Script**
2. Paste in the contents of `SheetSync-AppsScript.gs`, updating `SPREADSHEET_ID` at the top if needed
3. **Deploy → New deployment → Web app**, "Execute as: Me", "Who has access: Anyone", deploy, authorize
4. Copy the `/exec` URL it gives you
5. In the app: **Admin → Sync**, paste the URL, **Save URL**, then **Push all data now**

The script creates/updates three tabs: `Employees`, `Processes`, `ProductivityLog`.

## Default admin login

- Username: `admin`
- Password: `admin123`

Change this after first login by editing the seeded admin (or asking to add an admin-password-change feature).

## Where is the data actually stored?

Everything — Employees, Processes, every submitted productivity log, current login session, and any unsaved draft entry — is saved in the browser's `localStorage`, tied to **one browser on one device**. There is no server-side database by default. Concretely:

- Open the app in a different browser, device, or incognito window and you'll see none of the existing data — it starts empty there.
- Clearing that browser's site data / cache deletes it, with no automatic backup.
- Two employees on two different laptops each have their own separate local copy and don't see each other's entries inside the app itself.

This is exactly what Google Sheet sync and the JSON export are for — they're the two ways to get data out of one browser and into something shared and durable. Once sync is set up, treat the **Google Sheet as the real shared record**, not any single browser's local copy.

## Known limitations

- **Storage is per-browser** (see above) — no shared database out of the box.
- **No real authentication.** Passwords are stored in plain text in the browser; this is a lightweight internal tool, not a security-hardened login system.
- **Sync is one-way and best-effort.** The app pushes to the sheet; it doesn't read back from it.

## License

Internal tool — no license specified.
