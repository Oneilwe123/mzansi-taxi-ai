import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Brain, 
  MapPin, 
  DollarSign, 
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
  Send
} from "lucide-react";

interface Suggestion {
  id: string;
  type: "route" | "fare" | "safety";
  status: "pending" | "verified" | "rejected";
  from?: string;
  to?: string;
  fare?: string;
  description: string;
  submittedBy: string;
  date: string;
  votes: number;
}

const recentSuggestions: Suggestion[] = [
  {
    id: "1",
    type: "route",
    status: "verified",
    from: "Fourways",
    to: "Randburg",
    fare: "R18",
    description: "New direct route available via William Nicol",
    submittedBy: "Community Member",
    date: "2 days ago",
    votes: 45,
  },
  {
    id: "2",
    type: "fare",
    status: "pending",
    from: "Sandton",
    to: "Rosebank",
    fare: "R12",
    description: "Fare has increased from R10 to R12",
    submittedBy: "Regular Commuter",
    date: "1 day ago",
    votes: 23,
  },
  {
    id: "3",
    type: "safety",
    status: "verified",
    description: "New safety marshals at Park Station rank from 5 AM to 8 PM",
    submittedBy: "Safety Officer",
    date: "3 days ago",
    votes: 67,
  },
];

export default function TrainAI() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    type: "route",
    from: "",
    to: "",
    fare: "",
    description: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for your contribution!",
      description: "Your suggestion will be reviewed by our team.",
    });
    setFormData({
      type: "route",
      from: "",
      to: "",
      fare: "",
      description: "",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      verified: "bg-success/10 text-success border-success/20",
      pending: "bg-warning/10 text-warning border-warning/20",
      rejected: "bg-destructive/10 text-destructive border-destructive/20",
    };
    return styles[status as keyof typeof styles] || "";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-full mb-4 shadow-xl">
            <Brain className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold gradient-text mb-2">Help Train Our AI</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your local knowledge makes our service better for everyone. Share route updates, fare changes, and safety information.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center glass-card">
            <Users className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">1,234</p>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <CheckCircle className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="text-2xl font-bold">892</p>
            <p className="text-sm text-muted-foreground">Verified Updates</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <MapPin className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold">156</p>
            <p className="text-sm text-muted-foreground">New Routes</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-info" />
            <p className="text-2xl font-bold">98%</p>
            <p className="text-sm text-muted-foreground">Accuracy</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Submission Form */}
          <Card className="p-6 shadow-xl">
            <h2 className="text-xl font-semibold mb-4">Submit Information</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="type">Type of Information</Label>
                <select
                  id="type"
                  className="w-full mt-1 px-3 py-2 border border-input rounded-md bg-background"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                >
                  <option value="route">New Route</option>
                  <option value="fare">Fare Update</option>
                  <option value="safety">Safety Information</option>
                </select>
              </div>

              {(formData.type === "route" || formData.type === "fare") && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="from">From</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="from"
                          placeholder="Starting point"
                          value={formData.from}
                          onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="to">To</Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                        <Input
                          id="to"
                          placeholder="Destination"
                          value={formData.to}
                          onChange={(e) => setFormData({ ...formData, to: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="fare">Fare (Optional)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        id="fare"
                        placeholder="e.g., R25"
                        value={formData.fare}
                        onChange={(e) => setFormData({ ...formData, fare: e.target.value })}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="description">Additional Details</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional information that might be helpful..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>

              <Button type="submit" variant="gradient" className="w-full">
                <Send className="w-4 h-4 mr-2" />
                Submit Information
              </Button>
            </form>
          </Card>

          {/* Recent Contributions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recent Contributions</h2>
            <div className="space-y-4">
              {recentSuggestions.map((suggestion) => (
                <Card key={suggestion.id} className="p-4 card-hover">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className={getStatusBadge(suggestion.status)}>
                        {suggestion.status}
                      </Badge>
                      <Badge variant="outline">
                        {suggestion.type}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="w-3 h-3" />
                      <span>{suggestion.votes}</span>
                    </div>
                  </div>

                  {suggestion.from && suggestion.to && (
                    <div className="flex items-center gap-2 mb-2 font-medium">
                      <span>{suggestion.from}</span>
                      <span className="text-muted-foreground">→</span>
                      <span>{suggestion.to}</span>
                      {suggestion.fare && (
                        <Badge variant="secondary" className="ml-2">
                          {suggestion.fare}
                        </Badge>
                      )}
                    </div>
                  )}

                  <p className="text-sm text-muted-foreground mb-2">{suggestion.description}</p>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span>{suggestion.submittedBy}</span>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{suggestion.date}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}