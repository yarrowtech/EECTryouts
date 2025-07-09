import { Router, Request, Response } from "express";
import MCQ from "../model/mcq.js";

export const mcqRouter = Router();



mcqRouter.post("/submit", async (req: Request, res: Response) => {
  try {
    if (req.body === undefined)
        throw new Error("Request body is undefined");
    const { question, answer, options } = req.body;
    if (!question || !answer || !options || options.length < 2) {
      throw new Error(
        "Invalid input: question, answer, and at least two options are required."
      );
    }

    const mcq = new MCQ({
      question,
      answer,
      options,
    });

    await mcq.save();
    res.status(201).json({ message: "MCQ submitted successfully" });
  } catch (err) {
    console.error("Error submitting MCQ:", err);
    res.status(500).json({ message: (err as Error).message });
  }
});

mcqRouter.get("/fetch", async (req: Request, res: Response) => {
  try {
    const mcqs = await MCQ.find({}).select("-answer");
    res.status(200).json(mcqs);
  } catch (err) {
    console.error("Error fetching MCQs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});