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

async function upsertBatch(itemsList) {
  const batchSize = 50;
  let successCount = 0;
  for (let i = 0; i < itemsList.length; i += batchSize) {
    const chunk = itemsList.slice(i, i + batchSize);
    const { data, error } = await supabase.from('items').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Error upserting batch ${i / batchSize + 1}:`, error.message);
    } else {
      successCount += chunk.length;
      console.log(`Synced ${successCount}/${itemsList.length} items...`);
    }
  }
}

const WUKONG_ITEMS = [
  {
    id: 'bmw-weapon-jingubang',
    name: 'Jingubang',
    name_vi: 'Như Ý Kim Cô Bổng',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/jingubang_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Vũ khí thần thoại nguyên bản của Sun Wukong. Khi thi triển phép thuật sẽ tăng tỷ lệ chí mạng và duy trì 4 điểm Focus không bị suy giảm theo thời gian.',
    category: 'weapons',
    sub_category: 'Bổng Pháp Thần Thoại (Mythical Staff)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 6 - Thác Nước Thủy Liêm Động (Water Curtain Cave)',
    stats: { Attack: '135', CriticalHitChance: '6%', UniqueEffect: 'Khóa 4 điểm Focus Gauge & giảm Cooldown chiêu khi đánh chí mạng.' }
  },
  {
    id: 'bmw-weapon-kang-jin-staff',
    name: 'Kang-Jin Staff',
    name_vi: 'Khang Kim Côn',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/kang-jin_staff_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Vũ khí bổng pháp mang uy lực sấm sét của Khang Kim Long. Đòn đánh kết thúc combo nhảy múa phóng ra nguồn sát thương lôi điện quét sạch kẻ thù.',
    category: 'weapons',
    sub_category: 'Bổng Pháp Lôi Điện (Epic Staff)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 3 - Hạ gục trùm Khang Kim Long (Kang-Jin Loong)',
    stats: { Attack: '70', CriticalHitChance: '6%', UniqueEffect: 'Đòn kết thúc combo chuyển thành sát thương Sấm Sét (Thunder Damage).' }
  }
];

async function main() {
  console.log('🚀 STARTING SUPABASE MASTER DATA SYNC...');
  await upsertBatch(WUKONG_ITEMS);
  console.log('✅ COMPLETED!');
}

main().catch(err => console.error(err));
