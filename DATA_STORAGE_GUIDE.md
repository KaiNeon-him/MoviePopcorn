# 🔐 User Data Storage Guide

## 📍 Where is User Data Stored?

**All user data is stored in the browser's `localStorage`.**

There is **NO backend server, NO database, NO cloud storage**. Everything is 100% client-side.

---

## 🗂️ What Data is Stored?

### 1. **User Authentication** (`AuthContext.tsx`)
**Storage Keys:**
- `moviepopcorn_users` - All registered users
- `moviepopcorn_current_user` - Currently logged-in user

**Data Stored:**
```javascript
{
  id: "user123",
  email: "user@example.com",
  name: "John Doe",
  avatar: "optional-avatar-url",
  createdAt: 1234567890,
  passwordHash: "hashed-password" // Simple hash (NOT secure)
}
```

**⚠️ Security Note:** Passwords are hashed with a simple algorithm for demo purposes only. This is NOT production-ready security.

---

### 2. **Watch History** (`useWatchHistory.ts`)
**Storage Key:** `moviepopcorn_watch_history`

**Data Stored:**
```javascript
[
  {
    id: 12345,
    title: "Movie Title",
    poster_path: "/path/to/poster.jpg",
    media_type: "movie", // or "tv"
    watchedAt: 1234567890,
    progress: 45, // 0-100%
    season: 1, // For TV shows
    episode: 3  // For TV shows
  }
]
```

**Limit:** Maximum 20 items (oldest removed when exceeded)

---

### 3. **Watchlist** (`useWatchlist.ts`)
**Storage Key:** `moviepopcorn_watchlist`

**Data Stored:**
```javascript
[
  {
    id: 12345,
    title: "Movie Title",
    poster_path: "/path/to/poster.jpg",
    backdrop_path: "/path/to/backdrop.jpg",
    media_type: "movie", // or "tv"
    vote_average: 8.5,
    addedAt: 1234567890
  }
]
```

---

### 4. **User Settings** (`SettingsContext.tsx`)
**Storage Key:** `moviepopcorn_settings_v2`

**Data Stored:**
```javascript
{
  // Playback
  autoplay: true,
  autoplayNext: true,
  videoQuality: "high",
  stillWatching: true,
  inactivityTimeout: 10,
  autoPauseCountdown: 30,
  autoSkipIntro: true,
  autoSkipOutro: true,
  
  // Audio & Subtitles
  subtitles: false,
  subtitleLanguage: "en",
  audioLanguage: "en",
  volume: 100,
  
  // Notifications
  notifications: {
    newReleases: true,
    recommendations: true,
    watchlistUpdates: false
  },
  
  // Parental Controls
  parentalControls: {
    enabled: false,
    pin: "",
    matureContent: true,
    ageRestriction: 18
  },
  
  // Data Usage
  dataUsage: {
    mobileData: true,
    downloadQuality: "high"
  },
  
  // Account
  account: {
    email: "",
    twoFactor: false,
    privateProfile: false,
    showWatchHistory: true
  },
  
  // Ad Blocker
  adBlocker: true,
  
  // Language
  language: "en"
}
```

---

### 5. **Theme Preference** (`ThemeContext.tsx`)
**Storage Key:** `moviepopcorn_theme`

**Data Stored:**
```javascript
"dark" // or "light"
```

---

### 6. **Language Preference** (`LanguageContext.tsx`)
**Storage Key:** `moviepopcorn_language`

**Data Stored:**
```javascript
"en" // or "es", "fr", "de", "zh", "ja", "hi", "ar", "pt", "ru", "ko", "tr", "it", "pl", "nl"
```

---

### 7. **Cookie Consent** (`CookieConsent.tsx`)
**Storage Key:** `moviepopcorn_cookie_consent`

**Data Stored:**
```javascript
{
  essential: true,
  functional: true,
  analytics: false,
  marketing: false,
  timestamp: 1234567890,
  version: "1.0"
}
```

---

### 8. **App Install Prompt** (`InstallPrompt.tsx`)
**Storage Keys:**
- `moviepopcorn_visited` - Tracks if user has visited before
- `moviepopcorn_install_dismissed` - Tracks if install prompt was dismissed

**Data Stored:**
```javascript
"true"
```

---

## 🔍 How to View Stored Data

### In Browser Developer Tools:

1. **Open DevTools** (F12 or right-click → Inspect)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Local Storage** in left sidebar
4. Click on your domain (e.g., `http://localhost:5173`)
5. You'll see all the keys listed above

### Using Console:

