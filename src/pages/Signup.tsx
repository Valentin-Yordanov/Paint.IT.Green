import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, XCircle, CheckCircle, Leaf, Sparkles } from "lucide-react";

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
      setError(t('signup.error.serverOffline') || `Could not connect to the backend server. (Check if API is running).`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/10 via-background to-primary/5" />

      {/* Decorative Elements */}
      <div className="absolute top-10 right-20 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-10 left-20 w-96 h-96 bg-secondary/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-accent/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '2s' }} />

      {/* Floating Icons */}
      <Leaf className="absolute top-24 left-16 h-8 w-8 text-primary/20 animate-bounce" style={{ animationDuration: '3s' }} />
      <Sparkles className="absolute bottom-32 right-24 h-6 w-6 text-accent/30 animate-bounce" style={{ animationDuration: '4s', animationDelay: '1s' }} />
      <Leaf className="absolute bottom-1/3 left-1/4 h-10 w-10 text-primary/15 animate-bounce" style={{ animationDuration: '5s', animationDelay: '2s' }} />

      {/* Card */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-card/80 border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <div className="h-16 w-16 mb-2 p-2 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <img src="/pig-logo.png" className="h-full w-full object-contain" alt="Logo" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('signup.title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t('Help Paint IT Green today')}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {/* Success Message Display */}
            {successMessage && (
              <div className="flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary border border-primary/20 backdrop-blur-sm">
                <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-center">{successMessage}</span>
              </div>
            )}

            {/* Error Message Display */}
            {error && (
              <div className="flex items-center justify-center p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 backdrop-blur-sm">
                <XCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm font-medium text-center">{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground/80">{t('signup.name')}</Label>
              <Input
                id="name"
                type="text"
                placeholder={t('signup.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground/80">{t('signup.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('signup.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground/80">{t('signup.password')}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t('signup.passwordPlaceholder')}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus:border-primary/50 transition-colors"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground/80">{t('signup.confirmPassword')}</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t('signup.confirmPasswordPlaceholder')}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              disabled={isLoading || !!successMessage}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t('signup.loading') || 'Signing up...'}
                </>
              ) : (
                t('signup.signupButton')
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t('signup.haveAccount')}{" "}
              <Link to="/login" className="text-primary hover:text-primary/80 hover:underline font-medium transition-colors">
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
