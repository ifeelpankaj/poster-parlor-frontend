import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Navigation() {
  const navigation = [
    { href: "/", name: "Home" },
    { href: "/posters", name: "Posters" },
  ];
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex">
      <ul className="flex items-center gap-6">
        {navigation.map((item) => {
          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname?.startsWith(item.href));

          return (
            <li key={item.name}>
              <Link
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
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
    </nav>
  );
}
