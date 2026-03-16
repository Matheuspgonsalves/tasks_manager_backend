import { Router } from "express";

import userRoutes from "./users.routes";
import authMiddleware from "../middlewares/auth.middleware";
import authRoutes from "./auth-v1.routes";
import { healthCheckerController } from "../http/health/health.http";
import { createRequestId, logObservation } from "../utils/observability.util";

const routes = Router();

routes.use("/users", (req, _res, next) => {
  logObservation({ flow: "users.routes", requestId: createRequestId() }, "protected_route_received", {
    method: req.method,
    path: req.originalUrl,
    origin: req.headers.origin,
    referer: req.headers.referer,
    userAgent: req.headers["user-agent"],
    hasCookiesObject: Boolean(req.cookies),
    cookieKeys: req.cookies ? Object.keys(req.cookies) : [],
  });
  next();
});

routes.use("/users", authMiddleware.checkToken, userRoutes);
routes.use("/auth/v1", authRoutes);

//Health checker
routes.post("/health", healthCheckerController);

export default routes;
