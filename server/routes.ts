import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMoodSessionSchema } from "@shared/schema";
import { z } from "zod";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || process.env.VITE_SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;
const REDIRECT_URI = process.env.NODE_ENV === 'production' 
  ? `${process.env.REPLIT_DOMAINS?.split(',')[0] || 'localhost:5000'}/api/spotify/callback`
  : 'http://localhost:5000/api/spotify/callback';

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Spotify Client Credentials (no user login required)
  app.get("/api/spotify/client-token", async (req, res) => {
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'client_credentials'
        })
      });

      const tokenData = await response.json();
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      res.json({
        access_token: tokenData.access_token,
        expires_in: tokenData.expires_in
      });
    } catch (error) {
      console.error('Client credentials error:', error);
      res.status(500).json({ error: 'Failed to get client credentials' });
    }
  });
  
  // Spotify OAuth Routes
  app.get("/api/spotify/auth", (req, res) => {
    const scopes = [
      'streaming',
      'user-read-email',
      'user-read-private',
      'user-read-playback-state',
      'user-modify-playback-state',
      'playlist-read-private',
      'playlist-read-collaborative'
    ].join(' ');
    
    const authUrl = `https://accounts.spotify.com/authorize?` +
      `response_type=code&` +
      `client_id=${SPOTIFY_CLIENT_ID}&` +
      `scope=${encodeURIComponent(scopes)}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `state=${Math.random().toString(36).substring(7)}`;
    
    res.json({ authUrl });
  });

  app.get("/api/spotify/callback", async (req, res) => {
    const { code, error } = req.query;
    
    if (error) {
      return res.redirect(`/?error=${encodeURIComponent(error as string)}`);
    }

    try {
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code: code as string,
          redirect_uri: REDIRECT_URI
        })
      });

      const tokenData = await tokenResponse.json();
      
      if (tokenData.error) {
        throw new Error(tokenData.error_description || tokenData.error);
      }

      // Save token to storage
      await storage.saveSpotifyToken({
        userId: null, // For simplicity, not associating with specific user
        accessToken: tokenData.access_token,
        refreshToken: tokenData.refresh_token,
        expiresAt: new Date(Date.now() + tokenData.expires_in * 1000)
      });

      res.redirect('/?spotify=connected');
    } catch (error) {
      console.error('Spotify auth error:', error);
      res.redirect(`/?error=${encodeURIComponent('Failed to authenticate with Spotify')}`);
    }
  });

  app.get("/api/spotify/token", async (req, res) => {
    try {
      const token = await storage.getSpotifyToken();
      if (!token) {
        return res.status(404).json({ error: 'No Spotify token found' });
      }

      // Check if token is expired
      if (token.expiresAt < new Date()) {
        // Refresh token
        const refreshResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString('base64')}`
          },
          body: new URLSearchParams({
            grant_type: 'refresh_token',
            refresh_token: token.refreshToken
          })
        });

        const refreshData = await refreshResponse.json();
        
        if (refreshData.error) {
          return res.status(401).json({ error: 'Failed to refresh token' });
        }

        // Update token
        const updatedToken = await storage.updateSpotifyToken(token.id, {
          accessToken: refreshData.access_token,
          refreshToken: refreshData.refresh_token || token.refreshToken,
          expiresAt: new Date(Date.now() + refreshData.expires_in * 1000)
        });

        return res.json({ accessToken: updatedToken?.accessToken });
      }

      res.json({ accessToken: token.accessToken });
    } catch (error) {
      console.error('Token error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Spotify Recommendations
  app.get("/api/spotify/recommendations/:mood", async (req, res) => {
    try {
      const { mood } = req.params;
      const token = await storage.getSpotifyToken();
      
      if (!token) {
        return res.status(401).json({ error: 'Spotify not authenticated' });
      }

      // Mood-based seed parameters
      const moodParams: Record<string, any> = {
        happy: { valence: 0.8, energy: 0.7, danceability: 0.7 },
        sad: { valence: 0.2, energy: 0.3, acousticness: 0.7 },
        energetic: { energy: 0.9, valence: 0.7, tempo: 120 },
        calm: { valence: 0.5, energy: 0.3, acousticness: 0.8 },
        romantic: { valence: 0.7, energy: 0.4, acousticness: 0.6 },
        angry: { energy: 0.9, valence: 0.3, loudness: -5 }
      };

      const params = moodParams[mood] || moodParams.happy;
      const queryParams = new URLSearchParams({
        seed_genres: 'pop,rock,indie,electronic',
        limit: '20',
        market: 'US',
        ...Object.fromEntries(
          Object.entries(params).map(([key, value]) => [`target_${key}`, String(value)])
        )
      });

      const response = await fetch(`https://api.spotify.com/v1/recommendations?${queryParams}`, {
        headers: {
          'Authorization': `Bearer ${token.accessToken}`
        }
      });

      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error('Recommendations error:', error);
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  });

  // Mood Session Routes
  app.post("/api/mood-sessions", async (req, res) => {
    try {
      const sessionData = insertMoodSessionSchema.parse(req.body);
      const session = await storage.createMoodSession(sessionData);
      res.json(session);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: 'Invalid session data', details: error.errors });
      }
      console.error('Create session error:', error);
      res.status(500).json({ error: 'Failed to create mood session' });
    }
  });

  app.get("/api/mood-sessions", async (req, res) => {
    try {
      const sessions = await storage.getMoodHistory();
      res.json(sessions);
    } catch (error) {
      console.error('Get sessions error:', error);
      res.status(500).json({ error: 'Failed to get mood history' });
    }
  });

  app.patch("/api/mood-sessions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const session = await storage.updateMoodSession(id, updates);
      
      if (!session) {
        return res.status(404).json({ error: 'Session not found' });
      }
      
      res.json(session);
    } catch (error) {
      console.error('Update session error:', error);
      res.status(500).json({ error: 'Failed to update session' });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
