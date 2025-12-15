"use client";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../../ui/button";
import { ShoppingCart } from "lucide-react";

interface CartButtonProps {
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export function CartButton({ cartOpen, setCartOpen }: CartButtonProps) {
  return (
    <Sheet open={cartOpen} onOpenChange={setCartOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" aria-label="cart">
          <ShoppingCart className="h-4 w-4" />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
        </SheetHeader>
        <div className="mt-6">
          <p className="text-sm text-muted-foreground">Your cart is empty</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
