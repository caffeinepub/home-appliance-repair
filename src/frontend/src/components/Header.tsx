import { Button } from "@/components/ui/button";
import { Menu, Wrench, X } from "lucide-react";
import { useState } from "react";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import { UserRole } from "../hooks/useQueries";

interface HeaderProps {
  view: string;
  onNavigate: (v: string) => void;
  role: UserRole | undefined;
}

export default function Header({ view, onNavigate, role }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { login, clear, loginStatus, identity } = useInternetIdentity();
  const isLoggedIn = !!identity;
  const isLoggingIn = loginStatus === "logging-in";

  const navLinks = [
    { label: "Services", anchor: "services" },
    { label: "How it Works", anchor: "how-it-works" },
    { label: "Pricing", anchor: "pricing" },
    { label: "Contact", anchor: "contact" },
  ];

  const scrollTo = (id: string) => {
    if (view !== "landing") {
      onNavigate("landing");
      setTimeout(
        () =>
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }),
        300,
      );
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-border">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            onClick={() => onNavigate("landing")}
            className="flex items-center gap-2 group"
            data-ocid="nav.link"
          >
            <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center shadow-card group-hover:opacity-90 transition-opacity">
              <Wrench className="w-5 h-5 text-white" />
            </div>
            <div className="leading-tight">
              <span className="font-display font-bold text-lg text-foreground tracking-tight">
                HomeCare
              </span>
              <span
                className="block text-[10px] font-semibold uppercase tracking-widest text-accent"
                style={{ marginTop: "-2px" }}
              >
                REPAIRS
              </span>
            </div>
          </button>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.anchor}
                onClick={() => scrollTo(link.anchor)}
                className="text-sm text-muted-foreground hover:text-primary transition-colors font-medium"
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
            {isLoggedIn && role === UserRole.admin && (
              <button
                type="button"
                onClick={() => onNavigate("admin")}
                className="text-sm font-semibold text-primary hover:underline"
                data-ocid="nav.link"
              >
                Admin Panel
              </button>
            )}
            {isLoggedIn && role !== UserRole.admin && (
              <button
                type="button"
                onClick={() => onNavigate("dashboard")}
                className="text-sm font-semibold text-primary hover:underline"
                data-ocid="nav.link"
              >
                My Bookings
              </button>
            )}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <span className="text-xs text-muted-foreground hidden lg:block truncate max-w-[120px]">
                  {identity?.getPrincipal().toString().slice(0, 12)}...
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  data-ocid="nav.button"
                >
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                  data-ocid="nav.button"
                >
                  Log In
                </Button>
                <Button
                  size="sm"
                  onClick={login}
                  disabled={isLoggingIn}
                  className="bg-accent text-white hover:opacity-90 font-semibold"
                  data-ocid="nav.primary_button"
                >
                  BOOK NOW
                </Button>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 rounded-md text-foreground"
            onClick={() => setMobileOpen((v) => !v)}
            data-ocid="nav.toggle"
          >
            {mobileOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
        </div>

        {mobileOpen && (
          <div className="md:hidden py-3 border-t border-border flex flex-col gap-3">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link.anchor}
                onClick={() => scrollTo(link.anchor)}
                className="text-sm text-left text-muted-foreground hover:text-primary transition-colors font-medium px-1 py-1"
                data-ocid="nav.link"
              >
                {link.label}
              </button>
            ))}
            <div className="flex gap-2 pt-2">
              {isLoggedIn ? (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clear}
                  className="border-primary text-primary"
                  data-ocid="nav.button"
                >
                  Log Out
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={login}
                    className="border-primary text-primary"
                    data-ocid="nav.button"
                  >
                    Log In
                  </Button>
                  <Button
                    size="sm"
                    onClick={login}
                    className="bg-accent text-white"
                    data-ocid="nav.primary_button"
                  >
                    BOOK NOW
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
