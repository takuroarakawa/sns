"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  Home,
  Search,
  Bell,
  Mail,
  Bookmark,
  User,
  Settings,
  LogOut,
  PenSquare,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SidebarProps {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    username: string;
    userTier: string;
  };
}

const navItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/explore", icon: Search, label: "Explore" },
  { href: "/notifications", icon: Bell, label: "Notifications" },
  { href: "/messages", icon: Mail, label: "Messages" },
  { href: "/bookmarks", icon: Bookmark, label: "Bookmarks" },
];

export function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 h-screen w-64 flex-shrink-0 py-4 pr-4 hidden lg:block">
      <div className="flex h-full flex-col justify-between">
        <div className="space-y-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 px-4 py-2 mb-4">
            <span className="text-2xl font-bold">SNS</span>
          </Link>

          {/* Navigation */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 rounded-full px-4 py-3 text-lg transition-colors hover:bg-accent",
                    isActive && "font-bold"
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            {/* Profile Link */}
            <Link
              href={`/${user.username}`}
              className={cn(
                "flex items-center gap-4 rounded-full px-4 py-3 text-lg transition-colors hover:bg-accent",
                pathname === `/${user.username}` && "font-bold"
              )}
            >
              <User className="h-6 w-6" />
              <span>Profile</span>
            </Link>

            {/* Settings Link */}
            <Link
              href="/settings"
              className={cn(
                "flex items-center gap-4 rounded-full px-4 py-3 text-lg transition-colors hover:bg-accent",
                pathname === "/settings" && "font-bold"
              )}
            >
              <Settings className="h-6 w-6" />
              <span>Settings</span>
            </Link>
          </nav>

          {/* Post Button (only for creators) */}
          {user.userTier !== "ROM" && (
            <Button className="w-full mt-4 rounded-full py-6 text-lg" asChild>
              <Link href="/compose">
                <PenSquare className="h-5 w-5 mr-2" />
                Post
              </Link>
            </Button>
          )}
        </div>

        {/* User Menu */}
        <div className="mt-auto">
          <div className="flex items-center gap-3 rounded-full p-3 hover:bg-accent cursor-pointer">
            <Avatar>
              <AvatarImage src={user.image || undefined} alt={user.name || ""} />
              <AvatarFallback>
                {user.name?.[0]?.toUpperCase() || user.username[0].toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{user.name}</p>
              <p className="text-sm text-muted-foreground truncate">
                @{user.username}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/login" })}
              title="Sign out"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
