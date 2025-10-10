import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Users, DollarSign, Calendar, Search, TrendingUp } from 'lucide-react';
import { useChamas } from '@/hooks/useChamas';
import { CreateChamaModal } from '@/components/chama/CreateChamaModal';
import Navigation from '@/components/Navigation';

const ChamasPage: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { data: chamas, isLoading } = useChamas();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              My Chamas
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage your group savings and investment clubs
            </p>
          </div>
          
          <Button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Chama
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading your chamas...</p>
          </div>
        ) : chamas && chamas.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {chamas.map((chama: any) => (
              <Card key={chama.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{chama.name}</CardTitle>
                      <CardDescription>{chama.description}</CardDescription>
                    </div>
                    <Badge variant={chama.status === 'active' ? 'default' : 'secondary'}>
                      {chama.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Members
                      </span>
                      <span className="font-medium">{chama.current_members}/{chama.max_members}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        Total Savings
                      </span>
                      <span className="font-medium">KES {chama.total_savings?.toLocaleString() || 0}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        Contribution
                      </span>
                      <span className="font-medium">KES {chama.contribution_amount} / {chama.contribution_frequency}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Your Role</span>
                      <Badge variant="outline">{chama.userRole}</Badge>
                    </div>
                  </div>
                  <Button 
                    className="w-full mt-4"
                    onClick={() => window.location.href = `/chama/${chama.id}`}
                  >
                    View Chama
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Chamas Yet</h3>
            <p className="text-muted-foreground mb-6">
              Start your financial journey by creating your first chama.
            </p>
            <Button 
              onClick={() => setShowCreateModal(true)}
              className="bg-gradient-to-r from-primary to-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Chama
            </Button>
          </div>
        )}
      </div>

      <CreateChamaModal 
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />
    </div>
  );
};

export default ChamasPage;