import express from "express";
import {
  createGenre,
  getAllGenre,
  getGenreDetail,
  updateGenre,
  deleteGenre,
} from "../controllers/genre.controller";

const router = express.Router();

router.post("/", createGenre);
router.get("/", getAllGenre);
router.get("/:id", getGenreDetail);
router.patch("/:id", updateGenre);
router.delete("/:id", deleteGenre);

export default router;
