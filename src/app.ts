import cookieParser from "cookie-parser";
import cors from "cors";
import Redis from 'ioredis';
import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./app/routes";
import globalErrorHandler from "@middlewares/globalErrorHandler";
import config from "./config";

const app: Application = express();

app.use(cors());
app.use(cookieParser());

//parser
app.use(express.json());

const redisClient = new Redis(config.redis.url);
//
app.use("/api", routes);

// Add a test route for /
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, TypeScript with Express!');
});

//global error handler
app.use(globalErrorHandler);

//handle not found
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Not Found",
    errorMessages: [
      {
        path: req.originalUrl,
        message: "API Not Found",
      },
    ],
  });
  next();
});



export default app;