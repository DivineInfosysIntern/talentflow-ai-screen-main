import { 
  LayoutDashboard, 
  Briefcase, 
  Users, 
  Brain, 
  Settings,
  Building2
} from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

const navigationItems = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard"
  },
  {
    name: "Job Postings",
    icon: Briefcase,
    href: "/job-postings"
  },
  {
    name: "Candidates",
    icon: Users,
    href: "/candidates"
  },
  {
    name: "AI Screening Tool",
    icon: Brain,
    href: "/ai-screening"
  },
  {
    name: "Settings",
    icon: Settings,
    href: "/settings"
  }
];

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation();
  
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return location.pathname === "/" || location.pathname === "/dashboard";
    }
    return location.pathname === href;
  };
  return (
    <div className={cn(
      "fixed left-0 top-0 h-full w-64 bg-card border-r border-border shadow-lg z-10",
      className
    )}>
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary shadow-md">
          <Building2 className="h-6 w-6 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-foreground">TalentFlow</h1>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
                isActive(item.href)
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}