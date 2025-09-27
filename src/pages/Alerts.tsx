import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  AlertTriangle, 
  Info, 
  CheckCircle, 
  XCircle,
  Clock,
  MapPin,
  Bell,
  BellOff
} from "lucide-react";
import { useState } from "react";

interface Alert {
  id: string;
  type: "strike" | "closure" | "safety" | "info";
  severity: "high" | "medium" | "low";
  title: string;
  description: string;
  location: string;
  time: string;
  active: boolean;
}

const mockAlerts: Alert[] = [
  {
    id: "1",
    type: "strike",
    severity: "high",
    title: "Taxi Strike - Johannesburg CBD",
    description: "Major taxi associations are on strike. Avoid CBD area. Alternative transport recommended.",
    location: "Johannesburg CBD",
    time: "2 hours ago",
    active: true,
  },
  {
    id: "2",
    type: "closure",
    severity: "medium",
    title: "M1 Highway Partial Closure",
    description: "Roadworks on M1 North between Corlett Drive and William Nicol. Expect delays.",
    location: "M1 Highway North",
    time: "5 hours ago",
    active: true,
  },
  {
    id: "3",
    type: "safety",
    severity: "high",
    title: "Safety Alert - Alexandra",
    description: "Reports of unrest in Alexandra. Travelers advised to use alternative routes.",
    location: "Alexandra Township",
    time: "1 hour ago",
    active: true,
  },
  {
    id: "4",
    type: "info",
    severity: "low",
    title: "New Taxi Rank Opening",
    description: "New taxi rank opening in Midrand next week. Better connections to Pretoria.",
    location: "Midrand",
    time: "1 day ago",
    active: false,
  },
];

export default function Alerts() {
  const [notifications, setNotifications] = useState(true);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "resolved">("all");

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "strike":
        return <AlertTriangle className="w-5 h-5" />;
      case "closure":
        return <XCircle className="w-5 h-5" />;
      case "safety":
        return <AlertTriangle className="w-5 h-5" />;
      case "info":
        return <Info className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertColor = (type: string, severity: string) => {
    if (type === "info") return "bg-info/10 text-info border-info/20";
    if (severity === "high") return "bg-destructive/10 text-destructive border-destructive/20";
    if (severity === "medium") return "bg-warning/10 text-warning border-warning/20";
    return "bg-muted text-muted-foreground border-muted";
  };

  const getSeverityBadge = (severity: string) => {
    const colors = {
      high: "bg-destructive text-destructive-foreground",
      medium: "bg-warning text-warning-foreground",
      low: "bg-success text-success-foreground",
    };
    return colors[severity as keyof typeof colors] || "";
  };

  const filteredAlerts = mockAlerts.filter((alert) => {
    if (activeFilter === "all") return true;
    if (activeFilter === "active") return alert.active;
    if (activeFilter === "resolved") return !alert.active;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold gradient-text mb-2">Live Alerts</h1>
              <p className="text-muted-foreground">Stay informed about strikes, closures, and safety</p>
            </div>
            <Button
              variant={notifications ? "gradient" : "outline"}
              onClick={() => setNotifications(!notifications)}
            >
              {notifications ? (
                <>
                  <Bell className="w-4 h-4 mr-2" />
                  Notifications On
                </>
              ) : (
                <>
                  <BellOff className="w-4 h-4 mr-2" />
                  Notifications Off
                </>
              )}
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <Button
              variant={activeFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("all")}
            >
              All Alerts
            </Button>
            <Button
              variant={activeFilter === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("active")}
            >
              Active
            </Button>
            <Button
              variant={activeFilter === "resolved" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFilter("resolved")}
            >
              Resolved
            </Button>
          </div>
        </div>

        {/* Alert Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="p-4 text-center glass-card">
            <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-destructive" />
            <p className="text-2xl font-bold">2</p>
            <p className="text-sm text-muted-foreground">Critical Alerts</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <Info className="w-8 h-8 mx-auto mb-2 text-warning" />
            <p className="text-2xl font-bold">1</p>
            <p className="text-sm text-muted-foreground">Warnings</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold">1</p>
            <p className="text-sm text-muted-foreground">Resolved</p>
          </Card>
        </div>

        {/* Alerts List */}
        <div className="space-y-4">
          {filteredAlerts.map((alert) => (
            <Card 
              key={alert.id} 
              className={`p-6 card-hover ${alert.active ? "" : "opacity-60"}`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-2 rounded-lg ${getAlertColor(alert.type, alert.severity)}`}>
                  {getAlertIcon(alert.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{alert.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={getSeverityBadge(alert.severity)}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.active ? (
                          <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                            ACTIVE
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-muted text-muted-foreground">
                            RESOLVED
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground mb-3">{alert.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredAlerts.length === 0 && (
          <Card className="p-12 text-center">
            <CheckCircle className="w-12 h-12 mx-auto mb-4 text-success" />
            <h3 className="text-lg font-semibold mb-2">No alerts to show</h3>
            <p className="text-muted-foreground">
              All clear! No active alerts in your area.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}