import { config } from 'dotenv';
import { defineConfig } from 'drizzle-kit';

config({ path: '.env' });

export default defineConfig({
  schema: '/Users/jaafarcherkaoui/Desktop/MyStuff/TheMerger/Back/Immersive-Back-end/drizzle/schema.js',
  out: './supabase/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});