import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosClient, ItemDefinition } from "@azure/cosmos";
import * as bcrypt from "bcryptjs";

interface UserSchema extends ItemDefinition {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: string;
  isVerified: boolean;
  schoolId: string;
  createdAt: string;
}

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = process.env.COSMOS_DB_DATABASE_ID;
const containerName = "Users";

const VALID_ROLES = ["Student", "Teacher", "Parent"];

export async function userHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Processing user signup request.`);

  try {
    if (!connectionString || !databaseName) {
      context.error("Database configuration missing.");
      return { status: 500, body: "Internal Server Error." };
    }

    const body = (await request.json()) as {
      email: string;
      password: string;
      name: string;
      requestedRole?: string;
    };
    const { email, password, name, requestedRole } = body;

    // Input validation
    if (!email || !password || !name) {
      return { status: 400, body: "Please provide email, password, and name." };
    }
    if (typeof email !== "string" || email.length > 255 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { status: 400, body: "Invalid email format." };
    }
    if (typeof password !== "string" || password.length < 8 || password.length > 128) {
      return { status: 400, body: "Password must be between 8 and 128 characters." };
    }
    if (typeof name !== "string" || name.length < 2 || name.length > 100 || !/^[a-zA-Zа-яА-ЯёЁ\s\-']+$/.test(name)) {
      return { status: 400, body: "Name must be 2-100 characters and contain only letters, spaces, hyphens." };
    }
    if (requestedRole && !VALID_ROLES.includes(requestedRole)) {
      return { status: 400, body: "Invalid role." };
    }

    const client = new CosmosClient(connectionString);
    const database = client.database(databaseName);
    const container = database.container(containerName);

    const lowerCaseEmail = email.toLowerCase().trim();

    const { resources: existingUsers } = await container.items
      .query({
        query: "SELECT c.id FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: lowerCaseEmail }],
      })
      .fetchAll();

    if (existingUsers.length > 0) {
      // Generic message to prevent email enumeration
      return { status: 200, jsonBody: { message: "If this email is not already registered, your account has been created. Please check your email." } };
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const role = requestedRole && VALID_ROLES.includes(requestedRole) ? requestedRole : "Student";

    const newUser: UserSchema = {
      id: lowerCaseEmail,
      email: lowerCaseEmail,
      name: name.trim(),
      passwordHash,
      role,
      isVerified: false,
      schoolId: "default-school",
      createdAt: new Date().toISOString(),
    };

    const { resource: createdUser } = await container.items.create(newUser);

    if (!createdUser) {
      context.error("Cosmos DB create operation returned no resource.");
      return { status: 500, body: "Registration failed." };
    }

    return {
      status: 201,
      jsonBody: {
        message: "If this email is not already registered, your account has been created. Please check your email.",
      },
    };
  } catch (error) {
    context.error(`Error creating user: ${error instanceof Error ? error.message : String(error)}`);
    return { status: 500, body: "Internal Server Error." };
  }
}

app.http("RegisterUser", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "register",
  handler: userHandler,
});
