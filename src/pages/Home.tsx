import { ChatInterface } from "@/components/ChatInterface";
import { Card } from "@/components/ui/card";
import { MapPin, Users, Shield, Clock } from "lucide-react";

const stats = [
  { icon: MapPin, label: "Routes Covered", value: "500+" },
  { icon: Users, label: "Daily Users", value: "10K+" },
  { icon: Shield, label: "Safe Trips", value: "99.8%" },
  { icon: Clock, label: "Response Time", value: "<2s" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Stats Bar */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Card key={stat.label} className="p-4 text-center card-hover">
              <stat.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold gradient-text">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </Card>
          ))}
        </div>
      </div>

      {/* Chat Interface */}
      <ChatInterface />
    </div>
  );
}