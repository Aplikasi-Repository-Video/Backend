const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const bcrypt = require('bcryptjs');
const SALT = +process.env.SALT;
const { elasticClient } = require('../utils/elasticClient');
const { syncVideoIndex, deleteVideoIndex } = require('../utils/elasticHelpers');

const createVideoIndex = async () => {
    try {
        const indexExists = await elasticClient.indices.exists({ index: 'videos' });
        if (!indexExists) {
            await elasticClient.indices.create({
                index: 'videos',
                body: {
                    mappings: {
                        properties: {
                            id: { type: 'integer' },
                            searchable: {
                                type: 'text',
                                analyzer: 'standard'
                            }
                        }
                    }
                }
            });
        }
    } catch (error) {
        console.error('Error creating index:', error);
    }
};

async function main() {
    // Hapus data lama terlebih dahulu
    await prisma.watchHistory.deleteMany();
    await prisma.like.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.video.deleteMany();
    await prisma.user.deleteMany();
    await prisma.category.deleteMany();
    await elasticClient.indices.delete({ index: 'videos' });
    await createVideoIndex();
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
                video_url: `https://res.cloudinary.com/dr2nxslaq/video/upload/v1751276030/Belajar_NodeJS___1._Apa_Itu_NodeJS__wbd3zk.mp4`,
                thumbnail_url: `https://res.cloudinary.com/dr2nxslaq/image/upload/v1751018976/69ae8f1f3ba48a8fe208b394b450f6cb_io5hfd.jpg`,
                created: new Date(),
                updated: new Date(),
                category_id: categories[i % categories.length].id,
                user_id: users[i % users.length].id,
                searchable: `${title} ${description}`,
            },
        });

        await syncVideoIndex(video);

        videos.push(video);
    }


    // Seed Comments
    const comments = [];
    for (const video of videos) {
        for (let i = 0; i < 10; i++) {
            const user = users[(video.id + i) % users.length];
            const comment = await prisma.comment.create({
                data: {
                    content: `Comment ${i + 1} for video ${video.id}`,
                    created: new Date(),
                    updated: new Date(),
                    user_id: user.id,
                    video_id: video.id,
                },
            });
            comments.push(comment);
        }
    }

    // Seed Likes
    const likes = [];
    for (const video of videos) {
        for (let i = 0; i < 10; i++) {
            const user = users[(video.id + i) % users.length];
            const like = await prisma.like.create({
                data: {
                    created: new Date(),
                    updated: new Date(),
                    user_id: user.id,
                    video_id: video.id,
                },
            });
            likes.push(like);
        }
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
