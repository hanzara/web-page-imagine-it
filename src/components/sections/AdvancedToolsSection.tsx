import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import QRCode from 'qrcode';
import { 
  Link,
  Globe,
  MessageSquare,
  BarChart3,
  Bell,
  Settings,
  ExternalLink,
  Copy,
  QrCode,
  Smartphone,
  Mail,
  FileText,
  Code,
  Palette,
  Edit,
  Trash2,
  Share,
  TrendingUp,
  TrendingDown,
  Eye,
  Calendar,
  DollarSign,
  Users,
  MousePointer,
  Target,
  Zap,
  Clock,
  Save
} from "lucide-react";

const initialPaymentLinks = [
  {
    id: "LINK-001",
    name: "Product Purchase",
    amount: "$299.99",
    currency: "USD",
    type: "one-time",
    clicks: 45,
    conversions: 12,
    status: "active",
    created: "2024-01-15",
    expires: "2024-02-15",
    url: "https://pay.universalpay.com/product-purchase",
    revenue: "$3,598.88",
    conversionRate: "26.7%",
    description: "One-time purchase for premium product"
  },
  {
    id: "LINK-002",
    name: "Monthly Subscription",
    amount: "$29.99",
    currency: "USD",
    type: "recurring",
    clicks: 128,
    conversions: 89,
    status: "active",
    created: "2024-01-10",
    expires: "Never",
    url: "https://pay.universalpay.com/monthly-subscription",
    revenue: "$2,669.11",
    conversionRate: "69.5%",
    description: "Monthly recurring payment for subscription service"
  },
  {
    id: "LINK-003",
    name: "Event Ticket",
    amount: "€75.00",
    currency: "EUR",
    type: "one-time",
    clicks: 234,
    conversions: 156,
    status: "completed",
    created: "2024-01-05",
    expires: "2024-01-20",
    url: "https://pay.universalpay.com/event-ticket",
    revenue: "€11,700.00",
    conversionRate: "66.7%",
    description: "Single event ticket purchase"
  }
];

const analyticsData = [
  { metric: "Total Revenue", value: "$125,430", change: "+12.5%" },
  { metric: "Conversion Rate", value: "68.2%", change: "+5.3%" },
  { metric: "Average Transaction", value: "$89.50", change: "-2.1%" },
  { metric: "Failed Payments", value: "2.1%", change: "-0.8%" }
];

const disputeHistory = [
  {
    id: "DISP-001",
    transaction: "TXN-12345",
    amount: "$250.00",
    reason: "Product not received",
    status: "resolved",
    resolution: "Refund issued",
    date: "2024-01-15"
  },
  {
    id: "DISP-002",
    transaction: "TXN-12346",
    amount: "$89.99",
    reason: "Duplicate charge",
    status: "investigating",
    resolution: "Under review",
    date: "2024-01-18"
  }
];

