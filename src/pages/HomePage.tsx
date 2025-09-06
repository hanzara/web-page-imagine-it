import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Footer } from "@/components/Footer";
import { 
  Globe, 
  Zap, 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  Code, 
  TrendingUp, 
  Users,
  CreditCard,
  Bot,
  Workflow,
  Plug,
  Play,
  Star,
  DollarSign,
  Smartphone,
  Building,
  Target
} from "lucide-react";
import heroImage from "@/assets/hero-dashboard.jpg";
import aiRoutingImage from "@/assets/ai-routing.jpg";
import globalPaymentsImage from "@/assets/global-payments.jpg";
import securityImage from "@/assets/security-shield.jpg";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
              <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-bold text-lg sm:text-xl">Universal Pay</span>
          </Link>

          {/* Navigation Menu - Desktop Only */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            <Link to="/platform" className="text-sm font-medium hover:text-primary transition-colors">Platform</Link>
            <Link to="/solutions" className="text-sm font-medium hover:text-primary transition-colors">Solutions</Link>
            
            <Link to="/developers" className="text-sm font-medium hover:text-primary transition-colors">Developers</Link>
            <Link to="/company" className="text-sm font-medium hover:text-primary transition-colors">Company</Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <Button variant="ghost" asChild className="hidden sm:inline-flex">
              <Link to="/auth">Log In</Link>
            </Button>
            <Button asChild size="sm" className="text-sm px-3 sm:px-4">
              <Link to="/auth">
                <span className="hidden sm:inline">Get Started Free</span>
                <span className="sm:hidden">Start Free</span>
                <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-1 sm:ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-dashboard overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="space-y-6 lg:space-y-8 text-center lg:text-left">
              <div className="space-y-4 lg:space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                  One API. Infinite Payment Possibilities.
                </h1>
                <p className="text-lg sm:text-xl text-white/90 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Send, receive, convert, and automate global payments — across cards, crypto, mobile money, 
                  and bank transfers — with AI optimization and complete control.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link to="/dashboard?demo=true">
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
                    See Live Demo
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative mt-8 lg:mt-0">
              <img 
                src={heroImage} 
                alt="Universal Pay Dashboard" 
                className="w-full rounded-xl sm:rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-xl sm:rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-muted/50">
        <div className="container mx-auto max-w-7xl text-center">
          <p className="text-muted-foreground mb-6 sm:mb-8">Trusted by teams at</p>
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
            <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">Flutterwave</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">Wise</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">Crypto.com</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">Stripe</Badge>
            <Badge variant="secondary" className="px-3 py-1.5 sm:px-4 sm:py-2 text-xs sm:text-sm">PayPal</Badge>
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="platform" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">Everything you need to scale globally</h2>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">
              From payment processing to AI optimization, we provide the complete infrastructure for modern businesses.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
                  <CreditCard className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">All-In-One Wallet</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Multi-currency, real-time FX, crypto integration with complete control</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
                  <Bot className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">SmartRoute AI</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Save costs with AI-optimized routing and intelligent failover</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
                  <Plug className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Universal API Access</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Direct API access to Stripe, PayPal, Wise, and 200+ providers</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-4 sm:p-6 text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow">
                  <Workflow className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">No-Code Builder</h3>
                <p className="text-sm sm:text-base text-muted-foreground">Automate refunds, retries, split payouts with visual workflows</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Demo Section */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4 sm:mb-6">AI that optimizes every transaction</h2>
              <p className="text-lg sm:text-xl text-muted-foreground mb-6 sm:mb-8">
                Watch our AI choose between Stripe & Flutterwave in real-time, 
                automatically selecting the fastest, cheapest route for maximum success rates.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Up to 40% cost reduction</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">98.7% success rate improvement</span>
                </div>
                <div className="flex items-center justify-center lg:justify-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm sm:text-base">Sub-second decision making</span>
                </div>
              </div>
            </div>
            <div className="relative mt-8 lg:mt-0">
              <img 
                src={aiRoutingImage} 
                alt="AI Payment Routing" 
                className="w-full rounded-xl sm:rounded-2xl shadow-xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section id="solutions" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold mb-4">Built for every business model</h2>
            <p className="text-lg sm:text-xl text-muted-foreground">
              From startups to enterprises, we have the perfect solution for your payment needs.
            </p>
          </div>

          <Tabs defaultValue="saas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 mb-8 sm:mb-12 h-auto">
              <TabsTrigger value="saas" className="text-xs sm:text-sm p-2 sm:p-3">SaaS Platforms</TabsTrigger>
              <TabsTrigger value="marketplace" className="text-xs sm:text-sm p-2 sm:p-3">Marketplaces</TabsTrigger>
              <TabsTrigger value="developer" className="text-xs sm:text-sm p-2 sm:p-3">Developers</TabsTrigger>
              <TabsTrigger value="startup" className="text-xs sm:text-sm p-2 sm:p-3">Startups</TabsTrigger>
              <TabsTrigger value="mobile" className="text-xs sm:text-sm p-2 sm:p-3 col-span-2 sm:col-span-1">Mobile Money</TabsTrigger>
            </TabsList>

            <TabsContent value="saas" className="space-y-6 sm:space-y-8">
              <Card className="p-4 sm:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
                  <div className="text-center lg:text-left">
                    <div className="flex items-center justify-center lg:justify-start space-x-3 mb-4">
                      <Building className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
                      <h3 className="text-xl sm:text-2xl font-bold">For SaaS Platforms</h3>
                    </div>
                    <p className="text-muted-foreground mb-4 sm:mb-6">
                      Automate recurring billing, handle global subscriptions, and optimize payment success rates 
                      across multiple currencies and regions.
                    </p>
                    <ul className="space-y-2 sm:space-y-3">
                      <li className="flex items-center justify-center lg:justify-start space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Automated dunning management</span>
                      </li>
                      <li className="flex items-center justify-center lg:justify-start space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Multi-currency subscriptions</span>
                      </li>
                      <li className="flex items-center justify-center lg:justify-start space-x-3">
                        <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm sm:text-base">Revenue recovery optimization</span>
                      </li>
                    </ul>
                  </div>
                  <div className="mt-6 lg:mt-0">
                    <img 
                      src={globalPaymentsImage} 
                      alt="SaaS Payments" 
                      className="w-full rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">For Marketplaces</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Handle complex split payments, multi-party transactions, and instant payouts 
                      to sellers across the globe.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Automated split payments</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Instant seller payouts</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Multi-party escrow</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <img 
                      src={aiRoutingImage} 
                      alt="Marketplace Payments" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="developer" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Code className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">For Developers</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Integrate our APIs and SDKs to build custom payment solutions for your applications.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>RESTful APIs</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>SDKs for Node, Python, and more</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Comprehensive documentation</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <img 
                      src={securityImage} 
                      alt="Developer Payments" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="startup" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Star className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">For Startups</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Launch your startup with our flexible payment solutions and scale globally from day one.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Fast onboarding</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Enterprise-grade security</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Global reach</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <img 
                      src={globalPaymentsImage} 
                      alt="Startup Payments" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="mobile" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Smartphone className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">For Mobile Money</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Accept mobile money payments from users around the world and expand your reach.
                    </p>
                    <ul className="space-y-3">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Mobile money integration</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Global coverage</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Secure transactions</span>
                      </li>
                    </ul>
                  </div>
                  <div>
                    <img 
                      src={aiRoutingImage} 
                      alt="Mobile Money Payments" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section id="get-started" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-xl text-muted-foreground">
              Join thousands of businesses already using Universal Pay for their global payments.
            </p>
          </div>

           <div className="max-w-4xl mx-auto text-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="p-8 bg-gradient-card border-primary/20">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Code className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Developers</h3>
                <p className="text-muted-foreground mb-6">
                  Start building with our comprehensive APIs and SDKs
                </p>
                <Button size="lg" className="w-full">
                  View Documentation
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>

              <Card className="p-8 bg-gradient-card border-primary/20">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Building className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4">For Businesses</h3>
                <p className="text-muted-foreground mb-6">
                  Scale your payments with enterprise-grade solutions
                </p>
                <Button size="lg" variant="outline" className="w-full">
                  Schedule Demo
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Card>
            </div>

            <div className="mt-12">
              <p className="text-lg text-muted-foreground mb-6">
                Join thousands of businesses processing billions in payments
              </p>
              <div className="flex justify-center items-center space-x-8 text-muted-foreground">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">$5B+</div>
                  <div className="text-sm">Processed</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">10K+</div>
                  <div className="text-sm">Businesses</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">50+</div>
                  <div className="text-sm">Countries</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section id="developers" className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Built for developers, by developers</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Comprehensive APIs, SDKs, and tools to integrate payments 
                into any application in minutes, not months.
              </p>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center">
                  <Code className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">REST APIs</h4>
                  <p className="text-sm text-muted-foreground">Complete documentation</p>
                </div>
                <div className="text-center">
                  <Globe className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">SDKs</h4>
                  <p className="text-sm text-muted-foreground">Node, Python, Flutter</p>
                </div>
                <div className="text-center">
                  <Zap className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Webhooks</h4>
                  <p className="text-sm text-muted-foreground">Real-time notifications</p>
                </div>
                <div className="text-center">
                  <TrendingUp className="w-8 h-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Analytics</h4>
                  <p className="text-sm text-muted-foreground">Status & logs</p>
                </div>
              </div>
              <Button size="lg">
                Test in Sandbox
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
            <div className="bg-slate-900 rounded-2xl p-6 text-green-400 font-mono text-sm overflow-x-auto">
              <div className="mb-4">
                <span className="text-slate-400">// Initialize Universal Pay</span>
              </div>
              <div className="mb-2">
                <span className="text-blue-400">const</span> universalPay = <span className="text-blue-400">new</span> UniversalPay({'{'}
              </div>
              <div className="ml-4 mb-2">
                apiKey: <span className="text-yellow-400">'your-api-key'</span>,
              </div>
              <div className="ml-4 mb-2">
                environment: <span className="text-yellow-400">'sandbox'</span>
              </div>
              <div className="mb-4">{'}'});</div>
              
              <div className="mb-4">
                <span className="text-slate-400">// Process payment with AI routing</span>
              </div>
              <div className="mb-2">
                <span className="text-blue-400">const</span> payment = <span className="text-blue-400">await</span> universalPay.charge({'{'}
              </div>
              <div className="ml-4 mb-2">
                amount: <span className="text-purple-400">1000</span>,
              </div>
              <div className="ml-4 mb-2">
                currency: <span className="text-yellow-400">'USD'</span>,
              </div>
              <div className="ml-4 mb-2">
                smartRoute: <span className="text-purple-400">true</span>
              </div>
              <div>{'}'});</div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img 
                src={securityImage} 
                alt="Security Features" 
                className="rounded-2xl shadow-xl"
              />
            </div>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">Enterprise-grade security</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Your data and transactions are protected by bank-level security 
                with advanced fraud detection and compliance monitoring.
              </p>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Shield className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">End-to-end encryption</h4>
                    <p className="text-muted-foreground">AES-256 encryption for all data in transit and at rest</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <CheckCircle className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Compliance ready</h4>
                    <p className="text-muted-foreground">GDPR, PCI-DSS, Open Banking compliant out of the box</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <TrendingUp className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Real-time monitoring</h4>
                    <p className="text-muted-foreground">24/7 fraud detection with machine learning algorithms</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Users className="w-6 h-6 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold mb-1">Role-based access</h4>
                    <p className="text-muted-foreground">Granular permissions and audit trails</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-dashboard">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-6">
            Ready to streamline payments with superpowers?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Start your free trial today — no card required.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-4 bg-white text-primary hover:bg-white/90">
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/contact">
                Talk to Sales
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomePage;
