import { test, expect } from '../../src/fixtures';
import { PostListSchema, PostSchema, type NewPost } from '../../src/api/schemas';
import { parseWith } from '../../src/utils/validate';

const newPost: NewPost = {
  userId: 1,
  title: 'Automation framework demo',
  body: 'Created by a Playwright API test',
};

test.describe('Posts API', () => {
  test('GET /posts returns a list that matches the contract @smoke', async ({ api }) => {
    const response = await api.getPosts();

    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('application/json');

    const posts = parseWith(PostListSchema, await response.json());
    expect(posts.length).toBeGreaterThan(0);
  });

  test('GET /posts?userId=1 returns only that user\'s posts', async ({ api }) => {
    const response = await api.getPosts({ userId: 1 });
    expect(response.status()).toBe(200);

    const posts = parseWith(PostListSchema, await response.json());
    expect(posts.length).toBeGreaterThan(0);
    for (const post of posts) {
      expect(post.userId).toBe(1);
    }
  });

  // Data-driven: one test definition, several inputs
  for (const id of [1, 50, 100]) {
    test(`GET /posts/${id} returns the requested post`, async ({ api }) => {
      const response = await api.getPost(id);
      expect(response.status()).toBe(200);

      const post = parseWith(PostSchema, await response.json());
      expect(post.id).toBe(id);
    });
  }

  test('POST /posts creates a post and echoes the payload @smoke', async ({ api }) => {
    const response = await api.createPost(newPost);

    expect(response.status()).toBe(201);
    const created = await response.json();
    expect(created).toMatchObject(newPost);
    expect(typeof created.id).toBe('number');
  });

  test('PUT /posts/1 replaces the post', async ({ api }) => {
    const response = await api.replacePost(1, { ...newPost, title: 'Replaced title' });

    expect(response.status()).toBe(200);
    const updated = parseWith(PostSchema, await response.json());
    expect(updated.id).toBe(1);
    expect(updated.title).toBe('Replaced title');
  });

  test('PATCH /posts/1 changes only the supplied field', async ({ api }) => {
    const response = await api.updatePost(1, { title: 'Patched title' });

    expect(response.status()).toBe(200);
    const patched = await response.json();
    expect(patched.title).toBe('Patched title');
    expect(patched.id).toBe(1);
  });

  test('DELETE /posts/1 succeeds', async ({ api }) => {
    const response = await api.deletePost(1);
    expect(response.status()).toBe(200);
  });

  test.describe('negative paths', () => {
    test('GET /posts/{unknown id} returns 404', async ({ api }) => {
      const response = await api.getPost(999_999);
      expect(response.status()).toBe(404);
    });

    test('GET /posts?userId={unknown} returns an empty list', async ({ api }) => {
      const response = await api.getPosts({ userId: 999_999 });
      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual([]);
    });
  });
});
