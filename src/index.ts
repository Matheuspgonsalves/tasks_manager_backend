import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import "dotenv/config";
import routes from "./routes/index.routes";
import { createTimer, logObservation } from "./utils/observability.util";

const bootstrapTimer = createTimer();

logObservation({ flow: "bootstrap" }, "process_started", {
  pid: process.pid,
  nodeVersion: process.version,
});

const app = express();

logObservation({ flow: "bootstrap" }, "app_created", {
  ...bootstrapTimer.checkpoint(),
});

const allowedOrigins = ["http://localhost:5173", "http://192.168.15.141:5173", process.env.FRONTEND_URL].filter(
  (origin): origin is string => Boolean(origin)
);

logObservation({ flow: "bootstrap" }, "allowed_origins_resolved", {
  ...bootstrapTimer.checkpoint(),
  allowedOrigins,
});

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

logObservation({ flow: "bootstrap" }, "middlewares_and_routes_registered", {
  ...bootstrapTimer.checkpoint(),
});

const port = process.env.PORT || 3000;

logObservation({ flow: "bootstrap" }, "about_to_listen", {
  ...bootstrapTimer.checkpoint(),
  port,
});

app.listen(port, () => {
  logObservation({ flow: "bootstrap" }, "server_listening", {
    ...bootstrapTimer.checkpoint(),
    port,
  });
  console.log(`Servidor rodando em http://localhost:${port}`);
});
