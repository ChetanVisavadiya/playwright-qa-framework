import type { z } from 'zod';

/**
 * Validate data against a zod schema and throw a readable error listing every violation.
 * Returns the parsed, fully typed data on success.
 */
export function parseWith<S extends z.ZodType>(schema: S, data: unknown): z.infer<S> {
  const result = schema.safeParse(data);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `  - ${issue.path.join('.') || '(root)'}: ${issue.message}`)
      .join('\n');
    throw new Error(`Response does not match the expected contract:\n${details}`);
  }
  return result.data;
}
