
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Compass, Sparkles, UserCheck, Ruler, Calendar, Fingerprint, Stars } from "lucide-react";

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
    <Card className="overflow-hidden group glass-morphism mystic-glow flex flex-col h-full rounded-[2rem] border-slate-200/50">
      <CardHeader className="p-0 relative">
        <div className="h-40 overflow-hidden">
          <img 
            src={`https://picsum.photos/seed/${explorer.identificationName}-bg/600/400`} 
            alt="Fundo Cósmico" 
            className="w-full h-full object-cover grayscale opacity-20 group-hover:scale-110 transition-transform duration-700"
            data-ai-hint="mystic texture"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white" />
        </div>
        <div className="absolute top-6 right-6 z-10">
          <Badge variant="outline" className="bg-white/90 backdrop-blur-md border-slate-200 text-slate-900 text-[10px] font-black tracking-widest px-3 py-1 uppercase rounded-full">
            NDI: {explorer.ndi}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-8 pb-10 -mt-20 flex-1 flex flex-col">
        <div className="flex flex-col items-center text-center">
          <div className="relative">
            <Avatar className="h-32 w-32 border-[8px] border-white shadow-2xl group-hover:scale-105 transition-transform duration-500">
              <AvatarImage src={explorer.profileImageUrl} alt={explorer.name} className="object-cover" />
              <AvatarFallback className="bg-slate-900 text-white text-3xl font-bold">
                {explorer.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-full shadow-lg border border-slate-100">
              <Stars className="h-5 w-5 text-slate-900" />
            </div>
          </div>
          
          <div className="mt-8 space-y-2">
            <h3 className="text-2xl font-headline font-bold text-slate-900 tracking-tight">{explorer.name}</h3>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.3em]">@{explorer.identificationName}</p>
          </div>

          <div className="mt-6 flex justify-center gap-6">
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Idade</span>
              <span className="text-sm font-bold text-slate-600">{explorer.age} ciclos</span>
            </div>
            <div className="h-8 w-px bg-slate-100" />
            <div className="flex flex-col items-center gap-1">
              <span className="text-[9px] font-black uppercase text-slate-300 tracking-widest">Altura</span>
              <span className="text-sm font-bold text-slate-600">{explorer.height}</span>
            </div>
          </div>

          <div className="mt-10 w-full space-y-8 text-left">
            <div className="p-4 bg-slate-50/50 rounded-2xl border border-slate-100/50">
              <div className="flex items-center gap-2 mb-3">
                <Compass className="h-4 w-4 text-slate-400" />
                <span className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em]">Domínio Universal</span>
              </div>
              <p className="text-sm font-bold text-slate-800 tracking-tight">
                {explorer.universeName}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <span className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mb-2 block">Propósito</span>
                <p className="text-sm text-slate-500 italic leading-relaxed line-clamp-2">
                  "{explorer.purpose}"
                </p>
              </div>
              <div>
                <span className="text-[9px] uppercase font-black text-slate-300 tracking-[0.2em] mb-2 block">Registros</span>
                <p className="text-sm text-slate-500 leading-relaxed line-clamp-3 font-light">
                  {explorer.story}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-auto pt-10 border-t border-slate-100 w-full flex justify-between items-center opacity-40 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-2">
            <Fingerprint className="h-4 w-4 text-slate-900" />
            <span className="text-[9px] uppercase tracking-[0.3em] font-black text-slate-900">Assinatura Autêntica</span>
          </div>
          <Sparkles className="h-4 w-4 text-slate-300" />
        </div>
      </CardContent>
    </Card>
  );
}
