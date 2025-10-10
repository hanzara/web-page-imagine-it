import React, { useState } from 'react';
import { Search, Filter, Calendar, DollarSign, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useChamaLoans } from '@/hooks/useChamaLoans';
import LoanRequestModal from './LoanRequestModal';
import { useToast } from '@/hooks/use-toast';

interface ChamaLoansTabProps {
  chamaId: string;
  userRole?: string;
  isAdmin?: boolean;
}

export const ChamaLoansTab: React.FC<ChamaLoansTabProps> = ({ 
  chamaId, 
  userRole = 'member',
  isAdmin = false 
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [showLoanModal, setShowLoanModal] = useState(false);
  
  const { 
    loans, 
    isLoading, 
    applyForLoan, 
    isApplying, 
    approveLoan, 
    isApproving, 
    rejectLoan, 
    isRejecting 
  } = useChamaLoans(chamaId);

  const { toast } = useToast();

  const filteredLoans = loans?.filter(loan => {
    const matchesSearch = !searchQuery || 
      loan.purpose?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = selectedStatus === 'all' || loan.status === selectedStatus;
    return matchesSearch && matchesStatus;
  }) || [];

  const handleApproveLoan = async (loanId: string) => {
    try {
      await approveLoan({ loanId });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to approve loan",
        variant: "destructive"
      });
    }
  };

  const handleRejectLoan = async (loanId: string) => {
    try {
      await rejectLoan({ loanId, reason: "Rejected by admin" });
    } catch (error: any) {
      toast({
        title: "Error", 
        description: error.message || "Failed to reject loan",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      pending: "outline",
      approved: "default",
      rejected: "destructive",
      active: "secondary",
      completed: "default",
      defaulted: "destructive"
    };

    return (
      <Badge variant={variants[status] || "outline"}>
        {status?.charAt(0).toUpperCase() + status?.slice(1)}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES'
    }).format(amount);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-foreground">Loans</h3>
          <p className="text-sm text-muted-foreground">
            Manage group loans and applications
          </p>
        </div>
        <Button onClick={() => setShowLoanModal(true)}>
          Request Loan
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search loans..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-[180px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="defaulted">Defaulted</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Loans List */}
      <div className="space-y-4">
        {filteredLoans.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium text-foreground mb-2">No loans found</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {searchQuery ? 'No loans match your search criteria.' : 'No loan applications yet.'}
              </p>
              <Button onClick={() => setShowLoanModal(true)}>
                Request Your First Loan
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredLoans.map((loan) => (
            <Card key={loan.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h4 className="font-medium text-foreground">
                        {formatCurrency(loan.amount)} Loan Request
                      </h4>
                      {getStatusBadge(loan.status)}
                    </div>

                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-3 w-3" />
                        <span>Requested by: Member</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Applied: {new Date(loan.created_at).toLocaleDateString()}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Duration: {loan.duration_months} months</span>
                      </div>

                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-3 w-3" />
                        <span>Interest Rate: {loan.interest_rate}%</span>
                      </div>
                    </div>

                    {loan.approved_at && (
                      <div className="mt-3 text-xs text-muted-foreground">
                        Approved on {new Date(loan.approved_at).toLocaleDateString()}
                      </div>
                    )}
                  </div>

                  {/* Admin Actions */}
                  {isAdmin && loan.status === 'pending' && (
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleApproveLoan(loan.id)}
                        disabled={isApproving}
                        className="text-green-600 border-green-200 hover:bg-green-50"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRejectLoan(loan.id)}
                        disabled={isRejecting}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredLoans.length > 0 && filteredLoans.length % 10 === 0 && (
        <div className="text-center">
          <Button variant="outline">
            Load More Loans
          </Button>
        </div>
      )}

      {/* Loan Request Modal */}
      <LoanRequestModal
        isOpen={showLoanModal}
        onClose={() => setShowLoanModal(false)}
        chamaId={chamaId}
        chamaData={{ name: "Chama" }}
      />
    </div>
  );
};