import { Button } from "@/components/ui/button";
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Globe, Code, FileText, DollarSign } from "lucide-react";

export const TopNavigation = () => {
  return (
    <header className="border-b border-border bg-gradient-card/90 shadow-elegant backdrop-blur supports-[backdrop-filter]:bg-card/50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Globe className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-sm sm:text-lg">Universal Pay</h1>
              <p className="text-xs text-muted-foreground hidden sm:block">Global Payment Platform</p>
            </div>
          </div>

          {/* Navigation Menu */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xs sm:text-sm font-medium">
                  Features
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 sm:p-6 w-[300px] sm:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <div className="row-span-3">
                      <NavigationMenuLink asChild>
                        <div className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-primary p-4 sm:p-6 no-underline outline-none focus:shadow-md">
                          <Globe className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          <div className="mb-2 mt-4 text-base sm:text-lg font-medium text-white">
                            Universal Pay
                          </div>
                          <p className="text-xs sm:text-sm leading-tight text-white/90">
                            The universal payment gateway that connects the world's financial systems.
                          </p>
                        </div>
                      </NavigationMenuLink>
                    </div>
                    <div className="space-y-3">
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-xs sm:text-sm font-medium leading-none">Multi-Currency Wallet</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Store, convert and manage 180+ FIAT currencies and 50+ cryptocurrencies
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-xs sm:text-sm font-medium leading-none">Smart Routing</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          AI-powered payment routing through 50+ payment gateways and methods
                        </p>
                      </NavigationMenuLink>
                      <NavigationMenuLink className="block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                        <div className="text-xs sm:text-sm font-medium leading-none">Virtual Cards</div>
                        <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                          Instant virtual cards with configurable limits and global acceptance
                        </p>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <NavigationMenuTrigger className="text-xs sm:text-sm font-medium">
                  <Code className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  API
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid w-[300px] sm:w-[400px] gap-3 p-3 sm:p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-xs sm:text-sm font-medium leading-none">REST API</div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Comprehensive REST API for all payment operations
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-xs sm:text-sm font-medium leading-none">SDKs</div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Mobile and web SDKs for seamless integration
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-xs sm:text-sm font-medium leading-none">Webhooks</div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Real-time notifications for payment events
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink className="block select-none space-y-1 rounded-md p-2 sm:p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground">
                      <div className="text-xs sm:text-sm font-medium leading-none">Sandbox</div>
                      <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">
                        Test environment for development and integration
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Button variant="ghost" size="sm" className="text-xs sm:text-sm font-medium h-8 sm:h-9">
                  <FileText className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="hidden sm:inline">Docs</span>
                </Button>
              </NavigationMenuItem>

            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </div>
    </header>
  );
};