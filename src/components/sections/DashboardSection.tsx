import { WalletOverview } from "@/components/WalletOverview";
import { InteractiveChart } from "@/components/InteractiveChart";
import { PaymentChannelCard } from "@/components/PaymentChannelCard";
import { TransactionTable } from "@/components/TransactionTable";
import { GlobalSearch } from "@/components/GlobalSearch";
import { NotificationCenter } from "@/components/NotificationCenter";
import { RecentActivityPanel } from "@/components/RecentActivityPanel";
import { Card, CardContent } from "@/components/ui/card";
import { useWallet } from "@/hooks/useWallet";

export const DashboardSection = () => {
  const { wallets, transactions: walletTransactions, getTotalValue } = useWallet();

  // Convert wallet data for WalletOverview component
  const walletData = {
    totalUsdValue: `$${getTotalValue().toLocaleString()}`,
    currencies: wallets.map(wallet => {
      const rates: { [key: string]: number } = { USD: 1, EUR: 1.1, GBP: 1.25, BTC: 45000, ETH: 2500 };
      const usdValue = wallet.balance * (rates[wallet.currency] || 1);
      return {
        code: wallet.currency,
        amount: wallet.balance.toLocaleString(),
        usdValue: `$${usdValue.toLocaleString()}`,
        change24h: `+$${Math.floor(Math.random() * 100)}`,
        changePercentage: (Math.random() - 0.5) * 10
      };
    })
  };

  const analyticsMetrics = [
    { label: "Success Rate", value: "98.5%", change: "+0.2%", changeType: "positive" as const },
    { label: "Avg Processing", value: "2.3s", change: "-0.1s", changeType: "positive" as const },
    { label: "Total Volume", value: "$89.2K", change: "+12.5%", changeType: "positive" as const },
    { label: "Active APIs", value: "8/12", change: "+2", changeType: "positive" as const }
  ];

  const paymentChannels = [
    {
      provider: "Stripe",
      type: "inbound" as const,
      status: "active" as const,
      balance: "$12,450.00",
      volume24h: "$25,300",
      fees: "2.9%",
      apiStatus: "connected" as const,
      color: "hsl(229, 84%, 50%)"
    },
    {
      provider: "PayPal",
      type: "inbound" as const,
      status: "active" as const,
      balance: "$8,920.00",
      volume24h: "$15,600",
      fees: "3.5%",
      apiStatus: "connected" as const,
      color: "hsl(217, 91%, 60%)"
    },
    {
      provider: "Crypto.com",
      type: "inbound" as const,
      status: "active" as const,
      balance: "0.24 BTC",
      volume24h: "$12,900",
      fees: "0.5%",
      apiStatus: "connected" as const,
      color: "hsl(45, 93%, 47%)"
    }
  ];

  // Convert real transactions for the table or use mock data
  const tableTransactions = walletTransactions.length > 0 
    ? walletTransactions.slice(0, 5).map(tx => ({
        id: tx.id.slice(0, 8),
        type: tx.type as "inbound" | "outbound",
        provider: "Unknown",
        amount: tx.amount.toString(),
        currency: tx.currency || 'USD',
        status: tx.status as "completed" | "processing" | "failed",
        timestamp: new Date(tx.created_at).toLocaleString(),
        fees: "$0.00",
        txHash: tx.id.slice(0, 16)
      }))
    : [
        {
          id: "TXN001",
          type: "inbound" as const,
          provider: "stripe",
          amount: "1,250.00",
          currency: "USD",
          status: "completed" as const,
          timestamp: "2 minutes ago",
          fees: "$36.25",
          txHash: "0x1234...5678"
        },
        {
          id: "TXN002",
          type: "outbound" as const,
          provider: "wise",
          amount: "850.00",
          currency: "EUR",
          status: "processing" as const,
          timestamp: "15 minutes ago",
          fees: "$6.80"
        },
        {
          id: "TXN003",
          type: "inbound" as const,
          provider: "paypal",
          amount: "2,100.00",
          currency: "USD",
          status: "completed" as const,
          timestamp: "1 hour ago",
          fees: "$73.50"
        }
      ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Search Bar */}
      <div className="mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2">Universal Pay Dashboard</h1>
            <p className="text-muted-foreground">
              Monitor your universal payment platform with real-time analytics and performance data
            </p>
          </div>
          <div className="flex items-center gap-4">
            <GlobalSearch />
            <NotificationCenter />
          </div>
        </div>
      </div>

      {/* Top Row - Wallet Overview & Analytics */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        <WalletOverview {...walletData} />
        <InteractiveChart 
          title="Performance Metrics"
          subtitle="Real-time platform analytics"
          metrics={analyticsMetrics}
          chartType="line"
        />
      </div>

      {/* Market Insights & Currency Rates */}
      <div>
        <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Market Insights & Exchange Rates</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">USD/EUR</p>
                  <p className="text-lg font-semibold">1.0825</p>
                </div>
                <div className="text-green-600 text-sm">+0.32%</div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">USD/GBP</p>
                  <p className="text-lg font-semibold">0.7945</p>
                </div>
                <div className="text-red-600 text-sm">-0.18%</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">BTC/USD</p>
                  <p className="text-lg font-semibold">$43,750</p>
                </div>
                <div className="text-green-600 text-sm">+2.45%</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ETH/USD</p>
                  <p className="text-lg font-semibold">$2,485</p>
                </div>
                <div className="text-green-600 text-sm">+1.87%</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Activity Panel */}
      <RecentActivityPanel />

      {/* Transactions Table */}
      <TransactionTable transactions={tableTransactions} />
    </div>
  );
};