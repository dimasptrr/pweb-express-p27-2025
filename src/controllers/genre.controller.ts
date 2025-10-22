import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { z } from "zod";

const genreSchema = z.object({
  name: z.string().min(1, "Genre name is required"),
  description: z.string().optional(),
});

export const GenreController = {
  createGenre: async (req: Request, res: Response) => {
    try {
      const data = genreSchema.parse(req.body); 
      const genre = await prisma.genre.create({ data });
      res.status(201).json(genre);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: "Failed to create genre" });
    }
  },

  getAllGenre: async (_req: Request, res: Response) => {
    try {
      
      const genres = await prisma.genre.findMany({
        where: { deletedAt: null }
      });
      res.status(200).json(genres);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch genres" });
    }
  },

  getGenreDetail: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      
      const genre = await prisma.genre.findFirst({
        where: { id, deletedAt: null },
      });

      if (!genre) return res.status(404).json({ error: "Genre not found" });
      res.status(200).json(genre);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch genre detail" });
    }
  },

  updateGenre: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const data = genreSchema.partial().parse(req.body);
      const updated = await prisma.genre.update({
        where: { id },
        data,
      });
      res.status(200).json(updated);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: error.issues });
      }
      res.status(500).json({ error: "Failed to update genre" });
    }
  },


  deleteGenre: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      
      const existing = await prisma.genre.findFirst({
        where: { id, deletedAt: null }
      });

      if (!existing) {
        return res.status(404).json({ error: "Genre not found" });
      }

      await prisma.genre.update({
        where: { id },
        data: { deletedAt: new Date() }
      });

      res.status(200).json({ message: "Genre deleted successfully" });
    } catch (error) {
      console.error('Delete genre error:', error);
      res.status(500).json({ error: "Failed to delete genre" });
  }
},
};
