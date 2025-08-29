import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { 
  Users, 
  Plus, 
  Wallet,
  Settings,
  Send,
  Eye,
  ArrowUpDown,
  DollarSign,
  UserPlus,
  Building2,
  Home,
  Baby
} from "lucide-react";
import { useSubAccounts } from "@/hooks/useSubAccounts";
import { useEnhancedWallet } from "@/hooks/useEnhancedWallet";

const SubAccountCard = ({ subAccount, balances, onTransfer, onUpdatePermissions, onDeactivate }: any) => {
  const [transferOpen, setTransferOpen] = useState(false);
  const [permissionsOpen, setPermissionsOpen] = useState(false);
  const [transferAmount, setTransferAmount] = useState("");
  const [transferCurrency, setTransferCurrency] = useState("USD");
  const [permissions, setPermissions] = useState(subAccount.permissions);

  const getSubAccountBalances = () => {
    return balances.filter((b: any) => b.sub_account_id === subAccount.id);
  };

  const getTotalValue = () => {
    const rates: { [key: string]: number } = { USD: 1, EUR: 1.1, GBP: 1.25, BTC: 45000, ETH: 2500 };
    return getSubAccountBalances().reduce((total: number, balance: any) => {
      const rate = rates[balance.currency_code] || 1;
      return total + (balance.balance * rate);
    }, 0);
  };

  const getTypeIcon = () => {
    switch (subAccount.sub_account_type) {
      case 'family': return <Home className="w-4 h-4" />;
      case 'business': return <Building2 className="w-4 h-4" />;
      case 'team': return <Users className="w-4 h-4" />;
      default: return <UserPlus className="w-4 h-4" />;
    }
  };

  const handleTransfer = async () => {
    try {
      await onTransfer(subAccount.id, transferCurrency, parseFloat(transferAmount));
      setTransferOpen(false);
      setTransferAmount("");
    } catch (error) {
      console.error('Transfer failed:', error);
    }
  };

  const handlePermissionsUpdate = async () => {
    try {
      await onUpdatePermissions(subAccount.id, permissions);
      setPermissionsOpen(false);
    } catch (error) {
      console.error('Permissions update failed:', error);
    }
  };

  return (
    <Card className="border-l-4 border-l-primary/50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
              {getTypeIcon()}
            </div>
            <div>
              <CardTitle className="text-lg">{subAccount.sub_account_name}</CardTitle>
              <CardDescription className="capitalize">
                {subAccount.sub_account_type} Account
                {subAccount.sub_user_email && ` • ${subAccount.sub_user_email}`}
              </CardDescription>
            </div>
          </div>
          <Badge variant="outline" className="bg-green-50 text-green-700">
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Balance Overview */}
        <div className="bg-muted/30 rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium flex items-center gap-2">
              <Wallet className="w-4 h-4" />
              Total Value
            </h4>
            <span className="text-xl font-bold">
              ${getTotalValue().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          
          {getSubAccountBalances().length > 0 ? (
            <div className="grid grid-cols-2 gap-2 text-sm">
              {getSubAccountBalances().map((balance: any) => (
                <div key={balance.id} className="flex justify-between">
                  <span className="text-muted-foreground">{balance.currency_code}:</span>
                  <span className="font-mono">{balance.balance.toLocaleString()}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No balances available</p>
          )}
        </div>

        {/* Permissions Overview */}
        <div className="flex flex-wrap gap-2">
          {permissions.view && <Badge variant="secondary"><Eye className="w-3 h-3 mr-1" />View</Badge>}
          {permissions.send && <Badge variant="secondary"><Send className="w-3 h-3 mr-1" />Send</Badge>}
          {permissions.receive && <Badge variant="secondary"><DollarSign className="w-3 h-3 mr-1" />Receive</Badge>}
          {permissions.convert && <Badge variant="secondary"><ArrowUpDown className="w-3 h-3 mr-1" />Convert</Badge>}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Dialog open={transferOpen} onOpenChange={setTransferOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Transfer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Transfer to {subAccount.sub_account_name}</DialogTitle>
                <DialogDescription>
                  Transfer funds from your main wallet to this sub-account
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="amount">Amount</Label>
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={transferAmount}
                    onChange={(e) => setTransferAmount(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={transferCurrency} onValueChange={setTransferCurrency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {subAccount.allowed_currencies.map((currency: string) => (
                        <SelectItem key={currency} value={currency}>{currency}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={handleTransfer} className="w-full">
                  Transfer Funds
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={permissionsOpen} onOpenChange={setPermissionsOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex-1">
                <Settings className="w-4 h-4 mr-2" />
                Permissions
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Manage Permissions</DialogTitle>
                <DialogDescription>
                  Control what actions this sub-account can perform
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>View Balances</Label>
                    <p className="text-sm text-muted-foreground">Allow viewing of account balances</p>
                  </div>
                  <Switch
                    checked={permissions.view}
                    onCheckedChange={(checked) => setPermissions({...permissions, view: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Send Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow sending money to others</p>
                  </div>
                  <Switch
                    checked={permissions.send}
                    onCheckedChange={(checked) => setPermissions({...permissions, send: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Receive Payments</Label>
                    <p className="text-sm text-muted-foreground">Allow receiving money from others</p>
                  </div>
                  <Switch
                    checked={permissions.receive}
                    onCheckedChange={(checked) => setPermissions({...permissions, receive: checked})}
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Currency Conversion</Label>
                    <p className="text-sm text-muted-foreground">Allow converting between currencies</p>
                  </div>
                  <Switch
                    checked={permissions.convert}
                    onCheckedChange={(checked) => setPermissions({...permissions, convert: checked})}
                  />
                </div>
                <Button onClick={handlePermissionsUpdate} className="w-full">
                  Update Permissions
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Button variant="destructive" size="sm" onClick={() => onDeactivate(subAccount.id)}>
            Deactivate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export const SubAccountManager = () => {
  const [createOpen, setCreateOpen] = useState(false);
  const [newAccountName, setNewAccountName] = useState("");
  const [newAccountType, setNewAccountType] = useState("personal");
  const [newAccountEmail, setNewAccountEmail] = useState("");
  const [newAccountCurrencies, setNewAccountCurrencies] = useState(["USD"]);

  const { 
    subAccounts, 
    subAccountBalances, 
    getTotalSubAccountsValueUSD,
    loading,
    createSubAccount,
    transferToSubAccount,
    updateSubAccountPermissions,
    deactivateSubAccount
  } = useSubAccounts();

  const { walletCurrencies } = useEnhancedWallet();

  const handleCreateSubAccount = async () => {
    try {
      await createSubAccount(
        newAccountName,
        newAccountType,
        newAccountEmail || undefined,
        undefined,
        newAccountCurrencies
      );
      setCreateOpen(false);
      setNewAccountName("");
      setNewAccountType("personal");
      setNewAccountEmail("");
      setNewAccountCurrencies(["USD"]);
    } catch (error) {
      console.error('Create sub-account failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-32 bg-muted/30 rounded-lg animate-pulse"></div>
        <div className="h-64 bg-muted/30 rounded-lg animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Users className="w-4 h-4" />
              Total Sub-Accounts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subAccounts.length}</div>
            <div className="text-sm text-muted-foreground">Active accounts</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Wallet className="w-4 h-4" />
              Sub-Accounts Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${getTotalSubAccountsValueUSD().toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">USD equivalent</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <DollarSign className="w-4 h-4" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${walletCurrencies.reduce((total, currency) => {
                const rates: { [key: string]: number } = { USD: 1, EUR: 1.1, GBP: 1.25, BTC: 45000, ETH: 2500 };
                return total + (currency.balance * (rates[currency.currency_code] || 1));
              }, 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <div className="text-sm text-muted-foreground">Main wallet</div>
          </CardContent>
        </Card>
      </div>

      {/* Create New Sub-Account */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Sub-Account Management
          </CardTitle>
          <CardDescription>
            Create and manage sub-accounts for family, business, or team use
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={createOpen} onOpenChange={setCreateOpen}>
            <DialogTrigger asChild>
              <Button className="w-full md:w-auto">
                <Plus className="w-4 h-4 mr-2" />
                Create Sub-Account
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Sub-Account</DialogTitle>
                <DialogDescription>
                  Set up a new sub-account with custom permissions and currency access
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Account Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g., Kids Allowance, Business Expenses"
                    value={newAccountName}
                    onChange={(e) => setNewAccountName(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="type">Account Type</Label>
                  <Select value={newAccountType} onValueChange={setNewAccountType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="family">Family</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="team">Team</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="email">User Email (Optional)</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="user@example.com"
                    value={newAccountEmail}
                    onChange={(e) => setNewAccountEmail(e.target.value)}
                  />
                </div>
                <Button onClick={handleCreateSubAccount} className="w-full" disabled={!newAccountName}>
                  Create Sub-Account
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Sub-Accounts List */}
      <div className="space-y-4">
        {subAccounts.length > 0 ? (
          subAccounts.map((subAccount) => (
            <SubAccountCard
              key={subAccount.id}
              subAccount={subAccount}
              balances={subAccountBalances}
              onTransfer={transferToSubAccount}
              onUpdatePermissions={updateSubAccountPermissions}
              onDeactivate={deactivateSubAccount}
            />
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No Sub-Accounts Yet</h3>
              <p className="text-muted-foreground mb-4">
                Create your first sub-account to start managing multi-user wallets
              </p>
              <Button onClick={() => setCreateOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create First Sub-Account
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};