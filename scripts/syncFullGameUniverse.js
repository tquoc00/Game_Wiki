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
    const { error } = await supabase.from('items').upsert(chunk, { onConflict: 'id' });
    if (error) {
      console.error(`Error batch ${i / batchSize + 1}:`, error.message);
    } else {
      successCount += chunk.length;
      console.log(`Synced ${successCount}/${itemsList.length} items...`);
    }
  }
}

// 1. BLACK MYTH: WUKONG COMPREHENSIVE DATABASE (CHAPTERS 1-6)
const BMW_EXPANDED = [
  {
    id: 'bmw-weapon-jingubang',
    name: 'Jingubang',
    name_vi: 'Như Ý Kim Cô Bổng',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/jingubang_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Vũ khí thần thoại nguyên bản của Sun Wukong. Duy trì 4 điểm Focus Gauge vĩnh viễn không suy giảm và giảm thời gian hồi chiêu khi đánh chí mạng.',
    category: 'weapons',
    sub_category: 'Bổng Pháp Thần Thoại (Mythical Staff)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 6 - Thủy Liêm Động (Water Curtain Cave)',
    stats: { Attack: '135', CriticalHitChance: '6%', UniqueEffect: 'Khóa 4 Focus Gauge & giảm Cooldown khi chí mạng.' }
  },
  {
    id: 'bmw-weapon-tri-point-spear',
    name: 'Tri-Point Double-Edged Spear',
    name_vi: 'Tam Mũi Lưỡng Nhận Đao (Bạch Ngân Thương Dương Tiễn)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/tri-point_double-edged_spear_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Chiến thương lưỡng nhận huyền thoại của Nhị Lang Thần Dương Tiễn. Bắn ra hàng loạt phi đao kiếm khí khi dùng đòn thế đâm Thrust Stance.',
    category: 'weapons',
    sub_category: 'Vũ Khí Thần Thoại (Mythical Spear)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Bí Cảnh Động Mai Sơn - Hạ gục Nhị Lang Chân Quân (Erlang Shen)',
    stats: { Attack: '135', CriticalHitChance: '8%', UniqueEffect: 'Bắn ra kiếm khí phi đao theo đòn Thrust Stance.' }
  },
  {
    id: 'bmw-weapon-kang-jin-staff',
    name: 'Kang-Jin Staff',
    name_vi: 'Khang Kim Côn',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/kang-jin_staff_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Bổng pháp lôi điện của Khang Kim Long. Chuyển đòn kết thúc combo xoay côn thành sát thương lôi bão quét diện rộng.',
    category: 'weapons',
    sub_category: 'Bổng Pháp Lôi Điện (Epic Staff)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 3 - Hạ trùm Khang Kim Long tại Hồ Băng',
    stats: { Attack: '70', CriticalHitChance: '6%', UniqueEffect: 'Đòn kết thúc combo đổi thành Thunder Damage.' }
  },
  {
    id: 'bmw-weapon-bishui-beast-staff',
    name: 'Bishui Beast Staff',
    name_vi: 'Bích Thủy Thú Côn',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/bishui_beast_staff_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Bổng pháp chế tạo từ sừng quái thú Bích Thủy Kim Tố Ni. Mang chỉ số sát thương vật lý thô cực đại.',
    category: 'weapons',
    sub_category: 'Bổng Pháp Đại Vương (Legendary Staff)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 5 - Động Bích Thủy ẩn (Bishui Cave)',
    stats: { Attack: '105', CriticalHitChance: '10%' }
  },
  {
    id: 'bmw-weapon-spidery-staff',
    name: 'Spidery Staff',
    name_vi: 'Nhện Độc Côn',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/spidery_staff_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Bổng pháp chế tạo từ độc túc của Tinh Nhện. Gây thêm sát thương độc kịch và hồi máu khi đánh trúng mục tiêu bị nhiễm độc.',
    category: 'weapons',
    sub_category: 'Bổng Pháp Độc Đạo (Legendary Staff)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 4 - Động Bàn Tơ (Hạ trùm Nhện Độc)',
    stats: { Attack: '85', CriticalHitChance: '4%', PoisonEffect: 'Hồi phục HP khi đánh địch bị Poison.' }
  },
  {
    id: 'bmw-weapon-rat-sage-staff',
    name: 'Rat Sage Staff',
    name_vi: 'Hoàng Phong Thử Vương Côn',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/rat_sage_staff_weapon_black_myth_wukong_wiki_guide_200px.png',
    description: 'Gậy sắt của Hoàng Phong Quái. Tạo sóng xung kích cuồng phong kéo dồn kẻ địch khi dậm gậy.',
    category: 'weapons',
    sub_category: 'Bổng Pháp Cuồng Phong (Epic Staff)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 2 - Đánh bại Hoàng Phong Quái (Yellow Wind Sage)',
    stats: { Attack: '66', CriticalHitChance: '7%' }
  },
  {
    id: 'bmw-armor-gold-suozi-chest',
    name: 'Gold Suozi Armor',
    name_vi: 'Tỏa Tử Vàng Giáp (Thần Thoại Đại Thánh)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/gold_suozi_armor_chest_black_myth_wukong_wiki_guide_200px.png',
    description: 'Bộ giáp hoàng kim huyền thoại của Tề Thiên Đại Thánh. Giảm hao tốn Mana phép thuật và tăng sức chống chịu Poise cực đại.',
    category: 'armors',
    sub_category: 'Bộ Giáp Thần Thoại (Mythical Armor)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 6 - Đánh bại Gold Armored Rhino tại Hoa Quả Sơn',
    stats: { Defense: '120', CriticalChance: '+3%' }
  },
  {
    id: 'bmw-armor-bull-king-chest',
    name: "Bull King's Iron Armor",
    name_vi: 'Giáp Sắt Ngưu Vương',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/bull_kings_bronze_armor_chest_black_myth_wukong_wiki_guide_200px.png',
    description: 'Áo giáp sắt đúc từ sừng Ngưu Ma Vương. Cho chỉ số phòng thủ cao nhất game và kích hoạt trạng thái Siêu Giáp (Super Armor).',
    category: 'armors',
    sub_category: 'Bộ Giáp Ngưu Vương (Mythical Armor)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 5 - Đổi từ sừng Ngưu Ma Vương',
    stats: { Defense: '160', Poise: '+25' }
  },
  {
    id: 'bmw-armor-ebongold-chest',
    name: 'Ebongold Armor',
    name_vi: 'Bách Thiết Hắc Tháp Giáp',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/ebongold_silk_robe_chest_black_myth_wukong_wiki_guide_200px.png',
    description: 'Áo giáp lụa đen mạ vàng của Hắc Hùm Đại Vương. Gia tăng thời gian duy trì chiêu né mây Cloud Step.',
    category: 'armors',
    sub_category: 'Bộ Giáp Hắc Hùm (Epic Armor)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 1 - Đánh bại Hắc Hùm Đại Vương (Black Bear Guai)',
    stats: { Defense: '72', CloudStepDuration: '+3s' }
  },
  {
    id: 'bmw-curio-fire-tamer',
    name: 'Fire Tamer',
    name_vi: 'Hạt Châu Tránh Lửa (Tị Hỏa Châu)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/fire_tamer_curios_black_myth_wukong_wiki_guide_200px.png',
    description: 'Cổ vật bảo hộ tối thượng giúp miễn nhiễm hoàn toàn với các trạng thái thiêu đốt ngọn lửa.',
    category: 'curios',
    sub_category: 'Bảo Vật Hộ Mệnh (Curio)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 1 - Nhặt tại quan tài ẩn Động Hắc Phong',
    stats: { FireImmunity: 'Active' }
  },
  {
    id: 'bmw-curio-wind-tamer',
    name: 'Wind Tamer',
    name_vi: 'Định Phong Châu',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/wind_tamer_curios_black_myth_wukong_wiki_guide_200px.png',
    description: 'Bảo vật ngọc định phong dập tắt lập tức cơn bão cát của Hoàng Phong Quái.',
    category: 'curios',
    sub_category: 'Bảo Vật Thần Cấp (Vessel)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 2 - Hoàn thành Quest Vương Quốc Trư Trượng (Kingdom of Sahāvatī)',
    stats: { ActiveEffect: 'Dập tắt cuồng phong & tăng thủ vật lý trong 15s.' }
  },
  {
    id: 'bmw-curio-weaver-needle',
    name: 'Weaver Needle',
    name_vi: 'Kính Thần Kim Kim Chi Needle',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/weavers_needle_curios_black_myth_wukong_wiki_guide_200px.png',
    description: 'Pháp bảo kim thêu thiêng liêng đâm thủng lớp giáp độc của Bách Nhãn Ma Quân.',
    category: 'curios',
    sub_category: 'Bảo Vật Thần Cấp (Vessel)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 4 - Hoàn thành Bí Cảnh Núi Tử Vân (Purple Cloud Mountain)',
    stats: { ActiveEffect: 'Bắn ra kim thần tự động tấn công yếu huyệt kẻ địch.' }
  },
  {
    id: 'bmw-spirit-wandering-wight',
    name: 'Wandering Wight',
    name_vi: 'Linh Hồn U Hồn (Đầu To)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/wandering_wight_spirit_black_myth_wukong_wiki_guide_200px.png',
    description: 'Linh hồn trùm U Hồn. Thi triển cú húc đầu kinh thiên động địa phá vỡ đòn đánh của trùm.',
    category: 'spirits',
    sub_category: 'Linh Hồn Trảm Sát (Heavy Spirit)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 1 - Hạ trùm Wandering Wight',
    stats: { DefenseBonus: '+30', ActiveSkill: 'Thi triển cú húc đầu gây Stagger.' }
  },
  {
    id: 'bmw-spirit-earth-wolf',
    name: 'Earth Wolf',
    name_vi: 'Linh Hồn Địa Lang',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/earth_wolf_spirit_black_myth_wukong_wiki_guide_200px.png',
    description: 'Linh hồn dã lang bới đất. Tăng điểm tích tụ Focus Point khi né tránh đòn đánh thành công.',
    category: 'spirits',
    sub_category: 'Linh Hồn Tấn Công (Utility Spirit)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 2 - Đánh bại Địa Lang tại Làng Sa Mạc',
    stats: { FocusOnDodge: '+15%' }
  },
  {
    id: 'bmw-spirit-baw-li-guhh-lang',
    name: 'Baw-Li-Guhh-Lang',
    name_vi: 'Linh Hồn Vua Ếch Ba Lý Ba Lãng',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/baw-li-guhh-lang_spirit_black_myth_wukong_wiki_guide_200px.png',
    description: 'Linh hồn vua ếch khổng lồ. Quét lưỡi dài trúng diện rộng và gây hiệu ứng trúng độc.',
    category: 'spirits',
    sub_category: 'Linh Hồn Diện Rộng (AOE Spirit)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 1 - Hạ trùm ếch dưới ao',
    stats: { PoisonDamage: '+10%' }
  },
  {
    id: 'bmw-spell-immobilize',
    name: 'Immobilize',
    name_vi: 'Định Thân Thuật',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/immobilize_spell_black_myth_wukong_wiki_guide_200px.png',
    description: 'Phép thuật cơ bản và hiệu quả nhất. Chỉ tay khóa chặt đối thủ trong vài giây để dồn sát thương.',
    category: 'sorceries',
    sub_category: 'Thuật Khống Chế (Mysticism Spell)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 1 - Nhận từ Thổ Địa Nguyện Quan',
    stats: { Cooldown: '35s', ManaCost: '50' }
  },
  {
    id: 'bmw-spell-rock-solid',
    name: 'Rock Solid',
    name_vi: 'Kim Cang Thể (Hóa Đá Phản Đòn)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/rock_solid_spell_black_myth_wukong_wiki_guide_200px.png',
    description: 'Tức thời biến cơ thể thành khối đá kiên cố để đỡ trọn đòn đánh và làm choáng kẻ thù.',
    category: 'sorceries',
    sub_category: 'Thuật Phản Đòn (Parry Spell)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 2 - Nhận sau khi đánh bại Thạch Mẫu',
    stats: { Cooldown: '15s', ManaCost: '30' }
  },
  {
    id: 'bmw-spell-pluck-of-many',
    name: 'A Pluck of Many',
    name_vi: 'Thân Ngoại Thân (Nhổ Tóc Nhân Phân Thân)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/a_pluck_of_many_spell_black_myth_wukong_wiki_guide_200px.png',
    description: 'Nhổ nắm tóc thổi ra hàng chục phân thân Sun Wukong đồng loạt tấn công hội đồng kẻ địch.',
    category: 'sorceries',
    sub_category: 'Thuật Phân Thân (Strand Spell)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 2 - Nhận từ Đầu Đà Bồ Đát',
    stats: { Cooldown: '120s', ManaCost: '120' }
  },
  {
    id: 'bmw-boss-erlang-shen',
    name: 'Erlang Shen (Erlang the Sacred Divinity)',
    name_vi: 'Nhị Lang Chân Quân Dương Tiễn',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/erlang_the_sacred_divinity_boss_black_myth_wukong_wiki_guide_200px.png',
    description: 'Trùm tối thượng bí mật tại Động Mai Sơn. Sử dụng Tam Mũi Lưỡng Nhận Đao, Mắt Thần và Hốt Lôi Khiên khống chế toàn sân.',
    category: 'bosses',
    sub_category: 'Trùm Bí Mật Tối Cao (Secret Ultimate Boss)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Bí Cảnh Động Mai Sơn (Yêu cầu hoàn thành tất cả Secret Areas Chapter 1-5)',
    stats: { PhaseCount: '4', Difficulty: 'S+' }
  },
  {
    id: 'bmw-boss-great-sage-broken-shell',
    name: "Great Sage's Broken Shell",
    name_vi: 'Tàn Hồn Đại Thánh (Trùm Cuối)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/great_sages_broken_shell_boss_black_myth_wukong_wiki_guide_200px.png',
    description: 'Thể xác tàn hồn của Sun Wukong tại đỉnh Thác Thủy Liêm Động. Sử dụng lại chính toàn bộ phép thuật và bổng pháp của người chơi.',
    category: 'bosses',
    sub_category: 'Trùm Cuối Cốt Truyện (Final Story Boss)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 6 - Đỉnh Thủy Liêm Động',
    stats: { PhaseCount: '2', Difficulty: 'S+' }
  },
  {
    id: 'bmw-boss-yellow-wind-sage',
    name: 'Yellow Wind Sage',
    name_vi: 'Hoàng Phong Quái (Thử Vương)',
    image: 'https://blackmythwukong.wiki.fextralife.com/file/Black-Myth-Wukong/yellow_wind_sage_boss_black_myth_wukong_wiki_guide_200px.png',
    description: 'Thủ lĩnh chuột mang đầu Phật tại Chương 2. Thi triển trận bão cát mù mịt nếu không dùng Định Phong Châu.',
    category: 'bosses',
    sub_category: 'Trùm Chương 2 (Chapter 2 Boss)',
    game_slug: 'black-myth-wukong',
    expansion: 'Base Game',
    location_hint: 'Chương 2 - Sa Mạc Hoàng Phong',
    stats: { PhaseCount: '2', Weakness: 'Định Phong Châu (Wind Tamer)' }
  }
];

