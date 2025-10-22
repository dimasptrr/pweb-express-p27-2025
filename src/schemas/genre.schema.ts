import { z } from 'zod';

export const createGenreSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Genre name is required'),
  }),
});

export const updateGenreSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid genre ID'),
  }),
  body: z.object({
    name: z.string().min(1, 'Genre name is required'),
  }),
});

export const genreParamSchema = z.object({
  params: z.object({
    id: z.string().cuid('Invalid genre ID'),
  }),
});


export type CreateGenreInput = z.infer<typeof createGenreSchema>;
export type UpdateGenreInput = z.infer<typeof updateGenreSchema>;
export type GenreParamInput = z.infer<typeof genreParamSchema>;
