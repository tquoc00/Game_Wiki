const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env if present
const envPath = path.resolve(__dirname, '../.env');
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8');
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      process.env[key] = value;
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kpnwtagcoxrdtekzezld.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseKey) {
  console.error('Error: NEXT_PUBLIC_SUPABASE_ANON_KEY is not defined in environment.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllMasterItems() {
  let allRows = [];
  let page = 0;
  const pageSize = 1000;
  while (true) {
    const { data, error } = await supabase
      .from('items')
      .select('*')
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error || !data || data.length === 0) break;
    allRows = [...allRows, ...data];
    if (data.length < pageSize) break;
    page++;
  }
  return allRows;
}

function cleanItem(item, allowedKeys) {
  const cleaned = {};
  allowedKeys.forEach((key) => {
    if (item[key] !== undefined) cleaned[key] = item[key];
  });
  return cleaned;
}

async function upsertTable(tableName, items) {
  if (!items || items.length === 0) return;
  const batchSize = 50;
  let successCount = 0;
  for (let i = 0; i < items.length; i += batchSize) {
    const chunk = items.slice(i, i + batchSize);
    const { error } = await supabase.from(tableName).upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Error populating ${tableName} batch ${i / batchSize + 1}:`, error.message);
    } else {
      successCount += chunk.length;
      console.log(`Synced ${successCount}/${items.length} into ${tableName}...`);
    }
  }
}

async function main() {
  console.log('🚀 FETCHING ALL MASTER ITEMS WITH PAGINATION...');
  const allItems = await fetchAllMasterItems();
  console.log(`Fetched TOTAL ${allItems.length} items from master table.`);

  const commonKeys = ['id', 'name', 'name_vi', 'image', 'description', 'category', 'sub_category', 'game_slug', 'expansion', 'stats', 'location_hint', 'map_location_url', 'quote', 'created_at'];

  const wukong = allItems
    .filter((i) => i.game_slug === 'black-myth-wukong')
    .map((i) => cleanItem(i, commonKeys));

  const lol = allItems
    .filter((i) => i.game_slug === 'lien-minh-huyen-thoai')
    .map((i) => cleanItem(i, ['id', 'name', 'name_vi', 'image', 'description', 'category', 'sub_category', 'game_slug', 'expansion', 'stats', 'created_at']));

  const eldenRing = allItems
    .filter((i) => i.game_slug === 'elden-ring')
    .map((i) => cleanItem(i, commonKeys));

  const tft = allItems
    .filter((i) => i.game_slug === 'tft')
    .map((i) => cleanItem(i, ['id', 'name', 'name_vi', 'image', 'description', 'category', 'sub_category', 'game_slug', 'expansion', 'stats', 'created_at']));

  console.log(`Distributing: Wukong (${wukong.length}), LoL (${lol.length}), Elden Ring (${eldenRing.length}), TFT (${tft.length})...`);

  await upsertTable('wukong_items', wukong);
  await upsertTable('lol_items', lol);
  await upsertTable('elden_ring_items', eldenRing);
  await upsertTable('tft_items', tft);

  console.log('🎉 POPULATING ALL GAME TABLES COMPLETED SUCCESSFULLY!');
}

main().catch((err) => console.error('Migration error:', err));
