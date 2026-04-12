import express from "express";
import cors from "cors";
import morgan from "morgan";
import { authMiddleware } from "../middlewares/auth.middlewares";

const app = express();
const PORT = 8080;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(authMiddleware);

export { app, PORT };
