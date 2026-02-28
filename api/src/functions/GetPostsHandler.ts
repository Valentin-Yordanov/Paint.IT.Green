import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

export async function GetPostsHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
        if (!connectionString) {
            return { status: 500, body: "Missing Cosmos DB connection string" };
        }

        const client = new CosmosClient(connectionString);
        const database = client.database("PaintItGreenDB"); 
        const container = database.container("Posts");

        
        const { resources } = await container.items
            .query("SELECT * FROM c ORDER BY c._ts DESC")
            .fetchAll();

        return { 
            status: 200, 
            jsonBody: resources,
            headers: { "Content-Type": "application/json" }
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        context.error(`Error fetching posts: ${errorMessage}`);
        return { status: 500, body: "Error fetching posts" };
    }
}

app.http('GetPosts', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'posts',
    handler: GetPostsHandler
});