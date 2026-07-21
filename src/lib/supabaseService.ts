import { supabase } from './supabaseClient';

export interface SupabaseItem {
  id: string;
  name: string;
  name_vi?: string;
  image?: string;
  description?: string;
  category: string;
  sub_category?: string;
  game_slug?: string;
  expansion?: string;
  location_hint?: string;
  map_location_url?: string;
  quote?: string;
  stats?: Record<string, any>;
  created_at?: string;
}

const GAME_TABLE_MAP: Record<string, string> = {
  'black-myth-wukong': 'wukong_items',
  'lien-minh-huyen-thoai': 'lol_items',
  'elden-ring': 'elden_ring_items',
  tft: 'tft_items',
};

/**
 * Fetch items for a specific game from its dedicated Supabase Table
 */
export async function getGameItemsFromSupabase(
  gameSlug: string,
  category?: string
): Promise<SupabaseItem[]> {
  try {
    const tableName = GAME_TABLE_MAP[gameSlug] || 'items';
    let query = supabase.from(tableName).select('*');

    if (category) {
      query = query.eq('category', category);
    }

    const { data, error } = await query.order('name', { ascending: true });

    if (error) {
      // Fallback to master items table if individual table is not created yet
      let fallbackQuery = supabase.from('items').select('*').eq('game_slug', gameSlug);
      if (category) fallbackQuery = fallbackQuery.eq('category', category);
      const fallbackRes = await fallbackQuery.order('name', { ascending: true });
      return fallbackRes.data || [];
    }

    return data || [];
  } catch (err) {
    console.error(`Unexpected error fetching items for ${gameSlug}:`, err);
    return [];
  }
}

/**
 * Search items across dedicated game tables or master table
 */
export async function searchSupabaseItems(
  searchTerm: string,
  gameSlug?: string
): Promise<SupabaseItem[]> {
  try {
    const tableName = gameSlug ? (GAME_TABLE_MAP[gameSlug] || 'items') : 'items';
    let query = supabase.from(tableName).select('*');

    query = query.or(`name.ilike.%${searchTerm}%,name_vi.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);

    const { data, error } = await query.limit(50);
    if (error) {
      // Fallback search in master items
      let fallbackQuery = supabase.from('items').select('*');
      if (gameSlug) fallbackQuery = fallbackQuery.eq('game_slug', gameSlug);
      fallbackQuery = fallbackQuery.or(`name.ilike.%${searchTerm}%,name_vi.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      const fallbackRes = await fallbackQuery.limit(50);
      return fallbackRes.data || [];
    }

    return data || [];
  } catch {
    return [];
  }
}
