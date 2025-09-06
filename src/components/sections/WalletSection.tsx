import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Wallet,
  ArrowUpDown,
  TrendingUp,
  History,
  Settings,
  CreditCard,
  Users
} from "lucide-react";
import { useEnhancedWallet } from "@/hooks/useEnhancedWallet";
import { WalletBalances } from "@/components/wallet/WalletBalances";
import { CurrencyConverter } from "@/components/wallet/CurrencyConverter";
import { TransactionHistory } from "@/components/wallet/TransactionHistory";
import { SubAccountManager } from "@/components/SubAccountManager";

export const WalletSection = () => {
  const { 
    walletCurrencies, 
    getTotalValueUSD, 
    loading 
  } = useEnhancedWallet();

  const totalValue = getTotalValueUSD();

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Multi-Currency Virtual Wallet</h1>
        <p className="text-muted-foreground">
          Professional-grade financial infrastructure with real-time conversion, live balances, and transaction processing
        </p>
      </div>

      {/* Portfolio Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Card className="sm:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
              <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
              Total Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl sm:text-3xl font-bold">
              ${loading ? '...' : totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="flex items-center mt-2 text-xs sm:text-sm text-green-600">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
              +8.3% (24h)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm">Active Currencies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold">{walletCurrencies.length}</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Multi-currency support</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-xs sm:text-sm">Live Processing</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl sm:text-2xl font-bold text-green-600">●</div>
            <div className="text-xs sm:text-sm text-muted-foreground">Real-time transactions</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Wallet Interface */}
      <Tabs defaultValue="balances" className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 h-auto">
          <TabsTrigger value="balances" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Balances</span>
            <span className="sm:hidden">Balance</span>
          </TabsTrigger>
          <TabsTrigger value="convert" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <ArrowUpDown className="w-3 h-3 sm:w-4 sm:h-4" />
            Convert
          </TabsTrigger>
          <TabsTrigger value="sub-accounts" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3 col-span-2 sm:col-span-1">
            <Users className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="hidden sm:inline">Sub-Accounts</span>
            <span className="sm:hidden">Accounts</span>
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <History className="w-3 h-3 sm:w-4 sm:h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm p-2 sm:p-3">
            <Settings className="w-3 h-3 sm:w-4 sm:h-4" />
            Settings
          </TabsTrigger>
        </TabsList>

        <TabsContent value="balances" className="space-y-6">
          <WalletBalances />
        </TabsContent>

        <TabsContent value="convert" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <CurrencyConverter />
            <Card>
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">Exchange Rates</CardTitle>
                <CardDescription className="text-sm">Live market rates updated every minute</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>USD/EUR</span>
                    <span className="font-mono">0.92</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>USD/GBP</span>
                    <span className="font-mono">0.80</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>BTC/USD</span>
                    <span className="font-mono">43,500.00</span>
                  </div>
                  <div className="flex justify-between text-xs sm:text-sm">
                    <span>ETH/USD</span>
                    <span className="font-mono">2,450.00</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sub-accounts" className="space-y-6">
          <SubAccountManager />
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <TransactionHistory />
        </TabsContent>

        <TabsContent value="settings" className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Wallet Settings</CardTitle>
                <CardDescription>Configure your wallet preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-convert small balances</p>
                    <p className="text-sm text-muted-foreground">Convert dust to USD automatically</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Real-time notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerts for all transactions</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Enhanced security</p>
                    <p className="text-sm text-muted-foreground">Two-factor authentication enabled</p>
                  </div>
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Security Status</CardTitle>
                <CardDescription>Your account security overview</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✓ Verified Account
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✓ 2FA Enabled
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    ✓ KYC Completed
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    ℹ Premium Tier
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};