```javascript
// View all stored data
console.log(localStorage);

// View specific data
console.log(JSON.parse(localStorage.getItem('moviepopcorn_users')));
console.log(JSON.parse(localStorage.getItem('moviepopcorn_current_user')));
console.log(JSON.parse(localStorage.getItem('moviepopcorn_watch_history')));
console.log(JSON.parse(localStorage.getItem('moviepopcorn_watchlist')));
console.log(JSON.parse(localStorage.getItem('moviepopcorn_settings_v2')));
console.log(localStorage.getItem('moviepopcorn_theme'));
console.log(localStorage.getItem('moviepopcorn_language'));

// Clear all data
localStorage.clear();
```

---

## ⚠️ Important Limitations

### 1. **No Cross-Device Sync**
- Data is stored **only in the browser** where it was created
- If you use a different device or browser, your data won't be there
- No cloud backup or synchronization

### 2. **Data Loss Risks**
- **Clearing browser data** = All data lost
- **Incognito/Private mode** = Data lost when browser closes
- **Different browser** = No access to data
- **Different device** = No access to data

### 3. **Storage Limits**
- localStorage has a **5-10 MB limit** per domain
- MoviePopcorn uses minimal space (< 100 KB typically)
- Not a concern for this app

### 4. **Security Concerns**
- **No encryption** - Data stored as plain JSON
- **XSS vulnerability** - If site is compromised, data can be accessed
- **Password hashing** - Simple hash, not production-ready
- **No HTTPS enforcement** - Depends on deployment

---

## 🔒 Privacy Implications

### ✅ Good for Privacy:
- **No server** = No data sent to external servers
- **No tracking** = No analytics or user tracking
- **No third-party** = No external databases
- **User control** = Users can clear data anytime

### ❌ Bad for Privacy:
- **No backup** = Data can be lost permanently
- **No sync** = Data tied to one browser/device
- **Local only** = Can't access from other devices
- **XSS risk** = If site is hacked, data exposed

---

## 🚀 How to Make it Production-Ready

If you want to deploy this for real users, you need:

### 1. **Backend Server**
- Node.js/Express, Python/Django, or similar
- Database (PostgreSQL, MongoDB, etc.)
- User authentication with proper security

### 2. **Database**
- Store user accounts securely
- Hash passwords with bcrypt/argon2
- Store watch history, watchlists, settings

### 3. **Authentication**
- JWT tokens or session-based auth
- Password reset functionality
- Email verification
- Two-factor authentication

### 4. **API Endpoints**
```
POST /api/auth/signup
POST /api/auth/login
GET /api/user/profile
PUT /api/user/settings
GET /api/user/watchlist
POST /api/user/watch-history
```

### 5. **Security**
- HTTPS only
- Rate limiting
- Input validation
- SQL injection protection
- XSS protection
- CSRF protection

---

## 📊 Current Architecture

```
┌─────────────────────────────────────┐
│   Browser (Client-Side Only)        │
│  ┌───────────────────────────────┐  │
│  │   React App                   │  │
│  │  - AuthContext                │  │
│  │  - SettingsContext            │  │
│  │  - ThemeContext               │  │
│  │  - LanguageContext            │  │
│  │  - useWatchHistory            │  │
│  │  - useWatchlist               │  │
│  └───────────────────────────────┘  │
│  ┌───────────────────────────────┐  │
│  │   localStorage                │  │
│  │  - Users                      │  │
│  │  - Settings                   │  │
│  │  - Watch History              │  │
│  │  - Watchlist                  │  │
│  │  - Theme                      │  │
│  │  - Language                   │  │
│  │  - Cookie Consent             │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
         │
         │ No data sent to server
         │ (except TMDB/VidAPI API calls)
         ▼
    ┌─────────┐
    │ TMDB    │ ← Movie/TV metadata only
    │ VidAPI  │ ← Video streaming only
    └─────────┘
```

---

## 🎯 Summary

**Current State:**
- ✅ All data stored in browser localStorage
- ✅ No backend server
- ✅ No database
- ✅ No cloud storage
- ✅ 100% client-side
- ✅ Private (no data sent to servers)
- ❌ No cross-device sync
- ❌ No backup
- ❌ Not production-ready for real users

**For Production:**
- Need backend server
- Need database
- Need proper authentication
- Need API endpoints
- Need security measures
- Need data encryption

---

## 💡 What This Means for You

### If This is a Demo/Portfolio Project:
- ✅ Perfect as-is
- ✅ Shows your skills
- ✅ No legal issues with data storage
- ✅ Easy to demonstrate

### If You Want Real Users:
- ❌ Need to add backend
- ❌ Need proper authentication
- ❌ Need database
- ❌ Need security audit
- ❌ Need privacy policy updates

---

## 🔧 Quick Test

To see your data right now:

1. Open your MoviePopcorn site
2. Sign up / Sign in
3. Add some movies to watchlist
4. Watch some content
5. Change settings
6. Open DevTools (F12)
7. Go to Application → Local Storage
8. See all your data!

---

**Bottom Line:** All user data is stored locally in the browser. There's no server, no database, no cloud. This is great for privacy and demos, but not suitable for production without adding a backend.
