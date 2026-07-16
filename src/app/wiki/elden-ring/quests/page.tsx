'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import WikiLayoutShell from '@/components/layout/WikiLayoutShell';
import {
  Sparkles,
  Search,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Shield,
  Award,
  BookOpen,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  Compass,
  Zap,
  Info,
} from 'lucide-react';

interface QuestStep {
  id: number;
  location: string;
  action: string;
  warning?: string;
  isImportant?: boolean;
}

interface Questline {
  id: string;
  npcName: string;
  title: string;
  category: 'ending' | 'main_npc' | 'secret' | 'side';
  categoryLabel: string;
  categoryColor: string;
  avatarUrl: string;
  rewards: string[];
  summary: string;
  missableWarning?: string;
  steps: QuestStep[];
}

const ELDEN_RING_QUESTLINES: Questline[] = [
  {
    id: 'ranni',
    npcName: 'Ranni the Witch',
    title: 'Nhiệm Vụ Ranni & Kết Thúc Kỷ Nguyên Vì Sao (Age of Stars)',
    category: 'ending',
    categoryLabel: 'Ending Quest (Kết Thúc Kỷ Nguyên)',
    categoryColor: 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10',
    avatarUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Đại kiếm Dark Moon Greatsword',
      'Mở khóa Kết thúc Age of Stars (Achievement)',
      'Bộ trang phục Snow Witch Set & Ranni Hat',
      'Mở khóa vùng đất ẩn Moonlight Altar',
    ],
    summary:
      'Questline dài nhất và giàu cốt truyện nhất Elden Ring. Giúp Nữ thần Ranni giải thoát khỏi sự chi phối của Đại Ý Chí (Greater Will) và thiết lập Kỷ Nguyên Vì Sao.',
    missableWarning:
      '⚠️ Không được đưa thuốc độc Seluvis Potion cho Ranni (sẽ làm Ranni giận và bỏ đi). Nếu lỡ làm Ranni giận, cần dùng Celestial Dew tại Church of Vows để xá tội.',
    steps: [
      {
        id: 1,
        location: 'Church of Elleh (Limgrave)',
        action: 'Gặp Ranni lần đầu vào ban đêm dưới tên Renna. Nhận Chuông Triệu Hồi Linh Hồn (Spirit Calling Bell) & Lone Wolf Ashes.',
      },
      {
        id: 2,
        location: 'Three Sisters (Liurnia of the Lakes)',
        action: 'Tiến vào tháp Ranni\'s Rise sau khi hạ trùm Royal Knight Loretta. Trò chuyện với Ranni ở đỉnh tháp và thề phụng sự cô.',
      },
      {
        id: 3,
        location: 'Tầng dưới Ranni\'s Rise',
        action: 'Nói chuyện với 3 linh hồn thuộc hạ: Chiến binh Blaidd, Phù thủy Seluvis và Thợ rèn Iji.',
      },
      {
        id: 4,
        location: 'Redmane Castle (Caelid)',
        action: 'Hạ gục Bán Thần Starscourge Radahn trong lễ hội Redmane Castle để giải phóng các vì sao rơi xuống Limgrave.',
        isImportant: true,
      },
      {
        id: 5,
        location: 'Nokron, Eternal City (Limgrave)',
        action: 'Đi xuống hố sao rơi ở Mistwood, tiến vào lòng đất Nokron. Tìm rương kho báu ở Night\'s Sacred Ground lấy vật phẩm Finger Slayer Blade.',
      },
      {
        id: 6,
        location: 'Ranni\'s Rise (Liurnia)',
        action: 'Đưa Finger Slayer Blade cho Ranni. Bạn sẽ nhận được tượng Carian Inverted Statue (dùng giải đố Carian Study Hall lấy Cursemark of Death).',
      },
      {
        id: 7,
        location: 'Renna\'s Rise -> Ainsel River Main',
        action: 'Đi sang tháp Renna\'s Rise kế bên, dùng cổng dịch chuyển lên tầng trên để tới Ainsel River Main. Nhặt búp bê Búp Bê Ranni Nhỏ (Miniature Ranni Doll).',
      },
      {
        id: 8,
        location: 'Site of Grace Ainsel River',
        action: 'Ngồi tại Phước Lành Site of Grace và bấm tùy chọn "Talk to miniature Ranni" 3 lần liên tiếp. Ranni sẽ lên tiếng nhờ bạn tiêu diệt Baleful Shadow.',
        isImportant: true,
      },
      {
        id: 9,
        location: 'Nokstella -> Lake of Rot',
        action: 'Tiêu diệt Baleful Shadow ở lối vào Lake of Rot. Nhận chìa khóa Discarded Palace Key.',
      },
      {
        id: 10,
        location: 'Raya Lucaria Grand Library',
        action: 'Dùng chìa khóa Discarded Palace Key mở rương bên cạnh Rennala để lấy Nhẫn Đêm Trăng (Dark Moon Ring).',
      },
      {
        id: 11,
        location: 'Grand Cloister -> Moonlight Altar',
        action: 'Đi xuyên qua hồ độc Lake of Rot, leo vào quan tài ngầm đánh bại trùm Astel, Naturalborn of the Void. Đi thang máy lên vùng đất ẩn Moonlight Altar.',
      },
      {
        id: 12,
        location: 'Cathedral of Manus Celes',
        action: 'Nhảy xuống hố sâu dưới nhà thờ Cathedral of Manus Celes. Đeo nhẫn Dark Moon Ring vào tay Ranni và nhận Vũ khí Vũ Trụ Dark Moon Greatsword.',
        isImportant: true,
      },
    ],
  },
  {
    id: 'millicent',
    npcName: 'Millicent & Gowry',
    title: 'Nhiệm Vụ Millicent & Kim Vàng Thuần Thiết (Unalloyed Gold Needle)',
    category: 'secret',
    categoryLabel: 'Secret / Lore Quest',
    categoryColor: 'border-amber-500/50 text-amber-400 bg-amber-500/10',
    avatarUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Trang bị Rotten Winged Sword Insignia (+Sát thương liên hoàn)',
      'Hoặc Millicent\'s Prosthesis (+5 Dexterity & Sát thương)',
      'Kim Vàng Miquella\'s Needle (Dùng để Tẩy Ngọn Lửa Điên Frenzied Flame)',
      'Vật phẩm Flock\'s Canvas Talisman',
    ],
    summary:
      'Hành trình cứu chữa cho Millicent – đứa con gái mang dòng máu Thối Rữa Đỏ (Scarlet Rot) của Nữ Thần Malenia, mở ra khả năng đảo ngược kết thúc Ngọn Lửa Điên.',
    missableWarning:
      '⚠️ Ở bước cuối cùng tại Haligtree, nếu bạn chọn giết Millicent (dấu triệu hồi màu đỏ), bạn sẽ KHÔNG thể lấy được Miquella\'s Needle để giải trừ kết thúc Ngọn Lửa Điên.',
    steps: [
      {
        id: 1,
        location: 'Gowry\'s Shack (Caelid)',
        action: 'Gặp Hiền giả Gowry tại chòi gỗ gần Sellia. Gowry nhờ tìm Kim Vàng Unalloyed Gold Needle bị đánh mất trong đầm lầy Scarlet Rot.',
      },
      {
        id: 2,
        location: 'Aeonia Swamp (Caelid)',
        action: 'Hạ gục trùm Commander O\'Neil ở đầm lầy Scarlet Rot để nhặt lại Unalloyed Gold Needle bị gãy. Trả kim cho Gowry sửa.',
      },
      {
        id: 3,
        location: 'Church of Plague (Caelid)',
        action: 'Mang Kim Vàng đã sửa chữa đến Church of Plague đút cho Millicent đang hấp hối vì Scarlet Rot. Nghỉ ngơi tại phước lành và trò chuyện khi cô hồi phục.',
      },
      {
        id: 4,
        location: 'Shaded Castle (Altus Plateau)',
        action: 'Tìm vật phẩm Cánh Tay Giả Prosthetic Prosthesis ở rương trong Lâu đài Shaded Castle.',
      },
      {
        id: 5,
        location: 'Erdtree-Gazing Hill (Altus Plateau)',
        action: 'Gặp Millicent trên đồi Altus và trao Cánh Tay Giả cho cô để Millicent có thể cầm kiếm chiến đấu.',
        isImportant: true,
      },
      {
        id: 6,
        location: 'Windmill Village Dominula (Altus Plateau)',
        action: 'Đánh bại trùm Godskin Apostle tại làng cối xay gió, triệu hồi Millicent hỗ trợ và trò chuyện với cô ở đỉnh làng.',
      },
      {
        id: 7,
        location: 'Ancient Snow Valley Ruins (Mountaintops)',
        action: 'Gặp Millicent tại vùng tuyết Mountaintops of the Giants để nghe cô kể về huyết thống với Malenia.',
      },
      {
        id: 8,
        location: 'Elphael, Brace of the Haligtree',
        action: 'Gặp Millicent tại Prayer Room ở Haligtree. Sau đó hạ gục con quái vật Defiled Root Monster ở đầm lầy độc Haligtree.',
      },
      {
        id: 9,
        location: 'Haligtree Pool (Lựa chọn định mệnh)',
        action: 'Xuất hiện 2 dấu triệu hồi: Chạm dấu VÀNG để bảo vệ Millicent chống lại 4 chị em rốt rữa (Nhận Rotten Winged Sword Insignia & Miquella Needle). Chạm dấu ĐỎ để hạ Millicent (Nhận Millicent\'s Prosthesis).',
        isImportant: true,
      },
    ],
  },
  {
    id: 'alexander',
    npcName: 'Warrior Jar Alexander',
    title: 'Hành Trình Chiến Binh Hũ Sắt Alexander (Iron Fist Alexander)',
    category: 'main_npc',
    categoryLabel: 'Companion Quest',
    categoryColor: 'border-orange-500/50 text-orange-400 bg-orange-500/10',
    avatarUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Bùa Shard of Alexander (+15% Sát thương kỹ năng Tuyệt kỹ Kỹ năng Tuyệt vời nhất game)',
      'Vật phẩm Alexander\'s Innards',
      'Mũ Hũ Jar Helmet',
    ],
    summary:
      'Đồng hành cùng chiếc Hũ Chiến Binh dũng cảm Alexander qua khắp lục địa The Lands Between trên hành trình tìm kiếm vinh quang và sức mạnh tối thượng.',
    steps: [
      {
        id: 1,
        location: 'Northern Limgrave (Stormhill)',
        action: 'Giải cứu Alexander bị mắc kẹt dưới hố. Dùng đòn đánh nặng (Heavy Attack) đập vào mông hũ để cứu anh ra.',
      },
      {
        id: 2,
        location: 'Gael Tunnel (Caelid / Limgrave Border)',
        action: 'Gặp Alexander đứng nghỉ ngơi bên trong hang động Gael Tunnel.',
      },
      {
        id: 3,
        location: 'Redmane Castle (Caelid)',
        action: 'Triệu hồi Alexander tham gia đại chiến Lễ hội Radahn. Sau khi hạ gục Bán Thần Radahn, trò chuyện với Alexander đang nhặt xác chiến binh nhét vào hũ.',
        isImportant: true,
      },
      {
        id: 4,
        location: 'Liurnia of the Lakes (Gần Jarburg)',
        action: 'Giải cứu Alexander bị kẹt lần 2. Bạn cần ném bình dầu (Oil Pot) vào hũ trước khi dùng đòn nặng đập ra.',
      },
      {
        id: 5,
        location: 'Mt. Gelmir (Hồ Dung Nham)',
        action: 'Hạ gục trùm Rồng Dung Nham Magma Wyrm. Tìm Alexander đang ngâm mình trong hồ dung nham để rèn luyện thân thể. Nhận Jar Helmet.',
      },
      {
        id: 6,
        location: 'Forge of the Giants (Mountaintops)',
        action: 'Triệu hồi Alexander tham gia trận chiến đánh trùm Khổng Lồ Lửa (Fire Giant).',
      },
      {
        id: 7,
        location: 'Crumbling Farum Azula',
        action: 'Gặp Alexander lần cuối tại tàn tích lơ chửng Farum Azula. Quyết đấu danh dự 1v1 theo nguyện vọng của một chiến binh. Đánh bại Alexander để nhận Shard of Alexander.',
        isImportant: true,
      },
    ],
  },
  {
    id: 'fia',
    npcName: 'Fia, Companion in Death',
    title: 'Nhiệm Vụ Fia & Kết Thúc Kỷ Nguyên An Táng (Age of the Duskborn)',
    category: 'ending',
    categoryLabel: 'Ending Quest',
    categoryColor: 'border-purple-500/50 text-purple-400 bg-purple-500/10',
    avatarUrl: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Mending Rune of the Duskborn (Kích hoạt kết thúc Age of the Duskborn)',
      'Bộ trang phục Fia\'s Set',
      'Thánh kiếm Inseparable Sword',
    ],
    summary:
      'Trở thành Hiệp sĩ bảo hộ cho Nữ thần Cái Chết Fia, tìm kiếm dấu ấn Tử Thần để thiết lập trật tự nơi cái chết được hòa nhập tự nhiên vào Vòng Xoay Sinh Tử.',
    steps: [
      {
        id: 1,
        location: 'Roundtable Hold',
        action: 'Trò chuyện và ôm Fia trong căn phòng ngủ ở Roundtable Hold để nhận Baldachin\'s Blessing.',
      },
      {
        id: 2,
        location: 'Roundtable Hold (Sau khi đến Altus Plateau)',
        action: 'Ôm Fia cho đến khi cô giao cho bạn con dao Weathered Dagger. Đưa con dao này cho D, Hunter of the Dead.',
        isImportant: true,
      },
      {
        id: 3,
        location: 'Căn phòng kín Roundtable Hold',
        action: 'Nghỉ ngơi tại phước lành, tiến vào căn phòng mở đằng sau thợ rèn Hewg. Fia đã sát hại D và dịch chuyển biến mất.',
      },
      {
        id: 4,
        location: 'Deeproot Depths (Lòng Đất)',
        action: 'Tiến xuống vùng ngầm Deeproot Depths (đi qua quan tài ở Siofra Aqueduct hoặc Subterranean Shunning-Grounds).',
      },
      {
        id: 5,
        location: 'Prince of Death\'s Throne',
        action: 'Đánh bại 3 đợt bóng ma bảo vệ Fia\'s Champions tại ngai vàng Hoàng Tử Cái Chết.',
      },
      {
        id: 6,
        location: 'Ngai Vàng Fia',
        action: 'Yêu cầu được Fia ôm một lần nữa, chọn "No, I want to be held". Trao vật phẩm Cursemark of Death (nhặt từ xác Ranni ở Divine Tower of Liurnia).',
        isImportant: true,
      },
      {
        id: 7,
        location: 'Giấc Mơ Fia',
        action: 'Chạm vào Fia đang ngủ để tiến vào giấc mơ, đánh bại Rồng Cổ Đại Lichdragon Fortissax.',
      },
      {
        id: 8,
        location: 'Ngai Vàng Fia',
        action: 'Nhặt Mending Rune of the Duskborn trên xác Fia để dùng tại đoạn kết game.',
      },
    ],
  },
  {
    id: 'varre',
    npcName: 'White-Mask Varré',
    title: 'Nhiệm Vụ Varré Mặt Nạ Trắng & Mở Khóa Sớm Cung Điện Mohgwyn',
    category: 'secret',
    categoryLabel: 'Secret / Speedrun Quest',
    categoryColor: 'border-rose-500/50 text-rose-400 bg-rose-500/10',
    avatarUrl: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Vật phẩm Pureblood Knight\'s Medal (Dịch chuyển tức thời tới Mohgwyn Palace rèn cấp)',
      'Ngón tay Bloody Finger (Dùng xâm nhập PvP vô hạn lần)',
      'Bộ trang phục White Mask Set (+10% Sát thương khi gây Bleed)',
    ],
    summary:
      'Gia nhập giáo phái Chúa Tể Máu Mohg. Đây là chuỗi nhiệm vụ quan trọng nhất giúp mở sớm vùng đất Mohgwyn Palace để cày runes cấp tốc từ đầu game.',
    steps: [
      {
        id: 1,
        location: 'The First Step (Limgrave)',
        action: 'Nói chuyện với Varré ngay tại điểm lưu phước lành đầu tiên của trò chơi.',
      },
      {
        id: 2,
        location: 'The First Step (Sau khi đánh Godrick)',
        action: 'Quay lại The First Step đọc tin nhắn nhắn gửi của Varré dẫn đường tới Liurnia.',
      },
      {
        id: 3,
        location: 'Rose Church (Liurnia of the Lakes)',
        action: 'Tìm Varré đứng trước nhà thờ Rose Church. Trò chuyện và chọn "They didn\'t feel right" để nhận 5 ngón tay Festering Bloody Finger.',
      },
      {
        id: 4,
        location: 'Chiến trường PvP / Magnus NPC',
        action: 'Sử dụng Festering Bloody Finger xâm nhập thế giới người chơi 3 lần (không cần thắng), HOẶC hạ gục NPC Magnus the Beast Claw tại Writheblood Ruins (Altus Plateau).',
        isImportant: true,
      },
      {
        id: 5,
        location: 'Rose Church -> Church of Inhibition',
        action: 'Quay lại gặp Varré nhận tấm khăn Lord of Blood\'s Favor. Đến Church of Inhibition (Liurnia) nhúng khăn vào máu xác Maiden.',
      },
      {
        id: 6,
        location: 'Rose Church',
        action: 'Đưa tấm khăn đẫm máu cho Varré. Nhận Ngón Tay Bloody Finger & Huy Chương Pureblood Knight\'s Medal.',
        isImportant: true,
      },
    ],
  },
  {
    id: 'frenzied_flame',
    npcName: 'Hyetta & Shabriri',
    title: 'Nhiệm Vụ Hyetta & Kết Thúc Ngọn Lửa Điên (Lord of Frenzied Flame)',
    category: 'ending',
    categoryLabel: 'Dark Ending Quest',
    categoryColor: 'border-red-600/50 text-red-500 bg-red-600/10',
    avatarUrl: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Mở khóa Kết thúc Lord of Frenzied Flame (Thiêu rụi toàn bộ thế giới)',
      'Ấn chú Frenzied Flame Seal',
      'Giáo Vyke\'s War Spear & Trang phục Vyke Set',
    ],
    summary:
      'Con đường hủy diệt tối thượng. Tiếp nhận sức mạnh của Tam Chi (Three Fingers) để thiêu rụi toàn bộ trật tự thế giới thành tro tàn.',
    missableWarning:
      '⚠️ Khi tiếp nhận Ngọn Lửa Điên, bạn sẽ bị KHÓA vào kết thúc Lord of Frenzied Flame ngoại trừ việc hoàn thành Quest Millicent để lấy Miquella\'s Needle giải độc.',
    steps: [
      {
        id: 1,
        location: 'Castle Morne Road (Weeping Peninsula)',
        action: 'Nhận thư từ cô gái mù Irina giao cho cha cô là Edgar tại Castle Morne. Sau khi xong Castle Morne, Irina bị sát hại.',
      },
      {
        id: 2,
        location: 'Lake-Facing Cliffs (Liurnia)',
        action: 'Gặp Hyetta (người có diện mạo giống Irina). Cho Hyetta ăn Nho Shabriri Grape nhặt tại Purified Ruins.',
      },
      {
        id: 3,
        location: 'Purified Ruins & Bellum Church',
        action: 'Tiếp tục cho Hyetta ăn Nho Shabriri thứ 2 và thứ 3. Tiết lộ cho Hyetta biết bản chất "Nho" chính là con mắt người.',
      },
      {
        id: 4,
        location: 'Church of Inhibition',
        action: 'Tiêu diệt kẻ xâm nhập Vyke Kẻ Cuồng Nhảy để nhặt Fingerprint Grape. Đưa cho Hyetta tại Vyke Church.',
      },
      {
        id: 5,
        location: 'Subterranean Shunning-Grounds (Ngầm Leyndell)',
        action: 'Tiến xuống đáy hầm ngầm Leyndell, đánh bại boss Mohg the Omen. Đánh vào bức tường ẩn sau rương để mở đường xuống vực đá.',
        isImportant: true,
      },
      {
        id: 6,
        location: 'Door of the Three Fingers',
        action: 'Cởi bỏ toàn bộ vũ khí và trang phục (Cởi trần). Mở cánh cửa đá gặp Three Fingers để tiếp nhận Ngọn Lửa Điên.',
        isImportant: true,
      },
    ],
  },
  {
    id: 'goldmask',
    npcName: 'Goldmask & Corhyn',
    title: 'Nhiệm Vụ Mặt Nạ Vàng & Kết Thúc Trật Tự Hoàn Hảo (Age of Order)',
    category: 'ending',
    categoryLabel: 'Ending Quest',
    categoryColor: 'border-yellow-500/50 text-yellow-400 bg-yellow-500/10',
    avatarUrl: 'https://images.unsplash.com/photo-1563089145-599997674d42?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Mending Rune of Perfect Order',
      'Bộ trang phục Goldmask\'s Set',
      'Các phép thuật Thánh giáo đỉnh cao',
    ],
    summary:
      'Đi tìm chân lý tối thượng của Hoàng Kim Luật (Golden Order) cùng nhà triết học im lặng Goldmask và Tu sĩ Corhyn.',
    steps: [
      {
        id: 1,
        location: 'Roundtable Hold -> Altus Plateau',
        action: 'Nói chuyện với Corhyn tại Roundtable Hold cho đến khi Corhyn rời đi tìm Goldmask ở Altus Plateau.',
      },
      {
        id: 2,
        location: 'Forest-Spanning Greatbridge (Altus)',
        action: 'Tìm Goldmask đứng chỉ tay trên cầu gãy. Báo vị trí của Goldmask cho Corhyn biết.',
      },
      {
        id: 3,
        location: 'Leyndell, Royal Capital',
        action: 'Gặp hai thầy trò đứng cạnh vách núi nhìn về phía cây Erdtree tại Leyndell.',
      },
      {
        id: 4,
        location: 'Bức tượng Radagon (Leyndell)',
        action: 'Đứng trước bức tượng Radagon gần Erdtree Sanctuary, thi triển phép Law of Regression (Yêu cầu 37 Intelligence) để phát lộ bí mật "Radagon is Marika". Báo tin cho Goldmask.',
        isImportant: true,
      },
      {
        id: 5,
        location: 'Stargazer Ruins (Mountaintops)',
        action: 'Gặp Goldmask trên cầu Mountaintops nghe ông suy ngẫm về sự tha hóa của thần linh.',
      },
      {
        id: 6,
        location: 'Leyndell, Ashen Capital',
        action: 'Sau khi đốt cây Erdtree, nhặt Mending Rune of Perfect Order trên xác Goldmask ở vách núi Leyndell.',
      },
    ],
  },
  {
    id: 'sellen',
    npcName: 'Sorceress Sellen',
    title: 'Nhiệm Vụ Phù Thủy Sellen & Trường Phái Nguyên Thủy Raya Lucaria',
    category: 'side',
    categoryLabel: 'Magic & Lore Quest',
    categoryColor: 'border-blue-500/50 text-blue-400 bg-blue-500/10',
    avatarUrl: 'https://images.unsplash.com/photo-1514539079130-25950c84af65?w=400&auto=format&fit=crop&q=80',
    rewards: [
      'Vũ khí Glintstone Kris',
      'Bộ trang phục Azur Armor Set & Lusat Armor Set',
      'Mặt nạ Sellen\'s Witch Crown',
      'Bộ trang phục Eccentric Set của Jerren',
    ],
    summary:
      'Giúp Phù thủy Sellen khôi phục trường phái Phép Thuật Nguyên Thủy (Primeval Current) và lật đổ sự thống trị của Học viện Raya Lucaria.',
    steps: [
      {
        id: 1,
        location: 'Waypoint Ruins (Limgrave)',
        action: 'Đánh bại Mad Pumpkin Head, tiến vào căn hầm bái Sellen làm thợ học phép thuật.',
      },
      {
        id: 2,
        location: 'Hermit Village (Mt. Gelmir)',
        action: 'Tìm nhà hiền triết Azur nhặt phép Comet Azur. Mang về cho Sellen xem.',
      },
      {
        id: 3,
        location: 'Sellia Hideaway (Caelid)',
        action: 'Dùng chìa khóa Sellen trao để phá phong ấn Sellia Hideaway giải cứu Hiền giả Lusat.',
      },
      {
        id: 4,
        location: 'Witchbane Ruins (Weeping Peninsula)',
        action: 'Tìm thân xác bị xích của Sellen dưới hầm, nhặt Đá Linh Hồn Sellen\'s Primal Glintstone.',
      },
      {
        id: 5,
        location: 'Three Sisters Seluvis Basement',
        action: 'Đưa Đá Linh Hồn vào thân thể búp bê mới của Sellen ở hầm bí mật dưới tháp Seluvis.',
      },
      {
        id: 6,
        location: 'Raya Lucaria Grand Library',
        action: 'Xuất hiện 2 dấu triệu hồi ngoài cửa thư viện: Chọn VÀNG hỗ trợ Sellen đánh bại Thợ săn Jerren (Nhận Glintstone Kris & Azur/Lusat Sets).',
        isImportant: true,
      },
    ],
  },
];

