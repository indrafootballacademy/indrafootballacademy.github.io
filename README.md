# ⚽ Indra Football Academy — Website

A modern, secure football coaching website built with Bootstrap 5, Firebase, and deployed on Netlify.

## 🚀 Quick Start

### Prerequisites
- [VS Code](https://code.visualstudio.com/) (code editor)
- [Node.js](https://nodejs.org/) (for Firebase CLI)
- [Git](https://git-scm.com/) (version control)

### Local Development
1. Clone or download this repository
2. Open the folder in VS Code
3. Install the "Live Server" extension
4. Right-click `index.html` → "Open with Live Server"
5. Your site opens at `http://localhost:5500`

### Firebase Setup
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project: "indrafa"
3. Enable Authentication → Google & Microsoft providers
4. Enable Firestore Database (production mode)
5. Enable Storage
6. Copy your config into `js/firebase-config.js`
7. Deploy security rules:
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init
   firebase deploy --only firestore:rules,storage
   ```

### Deploy to Netlify
1. Push code to GitHub
2. Go to [Netlify](https://app.netlify.com)
3. "New site from Git" → select your repo
4. Click Deploy — done! 🎉

## 📁 Project Structure
```
football-coaching-website/
├── index.html              ← Homepage
├── pages/
│   ├── about.html          ← About the academy
│   ├── contact.html        ← Contact form & info
│   ├── gallery.html        ← Photo gallery with filters
│   └── register.html       ← Multi-step registration
├── css/
│   ├── style.css           ← Main styles (CSS variables, components)
│   └── animations.css      ← Advanced animations & effects
├── js/
│   ├── app.js              ← Core functionality (navbar, counters, etc.)
│   └── firebase-config.js  ← Firebase auth, Firestore, storage
├── assets/
│   └── images/             ← Your photos go here
├── netlify.toml            ← Hosting config & security headers
├── firestore.rules         ← Database security rules
├── storage.rules           ← File storage security rules
└── README.md               ← This file
```

## 🔐 Security Features
- ✅ HTTPS enforced (HSTS)
- ✅ Content Security Policy (CSP)
- ✅ OAuth 2.0 authentication (no passwords stored)
- ✅ Firestore security rules (row-level access control)
- ✅ Storage rules (file type & size validation)
- ✅ XSS, clickjacking, MIME-sniffing protection
- ✅ Cloudflare WAF + DDoS protection (when configured)

## 💰 Monthly Cost
| Service | Cost |
|---|---|
| Netlify Hosting | FREE |
| Firebase Auth | FREE |
| Firestore Database | FREE (1GB, 50K reads/day) |
| Firebase Storage | FREE (5GB) |
| Cloudflare CDN + WAF | FREE |
| Domain (annual) | ~$12/year |
| **TOTAL** | **~$1/month** |

## 🎨 Tech Stack
- **Frontend**: HTML5, CSS3, Bootstrap 5.3, JavaScript ES6+
- **Animations**: AOS (Animate on Scroll), custom CSS keyframes
- **Gallery**: GLightbox, Masonry layout
- **Backend**: Firebase (Auth, Firestore, Storage, Functions)
- **Hosting**: Netlify (free tier)
- **CDN/Security**: Cloudflare (free tier)
- **Images**: Cloudinary or Firebase Storage

## 📝 How to Update Content
1. **Images**: Upload via admin panel or directly to Firebase Storage
2. **Programs**: Update in Firestore → changes appear instantly
3. **Pages**: Edit HTML, push to GitHub → Netlify auto-deploys in 30 seconds

## 📞 Support
For questions about this template, see the full architecture document.

---
Built with ❤️ for football coaching excellence.
