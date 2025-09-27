import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Globe } from "lucide-react";

interface LanguageSelectorProps {
  onSelect: (language: string) => void;
}

const languages = [
  { code: "en", name: "English", greeting: "Welcome" },
  { code: "zu", name: "isiZulu", greeting: "Sawubona" },
  { code: "af", name: "Afrikaans", greeting: "Welkom" },
];

export function LanguageSelector({ onSelect }: LanguageSelectorProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-secondary/20 via-background to-primary/10 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-secondary to-primary rounded-full mb-4 shadow-xl">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold gradient-text mb-2">TaxiConnect SA</h1>
          <p className="text-muted-foreground">Choose your preferred language</p>
        </div>

        <div className="space-y-3">
          {languages.map((lang) => (
            <Card
              key={lang.code}
              className="card-hover cursor-pointer overflow-hidden"
              onClick={() => onSelect(lang.code)}
            >
              <div className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{lang.greeting}</p>
                  <p className="text-lg font-semibold">{lang.name}</p>
                </div>
                <Button variant="gradient" size="sm">
                  Select
                </Button>
              </div>
            </Card>
          ))}
        </div>

        <p className="text-center text-sm text-muted-foreground mt-8">
          You can change this later in settings
        </p>
      </div>
    </div>
  );
}