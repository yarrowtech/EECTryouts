import express, { Request, Response } from "express";
import connectToMongoDB from "./db.js";
import cors from "cors";
import { mcqRouter } from "./routes/mcqRoute.js";
import { dragDropRouter } from "./routes/dragDropRoute.js";

const app = express();
connectToMongoDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())


app.get("/", (req: Request, res: Response) => {
  res.send("Welcome to the Tryouts server!");
})

app.use("/mcq", mcqRouter)
app.use("/drag-drop", dragDropRouter)


app.listen(process.env.PORT || 5000, () => {
  console.log(`Server is running on port ${process.env.PORT || 5000}`);
});
