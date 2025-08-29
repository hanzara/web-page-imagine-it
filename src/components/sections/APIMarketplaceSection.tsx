import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { 
  Search, 
  Star, 
  Download, 
  Key, 
  BarChart3, 
  Settings, 
  Users,
  DollarSign,
  Shield,
  Zap,
  Globe,
  ShoppingCart,
  Package,
  Link2,
  Webhook,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Code,
  Puzzle
} from "lucide-react";

const apiCategories = [
  { id: "payments", name: "Payment Processing", count: 12 },
  { id: "ecommerce", name: "E-Commerce", count: 15 },
  { id: "crypto", name: "Cryptocurrency", count: 8 },
  { id: "mobile", name: "Mobile Money", count: 6 },
  { id: "banking", name: "Banking APIs", count: 10 },
  { id: "data", name: "Financial Data", count: 5 },
];

const ecommerceIntegrations = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Global e-commerce platform with Universal Pay integration",
    type: "plugin",
    status: "ready",
    rating: 4.8,
    merchants: "2M+",
    logo: "SH",
    setupTime: "5 minutes",
    features: ["One-click install", "Auto-sync orders", "Real-time tracking", "Multi-currency"],
    integrationTypes: ["Plugin", "API", "Webhooks"]
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "WordPress e-commerce solution with seamless payment routing",
    type: "plugin",
    status: "ready",
    rating: 4.7,
    merchants: "5M+",
    logo: "WC",
    setupTime: "10 minutes",
    features: ["WordPress plugin", "Order management", "Payment tracking", "Custom checkout"],
    integrationTypes: ["Plugin", "API", "Payment Links"]
  },
  {
    id: "jumia",
    name: "Jumia",
    description: "Africa's leading e-commerce marketplace integration",
    type: "api",
    status: "manual",
    rating: 4.5,
    merchants: "100K+",
    logo: "JU",
    setupTime: "30 minutes",
    features: ["API integration", "Webhook notifications", "Payment links", "Order tracking"],
    integrationTypes: ["API", "Webhooks", "Payment Links"]
  },
  {
    id: "amazon",
    name: "Amazon Marketplace",
    description: "Connect your Amazon seller account to Universal Pay",
    type: "api",
    status: "manual",
    rating: 4.6,
    merchants: "9M+",
    logo: "AM",
    setupTime: "45 minutes",
    features: ["Seller API", "Payment routing", "Analytics", "Multi-region support"],
    integrationTypes: ["API", "Webhooks"]
  },
  {
    id: "magento",
    name: "Magento",
    description: "Enterprise e-commerce platform integration",
    type: "plugin",
    status: "beta",
    rating: 4.4,
    merchants: "250K+",
    logo: "MG",
    setupTime: "20 minutes",
    features: ["Enterprise plugin", "B2B features", "Advanced reporting", "Multi-store"],
    integrationTypes: ["Plugin", "API"]
  },
  {
    id: "bigcommerce",
    name: "BigCommerce",
    description: "SaaS e-commerce platform with Universal Pay gateway",
    type: "plugin",
    status: "coming-soon",
    rating: 4.3,
    merchants: "60K+",
    logo: "BC",
    setupTime: "15 minutes",
    features: ["Native integration", "API-first", "Headless commerce", "Multi-channel"],
    integrationTypes: ["Plugin", "API"]
  }
];

const featuredAPIs = [
  {
    id: "stripe",
    name: "Stripe",
    description: "Complete payment infrastructure for the internet",
    category: "Payment Processing",
    rating: 4.9,
    reviews: 2847,
    price: "2.9% + $0.30",
    logo: "ST",
    connected: false,
    features: ["Cards", "Digital Wallets", "Bank Transfers", "Subscriptions"],
    uptime: 99.9
  },
  {
    id: "flutterwave",
    name: "Flutterwave",
    description: "Payment infrastructure for global merchants",
    category: "Payment Processing", 
    rating: 4.7,
    reviews: 1205,
    price: "3.8% per transaction",
    logo: "FW",
    connected: true,
    features: ["Mobile Money", "Cards", "Bank Transfer", "USSD"],
    uptime: 99.7
  },
  {
    id: "binance",
    name: "Binance Pay",
    description: "Cryptocurrency payment solution",
    category: "Cryptocurrency",
    rating: 4.6,
    reviews: 892,
    price: "0% fees for merchants",
    logo: "BP",
    connected: false,
    features: ["Crypto Payments", "Multi-chain", "Instant Settlement"],
    uptime: 99.8
  },
  {
    id: "paypal",
    name: "PayPal",
    description: "Global digital payment platform",
    category: "Payment Processing",
    rating: 4.5,
    reviews: 3421,
    price: "3.49% + fixed fee",
    logo: "PP",
    connected: false,
    features: ["Digital Wallet", "PayPal Credit", "Invoice", "Subscriptions"],
    uptime: 99.6
  }
];

