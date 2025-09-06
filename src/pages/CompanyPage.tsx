import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { TopNavigation } from "@/components/TopNavigation";
import { Footer } from "@/components/Footer";
import { 
  ArrowRight, 
  Users,
  Globe,
  Shield,
  Award,
  Heart,
  Zap,
  Target,
  Building,
  MapPin,
  Calendar,
  TrendingUp,
  CheckCircle,
  Briefcase,
  Mail,
  Phone,
  Twitter,
  Linkedin,
  Github,
  Star,
  Quote,
  Clock,
  Newspaper,
  Download,
  ExternalLink,
  Camera,
  Video,
  FileText,
  Building2,
  Users2,
  Handshake,
  Trophy,
  Rocket,
  Code2,
  Lightbulb,
  PieChart,
  BarChart3,
  DollarSign
} from "lucide-react";
import companyImage from "@/assets/company-about.jpg";
import globalPaymentsImage from "@/assets/global-payments.jpg";
import securityImage from "@/assets/security-shield.jpg";

const CompanyPage = () => {
  const [activeTab, setActiveTab] = useState("overview");

  // Team data
  const leadership = [
    {
      name: "Abraham Ougene",
      role: "CEO & Co-Founder",
      image: "/api/placeholder/150/150",
      bio: "Former VP of Payments at Stripe. 15+ years in fintech, MIT Computer Science",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "Haruni Randu",
      role: "CTO & Co-Founder", 
      image: "/api/placeholder/150/150",
      bio: "Ex-Google Payments architect. PhD in Distributed Systems from Stanford",
      linkedin: "#",
      github: "#"
    },
    {
      name: "Priya Patel",
      role: "Chief Revenue Officer",
      image: "/api/placeholder/150/150",
      bio: "Former VP Sales at PayPal. Built revenue teams across 3 continents",
      linkedin: "#",
      twitter: "#"
    },
    {
      name: "David Kim",
      role: "Head of Engineering",
      image: "/api/placeholder/150/150",
      bio: "Lead engineer at Coinbase. Expert in blockchain and payment infrastructure",
      linkedin: "#",
      github: "#"
    }
  ];

  const investors = [
    { name: "Sequoia Capital", type: "Series B Lead", amount: "$50M" },
    { name: "Andreessen Horowitz", type: "Series A Lead", amount: "$15M" },
    { name: "Y Combinator", type: "Seed", amount: "$2M" },
    { name: "Stripe", type: "Strategic", amount: "Undisclosed" }
  ];

  const newsItems = [
    {
      title: "Universal Pay Raises $50M Series B to Expand Global Payment Infrastructure",
      date: "March 15, 2024",
      source: "TechCrunch",
      excerpt: "The funding will accelerate expansion into emerging markets and enhance AI capabilities..."
    },
    {
      title: "Universal Pay Named Fintech Company of the Year",
      date: "February 8, 2024", 
      source: "Fintech Awards",
      excerpt: "Recognized for innovation in cross-border payments and API excellence..."
    },
    {
      title: "Universal Pay Processes $5B in Annual Payment Volume",
      date: "January 12, 2024",
      source: "Business Wire",
      excerpt: "Company achieves major milestone with 300% year-over-year growth..."
    }
  ];

  const careers = [
    {
      title: "Senior Backend Engineer",
      department: "Engineering",
      location: "San Francisco, CA / Remote",
      type: "Full-time"
    },
    {
      title: "Product Manager - Payments",
      department: "Product",
      location: "New York, NY / Remote", 
      type: "Full-time"
    },
    {
      title: "Sales Director - EMEA",
      department: "Sales",
      location: "London, UK",
      type: "Full-time"
    },
    {
      title: "DevRel Engineer",
      department: "Developer Relations",
      location: "Remote",
      type: "Full-time"
    }
  ];

  const testimonials = [
    {
      quote: "Universal Pay transformed our global expansion. We went from 6 months to integrate payments in new markets to just 2 weeks.",
      author: "Emma Rodriguez",
      title: "CTO, GlobalCommerce",
      company: "GlobalCommerce",
      rating: 5
    },
    {
      quote: "The API is incredibly well-designed. Our team was able to integrate in hours, not days. The documentation is world-class.",
      author: "James Wilson", 
      title: "Lead Developer",
      company: "TechStartup Inc",
      rating: 5
    },
    {
      quote: "Universal Pay's customer support is unmatched. They helped us optimize our payment flows and reduced our costs by 30%.",
      author: "Maria Santos",
      title: "Finance Director", 
      company: "E-commerce Co",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <TopNavigation />

      {/* Enhanced Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-dashboard overflow-hidden">
        <div className="container mx-auto max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 text-center lg:text-left">
              <div className="space-y-4">
                <Badge className="bg-white/20 text-white border-white/30 mb-4">
                  🏆 Fintech Company of the Year 2024
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold text-white leading-tight">
                  About Universal Pay
                </h1>
                <p className="text-xl text-white/90 leading-relaxed max-w-2xl">
                  We're building the future of global payments. One platform to connect 
                  the world's financial systems and make payments truly universal.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" asChild className="text-lg px-8 py-4">
                  <Link to="/auth">
                    Join Our Team
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="text-lg px-8 py-4 bg-white/10 border-white/20 text-white hover:bg-white/20">
                  <Link to="#investors">
                    View Press Kit
                  </Link>
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">$5B+</div>
                  <div className="text-sm text-white/70">Payment Volume</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">10K+</div>
                  <div className="text-sm text-white/70">Businesses</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">50+</div>
                  <div className="text-sm text-white/70">Countries</div>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <img 
                src={companyImage} 
                alt="Universal Pay Company" 
                className="rounded-2xl shadow-2xl border border-white/20"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Navigation Tabs */}
      <section className="py-8 px-4 bg-muted/30 sticky top-0 z-40 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto p-1">
              <TabsTrigger value="overview" className="flex items-center gap-2 py-3">
                <Building className="w-4 h-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="team" className="flex items-center gap-2 py-3">
                <Users className="w-4 h-4" />
                Team
              </TabsTrigger>
              <TabsTrigger value="investors" className="flex items-center gap-2 py-3">
                <TrendingUp className="w-4 h-4" />
                Investors
              </TabsTrigger>
              <TabsTrigger value="news" className="flex items-center gap-2 py-3">
                <Newspaper className="w-4 h-4" />
                News
              </TabsTrigger>
              <TabsTrigger value="careers" className="flex items-center gap-2 py-3">
                <Briefcase className="w-4 h-4" />
                Careers
              </TabsTrigger>
              <TabsTrigger value="contact" className="flex items-center gap-2 py-3">
                <Mail className="w-4 h-4" />
                Contact
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-20">
              {/* Mission & Vision */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Mission</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      To democratize global payments by creating a universal platform that connects 
                      every payment method, currency, and financial system worldwide. We believe 
                      that moving money should be as simple as sending a message.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-gradient-card border-primary/20">
                      <Globe className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">Global Reach</h3>
                      <p className="text-sm text-muted-foreground">
                        Supporting 180+ currencies and 200+ payment methods across 50+ countries.
                      </p>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-card border-primary/20">
                      <Zap className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">Innovation First</h3>
                      <p className="text-sm text-muted-foreground">
                        AI-powered routing and cutting-edge technology to optimize every transaction.
                      </p>
                    </Card>
                  </div>
                </div>

                <div className="space-y-8">
                  <div>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Vision</h2>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                      A world where payments flow seamlessly across borders, currencies, and 
                      platforms. Where businesses can focus on growth while we handle the 
                      complexity of global payment infrastructure.
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-6 bg-gradient-card border-primary/20">
                      <Shield className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">Trust & Security</h3>
                      <p className="text-sm text-muted-foreground">
                        Bank-grade security with PCI DSS Level 1 compliance and fraud protection.
                      </p>
                    </Card>
                    
                    <Card className="p-6 bg-gradient-card border-primary/20">
                      <Heart className="w-8 h-8 text-primary mb-3" />
                      <h3 className="font-semibold mb-2">Customer Success</h3>
                      <p className="text-sm text-muted-foreground">
                        Dedicated to helping businesses succeed with world-class support.
                      </p>
                    </Card>
                  </div>
                </div>
              </div>

              {/* Company Stats */}
              <div className="py-20 px-4 bg-muted/30 rounded-3xl">
                <div className="text-center mb-16">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">By the Numbers</h2>
                  <p className="text-xl text-muted-foreground">
                    Our growth reflects the trust businesses place in Universal Pay
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <Card className="text-center p-8">
                    <DollarSign className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">$5B+</div>
                    <div className="text-muted-foreground">Payment Volume Processed</div>
                    <div className="text-sm text-green-500 mt-2">+250% YoY growth</div>
                  </Card>
                  
                  <Card className="text-center p-8">
                    <Building2 className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">10K+</div>
                    <div className="text-muted-foreground">Active Businesses</div>
                    <div className="text-sm text-green-500 mt-2">From 50+ countries</div>
                  </Card>
                  
                  <Card className="text-center p-8">
                    <Clock className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">99.99%</div>
                    <div className="text-muted-foreground">Platform Uptime</div>
                    <div className="text-sm text-green-500 mt-2">SLA guaranteed</div>
                  </Card>
                  
                  <Card className="text-center p-8">
                    <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">200+</div>
                    <div className="text-muted-foreground">Payment Methods</div>
                    <div className="text-sm text-green-500 mt-2">And growing</div>
                  </Card>
                </div>
              </div>

              {/* Customer Testimonials */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">What Our Customers Say</h2>
                  <p className="text-xl text-muted-foreground">
                    Trusted by thousands of businesses worldwide
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {testimonials.map((testimonial, index) => (
                    <Card key={index} className="p-6 bg-gradient-card border-primary/20">
                      <div className="flex items-center mb-4">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                        ))}
                      </div>
                      <Quote className="w-8 h-8 text-primary/30 mb-4" />
                      <p className="text-muted-foreground mb-4 italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="border-t pt-4">
                        <p className="font-semibold">{testimonial.author}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                        <p className="text-sm text-primary">{testimonial.company}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Company Timeline */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Journey</h2>
                  <p className="text-xl text-muted-foreground">
                    Key milestones in building the universal payment platform
                  </p>
                </div>

                <div className="space-y-8">
                  <Card className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">2020 - Founded</h3>
                          <Badge variant="secondary">Origin</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Universal Pay was founded with the vision of creating a truly universal payment platform 
                          that could connect all payment methods and currencies worldwide.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                        <TrendingUp className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">2021 - Series A</h3>
                          <Badge variant="secondary">Growth</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Raised $15M Series A to expand our team and build the core platform infrastructure. 
                          Launched our first API endpoints and processed our first million in payments.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                        <Globe className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">2022 - Global Expansion</h3>
                          <Badge variant="secondary">Scale</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Expanded to support mobile money across Africa, cryptocurrency payments, 
                          and launched our AI-powered SmartRoute technology.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                        <Award className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">2023 - Recognition</h3>
                          <Badge variant="secondary">Achievement</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Named "Fintech Company of the Year" and achieved PCI DSS Level 1 compliance. 
                          Processed over $1B in payment volume with 99.99% uptime.
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
                        <Zap className="w-8 h-8 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-xl font-semibold">2024 - AI Revolution</h3>
                          <Badge variant="secondary">Innovation</Badge>
                        </div>
                        <p className="text-muted-foreground">
                          Launched advanced AI capabilities including intelligent routing, fraud detection, 
                          and automated payment optimization. Now processing $5B+ annually.
                        </p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-16">
              {/* Leadership Team */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">Leadership Team</h2>
                  <p className="text-xl text-muted-foreground">
                    Meet the leaders driving Universal Pay's mission forward
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {leadership.map((member, index) => (
                    <Card key={index} className="p-6 text-center bg-gradient-card border-primary/20">
                      <Avatar className="w-24 h-24 mx-auto mb-4">
                        <AvatarImage src={member.image} alt={member.name} />
                        <AvatarFallback className="text-lg">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-primary font-medium mb-3">{member.role}</p>
                      <p className="text-sm text-muted-foreground mb-4">{member.bio}</p>
                      <div className="flex justify-center space-x-2">
                        {member.linkedin && (
                          <Button size="sm" variant="outline" asChild>
                            <Link to={member.linkedin}>
                              <Linkedin className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        {member.twitter && (
                          <Button size="sm" variant="outline" asChild>
                            <Link to={member.twitter}>
                              <Twitter className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                        {member.github && (
                          <Button size="sm" variant="outline" asChild>
                            <Link to={member.github}>
                              <Github className="w-4 h-4" />
                            </Link>
                          </Button>
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Team Culture */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">Our Team Culture</h2>
                  <p className="text-xl text-muted-foreground mb-8">
                    We're a diverse team of payment experts, engineers, and innovators 
                    from around the world, united by a shared mission to revolutionize global payments.
                  </p>
                  
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <Users className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Global Expertise</h3>
                        <p className="text-muted-foreground text-sm">
                          Team members from leading fintech companies across North America, Europe, Africa, and Asia.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Customer-Focused</h3>
                        <p className="text-muted-foreground text-sm">
                          Every decision we make is driven by what's best for our customers and their success.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center">
                        <Lightbulb className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">Innovation Culture</h3>
                        <p className="text-muted-foreground text-sm">
                          We continuously push the boundaries of what's possible in payments technology.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="relative">
                  <img 
                    src={globalPaymentsImage} 
                    alt="Our Team" 
                    className="rounded-2xl shadow-xl border border-border"
                  />
                </div>
              </div>

              {/* Team Values */}
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Values</h2>
                  <p className="text-xl text-muted-foreground">
                    The principles that guide everything we do
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
                    <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Trust & Security</h3>
                    <p className="text-muted-foreground">
                      We protect every transaction with bank-grade security and maintain the highest standards of compliance.
                    </p>
                  </Card>

                  <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
                    <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Customer Success</h3>
                    <p className="text-muted-foreground">
                      Our customers' success is our success. We're committed to providing exceptional support and service.
                    </p>
                  </Card>

                  <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
                    <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Innovation</h3>
                    <p className="text-muted-foreground">
                      We continuously innovate to solve complex payment challenges and create new possibilities.
                    </p>
                  </Card>

                  <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
                    <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Global Impact</h3>
                    <p className="text-muted-foreground">
                      We're building infrastructure that empowers businesses worldwide to participate in the global economy.
                    </p>
                  </Card>

                  <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
                    <Handshake className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Transparency</h3>
                    <p className="text-muted-foreground">
                      We believe in open communication, honest feedback, and building trust through transparency.
                    </p>
                  </Card>

                  <Card className="p-8 text-center bg-gradient-card border-primary/20 shadow-glow hover:shadow-glow/50 transition-all">
                    <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-3">Excellence</h3>
                    <p className="text-muted-foreground">
                      We strive for excellence in everything we do, from code quality to customer experience.
                    </p>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Investors Tab */}
            <TabsContent value="investors" className="space-y-16">
              <div className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-4">Our Investors</h2>
                  <p className="text-xl text-muted-foreground">
                    Backed by world-class investors who believe in our mission
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {investors.map((investor, index) => (
                    <Card key={index} className="p-6 bg-gradient-card border-primary/20">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-semibold">{investor.name}</h3>
                        <Badge variant="outline">{investor.type}</Badge>
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">{investor.amount}</div>
                      <p className="text-sm text-muted-foreground">
                        Leading investor in {investor.type} funding round
                      </p>
                    </Card>
                  ))}
                </div>

                <Card className="p-8 bg-gradient-card border-primary/20">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-4">Total Funding Raised</h3>
                    <div className="text-5xl font-bold text-primary mb-4">$67M+</div>
                    <p className="text-muted-foreground mb-6">
                      Across seed, Series A, and Series B rounds from 2020-2024
                    </p>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-2xl font-bold">$2M</div>
                        <div className="text-sm text-muted-foreground">Seed (2020)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">$15M</div>
                        <div className="text-sm text-muted-foreground">Series A (2021)</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">$50M</div>
                        <div className="text-sm text-muted-foreground">Series B (2024)</div>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-4">Press Kit & Resources</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Download className="w-6 h-6" />
                      <span>Company Logos</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <FileText className="w-6 h-6" />
                      <span>Press Releases</span>
                    </Button>
                    <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                      <Camera className="w-6 h-6" />
                      <span>Leadership Photos</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="space-y-8">
              <div className="text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Latest News</h2>
                <p className="text-xl text-muted-foreground">
                  Stay updated with Universal Pay's latest developments
                </p>
              </div>

              <div className="space-y-6">
                {newsItems.map((item, index) => (
                  <Card key={index} className="p-6 bg-gradient-card border-primary/20 hover:shadow-lg transition-all">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <div className="flex items-center space-x-4 mb-3">
                          <Badge variant="outline">{item.source}</Badge>
                          <span className="text-sm text-muted-foreground">{item.date}</span>
                        </div>
                        <p className="text-muted-foreground">{item.excerpt}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>

              <div className="text-center">
                <Button size="lg" variant="outline">
                  View All Press Releases
                  <ExternalLink className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            {/* Careers Tab */}
            <TabsContent value="careers" className="space-y-16">
              <div className="text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Join Our Team</h2>
                <p className="text-xl text-muted-foreground">
                  Help us build the future of global payments
                </p>
              </div>

              {/* Why Work With Us */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 text-center bg-gradient-card border-primary/20">
                  <Rocket className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">High Impact</h3>
                  <p className="text-muted-foreground">
                    Work on products that process billions in payments and impact millions of users worldwide.
                  </p>
                </Card>

                <Card className="p-6 text-center bg-gradient-card border-primary/20">
                  <Code2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Cutting Edge Tech</h3>
                  <p className="text-muted-foreground">
                    Work with the latest technologies including AI, blockchain, and distributed systems.
                  </p>
                </Card>

                <Card className="p-6 text-center bg-gradient-card border-primary/20">
                  <Users2 className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Amazing Team</h3>
                  <p className="text-muted-foreground">
                    Collaborate with world-class engineers and payment experts from top tech companies.
                  </p>
                </Card>
              </div>

              {/* Open Positions */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center">Open Positions</h3>
                
                <div className="space-y-4">
                  {careers.map((job, index) => (
                    <Card key={index} className="p-6 bg-gradient-card border-primary/20 hover:shadow-lg transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-xl font-semibold mb-2">{job.title}</h4>
                          <div className="flex items-center space-x-4">
                            <Badge variant="outline">{job.department}</Badge>
                            <span className="text-sm text-muted-foreground flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {job.location}
                            </span>
                            <Badge>{job.type}</Badge>
                          </div>
                        </div>
                        <Button>
                          Apply Now
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Application Process */}
              <Card className="p-8 bg-gradient-card border-primary/20">
                <h3 className="text-2xl font-bold mb-6 text-center">Our Hiring Process</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">1</div>
                    <h4 className="font-semibold mb-2">Application</h4>
                    <p className="text-sm text-muted-foreground">Submit your application and resume through our careers page.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">2</div>
                    <h4 className="font-semibold mb-2">Phone Screen</h4>
                    <p className="text-sm text-muted-foreground">Initial conversation with our talent team to learn more about you.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">3</div>
                    <h4 className="font-semibold mb-2">Technical Interview</h4>
                    <p className="text-sm text-muted-foreground">Technical discussion and problem-solving with the team.</p>
                  </div>
                  <div className="text-center">
                    <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3">4</div>
                    <h4 className="font-semibold mb-2">Final Interview</h4>
                    <p className="text-sm text-muted-foreground">Culture fit and leadership discussion.</p>
                  </div>
                </div>
              </Card>

              <div className="text-center">
                <p className="text-muted-foreground mb-4">
                  Don't see a position that fits? We're always looking for exceptional talent.
                </p>
                <Button size="lg">
                  Send Us Your Resume
                  <Mail className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </TabsContent>

            {/* Contact Tab */}
            <TabsContent value="contact" className="space-y-16">
              <div className="text-center">
                <h2 className="text-3xl lg:text-4xl font-bold mb-4">Get in Touch</h2>
                <p className="text-xl text-muted-foreground">
                  We'd love to hear from you. Reach out to our team.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="p-6 text-center bg-gradient-card border-primary/20">
                  <Mail className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">General Inquiries</h3>
                  <p className="text-muted-foreground mb-4">
                    For general questions about Universal Pay
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="mailto:hello@universalpay.com">
                      hello@universalpay.com
                    </Link>
                  </Button>
                </Card>

                <Card className="p-6 text-center bg-gradient-card border-primary/20">
                  <Briefcase className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Business Partnerships</h3>
                  <p className="text-muted-foreground mb-4">
                    Interested in partnering with us?
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="mailto:partnerships@universalpay.com">
                      partnerships@universalpay.com
                    </Link>
                  </Button>
                </Card>

                <Card className="p-6 text-center bg-gradient-card border-primary/20">
                  <Users className="w-12 h-12 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-3">Media & Press</h3>
                  <p className="text-muted-foreground mb-4">
                    Press inquiries and media requests
                  </p>
                  <Button variant="outline" asChild>
                    <Link to="mailto:press@universalpay.com">
                      press@universalpay.com
                    </Link>
                  </Button>
                </Card>
              </div>

              {/* Office Locations */}
              <div className="space-y-8">
                <h3 className="text-2xl font-bold text-center">Our Offices</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  <Card className="p-6 bg-gradient-card border-primary/20">
                    <h4 className="text-xl font-semibold mb-3">San Francisco HQ</h4>
                    <div className="space-y-2">
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        123 Market Street, Suite 400
                      </p>
                      <p className="text-muted-foreground">San Francisco, CA 94105</p>
                      <p className="text-muted-foreground flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        +1 (415) 555-0123
                      </p>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-card border-primary/20">
                    <h4 className="text-xl font-semibold mb-3">London Office</h4>
                    <div className="space-y-2">
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        25 Old Broad Street
                      </p>
                      <p className="text-muted-foreground">London EC2N 1HN, UK</p>
                      <p className="text-muted-foreground flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        +44 20 7123 4567
                      </p>
                    </div>
                  </Card>

                  <Card className="p-6 bg-gradient-card border-primary/20">
                    <h4 className="text-xl font-semibold mb-3">Singapore Office</h4>
                    <div className="space-y-2">
                      <p className="text-muted-foreground flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        1 Raffles Place, Level 30
                      </p>
                      <p className="text-muted-foreground">Singapore 048616</p>
                      <p className="text-muted-foreground flex items-center">
                        <Phone className="w-4 h-4 mr-2" />
                        +65 6123 4567
                      </p>
                    </div>
                  </Card>
                </div>
              </div>

              {/* Social Media */}
              <Card className="p-8 bg-gradient-card border-primary/20">
                <div className="text-center">
                  <h3 className="text-2xl font-bold mb-6">Follow Us</h3>
                  <div className="flex justify-center space-x-4">
                    <Button size="lg" variant="outline" asChild>
                      <Link to="https://twitter.com/universalpay">
                        <Twitter className="w-5 h-5 mr-2" />
                        Twitter
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="https://linkedin.com/company/universalpay">
                        <Linkedin className="w-5 h-5 mr-2" />
                        LinkedIn
                      </Link>
                    </Button>
                    <Button size="lg" variant="outline" asChild>
                      <Link to="https://github.com/universalpay">
                        <Github className="w-5 h-5 mr-2" />
                        GitHub
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CompanyPage;
