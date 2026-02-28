import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

interface Comment {
    author: string;
    role: string;
    content: string;
    time: string;
}

interface Attachment {
    type: "image" | "file";
    url: string;
    name: string;
    size?: string;
}

interface PostData {
    id: number | string;
    school: string;
    author: string;
    role: string;
    time: string;
    content: string;
    images?: string[];
    attachments?: Attachment[];
    likes: number;
    comments: Comment[];
    visibility: string;
    status: string;
}

export async function CreatePostHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    try {
        const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
        if (!connectionString) {
            return { status: 500, body: "Missing Cosmos DB connection string" };
        }

        const client = new CosmosClient(connectionString);
        const database = client.database("PaintItGreenDB"); 
        const container = database.container("Posts");

        const postData = await request.json() as PostData;
        
        const newPost = {
            ...postData,
            id: postData.id.toString()
        };

        const { resource } = await container.items.create(newPost);

        return { 
            status: 201, 
            jsonBody: resource,
            headers: { "Content-Type": "application/json" }
        };
    } catch (err: unknown) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        context.error(`Error saving post: ${errorMessage}`);
        
        return { 
            status: 500, 
            body: "Error saving post to Cosmos DB" 
        };
    }
}

app.http('CreatePost', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'posts',
    handler: CreatePostHandler
});