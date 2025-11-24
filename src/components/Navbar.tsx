import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Leaf, Trophy, Users, BookOpen, Menu, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useLanguage } from "../contexts/LanguageContext";
import { useAuth } from "../contexts/AuthContext";

const Navbar = () => {
  const location = useLocation();
  const { t } = useLanguage();
  const { isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { path: "/", label: t("nav.home"), icon: Leaf },
    { path: "/learn", label: t("nav.learn"), icon: BookOpen },
    { path: "/compete", label: t("nav.compete"), icon: Trophy },
    { path: "/community", label: t("nav.community"), icon: Users },
    { path: "/profile", label: t("nav.profile"), icon: User },
  ].filter(link => link.path !== "/profile" || isAuthenticated); // Filter out /profile if not authenticated

  const NavLinks = () => (
    <>
      {navLinks.map(({ path, label, icon: Icon }) => (
        <Link key={path} to={path}>
          <Button
            variant={isActive(path) ? "default" : "outline"}
            className="gap-2"
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        </Link>
      ))}
    </>
  );

  const AuthButtons = ({ isMobile = false }) => {
    // If the user is logged in, we render nothing (null)
    if (isAuthenticated) {
      return null;
    }

    // If the user is NOT logged in, we show Login and Signup
    return (
      <>
        <Link to="/login" className={isMobile ? "w-full" : ""}>
          <Button variant="outline" className={isMobile ? "w-full" : ""}>
            {t("nav.login")}
          </Button>
        </Link>
        <Link to="/signup" className={isMobile ? "w-full" : ""}>
          <Button className={isMobile ? "w-full" : ""}>
            {t("nav.signup")}
          </Button>
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/pig-logo.png"
            alt="PIG Logo"
            className="h-12 w-12 object-contain"
          />
          <span className="text-xl font-bold text-foreground">
            {t("Paint IT Green")}
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2">
          <NavLinks />
          <AuthButtons />
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <NavLinks />
              <div className="mt-4 border-t pt-4 flex flex-col gap-4">
                <AuthButtons isMobile={true} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;