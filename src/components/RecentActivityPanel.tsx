import { useState } from "react";
import { Clock, DollarSign, ArrowUpRight, ArrowDownLeft, RefreshCw, CreditCard, Shield, AlertCircle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ActivityItem {
  id: string;
  type: 'deposit' | 'withdrawal' | 'transfer' | 'conversion' | 'payment' | 'security' | 'card';
  title: string;
  description: string;
  amount?: string;
  currency?: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  timestamp: string;
  metadata?: Record<string, any>;
}

export const RecentActivityPanel = () => {
  const [filter, setFilter] = useState("all");
  
  const activities: ActivityItem[] = [
    {
      id: "1",
      type: "deposit",
      title: "Funds Received",
      description: "Stripe payment received from customer",
      amount: "$1,250.00",
      currency: "USD",
      status: "completed",
      timestamp: "2 minutes ago",
      metadata: { source: "stripe", customer: "John Doe" }
    },
    {
      id: "2",
      type: "conversion",
      title: "Currency Exchange",
      description: "USD to EUR conversion completed",
      amount: "$500.00",
      currency: "USD",
      status: "completed",
      timestamp: "15 minutes ago",
      metadata: { fromAmount: "500", fromCurrency: "USD", toAmount: "425", toCurrency: "EUR" }
    },
    {
      id: "3",
      type: "transfer",
      title: "Payment Sent",
      description: "Transfer to Sarah Wilson",
      amount: "$890.50",
      currency: "USD", 
      status: "processing",
      timestamp: "32 minutes ago",
      metadata: { recipient: "sarah@example.com" }
    },
    {
      id: "4",
      type: "card",
      title: "Virtual Card Created",
      description: "New virtual card for online purchases",
      status: "completed",
      timestamp: "1 hour ago",
      metadata: { cardNumber: "****1234", limit: "$2,000" }
    },
    {
      id: "5",
      type: "security",
      title: "Login Activity",
      description: "New login from Chrome on Windows",
      status: "completed",
      timestamp: "2 hours ago",
      metadata: { location: "New York, US", device: "Chrome Browser" }
    },
    {
      id: "6",
      type: "withdrawal",
      title: "Funds Withdrawn",
      description: "Bank transfer to Chase account",
      amount: "$2,100.00",
      currency: "USD",
      status: "pending",
      timestamp: "3 hours ago",
      metadata: { bank: "Chase Bank", account: "****9876" }
    },
    {
      id: "7",
      type: "payment",
      title: "Subscription Payment",
      description: "Monthly platform fee processed",
      amount: "$29.99",
      currency: "USD",
      status: "failed",
      timestamp: "5 hours ago",
      metadata: { reason: "Insufficient funds", retry: "scheduled" }
    }
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownLeft className="h-4 w-4 text-green-500" />;
      case 'withdrawal':
        return <ArrowUpRight className="h-4 w-4 text-red-500" />;
      case 'transfer':
        return <DollarSign className="h-4 w-4 text-blue-500" />;
      case 'conversion':
        return <RefreshCw className="h-4 w-4 text-purple-500" />;
      case 'payment':
        return <DollarSign className="h-4 w-4 text-orange-500" />;
      case 'card':
        return <CreditCard className="h-4 w-4 text-indigo-500" />;
      case 'security':
        return <Shield className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-3 w-3 text-green-500" />;
      case 'processing':
      case 'pending':
        return <Clock className="h-3 w-3 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'completed':
        return 'default';
      case 'processing':
      case 'pending':
        return 'secondary';
      case 'failed':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const filteredActivities = filter === "all" 
    ? activities 
    : activities.filter(activity => activity.type === filter);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Recent Activity
          </CardTitle>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Activity</SelectItem>
                <SelectItem value="deposit">Deposits</SelectItem>
                <SelectItem value="withdrawal">Withdrawals</SelectItem>
                <SelectItem value="transfer">Transfers</SelectItem>
                <SelectItem value="conversion">Conversions</SelectItem>
                <SelectItem value="payment">Payments</SelectItem>
                <SelectItem value="card">Cards</SelectItem>
                <SelectItem value="security">Security</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="ghost" size="sm">
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-96">
          <div className="space-y-3">
            {filteredActivities.map((activity) => (
              <div 
                key={activity.id}
                className="flex items-start gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer"
              >
                <div className="p-1 rounded-full bg-accent">
                  {getIcon(activity.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-medium text-sm">{activity.title}</h4>
                    <Badge variant={getStatusVariant(activity.status)} className="flex items-center gap-1">
                      {getStatusIcon(activity.status)}
                      {activity.status}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-1">
                    {activity.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </span>
                    {activity.amount && (
                      <span className="text-sm font-medium">
                        {activity.amount} {activity.currency}
                      </span>
                    )}
                  </div>
                  
                  {/* Metadata */}
                  {activity.metadata && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {activity.type === 'conversion' && activity.metadata.fromAmount && (
                        <span>{activity.metadata.fromAmount} {activity.metadata.fromCurrency} → {activity.metadata.toAmount} {activity.metadata.toCurrency}</span>
                      )}
                      {activity.type === 'security' && activity.metadata.location && (
                        <span>{activity.metadata.device} • {activity.metadata.location}</span>
                      )}
                      {activity.type === 'card' && activity.metadata.cardNumber && (
                        <span>Card {activity.metadata.cardNumber} • Limit: {activity.metadata.limit}</span>
                      )}
                      {activity.type === 'withdrawal' && activity.metadata.bank && (
                        <span>{activity.metadata.bank} {activity.metadata.account}</span>
                      )}
                      {activity.type === 'deposit' && activity.metadata.source && (
                        <span>via {activity.metadata.source} • {activity.metadata.customer}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};