import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient } from "@azure/cosmos";

// 1. Configuration
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING;
const databaseName = "SchoolDB";
const containerName = "Users";

// Define the shape of the update request body
interface ProfileUpdateRequest {
    email: string;
    name?: string;
    school?: string;
    role?: string;
}

export async function profileHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Processing Profile request.`);

    if (!connectionString) {
        return { status: 500, body: "Database configuration missing." };
    }

    const client = new CosmosClient(connectionString);
    const container = client.database(databaseName).container(containerName);

    // GET: Fetch User Profile
    if (request.method === "GET") {
        const email = request.query.get('email');

        if (!email) {
            return { status: 400, body: "Email is required to fetch profile." };
        }

        try {
            const lowerEmail = email.toLowerCase();
            const { resource: user } = await container.item(lowerEmail, lowerEmail).read();

            if (!user) {
                return { status: 404, body: "User not found." };
            }

            // Remove sensitive data
            const { passwordHash, ...safeUser } = user;

            // Merge with default stats if they don't exist in DB yet
            const fullProfile = {
                points: 0,
                rank: "Newcomer",
                treesPlanted: 0,
                challengesCompleted: 0,
                lessonsFinished: 0,
                school: "Not Set",
                ...safeUser 
            };

            return { status: 200, jsonBody: fullProfile };

        } catch (error) {
            context.error("Error fetching profile:", error);
            return { status: 500, body: "Failed to fetch profile." };
        }
    }

    // PUT: Update User Profile
    if (request.method === "PUT") {
        try {
            // FIX: Use the specific interface instead of 'any'
            const body = await request.json() as ProfileUpdateRequest;
            const { email, name, school, role } = body;

            if (!email) {
                return { status: 400, body: "Email is required for update." };
            }

            const lowerEmail = email.toLowerCase();
            
            // 1. Read existing item first
            const { resource: existingUser } = await container.item(lowerEmail, lowerEmail).read();

            if (!existingUser) {
                return { status: 404, body: "User to update not found." };
            }

            // 2. Update allowed fields
            const updatedUser = {
                ...existingUser,
                name: name || existingUser.name,
                schoolId: school || existingUser.schoolId, 
                role: role || existingUser.role,
            };

            // 3. Save back to DB
            const { resource: savedUser } = await container.items.upsert(updatedUser);

            return { 
                status: 200, 
                jsonBody: { 
                    message: "Profile updated successfully", 
                    user: savedUser 
                } 
            };

        } catch (error) {
            context.error("Error updating profile:", error);
            return { status: 500, body: "Failed to update profile." };
        }
    }

    return { status: 405, body: "Method Not Allowed" };
}

app.http('ProfileHandler', {
    methods: ['GET', 'PUT'],
    authLevel: 'anonymous',
    handler: profileHandler
});