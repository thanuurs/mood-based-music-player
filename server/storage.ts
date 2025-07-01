import { users, moodSessions, spotifyTokens, type User, type InsertUser, type MoodSession, type InsertMoodSession, type SpotifyToken, type InsertSpotifyToken } from "@shared/schema";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createMoodSession(session: InsertMoodSession): Promise<MoodSession>;
  getMoodHistory(userId?: number): Promise<MoodSession[]>;
  updateMoodSession(id: number, updates: Partial<MoodSession>): Promise<MoodSession | undefined>;
  
  saveSpotifyToken(token: InsertSpotifyToken): Promise<SpotifyToken>;
  getSpotifyToken(userId?: number): Promise<SpotifyToken | undefined>;
  updateSpotifyToken(id: number, updates: Partial<SpotifyToken>): Promise<SpotifyToken | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private moodSessions: Map<number, MoodSession>;
  private spotifyTokens: Map<number, SpotifyToken>;
  private currentUserId: number;
  private currentMoodSessionId: number;
  private currentSpotifyTokenId: number;

  constructor() {
    this.users = new Map();
    this.moodSessions = new Map();
    this.spotifyTokens = new Map();
    this.currentUserId = 1;
    this.currentMoodSessionId = 1;
    this.currentSpotifyTokenId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMoodSession(insertSession: InsertMoodSession): Promise<MoodSession> {
    const id = this.currentMoodSessionId++;
    const session: MoodSession = { 
      ...insertSession, 
      id, 
      timestamp: new Date(),
      songsPlayed: insertSession.songsPlayed || 0,
      userId: insertSession.userId || null,
      spotifyTrackId: insertSession.spotifyTrackId || null,
      trackName: insertSession.trackName || null,
      artistName: insertSession.artistName || null
    };
    this.moodSessions.set(id, session);
    return session;
  }

  async getMoodHistory(userId?: number): Promise<MoodSession[]> {
    const sessions = Array.from(this.moodSessions.values());
    if (userId) {
      return sessions.filter(session => session.userId === userId);
    }
    return sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async updateMoodSession(id: number, updates: Partial<MoodSession>): Promise<MoodSession | undefined> {
    const session = this.moodSessions.get(id);
    if (!session) return undefined;
    
    const updatedSession = { ...session, ...updates };
    this.moodSessions.set(id, updatedSession);
    return updatedSession;
  }

  async saveSpotifyToken(insertToken: InsertSpotifyToken): Promise<SpotifyToken> {
    const id = this.currentSpotifyTokenId++;
    const token: SpotifyToken = { 
      ...insertToken, 
      id,
      userId: insertToken.userId || null
    };
    this.spotifyTokens.set(id, token);
    return token;
  }

  async getSpotifyToken(userId?: number): Promise<SpotifyToken | undefined> {
    if (userId) {
      return Array.from(this.spotifyTokens.values()).find(token => token.userId === userId);
    }
    // Return the most recent token if no userId specified
    const tokens = Array.from(this.spotifyTokens.values());
    return tokens[tokens.length - 1];
  }

  async updateSpotifyToken(id: number, updates: Partial<SpotifyToken>): Promise<SpotifyToken | undefined> {
    const token = this.spotifyTokens.get(id);
    if (!token) return undefined;
    
    const updatedToken = { ...token, ...updates };
    this.spotifyTokens.set(id, updatedToken);
    return updatedToken;
  }
}

export const storage = new MemStorage();
