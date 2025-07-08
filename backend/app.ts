import express, { Request, Response } from "express";
import connectToMongoDB from "./db.js";
import MCQ from "./model/mcq.js";

const app = express();
connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/mcq/submit", async (req: Request, res: Response) => {
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

app.get("/mcq/fetch", async (req: Request, res: Response) => {
  try {
    const mcqs = await MCQ.find({});
    res.status(200).json(mcqs);
  } catch (err) {
    console.error("Error fetching MCQs:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
