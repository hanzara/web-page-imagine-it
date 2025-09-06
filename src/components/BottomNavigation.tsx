import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  User, 
  Bell,
  Settings,
  CreditCard,
  Wallet,
  BarChart3
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface BottomNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export function BottomNavigation({ activeSection, onSectionChange }: BottomNavigationProps) {
  const [notifications] = useState(3);
  const { t } = useLanguage();

  const quickActions = [
    { id: "dashboard", label: t("nav.home"), icon: Home },
    { id: "wallet", label: t("nav.wallets"), icon: Wallet },
    { id: "cards", label: t("nav.cards"), icon: CreditCard },
    { id: "analytics", label: t("nav.analytics"), icon: BarChart3 },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-xl border-t border-border z-50 lg:hidden">
      {/* Quick Actions Bar */}
      <div className="flex items-center justify-around px-2 py-2 border-b border-border/50">
        {quickActions.map((action) => (
          <Button
            key={action.id}
            variant={activeSection === action.id ? "default" : "ghost"}
            size="sm"
            onClick={() => onSectionChange(action.id)}
            className={`flex flex-col h-12 px-3 ${
              activeSection === action.id
                ? "bg-gradient-primary text-white shadow-glow"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <action.icon className="w-4 h-4 mb-1" />
            <span className="text-xs font-medium">{action.label}</span>
          </Button>
        ))}
      </div>

      {/* Main Bottom Navigation */}
      <div className="flex items-center justify-between px-4 py-3">
        {/* Home Button */}
        <Button
          variant={activeSection === "dashboard" ? "default" : "ghost"}
          onClick={() => onSectionChange("dashboard")}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl ${
            activeSection === "dashboard"
              ? "bg-gradient-primary text-white shadow-glow"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="font-medium">{t("nav.home")}</span>
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          className="relative p-3 rounded-full hover:bg-accent/20"
          onClick={() => {
            // Handle notification click
          }}
        >
          <Bell className="w-5 h-5" />
          {notifications > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center text-xs animate-pulse"
            >
              {notifications}
            </Badge>
          )}
        </Button>

        {/* Profile Button */}
        <Button
          variant="ghost"
          onClick={() => onSectionChange("profile")}
          className="flex items-center space-x-2 px-4 py-2 rounded-xl hover:bg-accent/20"
        >
          <Avatar className="w-6 h-6">
            <AvatarImage src="/placeholder-avatar.jpg" alt="Profile" />
            <AvatarFallback className="bg-gradient-primary text-white text-xs">
              JD
            </AvatarFallback>
          </Avatar>
          <span className="font-medium text-muted-foreground">{t("nav.profile")}</span>
        </Button>
      </div>
    </div>
  );
}