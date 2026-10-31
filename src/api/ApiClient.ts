import type { APIRequestContext, APIResponse } from '@playwright/test';
import type { NewPost } from './schemas';

/**
 * Thin, typed wrapper around Playwright's APIRequestContext.
 * Keeps URLs and HTTP details out of the tests so specs read like intent.
 * Methods return the raw APIResponse so tests can assert status, headers and body.
 */
export class ApiClient {
  constructor(private readonly request: APIRequestContext) {}

  getPosts(query?: Record<string, string | number>): Promise<APIResponse> {
    return this.request.get('/posts', { params: query });
  }

  getPost(id: number): Promise<APIResponse> {
    return this.request.get(`/posts/${id}`);
  }

  getPostComments(id: number): Promise<APIResponse> {
    return this.request.get(`/posts/${id}/comments`);
  }

  createPost(payload: NewPost): Promise<APIResponse> {
    return this.request.post('/posts', { data: payload });
  }

  replacePost(id: number, payload: NewPost): Promise<APIResponse> {
    return this.request.put(`/posts/${id}`, { data: { id, ...payload } });
  }

  updatePost(id: number, changes: Partial<NewPost>): Promise<APIResponse> {
    return this.request.patch(`/posts/${id}`, { data: changes });
  }

  deletePost(id: number): Promise<APIResponse> {
    return this.request.delete(`/posts/${id}`);
  }
}