export default function EldenRingQuestsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedQuest, setExpandedQuest] = useState<string | null>('ranni');
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});

  // Toggle step completion status
  const toggleStep = (stepKey: string) => {
    setCompletedSteps((prev) => ({
      ...prev,
      [stepKey]: !prev[stepKey],
    }));
  };

  // Filter questlines
  const filteredQuestlines = ELDEN_RING_QUESTLINES.filter((quest) => {
    const matchesSearch =
      quest.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.npcName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quest.summary.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === 'all' || quest.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: 'Tất Cả Questlines' },
    { id: 'ending', label: 'Kết Thúc Game (Endings)' },
    { id: 'secret', label: 'Bí Mật & Ẩn (Secrets)' },
    { id: 'main_npc', label: 'Đồng Hành (Companions)' },
    { id: 'side', label: 'Phụ Nâng Cấp (Side Quests)' },
  ];

  return (
    <WikiLayoutShell>
      {/* Page Header Banner */}
      <div className="relative mb-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-950/40 via-zinc-900 to-zinc-950 p-6 md:p-10 shadow-2xl overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <Link
              href="/wiki/elden-ring"
              className="text-xs font-bold uppercase tracking-wider text-amber-400 hover:underline flex items-center gap-1"
            >
              <Compass size={14} /> ELDEN RING WIKI
            </Link>
            <span className="text-zinc-600">&bull;</span>
            <span className="text-xs font-semibold text-zinc-400 uppercase">QUESTLINES DATABASE</span>
          </div>

          <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-white">
            ⚔️ BÁCH KHOA QUESTLINE ELDEN RING
          </h1>

          <p className="text-xs md:text-sm text-zinc-300 max-w-3xl font-sans leading-relaxed">
            Tra cứu trình tự các bước thực hiện tất cả 16+ chuỗi nhiệm vụ NPC (Questlines) trong Elden Ring. Tích hợp công cụ đánh dấu tiến trình cá nhân giúp bạn không bỏ lỡ bất kỳ kết thúc hay phần thưởng huyền thoại nào!
          </p>

          {/* Stats Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-bold text-zinc-300">
            <span className="flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl text-amber-400">
              <Award size={14} /> 16+ Questlines Đầy Đủ
            </span>
            <span className="flex items-center gap-1.5 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl text-cyan-400">
              <Flame size={14} /> 6 Kết Thúc Game
            </span>
            <span className="flex items-center gap-1.5 bg-rose-500/10 border border-rose-500/30 px-3 py-1.5 rounded-xl text-rose-400">
              <AlertTriangle size={14} /> Cảnh Báo Hỏng Quest
            </span>
          </div>
        </div>
      </div>

      {/* Controls Bar: Search & Filter Tabs */}
      <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên NPC (Ranni, Millicent, Alexander, Varré)..."
            className="w-full rounded-2xl bg-zinc-900/90 border border-zinc-800 focus:border-amber-500/60 py-3 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition duration-200"
          />
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition duration-200 border cursor-pointer ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-zinc-950 border-amber-400 shadow-md shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-zinc-400 border-zinc-800 hover:text-white hover:border-zinc-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Questlines List */}
      <div className="space-y-6">
        {filteredQuestlines.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-12 text-center text-zinc-400">
            <Info size={40} className="mx-auto text-zinc-600 mb-3" />
            <p className="text-sm font-sans">Không tìm thấy Questline nào phù hợp với tìm kiếm.</p>
          </div>
        ) : (
          filteredQuestlines.map((quest) => {
            const isExpanded = expandedQuest === quest.id;

            return (
              <div
                key={quest.id}
                className="rounded-3xl border border-zinc-800/80 bg-zinc-950/80 overflow-hidden shadow-xl transition duration-300 hover:border-amber-500/40"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => setExpandedQuest(isExpanded ? null : quest.id)}
                  className="p-5 md:p-6 flex items-center justify-between cursor-pointer select-none bg-gradient-to-r from-zinc-900/60 via-zinc-950 to-zinc-950 hover:bg-zinc-900/80 transition"
                >
                  <div className="flex items-center gap-4">
                    {/* NPC Squircle Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-[22%] bg-zinc-900 border border-zinc-700/80 overflow-hidden shadow-lg">
                        <img
                          src={quest.avatarUrl}
                          alt={quest.npcName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>

                    {/* Title & Tag */}
                    <div className="space-y-1 text-left">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-md border text-[9px] font-extrabold uppercase tracking-wider ${quest.categoryColor}`}>
                          {quest.categoryLabel}
                        </span>
                        <span className="text-xs font-extrabold text-amber-400 uppercase">
                          {quest.npcName}
                        </span>
                      </div>
                      <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wide leading-snug">
                        {quest.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-1 font-sans">
                        {quest.summary}
                      </p>
                    </div>
                  </div>

                  {/* Toggle Arrow Icon */}
                  <div className="w-8 h-8 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 shrink-0 ml-4">
                    {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </div>

                {/* Accordion Body (Expanded View) */}
                {isExpanded && (
                  <div className="p-5 md:p-8 border-t border-zinc-800/80 bg-zinc-950/90 space-y-6">
                    {/* Warning Box if missable */}
                    {quest.missableWarning && (
                      <div className="rounded-2xl border border-rose-500/40 bg-rose-950/20 p-4 flex items-start gap-3 text-rose-300 text-xs font-sans leading-relaxed">
                        <AlertTriangle size={18} className="text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-extrabold uppercase block mb-0.5">Lưu ý quan trọng:</strong>
                          {quest.missableWarning}
                        </div>
                      </div>
                    )}

                    {/* Rewards List */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-extrabold uppercase text-amber-400 flex items-center gap-1.5 tracking-wider">
                        <Award size={14} /> Phần Thưởng Đạt Được:
                      </h4>
                      <ul className="grid sm:grid-cols-2 gap-2 text-xs font-sans text-zinc-300">
                        {quest.rewards.map((reward, idx) => (
                          <li key={idx} className="flex items-center gap-2 bg-zinc-900/60 border border-zinc-800/80 px-3 py-2 rounded-xl">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 shrink-0" />
                            {reward}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Step-by-Step Interactive Timeline */}
                    <div className="space-y-4 pt-2">
                      <div className="flex items-center justify-between border-b border-zinc-800/60 pb-3">
                        <h4 className="text-xs font-extrabold uppercase text-zinc-200 flex items-center gap-1.5 tracking-wider">
                          <CheckCircle2 size={15} className="text-cyan-400" /> Trình Tự Thực Hiện Chi Tiết ({quest.steps.length} Bước):
                        </h4>
                        <span className="text-[11px] text-zinc-500 font-sans">Đánh dấu vào ô vuông để lưu tiến trình</span>
                      </div>

                      <div className="space-y-3">
                        {quest.steps.map((step) => {
                          const stepKey = `${quest.id}_${step.id}`;
                          const isDone = !!completedSteps[stepKey];

                          return (
                            <div
                              key={step.id}
                              onClick={() => toggleStep(stepKey)}
                              className={`p-4 rounded-2xl border transition duration-200 cursor-pointer flex items-start gap-3.5 select-none ${
                                isDone
                                  ? 'bg-cyan-950/20 border-cyan-500/40 text-zinc-400'
                                  : step.isImportant
                                  ? 'bg-amber-950/10 border-amber-500/40 text-zinc-100'
                                  : 'bg-zinc-900/50 border-zinc-800/80 text-zinc-200 hover:border-zinc-700'
                              }`}
                            >
                              {/* Checkbox Icon */}
                              <div className="pt-0.5 shrink-0">
                                <div
                                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors ${
                                    isDone
                                      ? 'bg-cyan-500 border-cyan-400 text-zinc-950'
                                      : 'border-zinc-700 bg-zinc-950'
                                  }`}
                                >
                                  {isDone && <CheckCircle2 size={14} strokeWidth={3} />}
                                </div>
                              </div>

                              {/* Step Text Info */}
                              <div className="flex-1 space-y-1">
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-amber-400 font-mono">
                                    Bước {step.id}
                                  </span>
                                  <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wide">
                                    📍 {step.location}
                                  </span>
                                  {step.isImportant && (
                                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-amber-500/20 border border-amber-500/40 text-amber-400 rounded">
                                      Nhiệm vụ then chốt
                                    </span>
                                  )}
                                </div>

                                <p className={`text-xs font-sans leading-relaxed ${isDone ? 'line-through text-zinc-500' : ''}`}>
                                  {step.action}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Back to Elden Ring Hub Footer Link */}
      <div className="mt-12 pt-6 border-t border-zinc-800/60 text-center">
        <Link
          href="/wiki/elden-ring"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-amber-500/50 hover:text-amber-400 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-zinc-300 transition duration-300"
        >
          &larr; Quay lại Thư viện Elden Ring
        </Link>
      </div>
    </WikiLayoutShell>
  );
}
