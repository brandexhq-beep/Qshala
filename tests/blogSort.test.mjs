import test from 'node:test';
import assert from 'node:assert/strict';

function getPostTimestamp(item) {
  const dateStr = item.isoDate || item.publishedDate || item.publishedAt || item.date || item._createdAt;
  if (!dateStr) return 0;
  const t = new Date(dateStr).getTime();
  return isNaN(t) ? 0 : t;
}

function sortPosts(posts) {
  return [...posts].sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
}

test('Blog Reverse Chronological Ordering & Fallback', async (t) => {
  await t.test('should order posts latest first by publication date', () => {
    const posts = [
      { id: '1', title: 'Older Post', isoDate: '2026-08-01T10:00:00Z' },
      { id: '2', title: 'Newer Post', isoDate: '2026-11-14T10:00:00Z' },
      { id: '3', title: 'Mid Post', isoDate: '2026-09-15T10:00:00Z' },
    ];

    const sorted = sortPosts(posts);
    assert.deepEqual(
      sorted.map((p) => p.id),
      ['2', '3', '1']
    );
  });

  await t.test('should fall back to creation date (_createdAt) when publication date is absent', () => {
    const posts = [
      { id: '1', title: 'Post with old pub date', isoDate: '2026-06-01T10:00:00Z' },
      { id: '2', title: 'Post without pub date but recent createdAt', _createdAt: '2026-11-18T10:00:00Z' },
      { id: '3', title: 'Post with latest pub date', publishedAt: '2026-11-20T10:00:00Z' },
    ];

    const sorted = sortPosts(posts);
    assert.deepEqual(
      sorted.map((p) => p.id),
      ['3', '2', '1']
    );
  });

  await t.test('should handle string date formats gracefully', () => {
    const posts = [
      { id: '1', title: 'July Post', date: 'July 15, 2026' },
      { id: '2', title: 'November Post', date: 'November 14, 2026' },
      { id: '3', title: 'August Post', date: 'August 1, 2026' },
    ];

    const sorted = sortPosts(posts);
    assert.deepEqual(
      sorted.map((p) => p.id),
      ['2', '3', '1']
    );
  });
});

