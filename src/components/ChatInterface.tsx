import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Bot, User, MapPin, DollarSign, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  type: "user" | "bot";
  content: string;
  timestamp: Date;
}

const suggestions = [
  "Where can I get a taxi to Sandton?",
  "How much from Braamfontein to Soweto?",
  "Is it safe to travel at night?",
  "Show me routes from my location",
];

export function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Sawubona! 👋 I'm your TaxiConnect assistant. Ask me about routes, fares, or safety tips. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getBotResponse(input),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const getBotResponse = (query: string) => {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes("braamfontein") && lowerQuery.includes("honeydew")) {
      return "🚕 From Braamfontein to Honeydew:\n\n📍 **Nearest taxi rank:** Braamfontein Taxi Rank (corner Juta & De Korte St)\n💰 **Fare:** R25-30\n⏱️ **Travel time:** 35-45 minutes\n🛤️ **Route:** Via Republic Rd and Beyers Naude Dr\n\n⚠️ **Tip:** Morning rush hour (6:30-9:00) may add 15-20 minutes to your journey.";
    }
    
    if (lowerQuery.includes("safe") || lowerQuery.includes("night")) {
      return "🛡️ **Safety Tips for Night Travel:**\n\n✅ Travel in groups when possible\n✅ Use well-known taxi ranks\n✅ Keep valuables hidden\n✅ Share your trip details with someone\n✅ Sit near the driver\n✅ Trust your instincts\n\n📱 Emergency: Save 10111 (Police) and 10177 (Ambulance) in your phone.";
    }
    
    if (lowerQuery.includes("fare") || lowerQuery.includes("price") || lowerQuery.includes("cost")) {
      return "💰 **Common Taxi Fares:**\n\n• Short distance (5-10km): R12-15\n• Medium distance (10-20km): R20-30\n• Long distance (20km+): R35-50\n\n💡 **Note:** Fares may vary based on time of day and specific routes. Always confirm with the driver before boarding.";
    }
    
    return "I understand you're asking about: \"" + query + "\". Let me help you with taxi information. You can ask me about:\n\n📍 Routes and directions\n💰 Fare estimates\n🛡️ Safety tips\n⏱️ Travel times\n🚕 Nearest taxi ranks\n\nWhat specific information would you like?";
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] max-w-4xl mx-auto p-4">
      <Card className="flex-1 flex flex-col overflow-hidden shadow-xl">
        {/* Chat Header */}
        <div className="bg-gradient-to-r from-secondary to-primary p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-white font-semibold">TaxiConnect Assistant</h2>
              <p className="text-white/80 text-sm">Always here to help you travel safely</p>
            </div>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex items-start gap-3 chat-bubble-enter",
                  message.type === "user" && "flex-row-reverse"
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
                    message.type === "bot"
                      ? "bg-gradient-to-br from-secondary to-primary"
                      : "bg-accent"
                  )}
                >
                  {message.type === "bot" ? (
                    <Bot className="w-5 h-5 text-white" />
                  ) : (
                    <User className="w-5 h-5 text-accent-foreground" />
                  )}
                </div>
                <div
                  className={cn(
                    "max-w-[70%] rounded-2xl p-3 shadow-sm",
                    message.type === "bot"
                      ? "bg-card border border-border"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  <p className="text-sm whitespace-pre-line">{message.content}</p>
                  <p
                    className={cn(
                      "text-xs mt-1",
                      message.type === "bot" ? "text-muted-foreground" : "text-primary-foreground/70"
                    )}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-card border border-border rounded-2xl p-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></span>
                    <span className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggestions */}
        {messages.length === 1 && (
          <div className="px-4 pb-2">
            <p className="text-xs text-muted-foreground mb-2">Quick questions:</p>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion) => (
                <Button
                  key={suggestion}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="border-t border-border p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about routes, fares, or safety..."
              className="flex-1"
            />
            <Button type="submit" variant="gradient" size="icon">
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </Card>

      {/* Feature Pills */}
      <div className="flex justify-center gap-4 mt-4">
        <div className="flex items-center gap-2 px-3 py-1 bg-card rounded-full border border-border text-sm">
          <MapPin className="w-3 h-3 text-primary" />
          <span className="text-muted-foreground">Live Routes</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-card rounded-full border border-border text-sm">
          <DollarSign className="w-3 h-3 text-secondary" />
          <span className="text-muted-foreground">Fair Prices</span>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-card rounded-full border border-border text-sm">
          <Shield className="w-3 h-3 text-success" />
          <span className="text-muted-foreground">Safe Travel</span>
        </div>
      </div>
    </div>
  );
}