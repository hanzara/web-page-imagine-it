import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TopNavigation } from "@/components/TopNavigation";
import { Footer } from "@/components/Footer";
import { 
  Globe, 
  ArrowRight, 
  CheckCircle, 
  CreditCard,
  Bot,
  Workflow,
  Plug,
  Shield,
  TrendingUp,
  Zap,
  Settings,
  BarChart3
} from "lucide-react";
import platformImage from "@/assets/platform-overview.jpg";
import aiRoutingImage from "@/assets/ai-routing.jpg";
import securityImage from "@/assets/security-shield.jpg";

const PlatformPage = () => {
  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-dashboard overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  The Complete Payment Platform
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  Everything you need to accept, process, and optimize payments globally. 
                  One platform, infinite possibilities.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="text-lg px-8 py-4">
                  <Link to="/auth">
                    Get Started Free
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link to="/auth">
                    Log In
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={platformImage} 
                alt="Universal Pay Platform Overview" 
                className="rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Platform Features */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Platform Capabilities</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built for scale, designed for simplicity. Our platform handles everything from simple payments to complex multi-party transactions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                  <CreditCard className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Universal Wallet</h3>
                <p className="text-muted-foreground mb-4">
                  Multi-currency wallet supporting 180+ FIAT currencies and 50+ cryptocurrencies with real-time conversion.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Real-time FX rates</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Cross-currency transfers</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                  <Bot className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">SmartRoute AI</h3>
                <p className="text-muted-foreground mb-4">
                  AI-powered routing engine that optimizes every transaction for success rate, cost, and speed.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Intelligent failover</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Cost optimization</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                  <Plug className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Universal API</h3>
                <p className="text-muted-foreground mb-4">
                  Single API to access 200+ payment providers including Stripe, PayPal, Wise, and more.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">RESTful integration</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">SDKs available</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                  <Workflow className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Flow Builder</h3>
                <p className="text-muted-foreground mb-4">
                  Visual workflow builder for complex payment automation, refunds, and multi-party settlements.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Drag & drop interface</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Automated workflows</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Security Suite</h3>
                <p className="text-muted-foreground mb-4">
                  Enterprise-grade security with fraud detection, compliance tools, and risk management.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">PCI DSS Level 1</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Real-time fraud detection</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all duration-300">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mb-4 shadow-glow">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Analytics Dashboard</h3>
                <p className="text-muted-foreground mb-4">
                  Real-time insights, performance metrics, and detailed reporting for all your transactions.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Real-time monitoring</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Custom reports</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Routing Demo */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">AI-Powered Intelligence</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Our SmartRoute AI analyzes hundreds of factors in real-time to ensure every payment 
                takes the optimal path for maximum success and minimum cost.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>98.7% payment success rate</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Up to 40% cost reduction</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Sub-second routing decisions</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  <span>Automatic failover protection</span>
                </div>
              </div>
              <Button size="lg" asChild>
                <Link to="/auth">
                  Experience AI Routing
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <img 
                src={aiRoutingImage} 
                alt="AI Payment Routing" 
                className="rounded-2xl shadow-xl border border-border"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Platform Stats */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Platform Performance</h2>
            <p className="text-xl text-muted-foreground">
              Trusted by thousands of businesses worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">99.99%</div>
              <div className="text-muted-foreground">Uptime SLA</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">200+</div>
              <div className="text-muted-foreground">Payment Methods</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">180+</div>
              <div className="text-muted-foreground">Currencies</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary mb-2">50+</div>
              <div className="text-muted-foreground">Countries</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-dashboard">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to revolutionize your payments?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Join thousands of businesses already using Universal Pay to optimize their payment infrastructure.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="text-lg px-8 py-4">
              <Link to="/auth">
                Get Started Free
                <ArrowRight className="w-5 h-5 ml-2" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
              <Link to="/auth">
                Log In
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PlatformPage;