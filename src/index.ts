import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import libraryRoutes from "./routes/library.route";
import genreRoutes from "./routes/genre.route";
import transactionRoutes from "./routes/transaction.route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running!" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/library", libraryRoutes);
app.use("/api/genre", genreRoutes);
app.use("/api/transaction", transactionRoutes);

// Error handling middleware

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
