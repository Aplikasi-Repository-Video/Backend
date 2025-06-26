create extension if not exists pgroonga;

CREATE INDEX video_searchable_pgroonga_index
ON video
USING pgroonga (searchable);

SELECT \*,
pgroonga_score(tableoid, ctid) AS score
FROM video
WHERE searchable &@~ 'mengenal'
ORDER BY score DESC
LIMIT 20;

db = cdis6brj4FB2Sc1t

<!-- baru sampai search -->
