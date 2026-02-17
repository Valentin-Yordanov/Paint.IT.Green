import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  input,
  output,
} from "@azure/functions";

// Interface for type safety
interface EventBody {
  title: string;
  dateString: string;
  time?: string;
  location?: string;
}

// --- Configuration Constants ---
const DATABASE_NAME = "CalendarDB";
const CONTAINER_NAME = "Events";
// 🌟 CORRECTED: Matches your local.settings.json key
const CONNECTION_SETTING = "COSMOS_DB_CONNECTION_STRING";

// 1. INPUT BINDING (Read)
const cosmosInput = input.cosmosDB({
  databaseName: DATABASE_NAME,
  containerName: CONTAINER_NAME,
  connection: CONNECTION_SETTING,
  sqlQuery: "SELECT * FROM c",
});

// 2. OUTPUT BINDING (Write)
const cosmosOutput = output.cosmosDB({
  databaseName: DATABASE_NAME,
  containerName: CONTAINER_NAME,
  connection: CONNECTION_SETTING,
  createIfNotExists: true,
});

// 3. MAIN HANDLER FUNCTION
export async function CalendarHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const method = request.method;
  context.log(`CalendarHandler received a ${method} request.`);

  // --- GET: Return all events ---
  if (method === "GET") {
    const events = context.extraInputs.get(cosmosInput);
    return {
      jsonBody: events || [],
    };
  }

  // --- POST: Create a new event (Database Insertion) ---
  if (method === "POST") {
    try {
      const body = (await request.json()) as EventBody;

      if (!body.title || !body.dateString) {
        context.warn("POST attempt failed: Missing title or date");
        return { status: 400, body: "Missing title or date" };
      }

      const newEvent = {
        // Using the built-in crypto module for unique ID
        id: crypto.randomUUID(),
        ...body,
        createdAt: new Date().toISOString(),
      };

      context.extraOutputs.set(cosmosOutput, newEvent);

      context.log(`Successfully created event: ${newEvent.id}`);

      return {
        status: 201,
        jsonBody: newEvent,
      };
    } catch (error) {
      context.error(`Error during POST: ${error}`);
      return { status: 500, body: "Error processing request" };
    }
  }

  // Handle unhandled methods
  return {
    status: 405,
    body: "Method Not Allowed",
  };
}

// 4. FUNCTION REGISTRATION
app.http("CalendarHandler", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  extraInputs: [cosmosInput],
  extraOutputs: [cosmosOutput],
  handler: CalendarHandler,
});
