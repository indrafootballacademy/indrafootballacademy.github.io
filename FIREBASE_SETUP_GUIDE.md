# 🔥 Firebase Setup Guide — ProStrike Football Academy

> **Time needed:** 5–10 minutes  
> **Cost:** FREE (Firebase free tier)  
> **What you'll get:** Working Google + Microsoft sign-in on your website

---

## Step 1: Create a Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com)**
2. Click **"Create a project"** (or "Add project")
3. Enter project name: `prostrike-academy`
4. Click **Continue**
5. Google Analytics → toggle OFF (not needed for auth) → **Create project**
6. Wait ~30 seconds → Click **Continue** when ready

---

## Step 2: Register Your Web App

1. On the Firebase project dashboard, click the **Web icon** (`</>`) to add a web app
2. Enter app nickname: `ProStrike Website`
3. ❌ Do NOT check "Firebase Hosting" (we're using Netlify)
4. Click **"Register app"**
5. You'll see a config object like this — **COPY IT**:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyB.....................",
    authDomain: "prostrike-academy.firebaseapp.com",
    projectId: "prostrike-academy",
    storageBucket: "prostrike-academy.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abc123def456"
};
```

6. Click **"Continue to console"**

---

## Step 3: Paste Config in Your Code

1. Open `js/firebase-config.js` in VS Code
2. Find this section (around line 30):

```javascript
const firebaseConfig = {
    apiKey: "YOUR_API_KEY_HERE",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    ...
};
```

3. **Replace** the placeholder values with your real config from Step 2
4. Save the file

---

## Step 4: Enable Google Authentication

1. In Firebase Console → left sidebar → **Authentication**
2. Click **"Get started"**
3. Go to **"Sign-in method"** tab
4. Click **Google** → Toggle **Enable** → 
5. Set "Project support email" = your email
6. Click **Save**

✅ Google sign-in is now active!

---

## Step 5: Enable Microsoft/Outlook Authentication

1. Still in Authentication → Sign-in method tab
2. Click **Microsoft** → Toggle **Enable**
3. You need an **Azure App Registration** (free):

### Azure Setup (one-time, ~3 minutes):
1. Go to [Azure Portal](https://portal.azure.com)
2. Search for "App registrations" → Click **"New registration"**
3. Name: `ProStrike Website`
4. Supported account types: **"Accounts in any organizational directory and personal Microsoft accounts"**
5. Redirect URI: Select **Web** → Enter: `https://prostrike-academy.firebaseapp.com/__/auth/handler`
6. Click **Register**
7. Copy the **Application (client) ID** → paste in Firebase Microsoft config
8. Go to **Certificates & secrets** → **New client secret** → Copy the **Value** → paste in Firebase

4. Back in Firebase, paste both values → Click **Save**

✅ Microsoft sign-in is now active!

---

## Step 6: Add Your Domain to Authorized Domains

1. In Firebase → Authentication → **Settings** tab
2. Under "Authorized domains", click **Add domain**
3. Add your domain (e.g., `www.prostrike-academy.com`)
4. Also add `localhost` for local testing

---

## Step 7: Enable Firestore Database

1. Left sidebar → **Firestore Database**
2. Click **"Create database"**
3. Select **"Start in production mode"** → Click **Next**
4. Choose a location (nearest to your users) → Click **Enable**
5. Go to **Rules** tab → paste these rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /programs/{programId} {
      allow read: if true;
      allow write: if false;
    }
    match /registrations/{regId} {
      allow create: if request.auth != null;
      allow read: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```
6. Click **Publish**

---

## Step 8: Re-enable Firebase in Your Pages

Add this line back to `signin.html` and `register.html` (before the closing `</body>` tag):

```html
<script type="module" src="../js/firebase-config.js"></script>
```

**Important:** This only works when served via HTTP (Live Server, Netlify). It won't work opening the file directly in a browser.

---

## Step 9: Test It!

1. Open your project in VS Code
2. Right-click `index.html` → **"Open with Live Server"**
3. Click **"Sign In"** → **"Continue with Google"**
4. The real Google popup should appear!
5. Sign in with your Google account
6. ✅ You're authenticated!

---

## Troubleshooting

| Issue | Fix |
|---|---|
| "auth/popup-blocked" | Allow popups for localhost in browser settings |
| "auth/unauthorized-domain" | Add your domain in Firebase → Auth → Settings → Authorized domains |
| "Firebase not defined" | Make sure you're using Live Server (not file:// protocol) |
| Google popup doesn't appear | Check browser popup blocker, try incognito mode |

---

## Summary of What's FREE

| Service | Free Limit |
|---|---|
| Firebase Authentication | Unlimited users (Google/Microsoft) |
| Firestore Database | 1GB storage, 50K reads/day |
| Firebase Storage | 5GB |
| Firebase Hosting (optional) | 10GB, 360MB/day bandwidth |

**Total cost: $0/month** for a typical football academy website.

---

> Once configured, the `signInWithGoogle()` and `signInWithMicrosoft()` functions in `firebase-config.js` will automatically handle the real OAuth flow. No more placeholder alerts!
