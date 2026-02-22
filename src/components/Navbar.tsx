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
    ...(isAuthenticated ? [{ path: "/profile", label: t("nav.profile"), icon: User }] : []),
  ];

  const hoverClasses =
    "hover:bg-[hsl(var(--hover))] hover:text-[hsl(var(--hover-foreground))] hover:border-[hsl(var(--hover))] transition-colors";

  const NavLinks = ({ isMobile = false }: { isMobile?: boolean }) => (
    <>
      {navLinks.map(({ path, label, icon: Icon }) => (
        <Link key={path} to={path} className={isMobile ? "w-full" : ""}>
          <Button
            variant={isActive(path) ? "default" : "outline"}
            className={`gap-2 min-w-[120px] justify-center ${isMobile ? "w-full" : ""} ${isActive(path) ? "" : hoverClasses}`}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Button>
        </Link>
      ))}
    </>
  );

  const AuthButtons = ({ isMobile = false }) => {
    if (isAuthenticated) {
      return null;
    }

    return (
      <>
        <Link to="/login" className={isMobile ? "w-full" : ""}>
          <Button
            variant="outline"
            className={`${isMobile ? "w-full" : ""} ${hoverClasses}`}
          >
            {t("nav.login")}
          </Button>
        </Link>
        <Link to="/signup" className={isMobile ? "w-full" : ""}>
          <Button className={`${isMobile ? "w-full" : ""} ${hoverClasses}`}>
            {t("nav.signup")}
          </Button>
        </Link>
      </>
    );
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between ">
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
            <Button variant="ghost" size="icon" className={hoverClasses}>
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-4 mt-8">
              <NavLinks isMobile={true} />

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
