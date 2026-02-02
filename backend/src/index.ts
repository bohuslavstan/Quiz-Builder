import "dotenv/config";
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { PrismaClient } from "./generated/prisma";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

const app = express();
const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

app.get("/health", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.post("/quizzes", async (req: Request, res: Response) => {
  try {
    const { title, questions } = req.body ?? {};

    if (typeof title !== "string" || !Array.isArray(questions)) {
      return res.status(400).json({ error: "Invalid payload" });
    }

    const quiz = await prisma.quiz.create({
      data: {
        title,
        questions,
      },
    });

    return res.status(201).json(quiz);
  } catch (error) {
    return res.status(500).json({ error: "Failed to create quiz" });
  }
});

app.get("/quizzes", async (_req: Request, res: Response) => {
  try {
    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        questions: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const response = quizzes.map((quiz: any) => ({
      id: quiz.id,
      title: quiz.title,
      questionCount: Array.isArray(quiz.questions) ? quiz.questions.length : 0,
    }));

    return res.status(200).json(response);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch quizzes" });
  }
});

app.get("/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid quiz id" });
    }

    const quiz = await prisma.quiz.findUnique({
      where: { id },
    });

    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    return res.status(200).json(quiz);
  } catch (error) {
    return res.status(500).json({ error: "Failed to fetch quiz" });
  }
});

app.delete("/quizzes/:id", async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ error: "Invalid quiz id" });
    }

    await prisma.quiz.delete({
      where: { id },
    });

    return res.status(204).send();
  } catch (error) {
    if (error instanceof Error && "code" in error && (error as { code?: string }).code === "P2025") {
      return res.status(404).json({ error: "Quiz not found" });
    }
    return res.status(500).json({ error: "Failed to delete quiz" });
  }
});

app.use((req: Request, res: Response) => {
  res.status(404).json({ error: "Route not found" });
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
