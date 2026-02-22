import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosClient, ItemDefinition } from "@azure/cosmos";
import * as bcrypt from "bcryptjs";
import * as crypto from "crypto";

interface UserSchema extends ItemDefinition {
  id: string;
  email: string;
  name: string;
  passwordHash: string;
  role: "Student" | "Parent" | "Teacher" | "Guest";
  isAdmin: boolean;
  schoolName: string;
  isVerified: boolean;
  createdAt: string;
}

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = process.env.COSMOS_DB_DATABASE_ID;
const containerName = "Users";

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
      role: "Student" | "Parent" | "Teacher" | "Guest";
      schoolName?: string;
    };
    
    const { email, password, name, role, schoolName } = body;

    if (!client || !databaseName || !email || !password || !name || !role) {
      return { status: 400, body: "Missing required fields." };
    }

    const validRoles = ["Student", "Parent", "Teacher", "Guest"];
    if (!validRoles.includes(role)) {
      return { status: 400, body: "Invalid role selected." };
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

    const newUser: UserSchema = {
      id: crypto.randomUUID(),
      email: lowerCaseEmail,
      name,
      passwordHash: hashedPassword,
      role,
      isAdmin: false,
      schoolName: (role === "Student" || role === "Teacher") ? (schoolName || "Not Provided") : "N/A",
      isVerified: false,
      createdAt: new Date().toISOString(),
    };

    const { resource: createdUser } = await container.items.create(newUser);

    if (!createdUser) {
      return { status: 500, body: `Database operation failed.` };
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
    context.error(error);
    return { status: 500, body: `Internal Server Error.` };
  }
}

app.http("RegisterUser", {
  methods: ["POST"],
  authLevel: "anonymous",
  route: "register",
  handler: userHandler,
});