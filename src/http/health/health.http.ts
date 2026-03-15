import { Request, Response } from "express";
import {
  createRequestId,
  createTimer,
  logObservation,
} from "../../utils/observability.util";

export const healthCheckerController = async (req: Request, res: Response) => {
  const requestId = createRequestId();
  const timer = createTimer();

  logObservation({ flow: "health", requestId }, "request_received", {
    method: req.method,
    path: req.originalUrl,
    ...timer.checkpoint(),
  });

  logObservation({ flow: "health", requestId }, "about_to_respond", {
    ...timer.checkpoint(),
    statusCode: 200,
  });

  return res.status(200).send({
    success: true,
    message: "Server running",
  });
};
