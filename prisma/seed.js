const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const SALT = +process.env.SALT;

async function main() {
    // Hapus data lama terlebih dahulu
    await prisma.watchHistory.deleteMany();
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.video.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();

    console.log('Data berhasil dihapus');

    // reset auto increment
    await prisma.$executeRaw`ALTER SEQUENCE "user_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "video_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "category_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "comment_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "like_id_seq" RESTART WITH 1`;
    await prisma.$executeRaw`ALTER SEQUENCE "watch_history_id_seq" RESTART WITH 1`;

    // Seed Categories
    const categories = [];
    for (let i = 1; i <= 5; i++) {
        const category = await prisma.category.create({
            data: {
                name: `Category ${i}`,
                created: new Date(),
                updated: new Date(),
            },
        });
        categories.push(category);
    }

    // Seed Users

    const users = [];
    for (let i = 1; i <= 10; i++) {
        const user = await prisma.user.create({
            data: {
                name: `User ${i}`,
                email: `user${i}@example.com`,
                password: bcrypt.hashSync(`password${i}`, SALT),
                role: "USER",
                created: new Date(),
                updated: new Date(),
                isActive: true,
            },
        });
        users.push(user);
    }

    const topics = [
        "JavaScript", "Vue.js", "Node.js", "Express", "PostgreSQL",
        "REST API", "Async Programming", "Frontend", "Backend",
        "Database", "Full-Stack", "BM25", "FTS", "ORM", "API Gateway"
    ];

    const verbs = [
        "Belajar", "Mengenal", "Membuat", "Menggunakan", "Mengoptimalkan",
        "Menjelaskan", "Menjelajahi", "Memahami", "Membandingkan", "Menerapkan"
    ];

    const benefits = [
        "untuk pemula", "secara lengkap", "dari nol", "secara mendalam", "step-by-step",
        "dengan studi kasus", "untuk production", "dalam 15 menit", "tanpa ribet", "untuk developer modern"
    ];

    const extras = [
        "di dunia nyata", "berbasis proyek", "yang sering ditanya saat interview",
        "dengan pendekatan modern", "menggunakan tools terbaru", "di tahun 2025",
        "dengan tantangan praktis", "yang disukai perusahaan teknologi", "dengan visual menarik"
    ];

    const videos = [];

    for (let i = 1; i <= 200; i++) {
        const topic = topics[Math.floor(Math.random() * topics.length)];
        const verb = verbs[Math.floor(Math.random() * verbs.length)];
        const benefit = benefits[Math.floor(Math.random() * benefits.length)];
        const extra = extras[Math.floor(Math.random() * extras.length)];
        const uuid = Math.random().toString(36).substring(7); // unik

        const title = `${verb} ${topic} ${uuid}`;
        const description = `${verb} ${topic} ${benefit} ${extra}. Video ke-${i} membahas topik penting seputar ${topic} (${uuid}).`;

        const video = await prisma.video.create({
            data: {
                title,
                description,
                duration: Math.floor(Math.random() * 100),
                video_url: `https://res.cloudinary.com/dr2nxslaq/video/upload/v1744656550/videos/ahwsabsnod1gbt6oops1.mp4`,
                thumbnail_url: `https://res.cloudinary.com/dr2nxslaq/image/upload/v1744656552/thumbnails/l6az5r6oi2maxkh7tjvk.jpg`,
                created: new Date(),
                updated: new Date(),
                category_id: categories[i % categories.length].id,
                user_id: users[i % users.length].id,
                searchable: `${title} ${description}`,
            },
        });

        videos.push(video);
    }


    // Seed Comments
    const comments = [];
    for (let i = 1; i <= 10; i++) {
        const comment = await prisma.comment.create({
            data: {
                content: `Comment ${i}`,
                created: new Date(),
                updated: new Date(),
                user_id: users[i % users.length].id,
                video_id: videos[i % videos.length].id,
            },
        });
        comments.push(comment);
    }

    // Seed Likes
    const likes = [];
    for (let i = 1; i <= 10; i++) {
        const like = await prisma.like.create({
            data: {
                created: new Date(),
                updated: new Date(),
                user_id: users[i % users.length].id,
                video_id: videos[i % videos.length].id,
            },
        });
        likes.push(like);
    }

    // Seed Watch History
    const watchHistories = [];
    for (let i = 1; i <= 10; i++) {
        const watchHistory = await prisma.watchHistory.create({
            data: {
                duration_watch: Math.floor(Math.random() * 100),
                created: new Date(),
                updated: new Date(),
                user_id: users[i % users.length].id,
                guest_id: `guest${new Date().getTime()}`,
                video_id: videos[i % videos.length].id,
            },
        });
        watchHistories.push(watchHistory);
    }

    console.log('Seeding completed!');
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
