import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Settings, 
  Shield, 
  CreditCard, 
  Bell,
  Globe,
  LogOut,
  Edit,
  ChevronRight
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

export function ProfileSection() {
  const { t } = useLanguage();

  const profileStats = [
    { label: "Total Transactions", value: "1,234", change: "+12%" },
    { label: "Account Balance", value: "$45,678.90", change: "+5.2%" },
    { label: "Active Cards", value: "3", change: "0%" },
    { label: "Monthly Volume", value: "$12,345", change: "+8.1%" }
  ];

  const menuItems = [
    { icon: User, label: "Personal Information", description: "Update your profile details" },
    { icon: Shield, label: "Security Settings", description: "Manage passwords and 2FA" },
    { icon: CreditCard, label: "Payment Methods", description: "Manage cards and accounts" },
    { icon: Bell, label: "Notifications", description: "Configure alert preferences" },
    { icon: Globe, label: "Language & Region", description: "Set language and timezone" },
    { icon: Settings, label: "App Preferences", description: "Customize your experience" }
  ];

  return (
    <div className="space-y-6 pb-20 lg:pb-6">
      {/* Profile Header */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20 ring-2 ring-primary/20">
              <AvatarImage src="/placeholder-avatar.jpg" alt="John Doe" />
              <AvatarFallback className="bg-gradient-primary text-white text-2xl font-bold">
                JD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h2 className="text-2xl font-bold">John Doe</h2>
                <Badge variant="secondary" className="bg-success/20 text-success">
                  Verified
                </Badge>
              </div>
              <p className="text-muted-foreground">john.doe@universalpay.com</p>
              <p className="text-sm text-muted-foreground">Member since January 2024</p>
            </div>
            <Button variant="outline" size="sm" className="gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {profileStats.map((stat, index) => (
          <Card key={index} className="bg-gradient-card border-border/50">
            <CardContent className="pt-4">
              <div className="text-center">
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <Badge 
                  variant={stat.change.startsWith('+') ? 'default' : 'secondary'}
                  className="mt-2 text-xs"
                >
                  {stat.change}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Settings Menu */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Account Settings
          </CardTitle>
          <CardDescription>
            Manage your account preferences and security settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1">
          {menuItems.map((item, index) => (
            <div key={index}>
              <Button
                variant="ghost"
                className="w-full justify-between h-auto p-4 hover:bg-accent/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <item.icon className="w-5 h-5 text-muted-foreground" />
                  <div className="text-left">
                    <p className="font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              </Button>
              {index < menuItems.length - 1 && <Separator className="opacity-50" />}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Sign Out */}
      <Card className="bg-gradient-card border-border/50 shadow-card">
        <CardContent className="pt-6">
          <Button variant="destructive" className="w-full gap-2">
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}