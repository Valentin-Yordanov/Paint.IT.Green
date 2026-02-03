import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { Loader2, XCircle, CheckCircle, Leaf, Sparkles, Sprout, Flower2, Cloud, Droplets } from "lucide-react";

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
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const errorMessage = data.body || data.message || t('signup.error.generic');
        setError(errorMessage);
      }

    } catch (err) {
      console.error("API call error:", err);
      setError(t('signup.error.serverOffline') || `Could not connect to the backend server.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-background">
      
      {/*Background Pattern*/}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      {/* Card */}
      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-card/80 border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <div className="h-16 w-16 mb-2 p-2 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <img src="/pig-logo.png" className="h-full w-full object-contain" alt="Logo" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t('signup.title')}
          </CardTitle>
          <CardDescription className="text-muted-foreground">{t('Help Paint IT Green today')}</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {successMessage && (
              <div className="flex items-center justify-center p-3 rounded-lg bg-primary/10 text-primary border border-primary/20">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{successMessage}</span>
              </div>
            )}
            {error && (
              <div className="flex items-center justify-center p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                <XCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            {/* Form Inputs */}
            <div className="space-y-2">
              <Label htmlFor="name">{t('signup.name')}</Label>
              <Input id="name" type="text" placeholder={t('signup.namePlaceholder')} value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">{t('signup.email')}</Label>
              <Input id="email" type="email" placeholder={t('signup.emailPlaceholder')} value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t('signup.password')}</Label>
              <Input id="password" type="password" placeholder={t('signup.passwordPlaceholder')} value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t('signup.confirmPassword')}</Label>
              <Input id="confirmPassword" type="password" placeholder={t('signup.confirmPasswordPlaceholder')} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25" disabled={isLoading || !!successMessage}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t('signup.loading')}</> : t('signup.signupButton')}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t('signup.haveAccount')}{" "}<Link to="/login" className="text-primary hover:underline">{t('signup.loginLink')}</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;