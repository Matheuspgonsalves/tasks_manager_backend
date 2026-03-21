import { Login } from "../../../interfaces/login.interface";
import { createTimer, logObservation } from "../../../utils/observability.util";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

export const loginUseCase = async (data: Login, requestId?: string) => {
  const timer = createTimer();

  try {
    const { email, password } = data;

    logObservation({ flow: "auth.login.usecase", requestId }, "started", {
      ...timer.checkpoint(),
      email,
    });

    if (!supabaseUrl || !supabaseAnonKey) {
      return {
        error: "Supabase authentication environment variables are not configured",
        statusCode: 500,
      };
    }

    const response = await fetch(`${supabaseUrl}/auth/v1/token?grant_type=password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: supabaseAnonKey,
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const responseBody = (await response.json().catch(() => null)) as
      | {
          access_token?: string;
          refresh_token?: string;
          expires_in?: number;
          token_type?: string;
          user?: {
            id: string;
            email?: string;
            role?: string;
          };
          msg?: string;
          error_description?: string;
          message?: string;
        }
      | null;

    if (!response.ok) {
      logObservation({ flow: "auth.login.usecase", requestId }, "supabase_login_failed", {
        ...timer.checkpoint(),
        statusCode: response.status,
      });

      return {
        error:
          responseBody?.msg ||
          responseBody?.error_description ||
          responseBody?.message ||
          "Invalid email or password",
        statusCode: response.status,
      };
    }

    return {
      user: responseBody?.user,
      session: {
        access_token: responseBody?.access_token,
        refresh_token: responseBody?.refresh_token,
        expires_in: responseBody?.expires_in,
        token_type: responseBody?.token_type,
      },
    };
  } catch (error) {
    console.error("Login use case error:", error);
    logObservation({ flow: "auth.login.usecase", requestId }, "unexpected_error", {
      ...timer.checkpoint(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
    throw error;
  }
};
