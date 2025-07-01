import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const moodSessions = pgTable("mood_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  mood: text("mood").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  songsPlayed: integer("songs_played").default(0),
  spotifyTrackId: text("spotify_track_id"),
  trackName: text("track_name"),
  artistName: text("artist_name"),
});

export const spotifyTokens = pgTable("spotify_tokens", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertMoodSessionSchema = createInsertSchema(moodSessions).omit({
  id: true,
  timestamp: true,
});

export const insertSpotifyTokenSchema = createInsertSchema(spotifyTokens).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type MoodSession = typeof moodSessions.$inferSelect;
export type InsertMoodSession = z.infer<typeof insertMoodSessionSchema>;
export type SpotifyToken = typeof spotifyTokens.$inferSelect;
export type InsertSpotifyToken = z.infer<typeof insertSpotifyTokenSchema>;
