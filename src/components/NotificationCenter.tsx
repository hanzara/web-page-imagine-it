import { useState } from "react";
import { Bell, Check, AlertTriangle, Shield, DollarSign, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Notification {
  id: string;
  type: 'transaction' | 'security' | 'system' | 'wallet';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
}

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "transaction",
      title: "Payment Received",
      message: "$1,250.00 received from Stripe",
      timestamp: "2 minutes ago",
      read: false,
      priority: "medium"
    },
    {
      id: "2",
      type: "security",
      title: "New Login Detected",
      message: "Login from Chrome on Windows 11",
      timestamp: "15 minutes ago",
      read: false,
      priority: "high"
    },
    {
      id: "3",
      type: "wallet",
      title: "Currency Conversion Complete",
      message: "Converted $500 USD to 425 EUR",
      timestamp: "1 hour ago",
      read: true,
      priority: "low"
    },
    {
      id: "4",
      type: "system",
      title: "Maintenance Scheduled",
      message: "System maintenance on Dec 25, 2024",
      timestamp: "2 hours ago",
      read: true,
      priority: "medium"
    },
    {
      id: "5",
      type: "transaction",
      title: "Payment Failed",
      message: "Failed to process $89.99 payment",
      timestamp: "3 hours ago",
      read: false,
      priority: "high"
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <DollarSign className="h-4 w-4" />;
      case 'security':
        return <Shield className="h-4 w-4" />;
      case 'wallet':
        return <DollarSign className="h-4 w-4" />;
      case 'system':
        return <Settings className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'text-destructive';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  const filterNotifications = (type?: string) => {
    if (!type) return notifications;
    return notifications.filter(n => n.type === type);
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div 
      className={`p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent ${
        !notification.read ? 'bg-accent/50 border-primary/20' : 'bg-background'
      }`}
      onClick={() => markAsRead(notification.id)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-1 rounded ${getPriorityColor(notification.priority)}`}>
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-sm">{notification.title}</h4>
            {!notification.read && (
              <div className="w-2 h-2 bg-primary rounded-full" />
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            {notification.message}
          </p>
          <p className="text-xs text-muted-foreground mt-2">
            {notification.timestamp}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs flex items-center justify-center"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Notifications</h3>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
          </div>

          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="transaction" className="text-xs">💰</TabsTrigger>
              <TabsTrigger value="security" className="text-xs">🛡️</TabsTrigger>
              <TabsTrigger value="wallet" className="text-xs">💳</TabsTrigger>
              <TabsTrigger value="system" className="text-xs">⚙️</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {notifications.map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="transaction">
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {filterNotifications('transaction').map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="security">
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {filterNotifications('security').map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="wallet">
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {filterNotifications('wallet').map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="system">
              <ScrollArea className="h-80">
                <div className="space-y-2">
                  {filterNotifications('system').map((notification) => (
                    <NotificationItem 
                      key={notification.id} 
                      notification={notification} 
                    />
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </PopoverContent>
    </Popover>
  );
};