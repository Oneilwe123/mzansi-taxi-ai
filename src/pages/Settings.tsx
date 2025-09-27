import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Bell, 
  Shield, 
  Moon,
  Smartphone,
  HelpCircle,
  User
} from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    notifications: true,
    locationTracking: false,
    darkMode: false,
    mobileData: true,
    safetyAlerts: true,
  });

  const handleToggle = (key: string) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold gradient-text mb-2">Settings</h1>
          <p className="text-muted-foreground">Customize your TaxiConnect experience</p>
        </div>

        {/* User Profile Card */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg">Guest User</h3>
              <p className="text-sm text-muted-foreground">Sign in to save your preferences</p>
            </div>
            <Button variant="gradient">
              Sign In
            </Button>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notifications" className="text-base">Push Notifications</Label>
                <p className="text-sm text-muted-foreground">Get alerts about strikes and delays</p>
              </div>
              <Switch
                id="notifications"
                checked={settings.notifications}
                onCheckedChange={() => handleToggle("notifications")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="safety-alerts" className="text-base">Safety Alerts</Label>
                <p className="text-sm text-muted-foreground">Receive important safety updates</p>
              </div>
              <Switch
                id="safety-alerts"
                checked={settings.safetyAlerts}
                onCheckedChange={() => handleToggle("safetyAlerts")}
              />
            </div>
          </div>
        </Card>

        {/* Privacy Settings */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">Privacy</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="location" className="text-base">Location Tracking</Label>
                <p className="text-sm text-muted-foreground">Help us provide better route suggestions</p>
              </div>
              <Switch
                id="location"
                checked={settings.locationTracking}
                onCheckedChange={() => handleToggle("locationTracking")}
              />
            </div>
          </div>
        </Card>

        {/* App Settings */}
        <Card className="p-6 mb-6 shadow-lg">
          <div className="flex items-center gap-3 mb-4">
            <Smartphone className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-semibold">App Preferences</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="dark-mode" className="text-base">Dark Mode</Label>
                <p className="text-sm text-muted-foreground">Easier on the eyes at night</p>
              </div>
              <Switch
                id="dark-mode"
                checked={settings.darkMode}
                onCheckedChange={() => handleToggle("darkMode")}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="mobile-data" className="text-base">Use Mobile Data</Label>
                <p className="text-sm text-muted-foreground">Allow app to work on mobile data</p>
              </div>
              <Switch
                id="mobile-data"
                checked={settings.mobileData}
                onCheckedChange={() => handleToggle("mobileData")}
              />
            </div>
          </div>
        </Card>

        {/* About Section */}
        <Card className="p-6 mb-6 glass-card">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Version</span>
              <Badge variant="secondary">1.0.0</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Last Updated</span>
              <span className="text-sm">December 2024</span>
            </div>
            <Button variant="outline" className="w-full">
              <HelpCircle className="w-4 h-4 mr-2" />
              Help & Support
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}