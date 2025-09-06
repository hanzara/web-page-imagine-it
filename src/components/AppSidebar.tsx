import { 
  LayoutDashboard, 
  Vault, 
  Send, 
  Brain, 
  Plug,
  Code, 
  Settings,
  LogOut,
  Globe,
  ArrowDownUp,
  CreditCard,
  Shield,
  BarChart3,
  Banknote,
  Workflow
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";

interface AppSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "payments", label: "Payment", icon: Send },
  { id: "wallet", label: "Multi-Currency Virtual Wallet", icon: Vault },
  { id: "cards", label: "Virtual & Physical Cards", icon: CreditCard },
  { id: "routing", label: "Smart Routing", icon: ArrowDownUp },
  { id: "api", label: "Universal API", icon: Code },
  { id: "marketplace", label: "API Marketplace", icon: Globe },
  { id: "smartroute", label: "SmartRoute AI", icon: Brain },
  { id: "flowbuilder", label: "FlowBuilder Studio", icon: Workflow },
  { id: "qr", label: "QR Code Payments", icon: Banknote },
  { id: "refunds", label: "Refund Management", icon: Shield },
  { id: "security", label: "Security & Compliance", icon: Shield },
  { id: "antiblockage", label: "Anti-Blockage", icon: Shield },
  { id: "tools", label: "Advanced Tools", icon: Settings },
];

export function AppSidebar({ activeSection, onSectionChange }: AppSidebarProps) {
  const { signOut } = useAuth();

  return (
    <Sidebar>
      <SidebarHeader className="border-b border-border p-3 sm:p-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-sm sm:text-lg">Universal Pay</h2>
            <p className="text-xs text-muted-foreground">Global Payment Platform</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton 
                    onClick={() => onSectionChange(item.id)}
                    isActive={activeSection === item.id}
                    className="text-xs sm:text-sm"
                  >
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-border p-3 sm:p-4">
        <Button 
          variant="ghost" 
          onClick={signOut}
          className="w-full justify-start text-xs sm:text-sm text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}