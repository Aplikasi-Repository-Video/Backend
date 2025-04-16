const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createIndex() {
    try {
        const indexes = await prisma.$queryRaw`SELECT indexname FROM pg_indexes WHERE tablename = 'video';`;

        const indexExists = indexes.some(index => index.indexname === 'video_searchable_idx');

        if (indexExists) {
            console.log('Indeks "video_searchable_idx" sudah ada, menghapus indeks...');

            await prisma.$executeRaw`DROP INDEX IF EXISTS video_searchable_idx;`;
            console.log('Indeks "video_searchable_idx" berhasil dihapus.');
        }

        await prisma.$executeRaw`CREATE INDEX video_searchable_idx ON video USING gin(to_tsvector('indonesian', searchable));`;
        console.log('Indeks "video_searchable_idx" berhasil dibuat!');

        const newIndexes = await prisma.$queryRaw`SELECT indexname FROM pg_indexes WHERE tablename = 'video';`;
        console.log('Indeks yang ada di tabel "video":', newIndexes);

    } catch (error) {
        console.error('Terjadi kesalahan:', error);
    } finally {
        await prisma.$disconnect();
    }
}

createIndex();
