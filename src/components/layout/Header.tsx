import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  return (
    <header className={`flex items-center justify-end p-6 bg-card border-b border-border shadow-sm ${className}`}>
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src="" alt="Alex Greene" />
          <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
            AG
          </AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-semibold text-foreground">Alex Greene</p>
          <p className="text-muted-foreground">HR Manager</p>
        </div>
      </div>
    </header>
  );
}