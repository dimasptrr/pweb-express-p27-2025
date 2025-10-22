import { Router } from "express";
import { GenreController } from "../controllers/genre.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const router = Router();

// CRUD Genre routes
router.post("/", authMiddleware, GenreController.createGenre);
router.get("/", authMiddleware, GenreController.getAllGenre);
router.get("/:id", authMiddleware, GenreController.getGenreDetail);
router.patch("/:id", authMiddleware, GenreController.updateGenre);
router.delete("/:id", authMiddleware, GenreController.deleteGenre);

export default router;
