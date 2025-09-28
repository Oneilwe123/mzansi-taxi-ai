import { useState } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface EmergencyContact {
  name: string;
  phone: string;
  email?: string;
}

export function EmergencyButton() {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState<EmergencyContact>({
    name: "",
    phone: "",
    email: "",
  });

  const getCurrentLocation = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      });
    });
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
      );
      const data = await response.json();
      return data.display_name || `${lat}, ${lng}`;
    } catch (error) {
      return `${lat}, ${lng}`;
    }
  };

  const shareLocation = async () => {
    setIsSharing(true);
    
    try {
      const position = await getCurrentLocation();
      const { latitude, longitude } = position.coords;
      const address = await getAddressFromCoordinates(latitude, longitude);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to share your location.",
          variant: "destructive",
        });
        return;
      }

      // Get emergency contacts from database
      const { data: contacts, error: contactsError } = await supabase
        .from("emergency_contacts")
        .select("*")
        .eq("user_id", user.id);

      if (contactsError) {
        console.error("Error fetching contacts:", contactsError);
      }

      // Save location share to database
      const sharedWith = contacts?.map(c => c.email || c.phone) || [];
      
      const { error: shareError } = await supabase
        .from("location_shares")
        .insert({
          user_id: user.id,
          latitude,
          longitude,
          address,
          shared_with: sharedWith,
          is_emergency: true,
          expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Expires in 24 hours
        });

      if (shareError) {
        console.error("Error saving location share:", shareError);
      }

      // Create Google Maps link
      const mapsLink = `https://www.google.com/maps?q=${latitude},${longitude}`;
      
      // Create shareable message
      const message = `🚨 EMERGENCY LOCATION SHARE 🚨\n\nI need help! My current location is:\n${address}\n\nView on map: ${mapsLink}\n\nShared via TaxiConnect SA`;

      // Try to share using Web Share API
      if (navigator.share) {
        await navigator.share({
          title: "Emergency Location Share",
          text: message,
          url: mapsLink,
        });
      } else {
        // Fallback: Copy to clipboard
        await navigator.clipboard.writeText(message);
        toast({
          title: "Location copied!",
          description: "Emergency location details copied to clipboard. Share it with your contacts.",
        });
      }

      // Show success message
      toast({
        title: "Location shared successfully",
        description: `Your location has been shared. ${contacts?.length ? `Notified ${contacts.length} emergency contacts.` : "Add emergency contacts for automatic notifications."}`,
      });

    } catch (error) {
      console.error("Error sharing location:", error);
      toast({
        title: "Location sharing failed",
        description: error instanceof Error ? error.message : "Unable to share your location. Please ensure location services are enabled.",
        variant: "destructive",
      });
    } finally {
      setIsSharing(false);
    }
  };

  const addEmergencyContact = async () => {
    if (!newContact.name || !newContact.phone) {
      toast({
        title: "Missing information",
        description: "Please provide at least a name and phone number.",
        variant: "destructive",
      });
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        toast({
          title: "Not authenticated",
          description: "Please sign in to add emergency contacts.",
          variant: "destructive",
        });
        return;
      }

      const { error } = await supabase
        .from("emergency_contacts")
        .insert({
          user_id: user.id,
          name: newContact.name,
          phone: newContact.phone,
          email: newContact.email,
        });

      if (error) {
        throw error;
      }

      setEmergencyContacts([...emergencyContacts, newContact]);
      setNewContact({ name: "", phone: "", email: "" });
      
      toast({
        title: "Contact added",
        description: `${newContact.name} has been added as an emergency contact.`,
      });
    } catch (error) {
      console.error("Error adding contact:", error);
      toast({
        title: "Failed to add contact",
        description: "Unable to add emergency contact. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50">
        <div className="relative">
          {/* Pulsing ring animation for emergency button */}
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
          
          <Button
            variant="default"
            size="lg"
            onClick={shareLocation}
            disabled={isSharing}
            className="relative bg-red-600 hover:bg-red-700 text-white shadow-2xl rounded-full w-16 h-16 p-0"
          >
            {isSharing ? (
              <MapPin className="w-8 h-8 animate-pulse" />
            ) : (
              <AlertCircle className="w-8 h-8" />
            )}
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowContactsDialog(true)}
          className="mt-2 w-16 text-xs"
        >
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={showContactsDialog} onOpenChange={setShowContactsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Contacts</DialogTitle>
            <DialogDescription>
              Add emergency contacts who will be notified when you share your location.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Add New Contact</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <Input
                    id="contact-name"
                    value={newContact.name}
                    onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input
                    id="contact-phone"
                    value={newContact.phone}
                    onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                    placeholder="+27 123 456 7890"
                  />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email (Optional)</Label>
                  <Input
                    id="contact-email"
                    type="email"
                    value={newContact.email}
                    onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>
                <Button onClick={addEmergencyContact} className="w-full">
                  Add Contact
                </Button>
              </div>
            </Card>

            {emergencyContacts.length > 0 && (
              <div className="space-y-2">
                <h3 className="font-semibold">Your Emergency Contacts</h3>
                {emergencyContacts.map((contact, index) => (
                  <Card key={index} className="p-3">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        {contact.email && (
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEmergencyContacts(emergencyContacts.filter((_, i) => i !== index));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}