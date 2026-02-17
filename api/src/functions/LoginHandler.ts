import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import * as bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = process.env.COSMOS_DB_DATABASE_ID;
const containerName = "Users";
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret-change-me";

interface LoginRequest {
  email?: string;
  password?: string;
}

interface DbUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  passwordHash: string;
}

// In-memory rate limiting
const failedAttempts = new Map<string, { count: number; firstAttempt: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes

function cleanupExpiredEntries() {
  const now = Date.now();
  for (const [key, value] of failedAttempts.entries()) {
    if (now - value.firstAttempt > LOCKOUT_TIME) {
      failedAttempts.delete(key);
    }
  }
}

export async function loginHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Login attempt processing...`);

  try {
    const body = (await request.json()) as LoginRequest;
    const { email, password } = body;

    if (!connectionString || !databaseName) {
      context.error("Database configuration missing.");
      return { status: 500, body: "Internal Server Error." };
    }

    // Input validation
    if (!email || !password) {
      return { status: 400, body: "Missing email or password." };
    }
    if (typeof email !== "string" || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { status: 400, body: "Invalid email format." };
    }
    if (typeof password !== "string" || password.length > 128) {
      return { status: 400, body: "Invalid password." };
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Rate limiting
    cleanupExpiredEntries();
    const clientIp = request.headers.get("x-forwarded-for") || "unknown";
    const rateLimitKey = `${normalizedEmail}:${clientIp}`;
    const attempts = failedAttempts.get(rateLimitKey);

    if (attempts && attempts.count >= MAX_ATTEMPTS && Date.now() - attempts.firstAttempt < LOCKOUT_TIME) {
      return { status: 429, body: "Too many login attempts. Please try again later." };
    }

    const client = new CosmosClient(connectionString);
    const container = client.database(databaseName).container(containerName);

    const querySpec = {
      query: "SELECT c.id, c.email, c.name, c.role, c.passwordHash FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: normalizedEmail }],
    };

    const { resources: users } = await container.items.query(querySpec).fetchAll();

    if (users.length === 0) {
      // Track failed attempt
      const current = failedAttempts.get(rateLimitKey) || { count: 0, firstAttempt: Date.now() };
      current.count++;
      failedAttempts.set(rateLimitKey, current);
      return { status: 401, body: "Invalid email or password." };
    }

    const user = users[0] as DbUser;
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      const current = failedAttempts.get(rateLimitKey) || { count: 0, firstAttempt: Date.now() };
      current.count++;
      failedAttempts.set(rateLimitKey, current);
      return { status: 401, body: "Invalid email or password." };
    }

    // Clear failed attempts on success
    failedAttempts.delete(rateLimitKey);

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "student",
    };

    // Issue JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: "24h" }
    );

    return {
      status: 200,
      jsonBody: { user: userProfile, token },
    };
  } catch (error) {
    context.error("Login Handler Error:", error);
    return { status: 500, body: "Internal Server Error." };
  }
}

app.http("UserLogin", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "login",
  handler: loginHandler,
});
