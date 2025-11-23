import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";
import * as bcrypt from "bcryptjs"; // Used for secure password comparison

// Configuration (Use Environment Variables in production! Check your local.settings.json)
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = "SchoolDB"; 
const containerName = "Users";

interface LoginRequest {
    email?: string;
    password?: string;
}

// Interface for user data fetched from Cosmos DB (must include the hash field)
interface DbUser {
    id: string;
    email: string;
    name?: string;
    role: string;
    passwordHash: string; // The hashed password field
}

export async function LoginHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Login attempt processing...`);

    try {
        const body = await request.json() as LoginRequest;
        const { email, password } = body;

        if (!email || !password) {
            return { status: 400, body: "Please provide email and password" };
        }

        if (!connectionString) {
            context.error("Database connection string missing in environment variables.");
            return { status: 500, body: "Internal Server Error: Configuration missing." };
        }

        // 1. Connect to Cosmos DB
        const client = new CosmosClient(connectionString);
        const container = client.database(databaseName).container(containerName);

        // 2. Query for the user by email
        const querySpec = {
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

        // 3. Check Password (Secure Professional Standard)
        // Compare the plain text password with the stored HASH
        const passwordMatch = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatch) {
            context.log("Login failed: Password mismatch");
            return { status: 401, body: "Invalid email or password" };
        }

        // 4. Success! Return a clean user profile (EXCLUDING the password hash)
        const userProfile = {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role || "student" // Default role
        };

        return {
            status: 200,
            jsonBody: userProfile // Ensures the response is JSON with correct Content-Type
        };

    } catch (error) {
        context.error("Login Handler Error:", error);
        return { status: 500, body: "Internal Server Error" };
    }
}

app.http('LoginHandler', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: LoginHandler
});