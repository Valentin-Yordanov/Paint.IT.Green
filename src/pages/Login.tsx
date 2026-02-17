import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Loader2,
  XCircle,
} from "lucide-react";

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
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Backend now returns { user, token }
        login(data);
      } else if (response.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError(t("login.error.generic") || "Invalid email or password.");
      }
    } catch (err) {
      console.error("Error:", err);
      setError(
        t("login.error.serverOffline") || "Could not connect to server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-30" />

      <Card className="w-full max-w-md relative z-10 backdrop-blur-xl bg-card/80 border-primary/20 shadow-2xl shadow-primary/10">
        <CardHeader className="space-y-1 flex flex-col items-center pb-2">
          <div className="h-16 w-16 mb-2 p-2 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 backdrop-blur-sm border border-primary/20 flex items-center justify-center">
            <img
              src="/pig-logo.png"
              className="h-full w-full object-contain"
              alt="Logo"
            />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t("login.title")}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("Log in your Paint IT Green account")}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="flex items-center justify-center p-3 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
                <XCircle className="h-5 w-5 mr-2" />
                <span className="text-sm font-medium">{error}</span>
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">{t("login.email")}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t("login.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{t("login.password")}</Label>
              <Input
                id="password"
                type="password"
                placeholder={t("login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                className="bg-background/50 border-primary/20 focus:border-primary/50"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("login.loading")}
                </>
              ) : (
                t("login.loginButton")
              )}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t("login.noAccount")}{" "}
              <Link to="/signup" className="text-primary hover:underline">
                {t("login.signupLink")}
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Login;
