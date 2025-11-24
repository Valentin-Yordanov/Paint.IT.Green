import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

interface ApiResponseData {
   body?: string; 
   message?: string;
   userId?: string;
   role?: string;
}

const Signup: React.FC = () => {
   const { t } = useLanguage();
   const navigate = useNavigate();
   const [name, setName] = useState<string>("");
   const [email, setEmail] = useState<string>("");
   const [password, setPassword] = useState<string>("");
   const [confirmPassword, setConfirmPassword] = useState<string>("");
   
   const [isLoading, setIsLoading] = useState<boolean>(false);
   const [error, setError] = useState<string | null>(null);
   const [successMessage, setSuccessMessage] = useState<string | null>(null);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      setSuccessMessage(null);

      if (password !== confirmPassword) {
         setError(t('signup.error.passwordMismatch'));
         return;
      }

      setIsLoading(true);

      try {
         const userData = {
            name,
            email,
            password,
            requestedRole: "Student" 
         };


         const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
         });
         
         let data: ApiResponseData = {};
         const contentType = response.headers.get("content-type");
         
         if (contentType && contentType.includes("application/json")) {
            data = (await response.json()) as ApiResponseData;
         } else {
            const text = await response.text();
            data = { body: text }; 
         }

         if (response.ok) {
            const message = data.message || t('signup.successMessage');
            setSuccessMessage(message);
            
            setTimeout(() => {
                  navigate('/login');
            }, 2000); 

         } else {
            const errorMessage = data.body || data.message || t('signup.error.generic');
            setError(errorMessage);
         }

      } catch (err) {
         console.error("API call error:", err);
         // Fallback network error message
         setError(t('signup.error.serverOffline') || `Could not connect to the backend server. (Check if API is running).`);
      } finally {
         setIsLoading(false);
      }
   };

   return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-secondary/20 px-4 py-8">
         <Card className="w-full max-w-md">
            <CardHeader className="space-y-1 flex flex-col items-center">
               <div className="h-12 w-12 object-contain">
                  <img src="/pig-logo.png" />
               </div>
               <CardTitle className="text-2xl font-bold">{t('signup.title')}</CardTitle>
               <CardDescription>{t('Help Paint IT Green today')}</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
               <CardContent className="space-y-4">
                  
                  {/* Input Fields */}
                  <div className="space-y-2">
                     <Label htmlFor="name">{t('signup.name')}</Label>
                     <Input
                        id="name"
                        type="text"
                        placeholder={t('signup.namePlaceholder')}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={isLoading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="email">{t('signup.email')}</Label>
                     <Input
                        id="email"
                        type="email"
                        placeholder={t('signup.emailPlaceholder')}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        disabled={isLoading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="password">{t('signup.password')}</Label>
                     <Input
                        id="password"
                        type="password"
                        placeholder={t('signup.passwordPlaceholder')}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        disabled={isLoading}
                     />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Label>
                     <Input
                        id="confirmPassword"
                        type="password"
                        placeholder={t('signup.confirmPasswordPlaceholder')}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        disabled={isLoading}
                     />
                  </div>
                  
                  {/* --- Message Display --- */}
                  {successMessage && (
                     <div className="flex items-center justify-center p-3 rounded-lg bg-green-100 text-green-700">
                        <CheckCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium">{successMessage}</span>
                     </div>
                  )}
                  {error && (
                     <div className="flex items-center justify-center p-3 rounded-lg bg-red-100 text-red-700 border border-red-200">
                        <XCircle className="h-5 w-5 mr-2" />
                        <span className="text-sm font-medium text-center">{error}</span>
                     </div>
                  )}
                  
               </CardContent>
               <CardFooter className="flex flex-col space-y-4">
                  <Button 
                     type="submit" 
                     className="w-full" 
                     disabled={isLoading || !!successMessage} 
                  >
                     {isLoading ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           {t('signup.loading')}
                        </>
                     ) : (
                        t('signup.signupButton')
                     )}
                  </Button>
                  <p className="text-sm text-muted-foreground text-center">
                     {t('signup.haveAccount')}{" "}
                     <Link to="/login" className="text-primary hover:underline">
                        {t('signup.loginLink')}
                     </Link>
                  </p>
               </CardFooter>
            </form>
         </Card>
      </div>
   );
};

export default Signup;