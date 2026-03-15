type ObservabilityContext = {
  flow: string;
  requestId?: string;
};

type ObservabilityPayload = Record<string, unknown>;

const processStartAt = Date.now();

const nowIso = () => new Date().toISOString();

const elapsedFrom = (startNs: bigint) => Number(process.hrtime.bigint() - startNs) / 1_000_000;

const formatContext = (context: ObservabilityContext) => {
  return context.requestId
    ? `[obs][${context.flow}][request:${context.requestId}]`
    : `[obs][${context.flow}]`;
};

export const createRequestId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

export const createTimer = () => {
  const startNs = process.hrtime.bigint();
  let lastCheckpointNs = startNs;

  return {
    elapsedMs: () => Number(elapsedFrom(startNs).toFixed(3)),
    checkpoint: () => {
      const nowNs = process.hrtime.bigint();
      const elapsedMs = Number((Number(nowNs - startNs) / 1_000_000).toFixed(3));
      const stepElapsedMs = Number((Number(nowNs - lastCheckpointNs) / 1_000_000).toFixed(3));

      lastCheckpointNs = nowNs;

      return {
        elapsedMs,
        stepElapsedMs,
      };
    },
  };
};

export const logObservation = (
  context: ObservabilityContext,
  stage: string,
  payload: ObservabilityPayload = {}
) => {
  console.log(`${formatContext(context)} ${stage}`, {
    timestamp: nowIso(),
    uptimeMs: Date.now() - processStartAt,
    ...payload,
  });
};
