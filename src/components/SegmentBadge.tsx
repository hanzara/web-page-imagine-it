import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Info } from "lucide-react";

interface SegmentBadgeProps {
  segments: string[];
  className?: string;
  showTooltip?: boolean;
}

const segmentLabels: { [key: string]: string } = {
  "government": "Gov",
  "public-institutions": "Public", 
  "financial-companies": "FinTech",
  "b2b-clients": "B2B",
  "retail-exporters": "Export",
  "strategic-individuals": "Premium",
  "niche-clients": "Niche"
};

const segmentDescriptions: { [key: string]: string } = {
  "government": "Ideal for government agencies needing compliant infrastructure",
  "public-institutions": "Perfect for educational and healthcare institutions",
  "financial-companies": "Built for FinTechs and financial services",
  "b2b-clients": "Designed for enterprise businesses",
  "retail-exporters": "Optimized for international sellers",
  "strategic-individuals": "Premium features for sophisticated users",
  "niche-clients": "Tailored for NGOs, SaaS, and freelancers"
};

export const SegmentBadge = ({ segments, className = "", showTooltip = true }: SegmentBadgeProps) => {
  if (segments.length === 0) return null;

  const BadgeContent = () => (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex gap-1">
        {segments.map((segment) => (
          <Badge key={segment} variant="secondary" className="text-xs">
            {segmentLabels[segment] || segment}
          </Badge>
        ))}
      </div>
      {showTooltip && (
        <Info className="w-3 h-3 text-muted-foreground" />
      )}
    </div>
  );

  if (!showTooltip) return <BadgeContent />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" className="h-auto p-1 hover:bg-transparent">
          <BadgeContent />
        </Button>
      </TooltipTrigger>
      <TooltipContent className="max-w-xs">
        <div className="space-y-2">
          {segments.map((segment) => (
            <div key={segment} className="text-sm">
              <span className="font-medium">{segmentLabels[segment]}:</span>{" "}
              <span>{segmentDescriptions[segment]}</span>
            </div>
          ))}
        </div>
      </TooltipContent>
    </Tooltip>
  );
};