# VidAPI Integration Guide

## Overview

MoviePopcorn now uses VidAPI's official embed API with proper integration, eliminating the conflict between VidAPI's native controls and our custom player controls.

## What Changed

### Before
- VidAPI's native player controls were visible
- Our custom controls were layered on top, causing conflicts
- Users saw double controls (VidAPI + our custom ones)
- No proper communication between our player and VidAPI

### After
- VidAPI's native controls are **hidden** using `controls=false` parameter
- Our custom VideoPlayer component provides all controls
- Real-time communication via `postMessage` API
- Progress tracking, resume playback, and auto-advance features
- Clean, unified player experience

## VidAPI Parameters Used

### Hiding Native Controls
```javascript
// Hide VidAPI's control bar
url.searchParams.set('controls', 'false');

// Hide hover overlay
url.searchParams.set('overlay', 'false');
```

### Customization
```javascript
// Set primary color to match our theme
url.searchParams.set('primaryColor', '#e50914');

// Set video title
url.searchParams.set('title', title);

// Resume from saved position
url.searchParams.set('resumeAt', savedProgress);

// Autoplay based on user settings
url.searchParams.set('autoplay', settings.autoplay ? '1' : '0');

// Set default subtitle language
url.searchParams.set('ds_lang', settings.subtitleLanguage);
```

## postMessage Communication

### Listening for Player Events
```javascript
window.addEventListener('message', (event) => {
  if (event.data?.type !== 'PLAYER_EVENT') return;
  
  const { 
    player_info, 
    player_status, 
    player_progress, 
    player_duration,
    quality,
    availableQualities 
  } = event.data.data;
  
  // Update UI based on player state
  setPlayerStatus(player_status);
  setCurrentTime(player_progress);
  setDuration(player_duration);
});
```

### Player Status Events
- **`playing`** - Video is playing, updates every ~5 seconds
- **`paused`** - Video is paused
- **`completed`** - Video finished playing
- **`seeked`** - User seeked to a different position

### Sending Commands to VidAPI
```javascript
// Play/Pause
iframeRef.current?.contentWindow?.postMessage(
  { type: 'PLAYER_COMMAND', command: 'play' },
  '*'
);

// Seek to specific time
iframeRef.current?.contentWindow?.postMessage(
  { type: 'PLAYER_COMMAND', command: 'seek', time: 120 },
  '*'
);

// Set volume
iframeRef.current?.contentWindow?.postMessage(
  { type: 'PLAYER_COMMAND', command: 'volume', volume: 0.5 },
  '*'
);

// Change quality
iframeRef.current?.contentWindow?.postMessage(
  { type: 'PLAYER_COMMAND', command: 'quality', quality: '1080p' },
  '*'
);
```

## Features Implemented

### 1. Custom Controls
- ✅ Play/Pause button
- ✅ Volume control with slider
- ✅ Progress bar with seek functionality
- ✅ Time display (current / total)
- ✅ Fullscreen toggle
- ✅ Skip forward/backward 10 seconds
- ✅ Quality selector
- ✅ Playback speed control

### 2. Progress Tracking
- ✅ Real-time progress updates from VidAPI
- ✅ Automatic progress saving to localStorage
- ✅ Resume playback from last position
- ✅ Progress percentage calculation

### 3. Smart Features
- ✅ Auto-hide controls after 3 seconds of inactivity
- ✅ Show controls on mouse movement
- ✅ "Still Watching?" detection
- ✅ Auto-play next episode (when enabled)
- ✅ Skip intro/outro buttons

### 4. Settings Integration
All user settings from SettingsContext are respected:
- `autoplay` - Auto-play video on load
- `autoplayNext` - Auto-play next episode
- `volume` - Default volume level
- `subtitles` - Enable subtitles
- `subtitleLanguage` - Default subtitle language
- `videoQuality` - Default video quality

## Usage in Components

### MoviePage
```tsx
<VideoPlayer
  src={embedUrl}
  title={movie.title || 'Movie'}
  imdbId={movie.imdb_id}
  tmdbId={movie.id.toString()}
  onProgressUpdate={(progress, duration) => {
    const progressPercent = duration > 0 
      ? Math.round((progress / duration) * 100) 
      : 0;
    addToHistory({
      id: movie.id,
      title: movie.title || '',
      poster_path: movie.poster_path,
      media_type: 'movie',
      progress: progressPercent,
    });
  }}
/>
```

### TVPage
```tsx
<VideoPlayer
  src={embedUrl}
  title={`${show.name} S${season}E${episode}`}
  imdbId={show.imdb_id}
  tmdbId={show.id.toString()}
  hasNextEpisode={hasNextEpisode}
  onNextEpisode={() => {
    // Navigate to next episode
  }}
  onProgressUpdate={(progress, duration) => {
    // Update watch history
  }}
/>
```

## Progress Saving

Progress is automatically saved to localStorage:
```javascript
// Key format
`moviepopcorn_progress_${mediaId}`

// Value: timestamp in seconds
localStorage.setItem(progressKey, '300'); // 5 minutes
```

When user returns to the same movie/episode:
```javascript
// VidAPI automatically resumes from saved position
url.searchParams.set('resumeAt', savedProgress);
```

## Quality Selection

Available qualities are provided by VidAPI:
```javascript
// From player event
const { quality, availableQualities } = event.data.data;

// quality: { label: '1080p', width: 1920, height: 1080 }
// availableQualities: ['1080p', '720p', '480p', '360p']
```

Users can switch quality via the settings panel in the player.

## Benefits

### User Experience
- ✅ No conflicting controls
- ✅ Clean, professional interface
- ✅ Consistent with rest of the app
- ✅ All settings work as expected
- ✅ Progress is saved and resumed

### Technical
- ✅ Proper API integration
- ✅ Real-time state synchronization
- ✅ No iframe manipulation hacks
- ✅ Future-proof (uses official API)
- ✅ Easy to extend with new features

### Developer Experience
- ✅ Type-safe postMessage communication
- ✅ Clear event structure
- ✅ Easy to add new commands
- ✅ Well-documented API
- ✅ Reusable VideoPlayer component

## Troubleshooting

### Video Not Playing
- Check if VidAPI domain is whitelisted
- Verify embed URL is correct
- Check browser console for errors

### Controls Not Responding
- Ensure `controls=false` is set in URL
- Check postMessage is being sent correctly
- Verify iframe has loaded

### Progress Not Saving
- Check localStorage is available
- Verify mediaId is being passed
- Check browser console for errors

### Resume Not Working
- Ensure `resumeAt` parameter is in URL
- Check saved progress exists in localStorage
- Verify VidAPI supports resume for this content

## Future Enhancements

### Potential Features
- [ ] Subtitle upload support
- [ ] Picture-in-picture mode
- [ ] Keyboard shortcuts
- [ ] Chromecast/AirPlay support
- [ ] Download for offline viewing
- [ ] Chapter markers
- [ ] Scene preview on hover
- [ ] Multiple audio tracks

### API Extensions
- [ ] Analytics tracking
- [ ] Ad insertion points
- [ ] Custom thumbnails
- [ ] Watermark support
- [ ] DRM protection

## References

- [VidAPI Documentation](https://vidapi.ru/docs)
- [postMessage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage)
- [HTML5 Video Events](https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Media_events)

## Support

For VidAPI-specific issues:
- Check VidAPI status: https://vidapi.ru/status
- VidAPI docs: https://vidapi.ru/docs
- Contact VidAPI support

For MoviePopcorn player issues:
- Check browser console for errors
- Verify all props are being passed correctly
- Test with different content to isolate issues
