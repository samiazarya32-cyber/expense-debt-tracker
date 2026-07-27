import { createClient } from '@supabase/supabase-js';

// Load environment variables (NEXT_PUBLIC_*) at build time
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase environment variables are missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for local IndexedDB fallback (optional, simple wrapper)
export async function getFromCache<T>(key: string): Promise<T | null> {
  if (typeof window === 'undefined') return null;
  const { openDB } = await import('idb');
  const db = await openDB('simple-cash-db', 1, { upgrade(db) { db.createObjectStore('kv'); } });
  return (await db.get('kv', key)) as T | null;
}

export async function setInCache<T>(key: string, value: T): Promise<void> {
  if (typeof window === 'undefined') return;
  const { openDB } = await import('idb');
  const db = await openDB('simple-cash-db', 1, { upgrade(db) { db.createObjectStore('kv'); } });
  await db.put('kv', value, key);
}
