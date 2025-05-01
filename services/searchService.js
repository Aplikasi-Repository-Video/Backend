const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const searchVideos = async (rawKeyword) => {
  const keyword = rawKeyword.trim();
  const normalized = keyword.replace(/[^a-zA-Z0-9\s]/g, '');
  const ftsResult = await prisma.$queryRawUnsafe(`
    SELECT *,
      pgroonga_score(tableoid, ctid) AS score
    FROM video
    WHERE searchable &@~ pgroonga_normalize('${normalized}')
    ORDER BY score DESC
    LIMIT 100
  `);

  if (ftsResult.length > 0) return ftsResult;

  const words = normalized.split(/\s+/);
  const fallbackResult = await prisma.$queryRawUnsafe(`
    SELECT *,
      pgroonga_score(tableoid, ctid) AS score,
      (${words.map(w =>
    `(CASE WHEN searchable &~ pgroonga_normalize('${w}') THEN 1 ELSE 0 END)`
  ).join(' + ')}) AS match_count
    FROM video
    WHERE ${words.map(w =>
    `searchable &~ pgroonga_normalize('${w}')`
  ).join(' OR ')}
    ORDER BY match_count DESC, score DESC
    LIMIT 100
  `);

  return fallbackResult;
};

module.exports = {
  searchVideos,
};
