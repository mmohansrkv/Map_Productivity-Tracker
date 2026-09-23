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
This repo is set up for GitHub Pages:
1. Repo **Settings → Pages**
2. Source: **Deploy from a branch** → Branch: `main`, folder `/ (root)`
3. Save, wait a minute, then use the URL shown there.

Open that URL directly — don't rely on a chat-hosted preview link, since those sandbox outbound network requests and Sheet sync won't work from them.

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

## Known limitations

- **Storage is per-browser.** Data lives in each visitor's `localStorage`, not a shared database. Different employees on different devices won't automatically see each other's entries in the app itself — the Google Sheet is the shared source of truth once sync is set up.
- **No real authentication.** Passwords are stored in plain text in the browser; this is a lightweight internal tool, not a security-hardened login system.
- **Sync is one-way and best-effort.** The app pushes to the sheet; it doesn't read back from it.

## License

Internal tool — no license specified.
