"use client";

import Link from "next/link";

import { ModeToggle } from "../../theme/theme-toggle";

import { useState } from "react";

import { CartButton } from "./cart";
import { GoogleSignInButton } from "./auth";
import { MobileMenu } from "./menu";
import { Navigation } from "./navigation";
import { Logo } from "@/components/ui/logo";

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Logo */}
          <Link className="flex items-center gap-2" href="/">
            <Logo />
          </Link>

          {/* Center: Desktop Navigation */}
          <Navigation />
          {/* Right: Actions */}

          <div className="flex items-center gap-2">
            {/* Google Sign In - Desktop Only */}
            <GoogleSignInButton className="hidden md:flex" />

            {/* Mode Toggle - Desktop Only */}
            <div className="hidden md:block">
              <ModeToggle />
            </div>

            {/* Cart */}
            <CartButton cartOpen={cartOpen} setCartOpen={setCartOpen} />

            {/* Mobile Menu */}
            <MobileMenu mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
          </div>
        </div>
      </div>
    </header>
  );
}
