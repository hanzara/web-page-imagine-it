import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Globe, Languages, Palette, Menu, X } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { useLanguage } from "@/hooks/useLanguage";

interface TopNavigationProps {
  onMenuToggle?: () => void;
  isMenuOpen?: boolean;
}

export const TopNavigation = ({ onMenuToggle, isMenuOpen }: TopNavigationProps) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const languageLabels = {
    en: "English",
    es: "Español", 
    fr: "Français",
    de: "Deutsch",
    zh: "中文",
    ja: "日本語",
    ar: "العربية"
  };

  const themeLabels = {
    light: t("theme.light"),
    dark: t("theme.dark"),
    system: t("theme.system")
  };

  return (
    <header className="border-b border-border bg-gradient-card/90 shadow-elegant backdrop-blur supports-[backdrop-filter]:bg-card/50 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo & Menu Toggle */}
          <div className="flex items-center space-x-3">
            {onMenuToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMenuToggle}
                className="lg:hidden p-2 hover:bg-accent/20 transition-colors"
              >
                {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            )}
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center shadow-glow">
                <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <div>
                <h1 className="font-bold text-sm sm:text-lg bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                  Universal Pay
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">Global Payment Platform</p>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList className="flex items-center space-x-2">
              <NavigationMenuItem>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-auto h-8 sm:h-9 text-xs sm:text-sm border-none bg-transparent hover:bg-accent/20 transition-colors">
                    <Languages className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-auto h-8 sm:h-9 text-xs sm:text-sm border-none bg-transparent hover:bg-accent/20 transition-colors">
                    <Palette className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover/95 backdrop-blur-xl border-border/50">
                    <SelectItem value="light">{themeLabels.light}</SelectItem>
                    <SelectItem value="dark">{themeLabels.dark}</SelectItem>
                    <SelectItem value="system">{themeLabels.system}</SelectItem>
                  </SelectContent>
                </Select>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-accent/20 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden pb-4 pt-2 border-t border-border/50 mt-2 animate-fade-in">
            <div className="flex flex-col space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Language</span>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="es">Español</SelectItem>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="de">Deutsch</SelectItem>
                    <SelectItem value="zh">中文</SelectItem>
                    <SelectItem value="ja">日本語</SelectItem>
                    <SelectItem value="ar">العربية</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Theme</span>
                <Select value={theme} onValueChange={setTheme}>
                  <SelectTrigger className="w-auto">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">{themeLabels.light}</SelectItem>
                    <SelectItem value="dark">{themeLabels.dark}</SelectItem>
                    <SelectItem value="system">{themeLabels.system}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};