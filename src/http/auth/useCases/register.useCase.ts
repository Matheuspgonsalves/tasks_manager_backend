import { Register } from "../../../interfaces/register.interface";
import { createUserUseCase } from "../../users/useCases/createUser.useCase";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

interface SupabaseAuthUser {
  id: string;
  email?: string;
  role?: string;
  user_metadata?: {
    name?: string;
  };
}

interface SupabaseSignUpResponse {
  access_token?: string;
  refresh_token?: string;
  expires_in?: number;
  token_type?: string;
  user?: SupabaseAuthUser;
}

interface SupabaseErrorResponse {
  msg?: string;
  error_description?: string;
  message?: string;
}

export const registerUseCase = async (data: Register) => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      error: "Supabase authentication environment variables are not configured",
      statusCode: 500,
    };
  }

  const response = await fetch(`${supabaseUrl}/auth/v1/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({
      email: data.email,
      password: data.password,
      data: {
        name: data.name,
      },
    }),
  });

  const responseBody = (await response.json().catch(() => null)) as
    | SupabaseSignUpResponse
    | SupabaseErrorResponse
    | null;

  if (!response.ok) {
    const errorBody = responseBody as SupabaseErrorResponse | null;

    return {
      error: errorBody?.msg || errorBody?.error_description || errorBody?.message || "Supabase sign up failed",
      statusCode: response.status,
    };
  }

  const signUpBody = responseBody as SupabaseSignUpResponse | null;

  if (!signUpBody?.user?.id || !signUpBody.user.email) {
    return {
      error: "Supabase sign up did not return a valid user",
      statusCode: 502,
    };
  }

  const profileResult = await createUserUseCase({
    id: signUpBody.user.id,
    email: signUpBody.user.email,
    name: data.name,
    role: signUpBody.user.role === "admin" ? "admin" : "user",
  });

  if (profileResult.error) {
    return {
      error: profileResult.error,
      statusCode: 409,
    };
  }

  return {
    user: profileResult.user,
    session: signUpBody.access_token
      ? {
          access_token: signUpBody.access_token,
          refresh_token: signUpBody.refresh_token,
          expires_in: signUpBody.expires_in,
          token_type: signUpBody.token_type,
        }
      : null,
  };
};
