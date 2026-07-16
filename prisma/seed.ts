import 'dotenv/config';
import { PrismaClient, Role } from '../src/generated/prisma';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import bcrypt from 'bcryptjs';

const adapter = new PrismaLibSql({
  url: process.env.DATABASE_URL || 'file:./dev.db',
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Starting database seeding for multi-game wiki...');

  // 1. Create a default ADMIN user if not exists
  const adminEmail = 'admin@gamewiki.vn';
  let admin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!admin) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    admin = await prisma.user.create({
      data: {
        username: 'Wigaki Team',
        email: adminEmail,
        password: hashedPassword,
        role: Role.ADMIN,
      },
    });
    console.log('✅ Created default system author: Wigaki Team');
  } else {
    console.log('ℹ️ Default author already exists');
  }

  // 2. Define and seed Games
  const gamesData = [
    {
      name: 'Elden Ring',
      slug: 'elden-ring',
      logoUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=100&h=100&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80',
      description: 'Hành động nhập vai Souls-like thế giới mở huyền thoại từ FromSoftware. Khám phá Vùng Đất Giữa (The Lands Between) để hồi phục Elden Ring.',
    },
    {
      name: 'Genshin Impact',
      slug: 'genshin-impact',
      logoUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=100&h=100&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=1200&auto=format&fit=crop&q=80',
      description: 'Hành động nhập vai thế giới mở phong cách anime từ miHoYo. Đồng hành cùng Nhà Lữ Hành khám phá thế giới Teyvat kỳ bí.',
    },
    {
      name: 'League of Legends',
      slug: 'lien-minh-huyen-thoai',
      logoUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=100&h=100&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80',
      description: 'Game đấu trường trực tuyến nhiều người chơi (MOBA) hàng đầu thế giới từ Riot Games. Chiến đấu trên Bản đồ Summoner Rift huyền thoại.',
    }
  ];

  const gamesMap: Record<string, any> = {};

  for (const gameInfo of gamesData) {
    let game = await prisma.game.findUnique({
      where: { slug: gameInfo.slug },
    });

    if (!game) {
      game = await prisma.game.create({
        data: gameInfo,
      });
      console.log(`✅ Created Game: ${game.name}`);
    } else {
      console.log(`ℹ️ Game ${game.name} already exists`);
    }
    gamesMap[game.slug] = game;
  }

  // 3. Seed Game-Specific Categories
  const eldenRing = gamesMap['elden-ring'];
  const genshin = gamesMap['genshin-impact'];
  const lol = gamesMap['lien-minh-huyen-thoai'];

  const categoriesToSeed = [
    // Elden Ring
    { gameId: eldenRing.id, name: 'Nhân vật', slug: 'nhan-vat', description: 'Cốt truyện các Á thần và NPC trong Vùng Đất Giữa' },
    { gameId: eldenRing.id, name: 'Vũ khí', slug: 'vu-khi', description: 'Thông số kiếm, gậy phép và trang bị nâng cấp' },
    { gameId: eldenRing.id, name: 'Bản đồ & Cốt truyện', slug: 'ban-do-cot-truyen', description: 'Địa danh lịch sử và truyền thuyết cổ đại' },
    { gameId: eldenRing.id, name: 'Hướng dẫn tân thủ', slug: 'huong-dan-tan-thu', description: 'Cách build nhân vật cho người mới bắt đầu' },

    // Genshin Impact
    { gameId: genshin.id, name: 'Nhân vật', slug: 'nhan-vat', description: 'Kỹ năng, thiên phú và lối lên thánh di vật của nhân vật' },
    { gameId: genshin.id, name: 'Vũ khí', slug: 'vu-khi', description: 'Thần khí 5 sao, kiếm đơn, cung tên, đại kiếm' },
    { gameId: genshin.id, name: 'Nhiệm vụ & Cốt truyện', slug: 'nhiem-vu-cot-truyen', description: 'Hướng dẫn giải đố và chuỗi nhiệm vụ Ma Thần' },

    // League of Legends
    { gameId: lol.id, name: 'Tướng', slug: 'tuong', description: 'Bộ kỹ năng và combo hướng dẫn nâng cao' },
    { gameId: lol.id, name: 'Trang bị', slug: 'trang-bi', description: 'Các món trang bị huyền thoại trong đấu trường' },
    { gameId: lol.id, name: 'Bản đồ Summoner Rift', slug: 'ban-do', description: 'Chiến thuật đi rừng và di chuyển kiểm soát mục tiêu' }
  ];

  const categoriesMap: Record<string, string> = {};

  for (const cat of categoriesToSeed) {
    let existingCat = await prisma.category.findUnique({
      where: {
        slug_gameId: {
          slug: cat.slug,
          gameId: cat.gameId
        }
      }
    });

    if (!existingCat) {
      existingCat = await prisma.category.create({
        data: cat,
      });
      console.log(`✅ Created category: ${cat.name} for Game ID ${cat.gameId}`);
    } else {
      console.log(`ℹ️ Category ${cat.name} already exists for Game ID ${cat.gameId}`);
    }
    categoriesMap[`${cat.slug}_${cat.gameId}`] = existingCat.id;
  }

  // 4. Seed Map Article for LoL
  const lolMapCatId = categoriesMap[`ban-do_${lol.id}`];
  if (lolMapCatId) {
    await prisma.article.upsert({
      where: {
        slug_gameId: {
          slug: 'tong-quan-ban-do-summoner-rift',
          gameId: lol.id
        }
      },
      update: {},
      create: {
        gameId: lol.id,
        categoryId: lolMapCatId,
        title: 'Tổng Quan Bản Đồ Summoner Rift',
        slug: 'tong-quan-ban-do-summoner-rift',
        summary: 'Cơ chế hoạt động, các tuyến đường (Top, Mid, Bot), quái rừng và các mục tiêu lớn Rồng, Baron Nashor.',
        content: `
          <h1>Hướng Dẫn Bản Đồ Summoner's Rift</h1>
          <p>Summoner's Rift là bản đồ 5v5 tiêu chuẩn trong Liên Minh Huyền Thoại với 3 đường chính và khu vực rừng rộng lớn.</p>
          <h3>1. Khu vực Rừng & Quái Nguyên Tố</h3>
          <p>Chiếm giữ Rồng Nguyên Tố mang lại bùa lợi vĩnh viễn cho toàn đội. Baron Nashor xuất hiện ở phút 20 mang lại bùa cường hóa lính để đẩy nhà.</p>
          <h3>2. Kiểm Soát Tầm Nhìn</h3>
          <p>Mắt Xanh và Mắt Kiểm Soát là chìa khóa để giành chiến thắng trong việc kiểm soát các bụi rậm quan trọng.</p>
        `,
        featuredImg: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=60',
        published: true,
        authorId: admin.id,
      }
    });
  }

  console.log('🎉 Database seeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
