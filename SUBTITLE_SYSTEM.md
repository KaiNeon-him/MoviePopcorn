# 🎬 Subtitle System Implementation

## Overview

MoviePopcorn now includes a built-in subtitle search and selection system powered by **OpenSubtitles** through VidAPI's integration. Users can search for and select subtitles in 15+ languages directly within the video player.

## ✨ Features

### 1. **In-Player Subtitle Selection**
- Subtitle button (CC icon) in the video player controls
- Dropdown menu with 15 language options
- Visual indicator when subtitles are active (button turns red)
- One-click language selection
- Automatic subtitle loading via VidAPI

### 2. **Supported Languages**
- English (en)
- Spanish (es)
- French (fr)
- German (de)
- Italian (it)
- Portuguese (pt)
- Russian (ru)
- Chinese (zh)
- Japanese (ja)
- Korean (ko)
- Arabic (ar)
- Hindi (hi)
- Turkish (tr)
- Polish (pl)
- Dutch (nl)

### 3. **Smart Defaults**
- Respects user's default subtitle language from Settings
- "Off" option to disable subtitles
- Persists selection during playback session
- Reloads player when subtitle changes

### 4. **Visual Feedback**
- Subtitle button highlights when active
- Selected language marked with red dot
- Smooth animations for menu open/close
- Click-outside to close menu

## 🔧 Technical Implementation

### How It Works

1. **User selects subtitle language** from the dropdown menu
2. **Component updates state** with selected language code
3. **Embed URL is rebuilt** with `ds_lang` parameter
4. **VidAPI fetches subtitles** from OpenSubtitles automatically
5. **Player reloads** with subtitles enabled

### VidAPI Integration

```typescript
// Build embed URL with subtitle parameter
const embedUrl = useMemo(() => {
  const url = new URL(src);
  
  // Add subtitle language parameter
  const subtitleLang = selectedSubtitle !== 'off' 
    ? selectedSubtitle 
    : (settings.subtitles ? settings.subtitleLanguage : null);
  
  if (subtitleLang) {
    url.searchParams.set('ds_lang', subtitleLang);
  }
  
  return url.toString();
}, [src, selectedSubtitle, /* other deps */]);
```

### OpenSubtitles Integration

VidAPI handles the OpenSubtitles integration automatically:
- Searches OpenSubtitles database for matching subtitles
- Downloads subtitle files (.srt or .vtt)
- Syncs subtitles with video playback
- No API keys required (handled by VidAPI)

## 🎨 User Interface

### Subtitle Button
```
┌─────────────────────────────────────┐
│  [Title]              [1080p] [CC]  │ ← Subtitle button (CC icon)
│                                     │
│         Video Player                │
│                                     │
└─────────────────────────────────────┘
```

### Subtitle Menu
```
┌──────────────────────┐
│ Select Subtitle      │
│ Language             │
├──────────────────────┤
│ Off                  │ ← Currently selected
│ English           ●  │
│ Spanish              │
│ French               │
│ German               │
│ ...                  │
├──────────────────────┤
│ Powered by           │
│ OpenSubtitles        │
└──────────────────────┘
```

### Active State
When subtitles are enabled:
- CC button turns red/pink
- Selected language shows red dot
- Subtitles appear on video

## 🔄 User Flow

### Selecting Subtitles

1. **Click CC button** in video player
2. **Menu opens** with language options
3. **Select language** (e.g., "Spanish")
4. **Player reloads** automatically
5. **Subtitles appear** on video
6. **CC button turns red** to indicate active state

### Changing Subtitles

1. **Click CC button** again
2. **Select different language**
3. **Player reloads** with new subtitles
4. **Previous subtitles replaced**

### Disabling Subtitles

1. **Click CC button**
2. **Select "Off"**
3. **Player reloads** without subtitles
4. **CC button returns to normal**

## 🎯 Benefits

### For Users
- ✅ **No external search needed** - Everything in-app
- ✅ **15+ languages** - Wide language support
- ✅ **One-click selection** - Fast and easy
- ✅ **Visual feedback** - Clear active state
- ✅ **Powered by OpenSubtitles** - Large subtitle database

### For Developers
- ✅ **No API keys needed** - VidAPI handles it
- ✅ **Simple implementation** - Just pass language code
- ✅ **Automatic sync** - VidAPI handles timing
- ✅ **Fallback support** - Works with or without subtitles

## 📊 Comparison: Before vs After

### Before
- ❌ No subtitle selection in player
- ❌ Had to rely on global settings only
- ❌ No visual feedback
- ❌ Limited to default language

### After
- ✅ In-player subtitle selection
- ✅ 15 language options
- ✅ Visual indicator when active
- ✅ Easy language switching
- ✅ Powered by OpenSubtitles

## 🔍 How VidAPI Finds Subtitles

VidAPI uses the following process:

1. **Receives language code** (e.g., "es" for Spanish)
2. **Queries OpenSubtitles API** with movie/episode info
3. **Searches by IMDB/TMDB ID** for exact match
4. **Downloads best matching subtitle** file
5. **Converts to WebVTT format** if needed
6. **Serves subtitle file** to the player
7. **Player syncs** subtitles with video

### Subtitle Sources
- **OpenSubtitles.org** - Largest subtitle database
- **OpenSubtitles.com** - Alternative source
- **Automatic fallback** if primary source fails

## ⚙️ Settings Integration

### Global Settings
Users can set default subtitle language in:
- Settings → Audio & Subtitles → Subtitle Language
- This becomes the default for all videos

### Per-Video Override
- In-player selection overrides global setting
- Selection persists during current video
- Resets to default on next video

## 🧪 Testing

### Test Cases

1. **Select subtitle language**
   - Click CC button
   - Select "Spanish"
   - Verify subtitles appear
   - Verify CC button turns red

2. **Change subtitle language**
   - Click CC button
   - Select "French"
   - Verify Spanish subtitles disappear
   - Verify French subtitles appear

3. **Disable subtitles**
   - Click CC button
   - Select "Off"
   - Verify subtitles disappear
   - Verify CC button returns to normal

4. **Click outside menu**
   - Open subtitle menu
   - Click outside menu
   - Verify menu closes

5. **Default language**
   - Set default in Settings
   - Play video
   - Verify default language is selected

## 🚀 Future Enhancements

### Potential Features
- [ ] Custom subtitle upload (.srt, .vtt files)
- [ ] Subtitle styling options (size, color, position)
- [ ] Subtitle search by keyword
- [ ] Subtitle rating system
- [ ] Multiple subtitle tracks
- [ ] Subtitle download for offline use
- [ ] Auto-detect language preference
- [ ] Subtitle timing adjustment

## 📝 Code Location

**Main Implementation:**
- `src/components/VideoPlayer.tsx`
  - Lines 50-60: Subtitle state management
  - Lines 80-120: Embed URL builder with subtitle param
  - Lines 320-420: Subtitle button and menu UI
  - Lines 150-170: Click-outside handler

**Settings Integration:**
- `src/context/SettingsContext.tsx`
  - Default subtitle language setting

## 🎉 Summary

The subtitle system provides a seamless, in-app subtitle search and selection experience powered by OpenSubtitles through VidAPI. Users can easily select from 15+ languages with visual feedback and automatic subtitle loading. No external tools or websites needed - everything works directly in the video player!

**Result:** Professional subtitle experience comparable to Netflix, Disney+, and other major streaming platforms! 🎬✨
