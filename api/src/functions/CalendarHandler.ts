import {
  app,
  HttpRequest,
  HttpResponseInit,
  InvocationContext,
  input,
  output,
} from "@azure/functions";

interface EventBody {
  title: string;
  dateString: string;
  time?: string;
  location?: string;
}

const DATABASE_NAME = "CalendarDB";
const CONTAINER_NAME = "Events";
const CONNECTION_SETTING = "COSMOS_DB_CONNECTION_STRING";

const cosmosInput = input.cosmosDB({
  databaseName: DATABASE_NAME,
  containerName: CONTAINER_NAME,
  connection: CONNECTION_SETTING,
  sqlQuery: "SELECT * FROM c",
});

const cosmosOutput = output.cosmosDB({
  databaseName: DATABASE_NAME,
  containerName: CONTAINER_NAME,
  connection: CONNECTION_SETTING,
  createIfNotExists: true,
});

export async function CalendarHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  const method = request.method;
  context.log(`CalendarHandler received a ${method} request.`);

  if (method === "GET") {
    const events = context.extraInputs.get(cosmosInput);
    return { jsonBody: events || [] };
  }

  if (method === "POST") {
    try {
      const body = (await request.json()) as EventBody;

      // Input validation
      if (!body.title || typeof body.title !== "string" || body.title.trim().length === 0 || body.title.length > 200) {
        return { status: 400, body: "Title is required and must be under 200 characters." };
      }
      if (!body.dateString || typeof body.dateString !== "string" || body.dateString.length > 50) {
        return { status: 400, body: "Valid date is required." };
      }
      if (body.time && (typeof body.time !== "string" || !/^\d{2}:\d{2}$/.test(body.time))) {
        return { status: 400, body: "Invalid time format. Use HH:MM." };
      }
      if (body.location && (typeof body.location !== "string" || body.location.length > 500)) {
        return { status: 400, body: "Location must be under 500 characters." };
      }

      const newEvent = {
        id: crypto.randomUUID(),
        title: body.title.trim(),
        dateString: body.dateString.trim(),
        time: body.time?.trim(),
        location: body.location?.trim(),
        createdAt: new Date().toISOString(),
      };

      context.extraOutputs.set(cosmosOutput, newEvent);
      context.log(`Successfully created event: ${newEvent.id}`);

      return { status: 201, jsonBody: newEvent };
    } catch (error) {
      context.error(`Error during POST: ${error}`);
      return { status: 500, body: "Error processing request." };
    }
  }

  return { status: 405, body: "Method Not Allowed" };
}

app.http("CalendarHandler", {
  methods: ["GET", "POST"],
  authLevel: "anonymous",
  extraInputs: [cosmosInput],
  extraOutputs: [cosmosOutput],
  handler: CalendarHandler,
});
