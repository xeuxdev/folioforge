export interface DbHealthResult {
  status: 'up' | 'down';
  latencyMs: number;
  error?: string;
}

export interface HealthResponse {
  status: 'ok' | 'degraded';
  timestamp: string;
  uptimeSeconds: number;
  database: DbHealthResult;
}