// 2. LEAGUE OF LEGENDS
async function fetchLolFullUniverse() {
  console.log('🌐 Fetching Full League of Legends Universe (Champions + Items)...');
  try {
    const vRes = await fetch('https://ddragon.leagueoflegends.com/api/versions.json');
    const versions = await vRes.json();
    const ver = versions[0];

    const champRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/vi_VN/champion.json`);
    const champData = await champRes.json();

    const champions = Object.values(champData.data).map((c) => ({
      id: `lol-champ-${c.id}`,
      name: c.name,
      name_vi: `${c.name} - ${c.title}`,
      image: `https://ddragon.leagueoflegends.com/cdn/${ver}/img/champion/${c.image.full}`,
      description: c.blurb,
      category: 'champions',
      sub_category: c.tags ? c.tags.join(' / ') : 'Tướng Liên Minh',
      game_slug: 'lien-minh-huyen-thoai',
      expansion: `Patch ${ver}`,
      stats: {
        hp: c.stats.hp,
        armor: c.stats.armor,
        attackdamage: c.stats.attackdamage,
        attackrange: c.stats.attackrange,
        movespeed: c.stats.movespeed,
        roles: c.tags
      }
    }));

    const itemRes = await fetch(`https://ddragon.leagueoflegends.com/cdn/${ver}/data/vi_VN/item.json`);
    const itemData = await itemRes.json();

    const items = Object.entries(itemData.data).map(([id, item]) => ({
      id: `lol-item-${id}`,
      name: item.name,
      name_vi: item.name,
      image: `https://ddragon.leagueoflegends.com/cdn/${ver}/img/item/${item.image.full}`,
      description: item.plaintext || item.description.replace(/<[^>]*>?/gm, ''),
      category: 'trang-bi',
      sub_category: 'Trang Bị Summoner Rift',
      game_slug: 'lien-minh-huyen-thoai',
      expansion: `Patch ${ver}`,
      stats: item.stats || {}
    }));

    return [...champions, ...items];
  } catch (e) {
    console.error('Failed to fetch LoL full universe:', e.message);
    return [];
  }
}

