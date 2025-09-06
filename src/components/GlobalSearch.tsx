import { useState } from "react";
import { Search, Filter, Clock, DollarSign, User, CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SearchResult {
  id: string;
  type: 'transaction' | 'wallet' | 'recipient' | 'card';
  title: string;
  subtitle: string;
  metadata?: string;
}

export const GlobalSearch = () => {
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  // Mock search results
  const searchResults: SearchResult[] = [
    {
      id: "tx-001",
      type: "transaction",
      title: "Payment to John Doe",
      subtitle: "$1,250.00 USD",
      metadata: "2 hours ago"
    },
    {
      id: "tx-002", 
      type: "transaction",
      title: "Stripe Payment",
      subtitle: "$890.50 USD",
      metadata: "5 hours ago"
    },
    {
      id: "wallet-usd",
      type: "wallet",
      title: "USD Wallet",
      subtitle: "$5,000.00 available",
      metadata: "Primary wallet"
    },
    {
      id: "recipient-001",
      type: "recipient",
      title: "Sarah Wilson",
      subtitle: "sarah@example.com",
      metadata: "Frequent recipient"
    },
    {
      id: "card-001",
      type: "card",
      title: "Virtual Card ****1234",
      subtitle: "Active • $2,000 limit",
      metadata: "Expires 12/25"
    }
  ];

  const filteredResults = searchResults.filter(result =>
    result.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    result.subtitle.toLowerCase().includes(searchValue.toLowerCase())
  );

  const getIcon = (type: string) => {
    switch (type) {
      case 'transaction':
        return <DollarSign className="h-4 w-4" />;
      case 'wallet':
        return <DollarSign className="h-4 w-4" />;
      case 'recipient':
        return <User className="h-4 w-4" />;
      case 'card':
        return <CreditCard className="h-4 w-4" />;
      default:
        return <Search className="h-4 w-4" />;
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className="w-64 justify-start text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <Search className="mr-2 h-4 w-4" />
        Search transactions, wallets...
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput 
          placeholder="Search transactions, wallets, recipients..." 
          value={searchValue}
          onValueChange={setSearchValue}
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          {filteredResults.length > 0 && (
            <CommandGroup heading="Results">
              {filteredResults.map((result) => (
                <CommandItem key={result.id} className="flex items-center gap-3">
                  {getIcon(result.type)}
                  <div className="flex-1">
                    <div className="font-medium">{result.title}</div>
                    <div className="text-sm text-muted-foreground">{result.subtitle}</div>
                  </div>
                  {result.metadata && (
                    <div className="text-xs text-muted-foreground">
                      {result.metadata}
                    </div>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          <CommandSeparator />
          
          <CommandGroup heading="Quick Actions">
            <CommandItem>
              <DollarSign className="mr-2 h-4 w-4" />
              Send Payment
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              Create Virtual Card
            </CommandItem>
            <CommandItem>
              <Filter className="mr-2 h-4 w-4" />
              Advanced Filters
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};