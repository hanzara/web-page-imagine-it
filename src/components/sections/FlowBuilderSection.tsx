import { useState, useCallback, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ReactFlow,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  Controls,
  MiniMap,
  Connection,
  Edge,
  Node,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { 
  Workflow, 
  Play, 
  Pause, 
  Edit, 
  Copy, 
  Trash2, 
  Plus, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Users,
  Settings,
  Zap,
  RefreshCw,
  GitBranch,
  Timer,
  Save,
  Download,
  Upload,
  Eye,
  BarChart3,
  Database,
  Mail,
  Smartphone,
  CreditCard,
  Filter,
  ArrowRight,
  Code,
  TestTube
} from "lucide-react";

const workflowTemplates = [
  {
    id: "retry-failed",
    name: "Smart Payment Retry",
    description: "Automatically retry failed payments through alternative APIs",
    category: "Payment Recovery",
    uses: 2847,
    steps: 4,
    icon: RefreshCw,
    complexity: "Simple"
  },
  {
    id: "split-payout",
    name: "Multi-Destination Payout",
    description: "Split payments across multiple recipients and currencies",
    category: "Treasury",
    uses: 1205,
    steps: 6,
    icon: GitBranch,
    complexity: "Medium"
  },
  {
    id: "crypto-fiat",
    name: "Crypto to Fiat Bridge",
    description: "Convert crypto payments to fiat and distribute to team",
    category: "Currency Exchange",
    uses: 892,
    steps: 8,
    complexity: "Advanced"
  },
  {
    id: "subscription-dunning",
    name: "Subscription Dunning",
    description: "Handle failed subscription payments with escalating retry logic",
    category: "Subscriptions",
    uses: 643,
    steps: 5,
    complexity: "Medium"
  }
];

const activeFlows = [
  {
    id: "flow-1",
    name: "Failed Payment Recovery",
    status: "active",
    lastRun: "2 mins ago",
    success: 94,
    executions: 127,
    team: ["JD", "SM", "AK"],
    trigger: "Payment Failed"
  },
  {
    id: "flow-2", 
    name: "Weekly Team Payout",
    status: "scheduled",
    lastRun: "6 hours ago",
    success: 100,
    executions: 24,
    team: ["JD", "LC"],
    trigger: "Every Friday 9:00 AM"
  },
  {
    id: "flow-3",
    name: "Crypto Conversion Alert",
    status: "paused",
    lastRun: "2 days ago", 
    success: 87,
    executions: 56,
    team: ["SM"],
    trigger: "BTC > $45,000"
  }
];

// Custom Node Types
const TriggerNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-red-500/10 border-red-500/20 border-2 rounded-lg p-3 min-w-32">
      <div className="flex items-center gap-2 mb-2">
        <AlertCircle className="w-4 h-4 text-red-500" />
        <span className="font-medium text-red-700 dark:text-red-400">Trigger</span>
      </div>
      <div className="text-sm">{data.label}</div>
      <div className="absolute w-3 h-3 bg-red-500 rounded-full -right-1.5 top-1/2 transform -translate-y-1/2"></div>
    </div>
  );
};

const ConditionNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-blue-500/10 border-blue-500/20 border-2 rounded-lg p-3 min-w-32">
      <div className="flex items-center gap-2 mb-2">
        <CheckCircle className="w-4 h-4 text-blue-500" />
        <span className="font-medium text-blue-700 dark:text-blue-400">Condition</span>
      </div>
      <div className="text-sm">{data.label}</div>
      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -left-1.5 top-1/2 transform -translate-y-1/2"></div>
      <div className="absolute w-3 h-3 bg-blue-500 rounded-full -right-1.5 top-1/2 transform -translate-y-1/2"></div>
    </div>
  );
};

const ActionNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-green-500/10 border-green-500/20 border-2 rounded-lg p-3 min-w-32">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-4 h-4 text-green-500" />
        <span className="font-medium text-green-700 dark:text-green-400">Action</span>
      </div>
      <div className="text-sm">{data.label}</div>
      <div className="absolute w-3 h-3 bg-green-500 rounded-full -left-1.5 top-1/2 transform -translate-y-1/2"></div>
      <div className="absolute w-3 h-3 bg-green-500 rounded-full -right-1.5 top-1/2 transform -translate-y-1/2"></div>
    </div>
  );
};