export function APIMarketplaceSection() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showApiKey, setShowApiKey] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("apis");
  const [showIntegrationDetails, setShowIntegrationDetails] = useState<string | null>(null);

  const filteredAPIs = featuredAPIs.filter(api => {
    const matchesSearch = api.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         api.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || api.category.toLowerCase().includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const handleConnect = (apiId: string) => {
    setShowApiKey(apiId);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">Ready</Badge>;
      case 'beta':
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">Beta</Badge>;
      case 'manual':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">Manual Setup</Badge>;
      case 'coming-soon':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">Coming Soon</Badge>;
      default:
        return null;
    }
  };

  const handleSetupIntegration = (integrationId: string) => {
    setShowIntegrationDetails(integrationId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Globe className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
              Universal Pay Connect
            </h1>
            <p className="text-muted-foreground">API Marketplace</p>
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Discover, connect, and manage payment APIs from one unified platform. 
          Choose from 40+ pre-integrated APIs with one-click setup.
        </p>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="apis" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Payment APIs
          </TabsTrigger>
          <TabsTrigger value="ecommerce" className="flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" />
            E-Commerce Integrations
          </TabsTrigger>
        </TabsList>

        <TabsContent value="apis" className="space-y-6">
          <Card className="bg-gradient-card shadow-card">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    placeholder="Search APIs (e.g., Stripe, mobile money, crypto...)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button 
                    variant={selectedCategory === "all" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All
                  </Button>
                  {apiCategories.filter(cat => cat.id !== 'ecommerce').map(category => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name} ({category.count})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* API Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAPIs.map((api) => (
              <Card key={api.id} className="bg-gradient-card shadow-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-white font-bold">
                          {api.logo}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{api.name}</CardTitle>
                          {api.connected && (
                            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                              Connected
                            </Badge>
                          )}
                        </div>
                        <CardDescription>{api.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{api.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {api.reviews} reviews
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {api.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Metrics */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <DollarSign className="w-4 h-4" />
                        <span>Pricing</span>
                      </div>
                      <div className="font-medium">{api.price}</div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2 text-muted-foreground">
                        <Zap className="w-4 h-4" />
                        <span>Uptime</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Progress value={api.uptime * 10} className="flex-1 h-2" />
                        <span className="font-medium">{api.uptime}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {api.connected ? (
                      <>
                        <Button size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Configure
                        </Button>
                        <Button variant="outline" size="sm">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          Usage
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleConnect(api.id)}
                        >
                          <Key className="w-4 h-4 mr-2" />
                          Connect
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Docs
                        </Button>
                      </>
                    )}
                  </div>

                  {/* API Key Input */}
                  {showApiKey === api.id && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border space-y-3">
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm font-medium">Secure API Key Setup</span>
                      </div>
                      <Input 
                        type="password"
                        placeholder={`Enter your ${api.name} API key`}
                        className="font-mono text-sm"
                      />
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          Save & Connect
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setShowApiKey(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Statistics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Connected APIs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">4</div>
                <p className="text-xs text-muted-foreground">+2 this month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Monthly API Calls</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">24.7K</div>
                <p className="text-xs text-muted-foreground">+18% from last month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Cost Savings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">$1,247</div>
                <p className="text-xs text-muted-foreground">Saved via smart routing</p>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="ecommerce" className="space-y-6">
          {/* E-Commerce Header */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
                  <ShoppingCart className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">E-Commerce Integrations</CardTitle>
                  <CardDescription>
                    Connect your online store to Universal Pay and start accepting payments in minutes
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">15+</div>
                  <div className="text-muted-foreground">Supported Platforms</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">5min</div>
                  <div className="text-muted-foreground">Average Setup Time</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">98.5%</div>
                  <div className="text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* E-Commerce Platforms Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {ecommerceIntegrations.map((integration) => (
              <Card key={integration.id} className="bg-gradient-card shadow-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-white font-bold">
                          {integration.logo}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center space-x-2">
                          <CardTitle className="text-lg">{integration.name}</CardTitle>
                          {getStatusBadge(integration.status)}
                        </div>
                        <CardDescription>{integration.description}</CardDescription>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center space-x-1 text-sm text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span>{integration.rating}</span>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {integration.merchants} merchants
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Features */}
                  <div className="flex flex-wrap gap-2">
                    {integration.features.map((feature) => (
                      <Badge key={feature} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>

                  {/* Integration Types */}
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">Integration Options:</div>
                    <div className="flex flex-wrap gap-2">
                      {integration.integrationTypes.map((type) => (
                        <div key={type} className="flex items-center space-x-1 text-xs bg-muted/50 px-2 py-1 rounded">
                          {type === 'Plugin' && <Puzzle className="w-3 h-3" />}
                          {type === 'API' && <Code className="w-3 h-3" />}
                          {type === 'Webhooks' && <Webhook className="w-3 h-3" />}
                          {type === 'Payment Links' && <Link2 className="w-3 h-3" />}
                          <span>{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Setup Time */}
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <Package className="w-4 h-4" />
                      <span>Setup Time</span>
                    </div>
                    <span className="font-medium">{integration.setupTime}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    {integration.status === 'ready' ? (
                      <>
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleSetupIntegration(integration.id)}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Install Plugin
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Docs
                        </Button>
                      </>
                    ) : integration.status === 'manual' ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleSetupIntegration(integration.id)}
                        >
                          <Settings className="w-4 h-4 mr-2" />
                          Setup Guide
                        </Button>
                        <Button variant="outline" size="sm">
                          <Code className="w-4 h-4 mr-2" />
                          API Docs
                        </Button>
                      </>
                    ) : integration.status === 'beta' ? (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleSetupIntegration(integration.id)}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Beta Access
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Docs
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button variant="outline" size="sm" className="flex-1" disabled>
                          <Package className="w-4 h-4 mr-2" />
                          Coming Soon
                        </Button>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Preview
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Integration Details */}
                  {showIntegrationDetails === integration.id && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-lg border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Settings className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm font-medium">Integration Setup</span>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => setShowIntegrationDetails(null)}
                        >
                          ×
                        </Button>
                      </div>
                      
                      {integration.status === 'ready' ? (
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            One-click plugin installation for {integration.name}
                          </div>
                          <div className="space-y-2">
                            <Button size="sm" className="w-full bg-green-600 hover:bg-green-700">
                              Download & Install Plugin
                            </Button>
                            <Button variant="outline" size="sm" className="w-full">
                              <ExternalLink className="w-4 h-4 mr-2" />
                              View Installation Guide
                            </Button>
                          </div>
                        </div>
                      ) : integration.status === 'manual' ? (
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            Manual integration options for {integration.name}
                          </div>
                          <div className="grid grid-cols-1 gap-2">
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Link2 className="w-4 h-4 mr-2" />
                              Generate Payment Links
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Key className="w-4 h-4 mr-2" />
                              API Key Setup
                            </Button>
                            <Button variant="outline" size="sm" className="w-full justify-start">
                              <Webhook className="w-4 h-4 mr-2" />
                              Configure Webhooks
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="text-sm text-muted-foreground">
                            {integration.status === 'beta' 
                              ? 'Beta integration available for early access'
                              : 'Integration coming soon - join waitlist for updates'
                            }
                          </div>
                          <Button size="sm" className="w-full">
                            {integration.status === 'beta' ? 'Request Beta Access' : 'Join Waitlist'}
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Quick Integration Methods */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Link2 className="w-4 h-4" />
                  <span>Payment Links</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Generate secure payment links for any e-commerce platform
                </p>
                <Button size="sm" className="w-full">
                  <Link2 className="w-4 h-4 mr-2" />
                  Create Payment Link
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Key className="w-4 h-4" />
                  <span>API Integration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Full API access for custom e-commerce integrations
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  <Code className="w-4 h-4 mr-2" />
                  Get API Keys
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium flex items-center space-x-2">
                  <Webhook className="w-4 h-4" />
                  <span>Webhooks</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-3">
                  Real-time payment notifications and order updates
                </p>
                <Button size="sm" variant="outline" className="w-full">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Webhooks
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Statistics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Integrations</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">+3 this month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89.2K</div>
            <p className="text-xs text-muted-foreground">+24% from last month</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Revenue Processed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$2.4M</div>
            <p className="text-xs text-muted-foreground">+32% growth</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-card shadow-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-400">98.7%</div>
            <p className="text-xs text-muted-foreground">+0.3% improvement</p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}