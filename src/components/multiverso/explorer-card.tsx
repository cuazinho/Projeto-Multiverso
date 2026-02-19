
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles, UserCheck, Ruler, Calendar, Fingerprint } from "lucide-react";

interface ExplorerCardProps {
  explorer: {
    name: string;
    identificationName: string;
    age: number;
    height: string;
    purpose: string;
    story: string;
    universeName: string;
    ndi: string;
    profileImageUrl?: string;
  };
}

export function ExplorerCard({ explorer }: ExplorerCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 group border-border/50 bg-white/40 backdrop-blur-md hover:-translate-y-2 flex flex-col h-full">
      <CardHeader className="p-0 relative">
        <div className="h-28 bg-gradient-to-br from-slate-200 to-slate-100 group-hover:from-slate-300 transition-colors" />
        <div className="absolute top-4 right-4 z-10">
          <Badge variant="outline" className="bg-white/80 backdrop-blur-sm border-primary/20 text-[9px] font-mono tracking-tighter">
            NDI: {explorer.ndi}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-8 -mt-12 flex-1 flex flex-col">
        <div className="flex flex-col items-center text-center">
          <Avatar className="h-24 w-24 border-[6px] border-white shadow-xl group-hover:scale-105 transition-transform">
            <AvatarImage src={explorer.profileImageUrl} alt={explorer.name} className="object-cover" />
            <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-bold">
              {explorer.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          
          <div className="mt-6 space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h3 className="text-xl font-headline font-bold text-primary">{explorer.name}</h3>
              <UserCheck className="h-4 w-4 text-green-600" />
            </div>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-widest">@{explorer.identificationName}</p>
          </div>

          <div className="mt-4 flex justify-center gap-4">
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
              <Calendar className="h-3 w-3 text-accent" /> {explorer.age} anos
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-bold uppercase tracking-tight">
              <Ruler className="h-3 w-3 text-accent" /> {explorer.height}
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center gap-2 w-full">
            <span className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold">Arquitetura Universal:</span>
            <Badge variant="secondary" className="w-full py-1.5 justify-center gap-2 bg-secondary text-primary border-none font-bold text-[11px]">
              <Compass className="h-3.5 w-3.5" /> {explorer.universeName}
            </Badge>
          </div>

          <div className="mt-6 relative w-full px-2 space-y-4 text-left">
            <div>
              <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">Propósito</p>
              <p className="text-xs text-muted-foreground italic line-clamp-2 leading-relaxed">
                "{explorer.purpose}"
              </p>
            </div>
            <div>
              <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest mb-1">História</p>
              <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                {explorer.story}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-6 border-t border-border w-full flex justify-center items-center gap-2 text-primary/40 group-hover:text-primary transition-colors">
          <Fingerprint className="h-4 w-4" />
          <span className="text-[10px] uppercase tracking-[0.3em] font-black">Registro Autêntico</span>
        </div>
      </CardContent>
    </Card>
  );
}
