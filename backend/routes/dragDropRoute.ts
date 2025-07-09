import { Router, Request, Response } from "express";
import DragDrop from "../model/drag_drop.js";

export const dragDropRouter = Router();



dragDropRouter.post("/submit", async (req: Request, res: Response) => {
  try {
    if (req.body === undefined)
        throw new Error("Request body is undefined");
    const { question, answer, options } = req.body;
    if (!question || !answer || !options ) {
      throw new Error(
        "Invalid input: question, answer, and options are required."
      );
    }

    const dragDrop = new DragDrop({
      question,
      answer,
      options,
    });

    await dragDrop.save();
    res.status(201).json({ message: "DragDrop submitted successfully" });
  } catch (err) {
    console.error("Error submitting DragDrop:", err);
    res.status(500).json({ message: (err as Error).message });
  }
});

dragDropRouter.get("/fetch", async (req: Request, res: Response) => {
  try {
    const dragDrop = await DragDrop.find({}).select("-answer");
    res.status(200).json(dragDrop);
  } catch (err) {
    console.error("Error fetching DragDrops:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});
