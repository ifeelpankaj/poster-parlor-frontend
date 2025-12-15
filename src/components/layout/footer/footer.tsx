import { cn } from "@/lib/utils";
import Link from "next/link";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        "relative bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800",
        className
      )}
    >
      {/* Top Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600" />

      <div className="w-full px-4 sm:px-6 lg:px-8 py-8 md:py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:gap-8">
          {/* Left Section - Brand & Copyright */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <Link href="/" className="group">
              <h3 className="text-xl md:text-2xl font-bold transition-all duration-500">
                Posterparlor
              </h3>
            </Link>
            <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
              &copy; {new Date().getFullYear()} All rights reserved.
            </p>
          </div>

          {/* Center Section - Tagline (hidden on mobile) */}
          <div className="hidden lg:block">
            <p className="text-sm text-gray-500 dark:text-gray-500 italic">
              Discover posters that match your vibe.
            </p>
          </div>

          {/* Right Section - Links */}
          <div className="flex items-center gap-6 md:gap-8">
            <Link
              className="relative text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group"
              href="/privacy"
            >
              Privacy
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              className="relative text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group"
              href="/terms"
            >
              Terms
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              className="relative text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group"
              href="/cookies"
            >
              Cookies
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
            <Link
              className="relative text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-300 group"
              href="/sitemap"
            >
              Sitemap
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300" />
            </Link>
          </div>
        </div>

        {/* Bottom Decorative Element */}
        <div className="mt-8 flex justify-center gap-2 opacity-30">
          <div className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="h-1 w-8 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
          <div className="h-1 w-1 rounded-full bg-gradient-to-r from-blue-600 to-purple-600" />
        </div>
      </div>
    </footer>
  );
}
