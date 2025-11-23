import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";
import { XCircle } from "lucide-react"; // Import XCircle for error display

const Login = () => {
 const { t } = useLanguage();
 const { login } = useAuth();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [isLoading, setIsLoading] = useState(false);
 const [error, setError] = useState("");

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError(""); // Clear previous errors
  setIsLoading(true);

  try {
   // FIX: Change URL from '/api/LoginHandler' to the registered route '/api/login'
   const response = await fetch('/api/login', { 
    method: 'POST',
    // *** IMPORTANT: Must include Content-Type header ***
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
   });

   if (response.ok) {
    // Successful login (status 200)
    const userData = await response.json();
    login(userData); // This triggers the Context update and navigation
   } else {
    // Unsuccessful login (status 401, 400, 500 etc.)
    const errorBody = await response.text();
    let errorMessage = t('login.error.generic') || "Login failed. Please check your credentials.";
    
    try {
      // Attempt to parse JSON response for a structured error message
      const jsonError = JSON.parse(errorBody);
      // Check for common error fields in the JSON body
      errorMessage = jsonError.body || jsonError.message || errorMessage;
    } catch {
      // If it's plain text, use it directly (e.g., "Invalid email or password" from the backend)
      errorMessage = errorBody || errorMessage;
    }

    // Set the error state, which displays the message to the user
    setError(errorMessage);
   }
  } catch (err) {
   console.error("Network or unexpected error during login:", err);
   // Fallback for network issues (CORS, server not running, etc.)
   setError(t('login.error.serverOffline') || "Could not connect to the backend server. Please check your connection.");
  } finally {
   setIsLoading(false);
  }
 };

 return (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4">
   <Card className="w-full max-w-md">
    <CardHeader className="space-y-1 flex flex-col items-center">
     <div className="h-12 w-12 object-contain">
      <img src="/pig-logo.png" />
     </div>
     <CardTitle className="text-2xl font-bold">{t('login.title')}</CardTitle>
     <CardDescription>{t('Log in your Paint IT Green account')}</CardDescription>
    </CardHeader>
    <form onSubmit={handleSubmit}>
     <CardContent className="space-y-4">
      
      {/* Error Message Display */}
      {error && (
       <div className="flex items-center justify-center p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
        <XCircle className="h-5 w-5 mr-2" />
        <span className="text-sm font-medium text-center">{error}</span>
       </div>
      )}

      <div className="space-y-2">
       <Label htmlFor="email">{t('login.email')}</Label>
       <Input
        id="email"
        type="email"
        placeholder={t('login.emailPlaceholder')}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={isLoading}
       />
      </div>
      <div className="space-y-2">
       <Label htmlFor="password">{t('login.password')}</Label>
       <Input
        id="password"
        type="password"
        placeholder={t('login.passwordPlaceholder')}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        disabled={isLoading}
       />
      </div>
     </CardContent>
     <CardFooter className="flex flex-col space-y-4">
      <Button type="submit" className="w-full" disabled={isLoading}>
       {isLoading ? (
        <>
         <Loader2 className="mr-2 h-4 w-4 animate-spin" />
         {t('login.loading') || 'Logging in...'}
        </>
       ) : (
        t('login.loginButton')
       )}
      </Button>
      <p className="text-sm text-muted-foreground text-center">
       {t('login.noAccount')}{" "}
       <Link to="/signup" className="text-primary hover:underline">
        {t('login.signupLink')}
       </Link>
      </p>
     </CardFooter>
    </form>
   </Card>
  </div>
 );
};

export default Login;