import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import routes from "./routes/index.routes";

const app = express();
const allowedOrigins = ["http://localhost:5173", process.env.FRONTEND_URL].filter(
  (origin): origin is string => Boolean(origin)
);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-access-token"],
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.get("/", (req: any, res: any) => {
  res.send({ message: "You're not suposed to be here" });
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
