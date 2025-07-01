# MoodTunes Cactus - A Mood-Driven Music Experience

## Overview

MoodTunes Cactus is an interactive web application that combines mood detection with Spotify music playback, featuring an animated dancing cactus that responds to your musical vibe. The app allows users to select or detect their mood and instantly plays curated Spotify playlists while providing visual feedback through an animated cactus character.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent UI design
- **State Management**: TanStack Query for server state management and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Animation**: Framer Motion for smooth animations and transitions
- **UI Components**: Radix UI primitives with custom theming

### Backend Architecture
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js for REST API endpoints
- **Database ORM**: Drizzle ORM with PostgreSQL (configured for Neon Database)
- **Authentication**: Spotify OAuth integration
- **Storage**: In-memory storage implementation with interface for database migration

### Design Patterns
- **Monorepo Structure**: Shared types and schemas between client and server
- **Component-Based Architecture**: Modular React components with clear separation of concerns
- **Custom Hooks**: Reusable logic encapsulated in hooks (useSpotify, useToast, useMobile)
- **Type Safety**: Full TypeScript implementation with Zod schema validation

## Key Components

### Core Features
1. **Mood Selection System**: Six predefined moods (Happy, Sad, Energetic, Calm, Romantic, Angry)
2. **Spotify Integration**: OAuth authentication and Web Playback SDK for music streaming
3. **Animated Cactus**: Dynamic character that responds to music and mood states
4. **Music Visualization**: Real-time audio visualization bars synchronized with playback
5. **Mood History**: Persistent tracking of user's mood sessions and listening history

### Component Structure
- **DancingCactus**: Animated character with mood-specific behaviors
- **MoodSelector**: Interactive mood selection interface
- **NowPlaying**: Music player controls and track information
- **MoodHistory**: Historical mood session display
- **MusicVisualizer**: Animated audio visualization

## Data Flow

### User Journey
1. User selects a mood from the predefined options
2. System authenticates with Spotify (if not already authenticated)
3. Backend fetches mood-appropriate track recommendations from Spotify API
4. Frontend initializes Spotify Web Playback SDK and begins streaming
5. Animated cactus responds to the selected mood and playback state
6. Mood session is tracked and stored for history

### API Integration
- **Spotify OAuth**: `/api/spotify/auth` and `/api/spotify/callback` for authentication flow
- **Token Management**: Secure token storage and refresh handling
- **Mood Sessions**: CRUD operations for tracking user listening history
- **Music Recommendations**: Spotify API integration for mood-based playlist generation

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, TanStack Query for data fetching
- **UI Framework**: Radix UI primitives, Tailwind CSS, Framer Motion
- **Form Handling**: React Hook Form with Hookform Resolvers
- **Development**: Vite, TypeScript, ESBuild for production builds

### Spotify Integration
- **Spotify Web Playback SDK**: Client-side music streaming
- **Neon Database**: Serverless PostgreSQL for production data storage
- **OAuth Implementation**: Secure authentication flow with token management

### Database Schema
- **Users**: User account management
- **Mood Sessions**: Tracking mood selections and listening sessions
- **Spotify Tokens**: Secure OAuth token storage with expiration handling

## Deployment Strategy

### Build Process
- **Frontend**: Vite builds optimized React application to `dist/public`
- **Backend**: ESBuild bundles Node.js server with external package handling
- **Type Checking**: TypeScript compilation verification across entire codebase

### Environment Configuration
- **Development**: Hot module replacement with Vite dev server
- **Production**: Optimized builds with environment-specific configuration
- **Database**: Drizzle migrations with push-based schema updates

### Replit Integration
- **Development Tools**: Cartographer integration for Replit environment
- **Runtime Error Handling**: Custom error overlay for development debugging
- **Asset Management**: Attached assets directory for project resources

## Changelog

```
Changelog:
- July 01, 2025. Initial setup
- July 01, 2025. Completed standalone MoodTunes Cactus app with Web Audio API music generation
- July 01, 2025. Fixed runtime errors by eliminating external dependencies
- July 01, 2025. Created simplified version with embedded SVG graphics and audio-only music
- July 01, 2025. Final delivery: moodtunes-cactus-final.tar.gz with complete documentation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```