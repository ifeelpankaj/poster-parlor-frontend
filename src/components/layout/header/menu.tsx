import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Menu } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleSignInButton } from "./auth";
import { ModeToggle } from "@/components/theme/theme-toggle";

interface MobileMenuProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export function MobileMenu({ mobileOpen, setMobileOpen }: MobileMenuProps) {
  const navigation = [
    { href: "/", name: "Home" },
    { href: "/posters", name: "Posters" },
  ];
  const pathname = usePathname();

  return (
    <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="md:hidden">
          <Menu className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav className="mt-6">
          <ul className="flex flex-col gap-4">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));

              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "block text-base font-medium transition-colors hover:text-primary",
                      isActive
                        ? "font-semibold text-primary"
                        : "text-muted-foreground"
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Google Sign In */}
          <div className="mt-6 pt-6 border-t">
            <GoogleSignInButton className="w-full justify-center gap-2" />
          </div>

          {/* Mode Toggle */}
          <div className="mt-4">
            <ModeToggle />
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}
