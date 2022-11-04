import express, { Response, Request } from "express";
import cors from "cors";
import dotenv from "dotenv";

//Routes
import authRoutes from "./routes/auth";
import homeworkRoutes from "./routes/homework";
import dayRoutes from "./routes/day";
import calendarRoutes from "./routes/calendar";
import subjectRoutes from "./routes/subject";
import plannedDateRoutes from "./routes/plannedDate";
import gradeRoutes from "./routes/grade";

import { ErrorResponse } from "./models";

import { PrismaClient } from "@prisma/client";
import weekRoutes from "./routes/week";
import applyPrismaMiddlewares from "./prisma-middlewares";
export const prisma = new PrismaClient();

applyPrismaMiddlewares(prisma);

//Configuring dotenv package to use env variables form .env
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use(authRoutes);
app.use("/homework", homeworkRoutes);
app.use("/day", dayRoutes);
app.use("/week", weekRoutes);
app.use("/calendar", calendarRoutes);
app.use("/subject", subjectRoutes);
app.use("/plannedDate", plannedDateRoutes);
app.use("/grade", gradeRoutes);

app.get("/", (_req, res, _next) => {
  res.json();
});

app.use((_req: Request, res: Response) => {
  const response: ErrorResponse = {
    message: "Page not found",
    statusCode: 404,
  };
  res.status(response.statusCode).json(response);
});

app.use((_req: Request, res: Response) => {
  res.status(500).json("An error has occurred");
});

app.listen(process.env.PORT, () => {
  console.log("app listening on port " + process.env.PORT);
});
