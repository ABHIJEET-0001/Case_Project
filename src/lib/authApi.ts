import { AuthUser, createDemoJwt } from "./auth";

export interface LoginInput {
  email: string;
  password: string;
}

export interface SignupInput {
  fullName: string;
  email: string;
  password: string;
}

export interface AuthResult {
  user: AuthUser;
  token: string;
}

export interface AuthApi {
  login(input: LoginInput): Promise<AuthResult>;
  signup(input: SignupInput): Promise<AuthResult>;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

class MockAuthApi implements AuthApi {
  async login(input: LoginInput): Promise<AuthResult> {
    await sleep(700);
    const user: AuthUser = {
      fullName: "Justice R. Sharma",
      email: input.email.trim().toLowerCase(),
      role: "Judge",
    };
    const token = createDemoJwt(user);
    return { user, token };
  }

  async signup(input: SignupInput): Promise<AuthResult> {
    await sleep(850);
    const user: AuthUser = {
      fullName: input.fullName.trim(),
      email: input.email.trim().toLowerCase(),
      role: "Judge",
    };
    const token = createDemoJwt(user);
    return { user, token };
  }
}

class HttpAuthApi implements AuthApi {
  private readonly baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async login(input: LoginInput): Promise<AuthResult> {
    return this.post<AuthResult>("/auth/login", input);
  }

  async signup(input: SignupInput): Promise<AuthResult> {
    return this.post<AuthResult>("/auth/signup", input);
  }

  private async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      throw new Error("Authentication request failed.");
    }

    return (await res.json()) as T;
  }
}

const useRealAuth = import.meta.env.VITE_USE_REAL_AUTH === "true";
const authApiBase = import.meta.env.VITE_AUTH_API_BASE_URL;
const mockApi = new MockAuthApi();
const httpApi = useRealAuth && authApiBase ? new HttpAuthApi(authApiBase) : null;

export const authApi: AuthApi = {
  async login(input: LoginInput): Promise<AuthResult> {
    if (!httpApi) return mockApi.login(input);
    try {
      return await httpApi.login(input);
    } catch {
      return mockApi.login(input);
    }
  },

  async signup(input: SignupInput): Promise<AuthResult> {
    if (!httpApi) return mockApi.signup(input);
    try {
      return await httpApi.signup(input);
    } catch {
      return mockApi.signup(input);
    }
  },
};
