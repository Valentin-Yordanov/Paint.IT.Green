import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2, XCircle, Leaf, Sparkles } from "lucide-react";

const Login = () => {
  const { t } = useLanguage();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (response.ok) {
        const userData = await response.json();
        login(userData);
      } else {
        const errorBody = await response.text();
        let errorMessage = t('login.error.generic') || "Login failed. Please check your credentials.";

        try {
          const jsonError = JSON.parse(errorBody);
          errorMessage = jsonError.body || jsonError.message || errorMessage;
        } catch {
          errorMessage = errorBody || errorMessage;
        }
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Network or unexpected error during login:", err);
      setError(t('login.error.serverOffline') || "Could not connect to the backend server. Please check your connection.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/10" />
      
      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Floating Icons */}
      <Leaf className="absolute top-20 right-16 h-8 w-8 text-primary/20 animate-bounce" style={{ animationDuration: '3s' }} />
      <Sparkles className="absolute bottom-32 left-16 h-6 w-6 text-accent/30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <Leaf className="absolute top-1/2 right-1/4 h-10 w-10 text-primary/15 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} />
      <Leaf className="absolute top-1/4 left-20 h-7 w-7 text-primary/25 animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
      <Sparkles className="absolute top-40 right-1/3 h-5 w-5 text-accent/25 animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1.5s' }} />
      <Leaf className="absolute bottom-1/4 right-16 h-9 w-9 text-primary/20 animate-bounce" style={{ animationDuration: '4.5s', animationDelay: '0.8s' }} />
      <Sparkles className="absolute top-16 left-1/3 h-4 w-4 text-accent/20 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2.5s' }} />
      <Leaf className="absolute bottom-20 right-1/4 h-6 w-6 text-primary/15 animate-bounce" style={{ animationDuration: '3.8s', animationDelay: '1.2s' }} />
      <Sparkles className="absolute top-1/3 right-10 h-5 w-5 text-accent/25 animate-bounce" style={{ animationDuration: '4.2s', animationDelay: '0.3s' }} />
      <Leaf className="absolute bottom-40 left-1/4 h-8 w-8 text-primary/20 animate-bounce" style={{ animationDuration: '3.2s', animationDelay: '1.8s' }} />
      <Sparkles className="absolute bottom-16 right-20 h-4 w-4 text-accent/30 animate-bounce" style={{ animationDuration: '4.8s', animationDelay: '2.2s' }} />
      <Leaf className="absolute top-28 left-10 h-5 w-5 text-primary/25 animate-bounce" style={{ animationDuration: '5.2s', animationDelay: '0.7s' }} />

      {/* Card */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-card/80 border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <div className="h-16 w-16 mb-2 p-2 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <img src="/pig-logo.png" className="h-full w-full object-contain" alt="Logo" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('login.title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('Log in your Paint IT Green account')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Error Message Display */}
            {error && (
              <div className="flex items-center justify-center p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 backdrop-blur-sm">
                <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-center">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">{t('login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">{t('login.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('login.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25 transition-all duration-300" 
              disabled={isLoading}
            >
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
              <Link to="/signup" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
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
