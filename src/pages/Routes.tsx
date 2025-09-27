import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  MapPin, 
  Clock, 
  DollarSign, 
  TrendingUp,
  Navigation,
  Bus
} from "lucide-react";

interface Route {
  id: string;
  from: string;
  to: string;
  fare: string;
  duration: string;
  distance: string;
  popularity: "high" | "medium" | "low";
  taxiRank: string;
}

const popularRoutes: Route[] = [
  {
    id: "1",
    from: "Johannesburg CBD",
    to: "Soweto",
    fare: "R25-30",
    duration: "30-40 min",
    distance: "20 km",
    popularity: "high",
    taxiRank: "Park Station",
  },
  {
    id: "2",
    from: "Sandton",
    to: "Alexandra",
    fare: "R15-20",
    duration: "15-20 min",
    distance: "8 km",
    popularity: "high",
    taxiRank: "Sandton Rank",
  },
  {
    id: "3",
    from: "Pretoria CBD",
    to: "Mamelodi",
    fare: "R20-25",
    duration: "25-35 min",
    distance: "15 km",
    popularity: "medium",
    taxiRank: "Bosman Station",
  },
  {
    id: "4",
    from: "Braamfontein",
    to: "Rosebank",
    fare: "R12-15",
    duration: "10-15 min",
    distance: "5 km",
    popularity: "medium",
    taxiRank: "Braamfontein Rank",
  },
  {
    id: "5",
    from: "Kempton Park",
    to: "OR Tambo Airport",
    fare: "R30-35",
    duration: "20-25 min",
    distance: "12 km",
    popularity: "high",
    taxiRank: "Kempton Park Station",
  },
];

export default function Routes() {
  const [searchFrom, setSearchFrom] = useState("");
  const [searchTo, setSearchTo] = useState("");
  const [filteredRoutes, setFilteredRoutes] = useState(popularRoutes);

  const handleSearch = () => {
    const filtered = popularRoutes.filter((route) => {
      const fromMatch = searchFrom === "" || route.from.toLowerCase().includes(searchFrom.toLowerCase());
      const toMatch = searchTo === "" || route.to.toLowerCase().includes(searchTo.toLowerCase());
      return fromMatch && toMatch;
    });
    setFilteredRoutes(filtered);
  };

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-success/10 text-success border-success/20";
      case "medium":
        return "bg-warning/10 text-warning border-warning/20";
      case "low":
        return "bg-muted text-muted-foreground border-muted";
      default:
        return "";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold gradient-text mb-2">Taxi Routes</h1>
          <p className="text-muted-foreground">Find the best routes and current fares</p>
        </div>

        {/* Search Section */}
        <Card className="p-6 mb-8 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="From location..."
                value={searchFrom}
                onChange={(e) => setSearchFrom(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="relative">
              <Navigation className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="To destination..."
                value={searchTo}
                onChange={(e) => setSearchTo(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="gradient" onClick={handleSearch} className="w-full">
              <Search className="w-4 h-4 mr-2" />
              Search Routes
            </Button>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 text-center glass-card">
            <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-sm text-muted-foreground">Most Popular</p>
            <p className="font-semibold">JHB to Soweto</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <DollarSign className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <p className="text-sm text-muted-foreground">Average Fare</p>
            <p className="font-semibold">R22</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <Clock className="w-8 h-8 mx-auto mb-2 text-info" />
            <p className="text-sm text-muted-foreground">Peak Hours</p>
            <p className="font-semibold">6-9 AM</p>
          </Card>
          <Card className="p-4 text-center glass-card">
            <Bus className="w-8 h-8 mx-auto mb-2 text-success" />
            <p className="text-sm text-muted-foreground">Active Taxis</p>
            <p className="font-semibold">2,500+</p>
          </Card>
        </div>

        {/* Routes List */}
        <div className="space-y-4">
          {filteredRoutes.map((route) => (
            <Card key={route.id} className="p-6 card-hover">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center shrink-0">
                      <Bus className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-lg">{route.from}</h3>
                        <span className="text-muted-foreground">→</span>
                        <h3 className="font-semibold text-lg">{route.to}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Taxi Rank: {route.taxiRank}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4 text-secondary" />
                      <span className="font-medium">{route.fare}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4 text-info" />
                      <span>{route.duration}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{route.distance}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge 
                    variant="outline" 
                    className={getPopularityColor(route.popularity)}
                  >
                    {route.popularity === "high" && "High Demand"}
                    {route.popularity === "medium" && "Moderate"}
                    {route.popularity === "low" && "Low Traffic"}
                  </Badge>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredRoutes.length === 0 && (
          <Card className="p-12 text-center">
            <MapPin className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No routes found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse our popular routes
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}