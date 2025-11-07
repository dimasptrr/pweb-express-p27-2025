import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import authRoutes from "./routes/auth.route";
import libraryRoutes from "./routes/library.route";
import genreRoutes from "./routes/genre.route";
import transactionRoutes from "./routes/transaction.route";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health-check", (req: Request, res: Response) => {
  res.json({
    success: true,
    message: "Hello World!",
    date: new Date().toDateString(),
  });
});

// Root route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Server is running!" });
});

// API Routes
app.use("/auth", authRoutes);
app.use("/books", libraryRoutes);
app.use("/genre", genreRoutes);
app.use("/transactions", transactionRoutes);

// Error handling middleware

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