export const AdvancedToolsSection = () => {
  const [paymentLinks, setPaymentLinks] = useState(initialPaymentLinks);
  const [linkName, setLinkName] = useState("");
  const [linkAmount, setLinkAmount] = useState("");
  const [linkCurrency, setLinkCurrency] = useState("USD");
  const [linkType, setLinkType] = useState("one-time");
  const [linkExpiration, setLinkExpiration] = useState("30d");
  const [linkDescription, setLinkDescription] = useState("");
  const [customDomain, setCustomDomain] = useState("");
  const [brandingEnabled, setBrandingEnabled] = useState(false);
  const [selectedLink, setSelectedLink] = useState<any>(null);
  const [qrCode, setQrCode] = useState("");
  const [showQrModal, setShowQrModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generatePaymentLink = async () => {
    if (!linkName.trim() || !linkAmount.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    const newLink = {
      id: `LINK-${Date.now()}`,
      name: linkName,
      amount: `$${linkAmount}`,
      currency: linkCurrency,
      type: linkType,
      clicks: 0,
      conversions: 0,
      status: "active",
      created: new Date().toISOString().split('T')[0],
      expires: linkExpiration === "never" ? "Never" : calculateExpiration(linkExpiration),
      url: `https://pay.universalpay.com/${linkName.toLowerCase().replace(/\s+/g, '-')}`,
      revenue: "$0.00",
      conversionRate: "0%",
      description: linkDescription || `Payment link for ${linkName}`
    };

    setPaymentLinks(prev => [newLink, ...prev]);
    
    // Reset form
    setLinkName("");
    setLinkAmount("");
    setLinkDescription("");
    
    toast.success("Payment link created successfully!");
  };

  const calculateExpiration = (period: string) => {
    const now = new Date();
    switch (period) {
      case "24h":
        now.setDate(now.getDate() + 1);
        break;
      case "7d":
        now.setDate(now.getDate() + 7);
        break;
      case "30d":
        now.setDate(now.getDate() + 30);
        break;
      default:
        return "Never";
    }
    return now.toISOString().split('T')[0];
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy");
    }
  };

  const generateQrCode = async (link: any) => {
    try {
      const qrCodeData = await QRCode.toDataURL(link.url, {
        width: 256,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        }
      });
      setQrCode(qrCodeData);
      setSelectedLink(link);
      setShowQrModal(true);
    } catch (error) {
      toast.error("Failed to generate QR code");
    }
  };

  const editLink = (link: any) => {
    setSelectedLink(link);
    setLinkName(link.name);
    setLinkAmount(link.amount.replace('$', '').replace('€', ''));
    setLinkCurrency(link.currency);
    setLinkType(link.type);
    setLinkDescription(link.description);
    setShowEditModal(true);
  };

  const updateLink = () => {
    if (!selectedLink) return;

    const updatedLinks = paymentLinks.map(link => 
      link.id === selectedLink.id 
        ? {
            ...link,
            name: linkName,
            amount: `$${linkAmount}`,
            currency: linkCurrency,
            type: linkType,
            description: linkDescription,
          }
        : link
    );

    setPaymentLinks(updatedLinks);
    setShowEditModal(false);
    setSelectedLink(null);
    toast.success("Payment link updated successfully!");
  };

  const deleteLink = (linkId: string) => {
    setPaymentLinks(prev => prev.filter(link => link.id !== linkId));
    toast.success("Payment link deleted");
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <Zap className="w-4 h-4 text-green-500" />;
      case 'completed': return <Target className="w-4 h-4 text-blue-500" />;
      case 'paused': return <Clock className="w-4 h-4 text-orange-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Advanced Tools</h1>
        <p className="text-muted-foreground">
          Custom payment links, hosted pages, dispute management, and financial analytics
        </p>
      </div>

      <Tabs defaultValue="links" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="links">Payment Links</TabsTrigger>
          <TabsTrigger value="pages">Hosted Pages</TabsTrigger>
          <TabsTrigger value="disputes">Disputes</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Create Payment Link */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link className="w-5 h-5" />
                  Create Payment Link
                </CardTitle>
                <CardDescription>
                  Generate custom payment links for easy sharing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Link Name</Label>
                  <Input 
                    placeholder="e.g., Product Purchase"
                    value={linkName}
                    onChange={(e) => setLinkName(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Amount</Label>
                    <Input 
                      type="number"
                      placeholder="0.00"
                      value={linkAmount}
                      onChange={(e) => setLinkAmount(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Currency</Label>
                    <Select value={linkCurrency} onValueChange={setLinkCurrency}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="NGN">NGN</SelectItem>
                        <SelectItem value="KES">KES</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea 
                    placeholder="Describe what this payment is for..."
                    value={linkDescription}
                    onChange={(e) => setLinkDescription(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Payment Type</Label>
                  <Select value={linkType} onValueChange={setLinkType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="one-time">One-time Payment</SelectItem>
                      <SelectItem value="recurring">Recurring Payment</SelectItem>
                      <SelectItem value="donation">Donation (Any Amount)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Expiration</Label>
                  <Select value={linkExpiration} onValueChange={setLinkExpiration}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24h">24 Hours</SelectItem>
                      <SelectItem value="7d">7 Days</SelectItem>
                      <SelectItem value="30d">30 Days</SelectItem>
                      <SelectItem value="never">Never Expire</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="bg-muted p-3 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">Preview URL:</p>
                  <p className="text-sm font-mono bg-background p-2 rounded border">
                    https://pay.universalpay.com/{linkName ? linkName.toLowerCase().replace(/\s+/g, '-') : 'payment-link'}
                  </p>
                </div>

                <Button 
                  className="w-full"
                  onClick={generatePaymentLink}
                  disabled={!linkName || !linkAmount}
                >
                  <Link className="w-4 h-4 mr-2" />
                  Generate Payment Link
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Payment Links List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Active Payment Links</span>
                  <Badge variant="outline" className="bg-primary/10">
                    {paymentLinks.length} links
                  </Badge>
                </CardTitle>
                <CardDescription>Manage and analyze your payment links performance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {paymentLinks.map((link) => (
                  <Card key={link.id} className="bg-gradient-card shadow-card">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {getStatusIcon(link.status)}
                          <div>
                            <h4 className="font-semibold text-lg">{link.name}</h4>
                            <p className="text-sm text-muted-foreground">{link.description}</p>
                          </div>
                        </div>
                        <Badge 
                          variant={link.status === 'active' ? 'default' : 'secondary'}
                          className={
                            link.status === 'active' 
                              ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                              : link.status === 'completed'
                              ? 'bg-blue-500/20 text-blue-400 border-blue-500/30'
                              : 'bg-orange-500/20 text-orange-400 border-orange-500/30'
                          }
                        >
                          {link.status}
                        </Badge>
                      </div>

                      {/* Metrics Grid */}
                      <div className="grid grid-cols-4 gap-4 mb-4 p-3 bg-muted/20 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-primary">{link.amount}</div>
                          <div className="text-xs text-muted-foreground">Amount</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold flex items-center justify-center gap-1">
                            <MousePointer className="w-4 h-4" />
                            {link.clicks}
                          </div>
                          <div className="text-xs text-muted-foreground">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold flex items-center justify-center gap-1">
                            <Target className="w-4 h-4" />
                            {link.conversions}
                          </div>
                          <div className="text-xs text-muted-foreground">Conversions</div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-bold flex items-center justify-center gap-1 ${
                            parseFloat(link.conversionRate) > 50 ? 'text-green-500' : 'text-orange-500'
                          }`}>
                            {parseFloat(link.conversionRate) > 50 ? 
                              <TrendingUp className="w-4 h-4" /> : 
                              <TrendingDown className="w-4 h-4" />
                            }
                            {link.conversionRate}
                          </div>
                          <div className="text-xs text-muted-foreground">Conv. Rate</div>
                        </div>
                      </div>

                      {/* Link Details */}
                      <div className="mb-4">
                        <div className="text-xs text-muted-foreground mb-1">Payment URL:</div>
                        <div className="text-sm font-mono bg-muted/50 p-2 rounded border truncate">
                          {link.url}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(link.url)}
                        >
                          <Copy className="w-3 h-3 mr-1" />
                          Copy URL
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(link.url, '_blank')}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Open
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => generateQrCode(link)}
                        >
                          <QrCode className="w-3 h-3 mr-1" />
                          QR Code
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => editLink(link)}
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => copyToClipboard(`Revenue: ${link.revenue} | Clicks: ${link.clicks} | Conversions: ${link.conversions}`)}
                        >
                          <Share className="w-3 h-3 mr-1" />
                          Share Stats
                        </Button>
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => deleteLink(link.id)}
                        >
                          <Trash2 className="w-3 h-3 mr-1" />
                          Delete
                        </Button>
                      </div>

                      {/* Additional Info */}
                      <div className="flex justify-between items-center mt-3 pt-3 border-t border-border/50 text-xs text-muted-foreground">
                        <span>Created: {link.created}</span>
                        <span>Expires: {link.expires}</span>
                        <span className="text-primary font-semibold">Revenue: {link.revenue}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {paymentLinks.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Link className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>No payment links created yet</p>
                    <p className="text-sm">Create your first payment link to get started</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* QR Code Modal */}
            <Dialog open={showQrModal} onOpenChange={setShowQrModal}>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>QR Code for {selectedLink?.name}</DialogTitle>
                  <DialogDescription>
                    Share this QR code for easy mobile payments
                  </DialogDescription>
                </DialogHeader>
                <div className="flex flex-col items-center space-y-4">
                  {qrCode && (
                    <img src={qrCode} alt="QR Code" className="border rounded-lg" />
                  )}
                  <div className="flex gap-2">
                    <Button onClick={() => copyToClipboard(selectedLink?.url || '')}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => {
                        const link = document.createElement('a');
                        link.download = `qr-${selectedLink?.name}.png`;
                        link.href = qrCode;
                        link.click();
                        toast.success('QR code downloaded!');
                      }}
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {/* Edit Link Modal */}
            <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Edit Payment Link</DialogTitle>
                  <DialogDescription>
                    Update your payment link details
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Link Name</Label>
                    <Input 
                      value={linkName}
                      onChange={(e) => setLinkName(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Amount</Label>
                      <Input 
                        type="number"
                        value={linkAmount}
                        onChange={(e) => setLinkAmount(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>Currency</Label>
                      <Select value={linkCurrency} onValueChange={setLinkCurrency}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                          <SelectItem value="GBP">GBP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea 
                      value={linkDescription}
                      onChange={(e) => setLinkDescription(e.target.value)}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={updateLink} className="flex-1">
                      <Save className="w-4 h-4 mr-2" />
                      Update Link
                    </Button>
                    <Button variant="outline" onClick={() => setShowEditModal(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </TabsContent>

        <TabsContent value="pages" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Hosted Payment Pages
              </CardTitle>
              <CardDescription>
                Create fully customizable payment pages with your branding
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-semibold">Page Configuration</h4>
                  
                  <div className="space-y-2">
                    <Label>Page Title</Label>
                    <Input placeholder="Payment for..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Description</Label>
                    <Textarea placeholder="Enter payment description..." />
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Domain</Label>
                    <Input 
                      placeholder="payments.yourdomain.com"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Custom Branding</p>
                      <p className="text-sm text-muted-foreground">
                        Add your logo and brand colors
                      </p>
                    </div>
                    <Switch checked={brandingEnabled} onCheckedChange={setBrandingEnabled} />
                  </div>

                  {brandingEnabled && (
                    <div className="space-y-4 p-4 bg-muted rounded-lg">
                      <div className="space-y-2">
                        <Label>Logo URL</Label>
                        <Input placeholder="https://yourdomain.com/logo.png" />
                      </div>
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex gap-2">
                          <Input placeholder="#0066CC" className="flex-1" />
                          <Button variant="outline" size="icon">
                            <Palette className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Page Preview</h4>
                  <div className="border rounded-lg p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                    <div className="text-center space-y-4">
                      <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto flex items-center justify-center">
                        <Globe className="w-8 h-8 text-primary" />
                      </div>
                      <h3 className="text-xl font-semibold">Payment Page</h3>
                      <p className="text-muted-foreground">Secure payment processing</p>
                      <div className="space-y-2">
                        <Input placeholder="Amount" className="max-w-xs mx-auto" />
                        <Button className="w-full max-w-xs">Pay Now</Button>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground text-center">
                    Preview of your hosted payment page
                  </p>
                </div>
              </div>

              <Button className="w-full">
                <Globe className="w-4 h-4 mr-2" />
                Create Hosted Page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="disputes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                Dispute & Chargeback Management
              </CardTitle>
              <CardDescription>
                Manage payment disputes and chargeback cases
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">2</div>
                    <div className="text-sm text-muted-foreground">Resolved</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-yellow-600">1</div>
                    <div className="text-sm text-muted-foreground">Investigating</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-blue-600">95%</div>
                    <div className="text-sm text-muted-foreground">Win Rate</div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-3">
                {disputeHistory.map((dispute) => (
                  <div key={dispute.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{dispute.id}</h4>
                      <p className="text-sm text-muted-foreground">
                        {dispute.transaction} • {dispute.amount} • {dispute.reason}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dispute.date} • {dispute.resolution}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge 
                        variant={dispute.status === 'resolved' ? 'default' : 'secondary'}
                        className="mb-1"
                      >
                        {dispute.status}
                      </Badge>
                      <div className="flex gap-1">
                        <Button variant="outline" size="sm">
                          <FileText className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="w-3 h-3 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Financial Analytics Dashboard
              </CardTitle>
              <CardDescription>
                Comprehensive analytics and reporting for your payments
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Key Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {analyticsData.map((metric) => (
                  <Card key={metric.metric}>
                    <CardContent className="p-4">
                      <div className="text-sm text-muted-foreground">{metric.metric}</div>
                      <div className="text-2xl font-bold">{metric.value}</div>
                      <div className={`text-sm ${
                        metric.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {metric.change}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-primary mx-auto mb-2" />
                        <p className="text-muted-foreground">Revenue chart would appear here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Methods</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gradient-to-br from-secondary/10 to-secondary/5 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-secondary mx-auto mb-2" />
                        <p className="text-muted-foreground">Payment methods breakdown</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="flex gap-2">
                <Button variant="outline">
                  <FileText className="w-4 h-4 mr-2" />
                  Export Report
                </Button>
                <Button variant="outline">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Real-time Notifications
              </CardTitle>
              <CardDescription>
                Configure notifications for email, SMS, and push alerts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Email Notifications</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment received</p>
                      <p className="text-sm text-muted-foreground">Get notified when payments are received</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Payment failed</p>
                      <p className="text-sm text-muted-foreground">Alert when payments fail</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Dispute opened</p>
                      <p className="text-sm text-muted-foreground">Immediate notification for new disputes</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Weekly summary</p>
                      <p className="text-sm text-muted-foreground">Weekly payment activity summary</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">SMS Notifications</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Large transactions</p>
                      <p className="text-sm text-muted-foreground">SMS for transactions over $1,000</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Security alerts</p>
                      <p className="text-sm text-muted-foreground">Critical security notifications</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Push Notifications</h4>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Real-time updates</p>
                      <p className="text-sm text-muted-foreground">Instant push notifications for all events</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Mobile app alerts</p>
                      <p className="text-sm text-muted-foreground">Push notifications on mobile app</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Notification Channels</h4>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>Email</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Smartphone className="w-4 h-4" />
                    <span>SMS</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    <span>Push</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};