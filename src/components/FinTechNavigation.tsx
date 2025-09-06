import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LayoutDashboard, 
  CreditCard, 
  Wallet, 
  TrendingUp, 
  Shield, 
  Settings, 
  BarChart3, 
  ArrowUpDown, 
  Users, 
  HelpCircle,
  Bell,
  Search,
  Globe,
  Menu,
  X
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

interface FinTechNavigationProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  onNotificationClick?: () => void;
}

export function FinTechNavigation({ activeSection, onSectionChange, onNotificationClick }: FinTechNavigationProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications] = useState(3);
  const { t } = useLanguage();

  const mainNavItems = [
    { id: "dashboard", label: t("nav.overview"), icon: LayoutDashboard, hasNotification: false },
    { id: "payments", label: t("nav.payments"), icon: ArrowUpDown, hasNotification: true },
    { id: "wallet", label: t("nav.wallets"), icon: Wallet, hasNotification: false },
    { id: "cards", label: t("nav.cards"), icon: CreditCard, hasNotification: false },
    { id: "analytics", label: t("nav.analytics"), icon: BarChart3, hasNotification: false },
    { id: "customers", label: t("nav.customers"), icon: Users, hasNotification: false },
  ];

  const toolsNavItems = [
    { id: "routing", label: "Smart Routing", icon: TrendingUp },
    { id: "security", label: "Security", icon: Shield },
    { id: "api", label: "Developer Hub", icon: Globe },
  ];

  const NavItem = ({ item, isActive }: { item: any; isActive: boolean }) => (
    <Button
      variant={isActive ? "default" : "ghost"}
      size="sm"
      onClick={() => onSectionChange(item.id)}
      onMouseEnter={() => setHoveredItem(item.id)}
      onMouseLeave={() => setHoveredItem(null)}
      className={`
        relative flex items-center space-x-2 px-3 py-2 rounded-xl transition-all duration-200
        ${isActive 
          ? "bg-gradient-primary text-white shadow-primary/25 shadow-lg" 
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
        }
        ${hoveredItem === item.id ? "scale-105" : ""}
      `}
    >
      <item.icon className="w-4 h-4" />
      <span className="font-medium text-sm">{item.label}</span>
      {item.hasNotification && (
        <Badge variant="destructive" className="w-2 h-2 p-0 ml-1 animate-pulse">
          <span className="sr-only">Notification</span>
        </Badge>
      )}
      {isActive && (
        <div className="absolute inset-0 bg-gradient-primary rounded-xl opacity-20 animate-pulse" />
      )}
    </Button>
  );

  return (
    <nav className="bg-card/80 backdrop-blur-xl border-b border-border/50 shadow-card sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                <Globe className="w-5 h-5 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Universal Pay
                </h1>
                <p className="text-xs text-muted-foreground">Global Platform</p>
              </div>
            </div>
          </div>

          {/* Main Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            <div className="flex items-center space-x-1 bg-muted/30 rounded-2xl p-1">
              {mainNavItems.map((item) => (
                <NavItem 
                  key={item.id} 
                  item={item} 
                  isActive={activeSection === item.id} 
                />
              ))}
            </div>
          </div>

          {/* Tools & Actions */}
          <div className="flex items-center space-x-2">
            {/* Tools Dropdown */}
            <div className="hidden md:flex items-center space-x-1 bg-muted/20 rounded-xl p-1">
              {toolsNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    px-2 py-1 text-xs transition-all duration-200
                    ${activeSection === item.id 
                      ? "bg-primary/20 text-primary" 
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                    }
                  `}
                >
                  <item.icon className="w-3 h-3 mr-1" />
                  {item.label}
                </Button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm" className="relative hover:bg-accent/20">
                <Search className="w-4 h-4" />
                <span className="sr-only">Search</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-accent/20 transition-colors"
                onClick={onNotificationClick}
              >
                <Bell className="w-4 h-4" />
                {notifications > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center text-xs animate-pulse">
                    {notifications}
                  </Badge>
                )}
                <span className="sr-only">{notifications} notifications</span>
              </Button>

              <Button variant="ghost" size="sm" className="hover:bg-accent/20">
                <Settings className="w-4 h-4" />
                <span className="sr-only">Settings</span>
              </Button>

              <Button variant="ghost" size="sm" className="hover:bg-accent/20">
                <HelpCircle className="w-4 h-4" />
                <span className="sr-only">Help</span>
              </Button>

              {/* Mobile Menu Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden hover:bg-accent/20"
              >
                {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-3 border-t border-border/50 animate-fade-in">
            <div className="grid grid-cols-2 gap-2">
              {mainNavItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSection === item.id ? "default" : "ghost"}
                  onClick={() => {
                    onSectionChange(item.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 justify-start h-12 ${
                    activeSection === item.id
                      ? "bg-gradient-primary text-white shadow-glow"
                      : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  <span className="font-medium text-sm">{item.label}</span>
                  {item.hasNotification && (
                    <Badge variant="destructive" className="w-2 h-2 p-0 ml-auto animate-pulse" />
                  )}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}