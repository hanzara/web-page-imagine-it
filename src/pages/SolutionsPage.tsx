import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNavigation } from "@/components/TopNavigation";
import { Footer } from "@/components/Footer";
import { 
  ArrowRight, 
  CheckCircle, 
  Building,
  Users,
  Code,
  Star,
  Smartphone,
  ShoppingCart,
  Banknote,
  Globe,
  TrendingUp,
  Shield
} from "lucide-react";
import solutionsImage from "@/assets/solutions-overview.jpg";
import aiRoutingImage from "@/assets/ai-routing.jpg";
import globalPaymentsImage from "@/assets/global-payments.jpg";

const SolutionsPage = () => {
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
                  Solutions for Every Business Model
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  From SaaS subscriptions to marketplace payouts, we provide tailored 
                  payment solutions for every industry and use case.
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
                src={solutionsImage} 
                alt="Universal Pay Solutions" 
                className="rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Industry Solutions */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Industry-Specific Solutions</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Tailored payment solutions designed for your specific business needs and industry requirements.
            </p>
          </div>

          <Tabs defaultValue="saas" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 mb-12">
              <TabsTrigger value="saas">SaaS</TabsTrigger>
              <TabsTrigger value="marketplace">Marketplace</TabsTrigger>
              <TabsTrigger value="ecommerce">E-commerce</TabsTrigger>
              <TabsTrigger value="mobile">Mobile Money</TabsTrigger>
              <TabsTrigger value="crypto">Crypto</TabsTrigger>
              <TabsTrigger value="fintech">Fintech</TabsTrigger>
            </TabsList>

            <TabsContent value="saas" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Building className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">SaaS Platforms</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Complete subscription management with automated billing, dunning, and revenue recovery. 
                      Handle global subscriptions with multi-currency support and intelligent retry logic.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Automated recurring billing</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Smart dunning management</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Revenue recovery optimization</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Multi-currency subscriptions</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/auth">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <img 
                      src={globalPaymentsImage} 
                      alt="SaaS Payments Solution" 
                      className="rounded-lg shadow-lg"
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
                      <h3 className="text-2xl font-bold">Marketplace Platforms</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Handle complex multi-party transactions with automated split payments, 
                      escrow services, and instant payouts to sellers worldwide.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Automated split payments</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Multi-party escrow</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Instant seller payouts</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Commission management</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/auth">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <img 
                      src={aiRoutingImage} 
                      alt="Marketplace Payments Solution" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="ecommerce" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <ShoppingCart className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">E-commerce Stores</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Optimize your online store with high-converting checkout flows, 
                      fraud protection, and global payment method support.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>One-click checkout</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Advanced fraud protection</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Mobile-optimized payments</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Cart abandonment recovery</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/auth">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <img 
                      src={globalPaymentsImage} 
                      alt="E-commerce Payments Solution" 
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
                      <h3 className="text-2xl font-bold">Mobile Money Integration</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Connect with Africa's leading mobile money providers including M-Pesa, 
                      Orange Money, and MTN Mobile Money for seamless local payments.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>M-Pesa integration</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Orange Money support</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>MTN Mobile Money</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Real-time notifications</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/auth">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <img 
                      src={aiRoutingImage} 
                      alt="Mobile Money Solution" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="crypto" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Banknote className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">Cryptocurrency Integration</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Accept and process cryptocurrency payments with support for Bitcoin, 
                      Ethereum, stablecoins, and 50+ other digital currencies.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Bitcoin & Lightning Network</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Ethereum & ERC-20 tokens</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Stablecoin support (USDT, USDC)</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Automatic conversion to fiat</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/auth">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <img 
                      src={globalPaymentsImage} 
                      alt="Crypto Payments Solution" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="fintech" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <TrendingUp className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">Fintech Applications</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Build the next generation of financial applications with our 
                      comprehensive APIs, compliance tools, and risk management solutions.
                    </p>
                    <ul className="space-y-3 mb-8">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>White-label solutions</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>KYC/AML compliance</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Risk management tools</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Regulatory reporting</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/auth">
                        Learn More
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <img 
                      src={aiRoutingImage} 
                      alt="Fintech Solution" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Success Stories</h2>
            <p className="text-xl text-muted-foreground">
              See how businesses are transforming their payment operations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold">SaaS Company</h3>
                  <p className="text-sm text-muted-foreground">B2B Software</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Universal Pay helped us reduce failed payments by 40% and increased our 
                monthly recurring revenue by 25% through intelligent retry logic."
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Failed payments</span>
                  <span className="font-semibold text-green-500">-40%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">MRR increase</span>
                  <span className="font-semibold text-green-500">+25%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <ShoppingCart className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold">E-commerce Store</h3>
                  <p className="text-sm text-muted-foreground">Fashion Retailer</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Our conversion rates improved by 30% after implementing Universal Pay's 
                one-click checkout and local payment methods."
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Conversion rate</span>
                  <span className="font-semibold text-green-500">+30%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Checkout time</span>
                  <span className="font-semibold text-green-500">-60%</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-8 h-8 text-primary" />
                <div>
                  <h3 className="font-bold">Marketplace</h3>
                  <p className="text-sm text-muted-foreground">Freelance Platform</p>
                </div>
              </div>
              <p className="text-muted-foreground mb-4">
                "Managing payouts to 10,000+ freelancers across 50 countries is now 
                effortless with Universal Pay's automated split payments."
              </p>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Payout time</span>
                  <span className="font-semibold text-green-500">-80%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Manual work</span>
                  <span className="font-semibold text-green-500">-90%</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-dashboard">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Find your perfect payment solution
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Let us help you choose the right solution for your business needs.
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

export default SolutionsPage;