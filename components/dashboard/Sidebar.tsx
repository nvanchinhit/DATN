"use client";

import Link from "next/link";
import { useState } from "react";
import { 
  Home, 
  BarChart2, 
  Users, 
  Settings, 
  HelpCircle,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarItemProps {
  icon: React.ReactNode;
  title: string;
  href: string;
  isActive?: boolean;
}

function SidebarItem({ icon, title, href, isActive }: SidebarItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
        isActive 
          ? "bg-primary text-primary-foreground" 
          : "hover:bg-muted"
      )}
    >
      {icon}
      <span>{title}</span>
    </Link>
  );
}

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 left-4 md:hidden z-50"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X /> : <Menu />}
      </Button>

      {/* Sidebar */}
      <div
        className={cn(
          "fixed top-0 bottom-0 left-0 z-40 w-64 bg-background border-r transition-transform md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center border-b px-6">
          <Link href="/" className="flex items-center gap-2 font-semibold">
            <span className="text-xl font-bold">ModernApp</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-6 px-4">
          <nav className="flex flex-col gap-2">
            <SidebarItem
              icon={<Home className="h-4 w-4" />}
              title="Dashboard"
              href="/dashboard"
              isActive={true}
            />
            <SidebarItem
              icon={<BarChart2 className="h-4 w-4" />}
              title="Analytics"
              href="/dashboard/analytics"
            />
            <SidebarItem
              icon={<Users className="h-4 w-4" />}
              title="Users"
              href="/dashboard/users"
            />
            <SidebarItem
              icon={<Settings className="h-4 w-4" />}
              title="Settings"
              href="/dashboard/settings"
            />
            <SidebarItem
              icon={<HelpCircle className="h-4 w-4" />}
              title="Help"
              href="/dashboard/help"
            />
          </nav>
        </div>
      </div>
      
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-30 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}