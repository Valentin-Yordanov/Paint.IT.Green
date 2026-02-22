import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
} from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = process.env.COSMOS_DB_DATABASE_ID;
const containerName = "Users";

export async function updateProfileHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  context.log(`Update profile attempt processing...`);

  try {
    const body = (await request.json()) as {
      id: string;
      email: string;
      name?: string;
      schoolName?: string;
    };
    const { id, email, name, schoolName } = body;

    if (!connectionString || !databaseName) {
      return { status: 500, body: "Database configuration missing." };
    }
    if (!id || !email) {
      return { status: 400, body: "Missing id or email." };
    }
    
    const client = new CosmosClient(connectionString);
    const container = client.database(databaseName).container(containerName);

    // 1. Намираме потребителя по неговото ID
    const { resource: existingUser } = await container.item(id, id).read();

    if (!existingUser) {
      return { status: 404, body: "User not found." };
    }

    // 2. Обновяваме само позволените полета (без имейл и парола)
    if (name) existingUser.name = name;
    if (schoolName) existingUser.schoolName = schoolName;
    if (email) existingUser.email = email.toLowerCase();
    
    // 3. Записваме промените обратно в базата
    const { resource: updatedUser } = await container
      .item(id, id)
      .replace(existingUser);

    if (!updatedUser) {
      return { status: 500, body: "Failed to update user." };
    }

    // 4. Връщаме обновения профил към фронтенда
    const userProfile = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role || "Student",
      schoolName: updatedUser.schoolName || "N/A",
    };

    return {
      status: 200,
      jsonBody: userProfile,
    };
  } catch (error) {
    context.error("Update Profile Error:", error);
    const errorMessage =
      error instanceof Error ? error.message : JSON.stringify(error);
    return { status: 500, body: `Internal Server Error: ${errorMessage}` };
  }
}

// Регистрираме новия път: /api/updateProfile
app.http("UpdateProfile", {
  methods: ["PUT"],
  authLevel: "anonymous",
  route: "updateProfile",
  handler: updateProfileHandler,
});
