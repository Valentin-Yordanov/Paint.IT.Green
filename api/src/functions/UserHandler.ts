import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosClient, ItemDefinition } from "@azure/cosmos";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto"; // Imported for UUID generation

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

// 1. FIX: Initialize client OUTSIDE the handler
const client = connectionString ? new CosmosClient(connectionString) : null;

export async function userHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Processing user signup request.`);

  try {
    const body = (await request.json()) as {
      email: string;
      password: string;
      name: string;
      requestedRole?: string;
    };
    const { email, password, name, requestedRole } = body;

    if (!client || !databaseName || !email || !password || !name) {
      context.error("Missing required fields or DB configuration.");
      return {
        status: 400,
        body: "Missing required fields or server configuration.",
      };
    }

    const database = client.database(databaseName);
    const container = database.container(containerName);

    const lowerCaseEmail = email.toLowerCase();

    const { resources: existingUsers } = await container.items
      .query({
        query: "SELECT * FROM c WHERE c.email = @email",
        parameters: [{ name: "@email", value: lowerCaseEmail }],
      })
      .fetchAll();

    if (existingUsers.length > 0) {
      return { status: 409, body: "User with this email already exists." };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const role = requestedRole || "Student";

    // 2. FIX: Generate a safe UUID for the Cosmos DB id
    const newUser: UserSchema = {
      id: crypto.randomUUID(), 
      email: lowerCaseEmail,
      name,
      passwordHash: hashedPassword,
      role,
      isVerified: false,
      schoolId: "default-school",
      createdAt: new Date().toISOString(),
    };

    const { resource: createdUser } = await container.items.create(newUser);

    if (!createdUser) {
      context.error("Cosmos DB create operation returned no resource.");
      return {
        status: 500,
        body: `Registration failed. Database operation did not return the created user.`,
      };
    }

    return {
      status: 201,
      jsonBody: {
        message: "User created successfully!",
        userId: createdUser.id,
        role: createdUser.role,
      },
    };
  } catch (error) {
    context.error(
      `Error creating user: ${error instanceof Error ? error.message : String(error)}`,
    );
    return {
      status: 500,
      body: `Internal Server Error. Please check the function logs for details.`,
    };
  }
}

app.http("RegisterUser", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "register",
  handler: userHandler,
});