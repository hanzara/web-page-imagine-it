import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Building, 
  Users, 
  Landmark, 
  Globe, 
  ShoppingCart, 
  UserCircle, 
  Heart,
  CheckCircle
} from "lucide-react";

export interface CustomerSegment {
  id: string;
  name: string;
  icon: any;
  color: string;
  description: string;
  painPoints: string[];
  primaryFeatures: string[];
}

export const customerSegments: CustomerSegment[] = [
  {
    id: "government",
    name: "Government",
    icon: Building,
    color: "bg-blue-500",
    description: "Public sector organizations needing transparent, compliant payment infrastructure",
    painPoints: ["Blocked Swift networks", "Expensive infrastructure", "Lack of transparency"],
    primaryFeatures: ["Smart Routing", "API Infrastructure", "Audit Trail", "Anti-Blockage"]
  },
  {
    id: "public-institutions",
    name: "Public Institutions",
    icon: Landmark,
    color: "bg-green-500", 
    description: "Educational institutions, healthcare, and public services requiring transparent aid distribution",
    painPoints: ["No transparency in aid", "Complex compliance", "Audit requirements"],
    primaryFeatures: ["API Logs", "Dashboard Analytics", "Audit Trail", "Compliance Tools"]
  },
  {
    id: "financial-companies",
    name: "Financial Companies",
    icon: Users,
    color: "bg-purple-500",
    description: "FinTechs, banks, and financial services needing unified payment infrastructure",
    painPoints: ["Multi-API complexity", "Integration overhead", "Compliance burden"],
    primaryFeatures: ["Universal API", "Developer Hub", "API Marketplace", "Smart Routing"]
  },
  {
    id: "b2b-clients",
    name: "B2B Clients",
    icon: Globe,
    color: "bg-orange-500", 
    description: "Enterprise businesses requiring fast, reliable payment integration",
    painPoints: ["Slow integration", "Multiple providers", "High complexity"],
    primaryFeatures: ["REST APIs", "Quick Integration", "Automated Workflows", "24h Setup"]
  },
  {
    id: "retail-exporters",
    name: "Retail/Exporters",
    icon: ShoppingCart,
    color: "bg-pink-500",
    description: "International sellers and exporters dealing with multi-currency challenges",
    painPoints: ["High FX fees", "Currency complexity", "Global reach"],
    primaryFeatures: ["Multi-Currency Wallet", "Auto Conversion", "Global Payments", "Virtual Cards"]
  },
  {
    id: "strategic-individuals",
    name: "Strategic Individuals", 
    icon: UserCircle,
    color: "bg-teal-500",
    description: "High-net-worth individuals requiring sophisticated payment tools and dispute resolution",
    painPoints: ["Lack of dispute tools", "Limited control", "Poor visibility"],
    primaryFeatures: ["Refund Management", "Status API", "Advanced Tools", "Premium Support"]
  },
  {
    id: "niche-clients",
    name: "NGOs, SaaS, Freelancers",
    icon: Heart,
    color: "bg-red-500",
    description: "Specialized organizations and individuals needing tailored payment solutions",
    painPoints: ["No tailored platform", "High fees", "Complex setup"],
    primaryFeatures: ["Virtual IBAN", "Virtual Cards", "QR Payments", "Mobile Integration"]
  }
];

interface SegmentSelectorProps {
  selectedSegment: string | null;
  onSegmentSelect: (segmentId: string) => void;
}

export const SegmentSelector = ({ selectedSegment, onSegmentSelect }: SegmentSelectorProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Personalize Your Experience</h2>
        <p className="text-muted-foreground">
          Help us tailor Universal Pay to your specific needs by selecting your organization type
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {customerSegments.map((segment) => (
          <Card 
            key={segment.id}
            className={`cursor-pointer transition-all duration-200 hover:scale-[1.02] hover:shadow-lg ${
              selectedSegment === segment.id 
                ? 'ring-2 ring-primary bg-primary/5' 
                : 'hover:bg-muted/50'
            }`}
            onClick={() => onSegmentSelect(segment.id)}
          >
            <CardHeader className="text-center">
              <div className={`w-12 h-12 ${segment.color} rounded-xl flex items-center justify-center mx-auto mb-2 text-white`}>
                <segment.icon className="w-6 h-6" />
              </div>
              <CardTitle className="text-lg">{segment.name}</CardTitle>
              <CardDescription className="text-sm leading-relaxed">
                {segment.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-2">Key Features for You:</p>
                  <div className="flex flex-wrap gap-1">
                    {segment.primaryFeatures.slice(0, 3).map((feature) => (
                      <Badge key={feature} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
                {selectedSegment === segment.id && (
                  <div className="flex items-center text-green-600 text-sm">
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Selected
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};