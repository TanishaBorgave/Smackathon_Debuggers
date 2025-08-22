import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { AlertTriangle, CheckCircle, Clock } from "lucide-react";

interface BloodStockCardProps {
  bloodType: string;
  units: number;
  maxUnits: number;
  urgency: "low" | "medium" | "high";
  expirationDays?: number;
}

const BloodStockCard = ({ bloodType, units, maxUnits, urgency, expirationDays }: BloodStockCardProps) => {
  const percentage = (units / maxUnits) * 100;
  
  const getUrgencyIcon = () => {
    switch (urgency) {
      case "high":
        return <AlertTriangle className="h-4 w-4 text-urgency-high" />;
      case "medium":
        return <Clock className="h-4 w-4 text-urgency-medium" />;
      default:
        return <CheckCircle className="h-4 w-4 text-urgency-low" />;
    }
  };

  const getProgressColor = () => {
    if (percentage < 20) return "bg-urgency-high";
    if (percentage < 50) return "bg-urgency-medium";
    return "bg-urgency-low";
  };

  const getBloodTypeColor = () => {
    switch (bloodType) {
      case "A+":
      case "A-":
        return "text-blood-a";
      case "B+":
      case "B-":
        return "text-blood-b";
      case "AB+":
      case "AB-":
        return "text-blood-ab";
      case "O+":
      case "O-":
        return "text-blood-o";
      default:
        return "text-primary";
    }
  };

  return (
    <Card className="p-4 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className={`text-2xl font-bold ${getBloodTypeColor()}`}>
            {bloodType}
          </span>
          {getUrgencyIcon()}
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-foreground">{units}</div>
          <div className="text-xs text-muted-foreground">units</div>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="text-muted-foreground">Availability</span>
          <span className="font-medium">{percentage.toFixed(0)}%</span>
        </div>
        
        <Progress value={percentage} className="h-2">
          <div
            className={`h-full rounded-full transition-all ${getProgressColor()}`}
            style={{ width: `${percentage}%` }}
          />
        </Progress>
        
        {expirationDays && (
          <div className="flex items-center text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3 mr-1" />
            {expirationDays} days to expiry
          </div>
        )}
      </div>
    </Card>
  );
};

export default BloodStockCard;