import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles } from "lucide-react";

interface ExplorerCardProps {
  explorer: {
    name: string;
    idName: string;
    purpose: string;
    universe: string;
    profileImage?: string;
  };
}

export function ExplorerCard({ explorer }: ExplorerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all group border-primary/10 bg-card/50 backdrop-blur-sm">
      <CardHeader className="p-0">
        <div className="h-24 bg-gradient-to-r from-primary via-accent to-primary opacity-20 group-hover:opacity-30 transition-opacity" />
      </CardHeader>
      <CardContent className="px-6 pb-6 -mt-10">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-20 w-20 border-4 border-background shadow-md">
            <AvatarImage src={explorer.profileImage} alt={explorer.name} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xl">
              {explorer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="mt-4 space-y-1">
            <h3 className="text-xl font-headline font-bold">{explorer.name}</h3>
            <p className="text-sm text-muted-foreground font-mono">@{explorer.idName}</p>
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-2">
            <Badge variant="secondary" className="flex gap-1 items-center bg-secondary text-primary">
              <Compass className="h-3 w-3" /> {explorer.universe}
            </Badge>
          </div>

          <p className="mt-4 text-sm text-muted-foreground italic line-clamp-3">
            "{explorer.purpose}"
          </p>

          <div className="mt-6 pt-4 border-t w-full flex justify-center items-center gap-2 text-accent">
            <Sparkles className="h-4 w-4" />
            <span className="text-[10px] uppercase tracking-widest font-bold">Viajante Multiversal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
