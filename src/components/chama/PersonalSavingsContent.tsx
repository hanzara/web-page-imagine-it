import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { PiggyBank, Target, Plus, Loader2, TrendingUp } from 'lucide-react';
import { usePersonalSavings } from '@/hooks/usePersonalSavings';
import CurrencyDisplay from '@/components/CurrencyDisplay';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';

export const PersonalSavingsContent = () => {
  const { 
    walletData, 
    savingsGoals, 
    isLoading, 
    addSavings, 
    getSavingsBreakdown 
  } = usePersonalSavings();
  
  const [savingAmount, setSavingAmount] = useState('');
  const [savingFrequency, setSavingFrequency] = useState('one_time');
  const [savingGoal, setSavingGoal] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const savingsBreakdown = getSavingsBreakdown();

  const handleSave = async () => {
    if (!savingAmount || parseFloat(savingAmount) <= 0) {
      return;
    }

    try {
      setIsSaving(true);
      await addSavings(
        parseFloat(savingAmount),
        savingGoal || undefined,
        savingFrequency as 'daily' | 'weekly' | 'monthly' | 'one_time'
      );
      
      setSavingAmount('');
      setSavingGoal('');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="grid gap-6">
      {/* Stats Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Savings</p>
                <CurrencyDisplay amount={walletData.totalSavings} className="text-2xl font-bold" showToggle={false} />
              </div>
              <PiggyBank className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Goal</p>
                <CurrencyDisplay amount={walletData.monthlyTarget} className="text-2xl font-bold" showToggle={false} />
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Saving Streak</p>
                <p className="text-2xl font-bold">{walletData.currentStreak} days</p>
              </div>
              <TrendingUp className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add Savings & Goals */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Add to Savings
            </CardTitle>
            <CardDescription>Save money to reach your goals</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount to Save</Label>
              <Input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={savingAmount}
                onChange={(e) => setSavingAmount(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Frequency</Label>
              <div className="flex gap-2">
                <Button
                  variant={savingFrequency === 'one_time' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSavingFrequency('one_time')}
                >
                  One Time
                </Button>
                <Button
                  variant={savingFrequency === 'monthly' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSavingFrequency('monthly')}
                >
                  Monthly
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="goal">Goal (Optional)</Label>
              <Input
                id="goal"
                placeholder="e.g., Emergency Fund"
                value={savingGoal}
                onChange={(e) => setSavingGoal(e.target.value)}
              />
            </div>

            <Button onClick={handleSave} className="w-full" disabled={isSaving}>
              {isSaving ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <PiggyBank className="h-4 w-4 mr-2" />
              )}
              {isSaving ? 'Saving...' : 'Save Money'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Savings Goals</CardTitle>
            <CardDescription>Track your progress</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="h-48 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : savingsBreakdown.length > 0 ? (
              <>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={savingsBreakdown}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {savingsBreakdown.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 space-y-2">
                  {savingsBreakdown.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <CurrencyDisplay amount={item.value} className="text-sm font-medium" showToggle={false} />
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-48 flex flex-col items-center justify-center text-muted-foreground">
                <PiggyBank className="h-12 w-12 mb-2" />
                <p className="text-sm">No savings goals yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Savings Goals List */}
      {savingsGoals.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Your Savings Goals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {savingsGoals.map((goal) => (
              <div key={goal.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{goal.goal_name}</p>
                    <p className="text-sm text-muted-foreground">
                      <CurrencyDisplay amount={goal.current_amount} showToggle={false} /> of <CurrencyDisplay amount={goal.target_amount} showToggle={false} />
                    </p>
                  </div>
                  <span className="text-sm font-medium">{Math.round((goal.current_amount / goal.target_amount) * 100)}%</span>
                </div>
                <Progress value={(goal.current_amount / goal.target_amount) * 100} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};