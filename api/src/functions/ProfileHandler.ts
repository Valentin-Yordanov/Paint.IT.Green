import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient, ItemDefinition } from "@azure/cosmos";
import * as bcrypt from "bcryptjs";

// Local interface representing the structure of the user object saved to Cosmos DB.
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

// 1. Database Configuration
const connectionString = process.env.COSMOS_DB_CONNECTION_STRING; 

const databaseName = process.env.COSMOS_DB_DATABASE_ID; 

const containerName = "Users"; 

export async function userHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Processing user signup request.`);

    try {
        // --- Configuration Check: Ensure all necessary variables are present ---
        if (!connectionString || !databaseName) {
            context.error("Database configuration missing: Check COSMOS_DB_CONNECTION_STRING and COSMOS_DB_DATABASE_ID.");
            return { status: 500, body: "Internal Server Error: Database configuration missing." };
        }
        
        // 1. Connect to Cosmos DB
        const client = new CosmosClient(connectionString);
        
        // Using the environment variable for the database ID
        const database = client.database(databaseName);
        const container = database.container(containerName);

        // 2. Get data from the frontend
        const body = await request.json() as { email: string; password: string; name: string; requestedRole?: string };
        const { email, password, name, requestedRole } = body;

        if (!email || !password || !name) {
            return { status: 400, body: "Please provide email, password, and name." };
        }

        const lowerCaseEmail = email.toLowerCase();
        
        // 3. Check if user already exists
        const { resources: existingUsers } = await container.items
            .query({
                query: "SELECT * FROM c WHERE c.email = @email",
                parameters: [{ name: "@email", value: lowerCaseEmail }]
            })
            .fetchAll();

        if (existingUsers.length > 0) {
            return { status: 409, body: "User with this email already exists." };
        }

        // 4. Security: Encrypt the password (Salt = 10 rounds)
        const salt = await bcrypt.genSalt(10); 
        const passwordHash = await bcrypt.hash(password, salt);

        // 5. Determine Role
        const role = requestedRole || "Student"; // Changed default to "Student" for clarity

        // 6. Create the User Object
        const newUser: UserSchema = {
            id: lowerCaseEmail, 
            email: lowerCaseEmail,
            name,
            passwordHash,
            role,
            isVerified: false, 
            schoolId: "default-school",
            createdAt: new Date().toISOString()
        }; 

        // 7. Save to Cosmos DB
        const { resource: createdUser } = await container.items.create(newUser); 
        
        if (!createdUser) {
            context.error('Cosmos DB create operation returned no resource.');
            return { 
                status: 500, 
                body: `Registration failed. Database operation did not return the created user.`,
            };
        }

        // 8. Response for success
        return {
            status: 201,
            jsonBody: {
                message: "User created successfully! Please wait for a moderator to verify your account.",
                userId: createdUser.id,
                role: createdUser.role
            }
        };

    } catch (error) {
        let errorMessage = "An unknown error occurred.";
        if (error instanceof Error) {
            errorMessage = error.message;
        } else if (typeof error === 'object' && error !== null && 'message' in error) {
            errorMessage = (error as { message: string }).message; 
        }

        context.error(`Error creating user: ${errorMessage}`);

        // Return a generic error to the client for security
        return { 
            status: 500, 
            body: `Internal Server Error. Please check the function logs for details.`,
        };
    }
}

// 9. Register the Function with the Azure Host
app.http('UserHandler', {
    methods: ['POST'], 
    authLevel: 'anonymous',
    handler: userHandler
});