// 3. TFT META
const TFT_EXPANDED = [
  {
    id: 'tft-comp-rebels-jinx',
    name: 'Jinx Reroll Chàng Trai Nổi Loạn',
    name_vi: 'Đội Hình Jinx Nổi Loạn (Meta S-Tier)',
    image: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Jinx.png',
    description: 'Đội hình xoay quanh chủ lực Jinx 3 sao kết hợp Tộc Nổi Loạn gánh sát thương vật lý tầm xa bùng nổ.',
    category: 'tft-comps',
    sub_category: 'Đội Hình Reroll Tier S',
    game_slug: 'tft',
    expansion: 'Set 13 / Set 14',
    stats: { CoreCarry: 'Jinx / Sevika', Difficulty: 'Medium', Tier: 'S-Tier' }
  },
  {
    id: 'tft-comp-academy-lux',
    name: 'Lux Học Viện Phép Thuật',
    name_vi: 'Đội Hình Lux Học Viện (Bán Thần Phép)',
    image: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/champion/Lux.png',
    description: 'Đội hình kẹp 6 Học Viện tích dồn sức mạnh phép thuật AP dội cầu vồng liên tục quét sạch sàn đấu.',
    category: 'tft-comps',
    sub_category: 'Đội Hình Fast 8 Tier S',
    game_slug: 'tft',
    expansion: 'Set 13 / Set 14',
    stats: { CoreCarry: 'Lux / Heimerdinger', Difficulty: 'Easy', Tier: 'S-Tier' }
  },
  {
    id: 'tft-item-infinity-edge',
    name: 'Vô Cực Kiếm (Infinity Edge)',
    name_vi: 'Vô Cực Kiếm TFT',
    image: 'https://ddragon.leagueoflegends.com/cdn/14.1.1/img/item/3031.png',
    description: 'Trang bị chí mạng cốt lõi cho mọi tướng sát thương vật lý AD. Kỹ năng của tướng có thể gây đòn đánh chí mạng.',
    category: 'tft-items',
    sub_category: 'Trang Bị Sát Thương AD',
    game_slug: 'tft',
    expansion: 'Core Item',
    stats: { AD: '+35%', CritChance: '+35%' }
  }
];

async function main() {
  console.log('🌟 STARTING COMPREHENSIVE UNIVERSE UPDATE FOR ALL GAMES...');

  console.log(`📦 Syncing Black Myth: Wukong Expanded (${BMW_EXPANDED.length} items)...`);
  await upsertBatch(BMW_EXPANDED);

  const lolUniverse = await fetchLolFullUniverse();
  console.log(`📦 Syncing League of Legends Universe (${lolUniverse.length} entries)...`);
  if (lolUniverse.length > 0) {
    await upsertBatch(lolUniverse);
  }

  console.log(`📦 Syncing Teamfight Tactics Meta (${TFT_EXPANDED.length} entries)...`);
  await upsertBatch(TFT_EXPANDED);

  console.log('🎉 COMPREHENSIVE UNIVERSE UPDATE COMPLETED SUCCESSFULLY!');
}

main().catch((err) => console.error('Full Universe Update Error:', err));
