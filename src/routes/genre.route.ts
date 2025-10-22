import { Router } from "express";
import { GenreController } from "../controllers/genre.controller";

const router = Router();

// CRUD Genre routes
router.post("/", GenreController.createGenre);
router.get("/", GenreController.getAllGenre);
router.get("/:id", GenreController.getGenreDetail);
router.patch("/:id", GenreController.updateGenre);
router.delete("/:id", GenreController.deleteGenre);

export default router;
