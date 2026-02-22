import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import * as bcrypt from "bcryptjs";

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = process.env.COSMOS_DB_DATABASE_ID;
const containerName = "Users";

interface LoginRequest {
  email?: string;
  password?: string;
}

interface DbUser {
  id: string;
  email: string;
  name?: string;
  role: string;
  schoolName?: string;
  passwordHash: string;
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
      return { status: 500, body: "Database configuration missing." };
    }
    if (!email || !password) {
      return { status: 400, body: "Missing email or password." };
    }

    const client = new CosmosClient(connectionString);
    const container = client.database(databaseName).container(containerName);

    const querySpec = {
      query:
        "SELECT c.id, c.email, c.name, c.role, c.schoolName, c.passwordHash FROM c WHERE c.email = @email",
      parameters: [{ name: "@email", value: email.toLowerCase() }],
    };

    const { resources: users } = await container.items
      .query(querySpec)
      .fetchAll();

    if (users.length === 0) {
      return { status: 401, body: "Invalid email or password" };
    }

    const user = users[0] as DbUser;
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      return { status: 401, body: "Invalid email or password" };
    }

    const userProfile = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role || "Student",
      schoolName: user.schoolName || "N/A",
    };

    return {
      status: 200,
      jsonBody: userProfile,
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
