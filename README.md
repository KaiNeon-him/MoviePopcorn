# 🍿 MoviePopcorn

A modern, feature-rich movie and TV show streaming platform built with React, TypeScript, and Vite. Experience Netflix-quality UI with advanced features like smart search, custom video player, multi-language support, and more.

![MoviePopcorn](https://img.shields.io/badge/React-18.3.1-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue) ![Vite](https://img.shields.io/badge/Vite-6.0.5-purple) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-blue)

## ✨ Features

### 🎬 Core Features
- **Smart Search with Autocomplete** - Real-time suggestions as you type
- **Custom Video Player** - Netflix-style controls with auto-skip intro/outro
- **Multi-Language Support** - 15 languages including English, Spanish, French, German, Chinese, Japanese, Hindi, Arabic, and more
- **Dark/Light Theme** - Toggle between themes with smooth transitions
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **PWA Support** - Install as desktop/mobile app with offline support

### 🎯 User Experience
- **Watchlist Management** - Save movies and shows for later
- **Watch History** - Track what you've watched
- **Continue Watching** - Resume from where you left off
- **User Authentication** - Secure login/signup system
- **Profile Management** - Customize your account
- **Advanced Settings** - Fine-tune your experience

### 🎥 Video Player Features
- **Custom Controls** - Play/pause, volume, fullscreen, progress bar
- **Auto-Skip Intro/Outro** - Skip opening and ending sequences automatically
- **"Still Watching?" Detection** - Pauses when you're inactive
- **Quality Selection** - Choose video quality (Auto/Low/Medium/High)
- **Playback Speed** - 0.5x to 2x speed control
- **Subtitle Support** - Multiple language options

### 🔒 Legal & Security
- **Terms of Service** - Comprehensive legal terms
- **Privacy Policy** - GDPR/CCPA compliant
- **Cookie Policy** - Transparent cookie usage
- **DMCA Policy** - Copyright compliance
- **Age Verification** - Content filtering
- **Cookie Consent** - GDPR-compliant cookie management

### 🌐 Global Features
- **15 Languages** - Full UI translation
- **Discord Integration** - Community support
- **Ad Blocker Detection** - Notify users about ad blockers
- **Auto Scroll to Top** - Smooth navigation between pages
- **Premium Icons** - Phosphor Duotone icons for modern look

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/moviepopcorn.git
cd moviepopcorn
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## 🛠️ Tech Stack

- **React 18.3.1** - UI library
- **TypeScript 5.7.2** - Type safety
- **Vite 6.0.5** - Build tool
- **Tailwind CSS 4.0** - Styling
- **Framer Motion** - Animations
- **React Router** - Navigation
- **Lucide React** - Icons
- **Phosphor Icons** - Premium duotone icons
- **TMDB API** - Movie/TV data
- **VidAPI** - Video streaming

## 📁 Project Structure

```
moviepopcorn/
├── src/
│   ├── api/              # API integrations (TMDB, VidAPI)
│   ├── components/       # Reusable UI components
│   ├── context/          # React Context providers
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── public/               # Static assets
├── index.html            # HTML template
├── package.json          # Dependencies
├── tailwind.config.js    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── vite.config.ts        # Vite configuration
```

## 🎨 Key Components

### Video Player (`src/components/VideoPlayer.tsx`)
Custom video player wrapper with:
- Netflix-style controls
- Auto-skip intro/outro
- "Still watching?" detection
- Quality and speed controls

### Search Suggestions (`src/components/SearchSuggestions.tsx`)
Real-time autocomplete with:
- Debounced API calls
- Keyboard navigation
- Rich metadata display
- Movie/TV show posters

### Cookie Consent (`src/components/CookieConsent.tsx`)
GDPR-compliant cookie management:
- Granular control
- Accept/Reject/Customize
- Persistent preferences

## 🌍 Supported Languages

1. English (en)
2. Spanish (es)
3. French (fr)
4. German (de)
5. Chinese (zh)
6. Japanese (ja)
7. Hindi (hi)
8. Arabic (ar)
9. Portuguese (pt)
10. Russian (ru)
11. Korean (ko)
12. Turkish (tr)
13. Italian (it)
14. Polish (pl)
15. Dutch (nl)

## 🔐 Security Features

- Content Security Policy (CSP)
- Security headers (X-Frame-Options, X-XSS-Protection, etc.)
- Input validation and sanitization
- XSS prevention
- CSRF protection
- Secure authentication

## 📱 PWA Features

- Installable on desktop and mobile
- Offline support with service worker
- Custom app icons
- Standalone mode
- App manifest with metadata

## 🎯 API Integration

### TMDB API
Used for movie and TV show metadata:
- Movie/TV details
- Images and posters
- Cast information
- Ratings and reviews
- Search functionality

### VidAPI
Used for video streaming:
- Movie playback
- TV show episodes
- Multiple quality options

## 📄 License

This project is for educational and portfolio purposes only.

## ⚠️ Disclaimer

This is a demo project showcasing modern web development techniques. The video streaming functionality uses third-party APIs and may have legal implications depending on your jurisdiction. Please ensure you have the right to use any content or APIs in your region.

## 🤝 Contributing

This is a personal project, but feel free to fork and modify for your own use!

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

## 🙏 Acknowledgments

- [TMDB](https://www.themoviedb.org/) - For movie/TV data
- [VidAPI](https://vidapi.ru/) - For video streaming API
- [React](https://react.dev/) - For the amazing UI library
- [Vite](https://vitejs.dev/) - For the fast build tool
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework

---

Made with ❤️ using React, TypeScript, and lots of popcorn! 🍿
