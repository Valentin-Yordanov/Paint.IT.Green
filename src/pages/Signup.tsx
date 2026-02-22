import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Loader2,
  XCircle,
  CheckCircle,
} from "lucide-react";

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
  
  const [role, setRole] = useState<string>("Student");
  const [schoolName, setSchoolName] = useState<string>("");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);

    if (password !== confirmPassword) {
      setError(t("signup.error.passwordMismatch") || "Passwords do not match");
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        name,
        email,
        password,
        role,
        schoolName: (role === "Student" || role === "Teacher") ? schoolName : undefined,
      };

      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
        const message = data.message || t("signup.successMessage") || "Success!";
        setSuccessMessage(message);
        setTimeout(() => navigate("/login"), 2000);
      } else {
        const errorMessage = data.body || data.message || t("signup.error.generic");
        setError(errorMessage);
      }
    } catch (err) {
      console.error("API call error:", err);
      setError(t("signup.error.serverOffline") || `Could not connect to the backend server.`);
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
            <img src="/pig-logo.png" className="h-full w-full object-contain" alt="Logo" />
          </div>
          <CardTitle className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
            {t("signup.title") || "Sign Up"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {t("Help Paint IT Green today") || "Create an account"}
          </CardDescription>
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
            
            <div className="space-y-2">
              <Label htmlFor="name">{t("signup.name") || "Full Name"}</Label>
              <Input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{t("signup.email") || "Email"}</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select value={role} onValueChange={setRole} disabled={isLoading}>
                <SelectTrigger className="w-full bg-background/50 border-primary/20 focus:border-primary/50 h-10">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Student">Student</SelectItem>
                  <SelectItem value="Parent">Parent</SelectItem>
                  <SelectItem value="Teacher">Teacher</SelectItem>
                  <SelectItem value="Guest">Guest</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {(role === "Student" || role === "Teacher") && (
              <div className="space-y-2">
                <Label htmlFor="schoolName">School Name</Label>
                <Input id="schoolName" type="text" value={schoolName} onChange={(e) => setSchoolName(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="password">{t("signup.password") || "Password"}</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">{t("signup.confirmPassword") || "Confirm Password"}</Label>
              <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required disabled={isLoading} className="bg-background/50 border-primary/20 focus:border-primary/50" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4 pt-2">
            <Button type="submit" className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/25" disabled={isLoading || !!successMessage}>
              {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />{t("signup.loading") || "Loading..."}</> : (t("signup.signupButton") || "Sign Up")}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              {t("signup.haveAccount") || "Already have an account?"} <Link to="/login" className="text-primary hover:underline">{t("signup.loginLink") || "Log in"}</Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default Signup;