const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
                password: `password${i}`,
                role: "USER",
                created: new Date(),
                updated: new Date(),
                isActive: true,
            },
        });
        users.push(user);
    }

    // Seed Videos with Full-Text Searchable Data
    const videos = [];
    for (let i = 1; i <= 10; i++) {
        const video = await prisma.video.create({
            data: {
                title: `Video ${i}`,
                description: `Description of Video ${i}`,
                duration: `00:00:24`,
                video_url: `https://res.cloudinary.com/dr2nxslaq/video/upload/v1744656550/videos/ahwsabsnod1gbt6oops1.mp4`,
                thumbnail_url: `https://res.cloudinary.com/dr2nxslaq/image/upload/v1744656552/thumbnails/l6az5r6oi2maxkh7tjvk.jpg`,
                created: new Date(),
                updated: new Date(),
                category_id: categories[i % categories.length].id,
                user_id: users[i % users.length].id,
                searchable: `Video ${i} Description of Video ${i}`, // Full-Text Searchable data
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
                duration_watch: `00:${String(i).padStart(2, '0')}:00`,
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
