import express from "express";
import requestLogger from "./middlewares/requestLogger.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import AppError from "./shared/errors/AppError.js";
import indexRoutes from "./routes/index.routes.js";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(requestLogger);
app.use(cors());

app.get("/health", (req, res) => {
    console.log("Health route hit");
    res.status(200).json({
      status: "success",
      message: "Resume Analyzer Backend is running 🚀"
    });
});

app.use("/api/v1", indexRoutes);


app.use((req, res, next) => {
    next(new AppError(`Route ${req.originalUrl} not found`, 404));
});
  

app.use(errorMiddleware);

export default app;