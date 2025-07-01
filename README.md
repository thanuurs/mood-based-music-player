# MoodTunes Cactus 🌵🎶

A delightful mood-driven music player featuring an animated dancing cactus that responds to your emotions and generates custom music patterns using Web Audio API.

## Features

- **6 Mood Options**: Happy, Sad, Energetic, Calm, Romantic, and Angry
- **Animated Dancing Cactus**: Responds to different moods with unique animations and expressions
- **Generated Music**: Web Audio API creates mood-specific musical patterns and rhythms
- **Music Visualizer**: Real-time audio visualization bars synchronized with generated music
- **Mood History**: Track your listening sessions and discover your favorite moods
- **Statistics Dashboard**: View total sessions, favorite mood, and songs discovered
- **No External Dependencies**: Works completely offline without requiring any API keys or logins

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + Framer Motion animations
- **UI Components**: Radix UI + shadcn/ui
- **Audio**: Web Audio API for music generation
- **Backend**: Node.js + Express (for mood session tracking)
- **Database**: In-memory storage (no external database required)

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. **Extract the project files** to your desired directory

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser** and navigate to `http://localhost:5000`

### Alternative: Visual Studio Code

If you're using Visual Studio Code:

1. Extract the zip file to a folder
2. Open the folder in VS Code
3. Open the integrated terminal (Ctrl+`)
4. Run `npm install`
5. Run `npm run dev`
6. Click the localhost link that appears in the terminal

## How to Use

1. **Select Your Mood**: Click on one of the six mood buttons (Happy, Sad, Energetic, Calm, Romantic, Angry)

2. **Watch the Cactus Dance**: The animated cactus will respond to your selected mood with unique animations:
   - **Happy**: Bouncy movements with bright expressions
   - **Sad**: Slow swaying with melancholic expressions
   - **Energetic**: Fast dancing with electric energy
   - **Calm**: Gentle pulsing with peaceful vibes
   - **Romantic**: Smooth movements with love expressions
   - **Angry**: Intense bouncing with fiery expressions

3. **Listen to Generated Music**: Each mood triggers unique musical patterns:
   - **Happy**: Major chord progressions in bright tones
   - **Sad**: Minor key progressions with slower tempo
   - **Energetic**: Driving rhythms with sawtooth waves
   - **Calm**: Peaceful harmonies with gentle rhythms
   - **Romantic**: Smooth triangular waves with flowing melodies
   - **Angry**: Aggressive square waves with powerful beats

4. **Control Playback**: Use the music player controls to:
   - Play/Pause the current mood music
   - Skip to next track in the mood playlist
   - Go back to previous track

5. **View Your History**: Check the mood history panel to see:
   - Your recent mood selections
   - How long ago you selected each mood
   - Number of songs played in each session

6. **Check Your Stats**: Monitor your music journey with:
   - Total mood sessions
   - Your most frequently selected mood
   - Total number of songs discovered

## Project Structure

```
moodtunes-cactus/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   │   ├── dancing-cactus.tsx
│   │   │   ├── mood-selector.tsx
│   │   │   ├── now-playing.tsx
│   │   │   ├── mood-history.tsx
│   │   │   └── music-visualizer.tsx
│   │   ├── lib/           # Utility libraries
│   │   │   ├── audio-generator.ts
│   │   │   ├── music-service.ts
│   │   │   └── utils.ts
│   │   ├── hooks/         # Custom React hooks
│   │   │   └── use-music.ts
│   │   ├── pages/         # Application pages
│   │   │   └── home.tsx
│   │   └── types/         # TypeScript type definitions
│   │       └── spotify.ts
│   └── index.html         # Main HTML template
├── server/                # Backend Express server
│   ├── index.ts          # Server entry point
│   ├── routes.ts         # API routes
│   └── storage.ts        # In-memory data storage
├── shared/               # Shared types and schemas
│   └── schema.ts
└── package.json          # Project dependencies
```

## Audio Generation Details

The app uses the Web Audio API to generate music dynamically:

### Musical Patterns by Mood

- **Happy**: A4 (440Hz) major chord progression with sine waves at 120 BPM
- **Sad**: A3 (220Hz) minor progression with sine waves at 60 BPM  
- **Energetic**: E4 (330Hz) power chord with sawtooth waves at 140 BPM
- **Calm**: G3 (196Hz) peaceful progression with sine waves at 80 BPM
- **Romantic**: C4 (261Hz) romantic progression with triangle waves at 90 BPM
- **Angry**: D3 (146Hz) aggressive progression with square waves at 160 BPM

### Rhythmic Patterns

Each mood has unique rhythmic envelopes that create different feels:
- Strong-weak patterns for happy moods
- Flowing patterns for romantic moods
- Driving patterns for energetic moods
- Gentle patterns for calm moods

## Customization

### Adding New Moods

1. Add the new mood to the `MoodType` in `client/src/types/spotify.ts`
2. Update the mood configurations in `client/src/components/mood-selector.tsx`
3. Add audio patterns in `client/src/lib/audio-generator.ts`
4. Update the cactus animations in `client/src/components/dancing-cactus.tsx`

### Modifying Audio Patterns

Edit the `getMoodFrequencies` method in `client/src/lib/audio-generator.ts` to:
- Change frequencies (musical notes)
- Adjust wave types (sine, square, sawtooth, triangle)
- Modify tempo (BPM)

### Styling Changes

The app uses Tailwind CSS with custom mood gradients defined in `client/src/index.css`:
- `.mood-gradient-happy`: Yellow to orange to pink
- `.mood-gradient-sad`: Blue to purple gradients
- `.mood-gradient-energetic`: Red to orange to yellow
- And more...

## Browser Compatibility

- **Chrome/Edge**: Full support with Web Audio API
- **Firefox**: Full support with Web Audio API
- **Safari**: Full support with Web Audio API
- **Mobile browsers**: Supported (may require user interaction to start audio)

## Development

### Available Scripts

- `npm run dev`: Start development server with hot reload
- `npm run build`: Build for production
- `npm run preview`: Preview production build locally

### Environment Setup

No environment variables or external API keys required! The app works completely standalone.

## Troubleshooting

### Audio Not Playing

1. **Check browser permissions**: Some browsers require user interaction before playing audio
2. **Try clicking a mood button**: This provides the required user interaction
3. **Check browser console**: Look for any audio context errors

### Cactus Not Animating

1. **Check that a mood is selected**: The cactus only animates when music is playing
2. **Ensure Framer Motion is working**: The animations rely on the Framer Motion library

### Development Issues

1. **Clear npm cache**: `npm cache clean --force`
2. **Delete node_modules and reinstall**: `rm -rf node_modules && npm install`
3. **Check Node.js version**: Ensure you're using Node.js 18 or higher

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Web Audio API for enabling dynamic music generation
- Framer Motion for smooth animations
- Tailwind CSS for beautiful styling
- Radix UI for accessible components
- The cactus emoji for being the perfect mascot 🌵

## Support

If you encounter any issues:

1. Check the troubleshooting section above
2. Ensure all dependencies are installed: `npm install`
3. Verify Node.js version: `node --version` (should be 18+)
4. Try running in an incognito/private browser window

---

Enjoy your musical journey with your dancing cactus buddy! 🌵🎶