const DelayNode = ({ data }: { data: any }) => {
  return (
    <div className="bg-orange-500/10 border-orange-500/20 border-2 rounded-lg p-3 min-w-32">
      <div className="flex items-center gap-2 mb-2">
        <Timer className="w-4 h-4 text-orange-500" />
        <span className="font-medium text-orange-700 dark:text-orange-400">Delay</span>
      </div>
      <div className="text-sm">{data.label}</div>
      <div className="absolute w-3 h-3 bg-orange-500 rounded-full -left-1.5 top-1/2 transform -translate-y-1/2"></div>
      <div className="absolute w-3 h-3 bg-orange-500 rounded-full -right-1.5 top-1/2 transform -translate-y-1/2"></div>
    </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  delay: DelayNode,
};

const flowBlocks = [
  { type: "trigger", name: "Payment Failed", icon: AlertCircle, color: "red", description: "Triggers when a payment fails" },
  { type: "trigger", name: "New User", icon: Users, color: "red", description: "Triggers when a new user signs up" },
  { type: "trigger", name: "Transaction Complete", icon: CreditCard, color: "red", description: "Triggers on successful transaction" },
  { type: "condition", name: "Check Amount", icon: CheckCircle, color: "blue", description: "Validates transaction amount" },
  { type: "condition", name: "User Location", icon: Database, color: "blue", description: "Checks user's geographic location" },
  { type: "condition", name: "Time of Day", icon: Clock, color: "blue", description: "Evaluates current time" },
  { type: "action", name: "Retry Payment", icon: RefreshCw, color: "green", description: "Attempts payment retry" },
  { type: "action", name: "Send Email", icon: Mail, color: "green", description: "Sends notification email" },
  { type: "action", name: "Send SMS", icon: Smartphone, color: "green", description: "Sends SMS notification" },
  { type: "action", name: "Update Database", icon: Database, color: "green", description: "Updates database record" },
  { type: "delay", name: "Wait 2 minutes", icon: Timer, color: "orange", description: "Pauses execution for 2 minutes" },
  { type: "delay", name: "Wait 1 hour", icon: Timer, color: "orange", description: "Pauses execution for 1 hour" },
];

export function FlowBuilderSection() {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [showBuilder, setShowBuilder] = useState(false);
  const [flowName, setFlowName] = useState("");
  const [flowDescription, setFlowDescription] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  
  // React Flow state
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [reactFlowInstance, setReactFlowInstance] = useState<any>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'paused': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'scheduled': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'bg-green-500/20 text-green-400';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'Advanced': return 'bg-red-500/20 text-red-400';
      default: return 'bg-gray-500/20 text-gray-400';
    }
  };

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect();
      const blockData = event.dataTransfer.getData('application/reactflow');

      if (typeof blockData === 'undefined' || !blockData || !reactFlowBounds) {
        return;
      }

      const { type, name } = JSON.parse(blockData);
      const position = reactFlowInstance?.project({
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      });

      const newNode: Node = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: { label: name },
      };

      setNodes((nds) => nds.concat(newNode));
      toast.success(`Added ${name} to workflow`);
    },
    [reactFlowInstance, setNodes]
  );

  const onDragStart = (event: React.DragEvent, blockType: string, blockName: string) => {
    event.dataTransfer.setData('application/reactflow', JSON.stringify({ type: blockType, name: blockName }));
    event.dataTransfer.effectAllowed = 'move';
  };

  const loadTemplate = (templateId: string) => {
    const template = workflowTemplates.find(t => t.id === templateId);
    if (!template) return;

    // Load predefined template nodes and edges
    let templateNodes: Node[] = [];
    let templateEdges: Edge[] = [];

    switch (templateId) {
      case "retry-failed":
        templateNodes = [
          { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Payment Failed' } },
          { id: '2', type: 'condition', position: { x: 300, y: 100 }, data: { label: 'Check Amount > $10' } },
          { id: '3', type: 'action', position: { x: 500, y: 50 }, data: { label: 'Retry via PayPal' } },
          { id: '4', type: 'action', position: { x: 500, y: 150 }, data: { label: 'Send Alert Email' } },
        ];
        templateEdges = [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e2-3', source: '2', target: '3', label: 'Yes' },
          { id: 'e2-4', source: '2', target: '4', label: 'No' },
        ];
        break;
      case "split-payout":
        templateNodes = [
          { id: '1', type: 'trigger', position: { x: 100, y: 100 }, data: { label: 'Payment Received' } },
          { id: '2', type: 'action', position: { x: 300, y: 50 }, data: { label: 'Split 70% to Savings' } },
          { id: '3', type: 'action', position: { x: 300, y: 150 }, data: { label: 'Split 30% to Team' } },
        ];
        templateEdges = [
          { id: 'e1-2', source: '1', target: '2' },
          { id: 'e1-3', source: '1', target: '3' },
        ];
        break;
    }

    setNodes(templateNodes);
    setEdges(templateEdges);
    setFlowName(template.name);
    setFlowDescription(template.description);
    setShowBuilder(true);
    toast.success(`Loaded ${template.name} template`);
  };

  const saveFlow = () => {
    if (!flowName.trim()) {
      toast.error("Please enter a flow name");
      return;
    }
    
    const flowData = {
      name: flowName,
      description: flowDescription,
      nodes,
      edges,
      created: new Date().toISOString(),
    };
    
    // Here you would save to your backend
    console.log('Saving flow:', flowData);
    toast.success("Workflow saved successfully!");
    setShowBuilder(false);
  };

  const executeFlow = async () => {
    if (nodes.length === 0) {
      toast.error("No workflow to execute");
      return;
    }

    setIsExecuting(true);
    toast.info("Executing workflow...");

    // Simulate workflow execution
    try {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.info(`Executing: ${node.data.label}`);
      }
      toast.success("Workflow executed successfully!");
    } catch (error) {
      toast.error("Workflow execution failed");
    } finally {
      setIsExecuting(false);
    }
  };

  const clearCanvas = () => {
    setNodes([]);
    setEdges([]);
    toast.info("Canvas cleared");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center shadow-glow">
            <Workflow className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-text bg-clip-text text-transparent">
              FlowBuilder Studio
            </h1>
            <p className="text-muted-foreground">Workflow Automation</p>
          </div>
        </div>
        
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Create powerful payment workflows with drag-and-drop simplicity. 
          Automate complex financial processes without writing code.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Dialog open={showBuilder} onOpenChange={setShowBuilder}>
          <DialogTrigger asChild>
            <Button size="lg" className="flex-1 sm:flex-none">
              <Plus className="w-5 h-5 mr-2" />
              Create New Flow
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Visual Flow Builder</DialogTitle>
              <DialogDescription>
                Drag and drop blocks to create your workflow
              </DialogDescription>
            </DialogHeader>
            
            {/* Advanced Flow Builder Interface */}
            <div className="space-y-4">
              {/* Flow Configuration */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Flow Name</Label>
                  <Input
                    value={flowName}
                    onChange={(e) => setFlowName(e.target.value)}
                    placeholder="Enter workflow name"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={flowDescription}
                    onChange={(e) => setFlowDescription(e.target.value)}
                    placeholder="Describe your workflow"
                  />
                </div>
              </div>

              {/* Visual Flow Builder */}
              <div className="grid grid-cols-5 gap-4 h-[500px]">
                {/* Blocks Palette */}
                <div className="col-span-1 bg-gradient-card rounded-lg p-4 shadow-card">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Code className="w-4 h-4" />
                    Building Blocks
                  </h3>
                  <div className="space-y-2 max-h-[400px] overflow-y-auto">
                    {flowBlocks.map((block) => (
                      <div 
                        key={`${block.type}-${block.name}`}
                        className="p-3 bg-card/50 rounded-lg cursor-move hover:bg-accent/50 transition-colors border border-border/50"
                        draggable
                        onDragStart={(event) => onDragStart(event, block.type, block.name)}
                      >
                        <div className="flex items-center space-x-2 mb-1">
                          <block.icon className={`w-4 h-4 text-${block.color}-500`} />
                          <span className="text-sm font-medium">{block.name}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{block.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Canvas */}
                <div className="col-span-4 bg-gradient-card rounded-lg border border-border shadow-card" ref={reactFlowWrapper}>
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    onNodesChange={onNodesChange}
                    onEdgesChange={onEdgesChange}
                    onConnect={onConnect}
                    onInit={setReactFlowInstance}
                    onDrop={onDrop}
                    onDragOver={onDragOver}
                    nodeTypes={nodeTypes}
                    fitView
                    attributionPosition="bottom-left"
                  >
                    <Controls />
                    <MiniMap />
                    <Background gap={12} size={1} />
                  </ReactFlow>
                </div>
              </div>

              {/* Flow Actions */}
              <div className="flex flex-wrap gap-3">
                <Button onClick={saveFlow} disabled={!flowName.trim()}>
                  <Save className="w-4 h-4 mr-2" />
                  Save Flow
                </Button>
                <Button 
                  variant="outline" 
                  onClick={executeFlow} 
                  disabled={nodes.length === 0 || isExecuting}
                >
                  {isExecuting ? (
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Play className="w-4 h-4 mr-2" />
                  )}
                  {isExecuting ? "Executing..." : "Test Flow"}
                </Button>
                <Button variant="outline" onClick={clearCanvas}>
                  <Trash2 className="w-4 h-4 mr-2" />
                  Clear
                </Button>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button variant="outline">
                  <Upload className="w-4 h-4 mr-2" />
                  Import
                </Button>
              </div>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBuilder(false)}>
                Cancel
              </Button>
              <Button>Save Flow</Button>
            </div>
          </DialogContent>
        </Dialog>
        
        <Button variant="outline" size="lg">
          <Copy className="w-5 h-5 mr-2" />
          Import Template
        </Button>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="active">Active Flows</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-6">
          {/* Active Workflows */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeFlows.map((flow) => (
              <Card key={flow.id} className="bg-gradient-card shadow-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg">{flow.name}</CardTitle>
                      <CardDescription>Trigger: {flow.trigger}</CardDescription>
                    </div>
                    <Badge variant="outline" className={getStatusColor(flow.status)}>
                      {flow.status}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Metrics */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Success Rate</div>
                      <div className="font-bold text-lg">{flow.success}%</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Executions</div>
                      <div className="font-bold text-lg">{flow.executions}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Last Run</div>
                      <div className="font-medium">{flow.lastRun}</div>
                    </div>
                  </div>

                  {/* Team */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Team</span>
                    </div>
                    <div className="flex -space-x-2">
                      {flow.team.map((member, index) => (
                        <Avatar key={index} className="w-8 h-8 border-2 border-background">
                          <AvatarFallback className="text-xs">{member}</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button size="sm" variant="outline">
                      {flow.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                    <Button size="sm" variant="outline">
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Template Gallery */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {workflowTemplates.map((template) => (
              <Card key={template.id} className="bg-gradient-card shadow-card hover:shadow-lg transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
                        <template.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <CardDescription>{template.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="outline" className={getComplexityColor(template.complexity)}>
                      {template.complexity}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Template Stats */}
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground">Category</div>
                      <div className="font-medium">{template.category}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Steps</div>
                      <div className="font-medium">{template.steps}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground">Uses</div>
                      <div className="font-medium">{template.uses.toLocaleString()}</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => loadTemplate(template.id)}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        loadTemplate(template.id);
                        toast.info(`Previewing ${template.name} template`);
                      }}
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Preview
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Analytics Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Active Flows</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">+3 this week</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Executions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Success Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">96.8%</div>
                <p className="text-xs text-muted-foreground">+2.1% improvement</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-card shadow-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Time Saved</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">127</div>
                <p className="text-xs text-muted-foreground">hours this month</p>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card className="bg-gradient-card shadow-card">
            <CardHeader>
              <CardTitle>Recent Flow Activity</CardTitle>
              <CardDescription>Latest workflow executions and results</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { flow: "Failed Payment Recovery", status: "success", time: "2 mins ago", result: "Payment recovered via PayPal" },
                  { flow: "Weekly Team Payout", status: "success", time: "1 hour ago", result: "5 payments sent successfully" },
                  { flow: "Crypto Conversion Alert", status: "warning", time: "3 hours ago", result: "Conversion rate threshold not met" },
                  { flow: "Subscription Dunning", status: "success", time: "6 hours ago", result: "3 of 4 retry attempts successful" }
                ].map((activity, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className={`w-2 h-2 rounded-full ${
                        activity.status === 'success' ? 'bg-green-400' : 'bg-yellow-400'
                      }`} />
                      <div>
                        <div className="font-medium">{activity.flow}</div>
                        <div className="text-sm text-muted-foreground">{activity.result}</div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}