import { Request, Response } from "express";
import  prisma  from "../lib/prisma";

// POST /genre
export const createGenre = async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const genre = await prisma.genre.create({ data: { name, description } });
  res.json(genre);
};

// GET /genre
export const getAllGenre = async (_req: Request, res: Response) => {
  const genres = await prisma.genre.findMany();
  res.json(genres);
};

// GET /genre/:id
export const getGenreDetail = async (req: Request, res: Response) => {
  const { id } = req.params;
  const genre = await prisma.genre.findUnique({ where: { id: Number(id) } });
  if (!genre) return res.status(404).json({ error: "Genre not found" });
  res.json(genre);
};

// PATCH /genre/:id
export const updateGenre = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const updated = await prisma.genre.update({
    where: { id: Number(id) },
    data: { name, description },
  });
  res.json(updated);
};

// DELETE /genre/:id
export const deleteGenre = async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.genre.delete({ where: { id: Number(id) } });
  res.json({ message: "Genre deleted" });
};
