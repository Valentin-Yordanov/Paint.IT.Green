import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";
import { CosmosClient, ItemDefinition } from "@azure/cosmos";
import * as bcrypt from "bcryptjs";

interface UserSchema extends ItemDefinition { 
    id: string;   
    email: string; 
    name: string;  
    // CONFIRMED NAME: passwordHash
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

/**
 * Handles user registration via POST request.
 * Creates a new user in Cosmos DB with a hashed password.
 */
export async function userHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    context.log(`Processing user signup request.`);

    try {
        const body = await request.json() as { email: string; password: string; name: string; requestedRole?: string };
        const { email, password, name, requestedRole } = body;

        // Ensure configuration and required fields are present
        if (!connectionString || !databaseName || !email || !password || !name) {
            context.error("Missing required fields or DB configuration.");
            return { status: 400, body: "Missing required fields or server configuration." };
        }
        
        // 1. Connect to Cosmos DB
        const client = new CosmosClient(connectionString); 
        const database = client.database(databaseName);
        const container = database.container(containerName);

        const lowerCaseEmail = email.toLowerCase();
        
        // 2. Check if user already exists
        const { resources: existingUsers } = await container.items
            .query({
                query: "SELECT * FROM c WHERE c.email = @email",
                parameters: [{ name: "@email", value: lowerCaseEmail }]
            })
            .fetchAll();

        if (existingUsers.length > 0) {
            return { status: 409, body: "User with this email already exists." };
        }

        // 3. Security: Encrypt the password (Salt = 10 rounds)
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Determine Role
        const role = requestedRole || "Student"; 

        // 5. Create the User Object
        const newUser: UserSchema = {
            id: lowerCaseEmail, 
            email: lowerCaseEmail,
            name,
            // CRITICAL FIX: SAVING AS passwordHash
            passwordHash: hashedPassword,  
            role,
            isVerified: false, 
            schoolId: "default-school",
            createdAt: new Date().toISOString()
        };

        // 6. Save to Cosmos DB
        const { resource: createdUser } = await container.items.create(newUser); 
        
        if (!createdUser) {
            context.error('Cosmos DB create operation returned no resource.');
            return { status: 500, body: `Registration failed. Database operation did not return the created user.`, };
        }

        // 7. Response for success
        return {
            status: 201,
            jsonBody: {
                message: "User created successfully! Please wait for a moderator to verify your account.",
                userId: createdUser.id,
                role: createdUser.role
            }
        };
 
    } catch (error) {
        context.error(`Error creating user: ${error instanceof Error ? error.message : String(error)}`);
        return {
            status: 500, 
            body: `Internal Server Error. Please check the function logs for details.`,
        };
    }
}

// FIX: Renamed function ID from 'UserHandler' to 'RegisterUser' to resolve the registration conflict.
app.http('RegisterUser', { 
    methods: ['POST'],
    authLevel: 'anonymous',
    route: 'register',
    handler: userHandler
});