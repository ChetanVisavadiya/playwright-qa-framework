import { z } from 'zod';

/**
 * Contract definitions for the Posts API.
 * If the API changes shape (missing field, wrong type), tests fail with a readable diff.
 */
export const PostSchema = z.object({
  userId: z.number().int().positive(),
  id: z.number().int().positive(),
  title: z.string().min(1),
  body: z.string(),
});

export const PostListSchema = z.array(PostSchema);

/** Payload for creating a post (server assigns the id). */
export const NewPostSchema = PostSchema.omit({ id: true });

export type Post = z.infer<typeof PostSchema>;
export type NewPost = z.infer<typeof NewPostSchema>;
