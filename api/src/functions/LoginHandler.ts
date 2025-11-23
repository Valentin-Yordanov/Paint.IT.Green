import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import * as bcrypt from "bcryptjs"; 

// Configuration (Uses Environment Variables from Azure's "Environment variables" blade)
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = process.env.COSMOS_DB_DATABASE_ID; 
const containerName = "Users";

interface LoginRequest {
    email?: string;
    password?: string;
}

// Interface for user data fetched from Cosmos DB 
interface DbUser {
    id: string;
    email: string;
    name?: string;
    role: string;
    // CONFIRMED NAME: passwordHash
    passwordHash: string; 
}

export async function LoginHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Login attempt processing...`);

    try {
        const body = await request.json() as LoginRequest;
        const { email, password } = body;

        // Ensure configuration and required fields are present
        if (!connectionString || !databaseName || !email || !password) {
            context.error("Missing required fields or DB configuration.");
            return { status: 400, body: "Missing required fields or server configuration." };
        }

        // 1. Connect to Cosmos DB
        const client = new CosmosClient(connectionString);
        const container = client.database(databaseName).container(containerName);

        // 2. Query for the user by email
        const querySpec = {
            // Field name in query must be passwordHash
            query: "SELECT c.id, c.email, c.name, c.role, c.passwordHash FROM c WHERE c.email = @email",
            parameters: [
                { name: "@email", value: email }
            ]
        };

        const { resources: users } = await container.items.query(querySpec).fetchAll();

        if (users.length === 0) {
            context.log(`Login failed: User not found for email: ${email}`);
            return { status: 401, body: "Invalid email or password" };
        }

        const user = users[0] as DbUser;

        // 3. Check Password (Comparing against user.passwordHash)
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            context.log("Login failed: Password mismatch");
            return { status: 401, body: "Invalid email or password" };
        }

        // 4. Success! Return a clean user profile
        const userProfile = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "student" 
        };

        return {
            status: 200,
            jsonBody: userProfile
        };

    } catch (error) {
        context.error("Login Handler Error:", error);
        return { 
            status: 500, 
            body: "Internal Server Error. Could not connect to the database. Check function logs." 
        };
    }
}

app.http('LoginHandler', {
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'login',
    handler: LoginHandler
});