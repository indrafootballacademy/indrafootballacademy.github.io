# 🚀 Deployment Guide — Indra Football Academy

> Push to GitHub + Deploy on Netlify in 10 minutes

---

## Prerequisites

Make sure you have:
- [x] A GitHub account ([sign up free](https://github.com/signup))
- [x] Git installed on your Mac (check: `git --version` in Terminal)
- [x] A Netlify account ([sign up free](https://app.netlify.com/signup))

If Git is not installed:
```bash
# Install via Homebrew
brew install git

# Or download from: https://git-scm.com/download/mac
```

---

## Step 1: Create a GitHub Repository

1. Go to **[github.com/new](https://github.com/new)**
2. Fill in:
   - **Repository name:** `indra-football-academy`
   - **Description:** `Indra Football Academy - Football coaching website`
   - **Visibility:** ✅ Public
   - ❌ Do NOT check "Add a README" (you already have one)
   - ❌ Do NOT check "Add .gitignore" (you already have one)
3. Click **"Create repository"**
4. Keep this page open — you'll need the URL shown

---

## Step 2: Push Code to GitHub

Open **Terminal** on your Mac (Cmd + Space → type "Terminal" → Enter):

```bash
# 1. Navigate to your project
cd /Users/amitxp/Documents/football-coaching-website

# 2. Initialize Git repository
git init

# 3. Add all files to staging
git add .

# 4. Create your first commit
git commit -m "Initial commit - Indra Football Academy website"

# 5. Rename branch to 'main'
git branch -M main

# 6. Connect to GitHub (replace YOUR-USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/indra-football-academy.git

# 7. Push to GitHub
git push -u origin main
```

### If asked for authentication:

**Option A: Use GitHub CLI (easiest)**
```bash
# Install GitHub CLI
brew install gh

# Login (follow the prompts)
gh auth login
# Choose: GitHub.com → HTTPS → Login with a web browser

# Then retry:
git push -u origin main
```

**Option B: Personal Access Token**
1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token (classic)"**
3. Check the `repo` scope
4. Click **Generate token** → Copy it
5. When Terminal asks for password, paste the token (not your GitHub password)

---

## Step 3: Verify on GitHub

1. Go to `https://github.com/YOUR-USERNAME/indra-football-academy`
2. You should see all your files listed
3. ✅ Your code is now safely on GitHub!

---

## Step 4: Deploy on Netlify

### Method A: Connect GitHub (Recommended — auto-deploys)

1. Go to **[app.netlify.com](https://app.netlify.com)**
2. Click **"Add new site"** → **"Import an existing project"**
3. Click **GitHub** → Authorize Netlify
4. Find and select **`indra-football-academy`**
5. Settings:
   - Branch to deploy: `main`
   - Build command: *(leave empty — it's a static site)*
   - Publish directory: `.` (just a dot)
6. Click **"Deploy site"**
7. Wait ~30 seconds → Your site is LIVE! 🎉

### Method B: Drag & Drop (Quick one-time deploy)

1. Go to [app.netlify.com](https://app.netlify.com)
2. On the dashboard, find **"Drag and drop your site folder here"**
3. Open Finder → navigate to `/Users/amitxp/Documents/football-coaching-website`
4. Drag the **entire folder** onto the Netlify drop zone
5. ✅ Site is live in seconds!

---

## Step 5: Set Your Custom Site Name

1. In Netlify, go to **Site configuration** → **Domain management**
2. Click **"Change site name"**
3. Enter: `indrafa`
4. Click **Save**

Your site is now live at: **https://indrafa.netlify.app** 🏆

---

## Step 6: Add Domain to Firebase Authorized Domains

This is critical for Google sign-in to work:

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: **indra-football-academy**
3. Left sidebar → **Authentication** → **Settings** tab
4. Under "Authorized domains", click **"Add domain"**
5. Add: `indrafa.netlify.app`
6. Click **Add**

✅ Google/Microsoft sign-in will now work on your deployed site!

---

## Future Updates (Push Changes)

Whenever you make changes to your website:

```bash
cd /Users/amitxp/Documents/football-coaching-website

# See what changed
git status

# Add all changes
git add .

# Commit with a description
git commit -m "Updated gallery photos"

# Push to GitHub (Netlify auto-deploys!)
git push
```

That's it — Netlify detects the push and redeploys automatically in ~30 seconds.

---

## Troubleshooting

| Issue | Fix |
|---|---|
| `git: command not found` | Install Git: `brew install git` |
| `Permission denied` | Run: `gh auth login` or use Personal Access Token |
| `remote already exists` | Run: `git remote remove origin` then re-add |
| Site shows 404 | Check Publish directory is `.` (not `dist` or `build`) |
| Google sign-in not working | Add your Netlify domain to Firebase Authorized Domains |
| Images not loading | Make sure paths are relative (e.g., `assets/images/hero-1.jpg`) |

---

## Summary

```
Your Computer                    GitHub                      Netlify
     │                              │                           │
     │── git push ─────────────────►│                           │
     │                              │── auto-detects push ─────►│
     │                              │                           │── deploys in 30s
     │                              │                           │
     │                              │                    https://indrafa.netlify.app
```

**Total cost: $0** | **Deploy time: ~10 minutes first time, 30 seconds for updates**

---

> Document created: June 2026
> Project: Indra Football Academy (IFA)
> Domain: indrafa.netlify.app
