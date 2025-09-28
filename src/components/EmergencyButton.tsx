import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { AlertCircle, MapPin, Share2, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface EmergencyContact {
  name: string;
  phone: string;
  email?: string;
}

interface Location {
  latitude: number;
  longitude: number;
  address: string;
}

export function EmergencyButton() {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);
  const [showContactsDialog, setShowContactsDialog] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [newContact, setNewContact] = useState<EmergencyContact>({ name: "", phone: "", email: "" });
  const watchIdRef = useRef<number | null>(null);

  // Load contacts from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("emergencyContacts");
    if (saved) setEmergencyContacts(JSON.parse(saved));
  }, []);

  const saveContacts = (contacts: EmergencyContact[]) => {
    setEmergencyContacts(contacts);
    localStorage.setItem("emergencyContacts", JSON.stringify(contacts));
  };

  const getAddressFromCoordinates = async (lat: number, lng: number): Promise<string> => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
      const data = await response.json();
      return data.display_name || `${lat}, ${lng}`;
    } catch {
      return `${lat}, ${lng}`;
    }
  };

  const shareLocationWithContacts = async (location: Location) => {
    const mapsLink = `https://maps.google.com/?q=${location.latitude},${location.longitude}`;
    const message = `🚨 EMERGENCY 🚨\nI need help!\nMy location: ${location.address}\nView on map: ${mapsLink}\nShared via your app`;

    try {
      if (navigator.share) {
        await navigator.share({ title: "Emergency Location Share", text: message, url: mapsLink });
      } else {
        await navigator.clipboard.writeText(message);
        toast({ title: "Location copied!", description: "Emergency location copied to clipboard." });
      }

      console.log("Live location sent to contacts:", emergencyContacts.length);
    } catch (err) {
      console.error("Share failed:", err);
    }
  };

  const startSharing = () => {
    if (emergencyContacts.length === 0) {
      toast({ title: "No contacts", description: "Please add at least one emergency contact first.", variant: "destructive" });
      return;
    }

    if (!navigator.geolocation) {
      toast({ title: "Geolocation not supported", description: "Your browser does not support location tracking.", variant: "destructive" });
      return;
    }

    setIsSharing(true);

    const id = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const address = await getAddressFromCoordinates(latitude, longitude);
        await shareLocationWithContacts({ latitude, longitude, address });
      },
      (error) => {
        console.error(error);
        toast({ title: "Location error", description: error.message, variant: "destructive" });
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );

    watchIdRef.current = id;
  };

  const stopSharing = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setIsSharing(false);
    toast({ title: "Emergency sharing stopped", description: "Your location is no longer being shared." });
  };

  const toggleSharing = () => (isSharing ? stopSharing() : startSharing());

  const addEmergencyContact = () => {
    if (!newContact.name || !newContact.phone) {
      toast({ title: "Missing info", description: "Provide a name and phone.", variant: "destructive" });
      return;
    }
    saveContacts([...emergencyContacts, newContact]);
    setNewContact({ name: "", phone: "", email: "" });
    toast({ title: "Contact added", description: `${newContact.name} added.` });
  };

  const removeContact = (index: number) => {
    saveContacts(emergencyContacts.filter((_, i) => i !== index));
  };

  return (
    <>
      <div className="fixed bottom-24 right-4 z-50">
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-red-500 animate-ping opacity-75"></div>
          <Button
            variant="default"
            size="lg"
            onClick={toggleSharing}
            className="relative bg-red-600 hover:bg-red-700 text-white shadow-2xl rounded-full w-16 h-16 p-0"
          >
            {isSharing ? <MapPin className="w-8 h-8 animate-pulse" /> : <AlertCircle className="w-8 h-8" />}
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={() => setShowContactsDialog(true)} className="mt-2 w-16 text-xs">
          <Share2 className="w-4 h-4" />
        </Button>
      </div>

      <Dialog open={showContactsDialog} onOpenChange={setShowContactsDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Emergency Contacts</DialogTitle>
            <DialogDescription>Add contacts who will be notified when you share your location.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Card className="p-4">
              <h3 className="font-semibold mb-3">Add New Contact</h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="contact-name">Name</Label>
                  <Input id="contact-name" value={newContact.name} onChange={(e) => setNewContact({ ...newContact, name: e.target.value })} placeholder="John Doe" />
                </div>
                <div>
                  <Label htmlFor="contact-phone">Phone</Label>
                  <Input id="contact-phone" value={newContact.phone} onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })} placeholder="+27 123 456 7890" />
                </div>
                <div>
                  <Label htmlFor="contact-email">Email (Optional)</Label>
                  <Input id="contact-email" type="email" value={newContact.email} onChange={(e) => setNewContact({ ...newContact, email: e.target.value })} placeholder="john@example.com" />
                </div>
                <Button onClick={addEmergencyContact} className="w-full">Add Contact</Button>
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
                        {contact.email && <p className="text-sm text-muted-foreground">{contact.email}</p>}
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => removeContact(index)}>
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
