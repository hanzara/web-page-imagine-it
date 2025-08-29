import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TopNavigation } from "@/components/TopNavigation";
import { Footer } from "@/components/Footer";
import { 
  ArrowRight, 
  Code, 
  Book,
  Terminal,
  Webhook,
  Cpu,
  Globe,
  Download,
  Play,
  Copy,
  ExternalLink,
  CheckCircle,
  Zap,
  Users
} from "lucide-react";
import developerImage from "@/assets/developer-tools.jpg";
import aiRoutingImage from "@/assets/ai-routing.jpg";

const DevelopersPage = () => {
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
                  Built for Developers
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  Powerful APIs, comprehensive SDKs, and developer tools to integrate 
                  payments into any application in minutes.
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
                src={developerImage} 
                alt="Universal Pay Developer Tools" 
                className="rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Start */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-5xl font-bold mb-4">Get Started in Minutes</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From API keys to your first payment in under 10 minutes. No complex setup required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Terminal className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Get API Keys</h3>
              <p className="text-muted-foreground">
                Sign up and get your API keys instantly. No approval process needed.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Code className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Install SDK</h3>
              <p className="text-muted-foreground">
                Choose from our SDKs for Node.js, Python, PHP, or use our REST API directly.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-glow">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Process Payments</h3>
              <p className="text-muted-foreground">
                Start processing payments with just a few lines of code.
              </p>
            </Card>
          </div>

          {/* Code Example */}
          <Card className="p-8 bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Your First Payment</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary">Node.js</Badge>
                <Button size="sm" variant="outline">
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </div>
            <div className="bg-card p-6 rounded-lg font-mono text-sm overflow-x-auto">
              <pre className="text-muted-foreground">
{`const universalPay = require('@universalpay/node');

// Initialize with your API key
const client = new universalPay.Client('up_live_...');

// Process a payment
const payment = await client.payments.create({
  amount: 2000, // $20.00
  currency: 'USD',
  payment_method: {
    type: 'card',
    card: {
      number: '4242424242424242',
      exp_month: 12,
      exp_year: 2025,
      cvc: '123'
    }
  },
  description: 'Payment for order #123'
});

console.log('Payment successful:', payment.id);`}
              </pre>
            </div>
          </Card>
        </div>
      </section>

      {/* Developer Tools */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3lg lg:text-4xl font-bold mb-4">Complete Developer Toolkit</h2>
            <p className="text-xl text-muted-foreground">
              Everything you need to build, test, and deploy payment solutions.
            </p>
          </div>

          <Tabs defaultValue="apis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 mb-12">
              <TabsTrigger value="apis">APIs</TabsTrigger>
              <TabsTrigger value="sdks">SDKs</TabsTrigger>
              <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
              <TabsTrigger value="testing">Testing</TabsTrigger>
            </TabsList>

            <TabsContent value="apis" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Globe className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">REST API</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Comprehensive REST API with predictable resource URLs and HTTP response codes.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Complete payment lifecycle</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Idempotent requests</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">JSON responses</span>
                    </li>
                  </ul>
                  <Button variant="outline" asChild>
                    <Link to="/auth">
                      <Book className="w-4 h-4 mr-2" />
                      View Docs
                    </Link>
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center space-x-3 mb-4">
                    <Cpu className="w-8 h-8 text-primary" />
                    <h3 className="text-xl font-semibold">GraphQL API</h3>
                  </div>
                  <p className="text-muted-foreground mb-4">
                    Flexible GraphQL API for complex queries and real-time subscriptions.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Type-safe queries</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Real-time subscriptions</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Schema introspection</span>
                    </li>
                  </ul>
                  <Button variant="outline" asChild>
                    <Link to="/auth">
                      <Play className="w-4 h-4 mr-2" />
                      Try Playground
                    </Link>
                  </Button>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sdks" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'Node.js', version: 'v2.1.0', downloads: '50K+' },
                  { name: 'Python', version: 'v1.8.0', downloads: '30K+' },
                  { name: 'PHP', version: 'v1.5.0', downloads: '25K+' },
                  { name: 'Ruby', version: 'v1.3.0', downloads: '15K+' },
                  { name: 'Java', version: 'v1.2.0', downloads: '20K+' },
                  { name: 'Go', version: 'v1.1.0', downloads: '10K+' }
                ].map((sdk) => (
                  <Card key={sdk.name} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">{sdk.name}</h3>
                      <Badge variant="secondary">{sdk.version}</Badge>
                    </div>
                    <p className="text-muted-foreground text-sm mb-4">
                      Official SDK with full type safety and comprehensive documentation.
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{sdk.downloads} downloads</span>
                      <Button size="sm" asChild>
                        <Link to="/auth">
                          <Download className="w-4 h-4 mr-2" />
                          Install
                        </Link>
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="webhooks" className="space-y-8">
              <Card className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                  <div>
                    <div className="flex items-center space-x-3 mb-4">
                      <Webhook className="w-8 h-8 text-primary" />
                      <h3 className="text-2xl font-bold">Real-time Webhooks</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      Get notified instantly about payment events with secure, reliable webhooks.
                    </p>
                    <ul className="space-y-3 mb-6">
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Cryptographically signed</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Automatic retries</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Event filtering</span>
                      </li>
                      <li className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span>Delivery monitoring</span>
                      </li>
                    </ul>
                    <Button asChild>
                      <Link to="/auth">
                        Setup Webhooks
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>
                  <div>
                    <img 
                      src={aiRoutingImage} 
                      alt="Webhooks Integration" 
                      className="rounded-lg shadow-lg"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="testing" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Sandbox Environment</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete testing environment that mirrors production without processing real payments.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Test card numbers</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Webhook simulation</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Error scenario testing</span>
                    </li>
                  </ul>
                  <Button variant="outline" asChild>
                    <Link to="/auth">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Access Sandbox
                    </Link>
                  </Button>
                </Card>

                <Card className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Testing Tools</h3>
                  <p className="text-muted-foreground mb-4">
                    Advanced tools to simulate various payment scenarios and edge cases.
                  </p>
                  <ul className="space-y-2 mb-4">
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Payment simulator</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">Webhook inspector</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="text-sm">API log viewer</span>
                    </li>
                  </ul>
                  <Button variant="outline" asChild>
                    <Link to="/auth">
                      <Terminal className="w-4 h-4 mr-2" />
                      View Tools
                    </Link>
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Resources */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">Developer Resources</h2>
            <p className="text-xl text-muted-foreground">
              Comprehensive guides, tutorials, and reference materials
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Book className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">API Reference</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Complete API documentation with examples and use cases.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">
                  Read Docs
                </Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Play className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Tutorials</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Step-by-step guides for common integration patterns.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">
                  View Tutorials
                </Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Code className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Code Samples</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Ready-to-use code examples in multiple languages.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">
                  Browse Samples
                </Link>
              </Button>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <Users className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Community</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Join our developer community for support and discussions.
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link to="/auth">
                  Join Community
                </Link>
              </Button>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-dashboard">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Start building today
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Get your API keys and process your first payment in minutes.
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

export default DevelopersPage;