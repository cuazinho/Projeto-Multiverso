
"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/multiverso/navbar";
import { ProfileForm } from "@/components/multiverso/profile-form";
import { ExplorerCard } from "@/components/multiverso/explorer-card";
import { Logo } from "@/components/multiverso/logo";
import { PalmeChat } from "@/components/multiverso/palme-chat";
import { Button } from "@/components/ui/button";
import { Users, ArrowDown, Sparkles, Globe, ShieldCheck, MessageCircle, Trash2, LayoutDashboard, Terminal, Stars } from "lucide-react";
import { useCollection, useMemoFirebase, useFirestore, useUser, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const firestore = useFirestore();
  const { user } = useUser();
  const [mounted, setMounted] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);

  const explorersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "explorer_profiles"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: explorers, isLoading: isListLoading } = useCollection(explorersQuery);

  const handleClearAll = async () => {
    if (!firestore || !explorers || explorers.length === 0) return;
    
    if (!confirm("⚠️ PROTOCOLO DE RESET: Deseja colapsar todos os universos desta linha temporal?")) {
      return;
    }

    explorers.forEach((explorer) => {
      const docRef = doc(firestore, "explorer_profiles", explorer.id);
      deleteDocumentNonBlocking(docRef);
    });

    toast({
      title: "Colapso Dimensional Iniciado",
      description: "Limpando registros da rede mística.",
    });
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen flex flex-col bg-[#f8f9fa] selection:bg-slate-200">
      <Navbar />
      
      <main className="flex-1">
        {/* Mystic Hero Section */}
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-white">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/mystic-void-2/1920/1080" 
              alt="Cosmos" 
              className="w-full h-full object-cover grayscale opacity-[0.03] scale-110"
              data-ai-hint="celestial stars"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/50 to-white" />
          </div>
          
          <div className="container mx-auto px-4 z-10 text-center space-y-12">
            <div className="inline-flex items-center gap-3 px-5 py-2 bg-slate-50 border border-slate-200 rounded-full text-slate-500 animate-pulse">
              <Stars className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Frequência Sincronizada</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-7xl md:text-[10rem] font-headline font-bold leading-none tracking-tighter text-slate-900 flex flex-col items-center">
                <span>PROJETO</span>
                <span className="text-slate-300 -mt-4 md:-mt-8">MULTIVERSO</span>
              </h1>
            </div>
            
            <p className="max-w-3xl mx-auto text-xl md:text-2xl text-slate-500 font-light leading-relaxed tracking-tight">
              Onde a consciência encontra a arquitetura universal. <br />
              Manifeste sua própria realidade na rede de criadores multidimensionais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-8 justify-center pt-12">
              <Button size="lg" className="bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full px-12 h-20 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95" asChild>
                <a href="#join">
                  {user ? (
                    <span className="flex items-center gap-3">
                      <Terminal className="h-5 w-5" /> ENTRAR NO TERMINAL
                    </span>
                  ) : (
                    <span className="flex items-center gap-3">
                      <Sparkles className="h-5 w-5" /> INICIAR JORNADA
                    </span>
                  )}
                </a>
              </Button>
              <Button size="lg" variant="outline" className="border-slate-200 text-slate-600 hover:bg-slate-50 font-bold rounded-full px-12 h-20 transition-all hover:border-slate-400" asChild>
                <a href="https://discord.gg/9znvQram" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3">
                  <MessageCircle className="h-5 w-5" /> COMUNIDADE DISCORD
                </a>
              </Button>
            </div>
            
            <div className="pt-24 opacity-20 animate-bounce">
              <ArrowDown className="mx-auto h-8 w-8" />
            </div>
          </div>
        </section>

        {/* Dashboard/Manifest Section */}
        <section id="join" className="py-40 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-32 items-start">
              <div className="space-y-12 sticky top-40">
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">
                    {user ? <Terminal className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
                    {user ? "Sistema de Controle" : "Nova Conexão"}
                  </div>
                  <h2 className="text-6xl font-headline font-bold text-slate-900 tracking-tight leading-tight">
                    {user ? "Terminal de Manifestação" : "Crie sua Identidade"}
                  </h2>
                  <div className="h-2 w-32 bg-slate-900 rounded-full" />
                </div>
                
                <p className="text-2xl text-slate-500 font-light leading-relaxed">
                  {user 
                    ? "Cada arquiteto possui o comando sobre uma única dimensão nesta linha temporal. Sua manifestação é o seu legado."
                    : "Registre sua assinatura oficial para começar a moldar sua realidade. Conecte-se com sua conta de e-mail ou Discord."}
                </p>

                <div className="grid sm:grid-cols-2 gap-6 pt-8">
                  {[
                    { text: "Acesso Discord", icon: <MessageCircle className="h-5 w-5" /> },
                    { text: "Universo Único", icon: <Globe className="h-5 w-5" /> },
                    { text: "Identidade NDI", icon: <ShieldCheck className="h-5 w-5" /> },
                    { text: "Painel Arquiteto", icon: <LayoutDashboard className="h-5 w-5" /> }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:border-slate-200 transition-colors group">
                      <div className="text-slate-400 group-hover:text-slate-900 transition-colors">
                        {item.icon}
                      </div>
                      <span className="font-bold text-xs uppercase tracking-widest text-slate-600">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-10 bg-slate-100/50 blur-[100px] rounded-full opacity-50" />
                <div className="relative mystic-glow rounded-3xl overflow-hidden">
                  <ProfileForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explorers Gallery */}
        <section id="explorers" className="py-40 bg-slate-50/50 border-t border-slate-100">
          <div className="container mx-auto px-4">
            <div className="text-center mb-32 space-y-6">
              <div className="inline-flex items-center gap-3 text-slate-400 font-black uppercase tracking-[0.4em] text-[10px]">
                <Users className="h-4 w-4" /> Rede de Arquitetos
              </div>
              <h2 className="text-6xl font-headline font-bold text-slate-900">Linha Temporal Ativa</h2>
              <div className="h-1 w-20 bg-slate-200 mx-auto rounded-full" />
              <p className="text-slate-500 max-w-2xl mx-auto text-xl font-light">
                Exploradores que manifestaram suas realidades nesta dimensão compartilhada.
              </p>
            </div>

            {isListLoading ? (
              <div className="flex flex-col items-center justify-center py-40 gap-8">
                <div className="relative">
                  <div className="h-24 w-24 border-[6px] border-slate-200 border-t-slate-900 rounded-full animate-spin" />
                  <Stars className="h-8 w-8 text-slate-900 absolute inset-0 m-auto animate-pulse" />
                </div>
                <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-[10px]">Sincronizando com o Multiverso...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                {explorers?.map((explorer) => (
                  <ExplorerCard key={explorer.id} explorer={explorer} />
                ))}
              </div>
            )}

            {!isListLoading && (!explorers || explorers.length === 0) && (
              <div className="text-center py-40 bg-white rounded-[3rem] border-2 border-dashed border-slate-200 max-w-4xl mx-auto">
                <div className="p-8 bg-slate-50 w-fit mx-auto rounded-full mb-8">
                  <Globe className="h-16 w-16 text-slate-200" />
                </div>
                <h3 className="text-3xl font-headline font-bold text-slate-900 mb-4">Vazio Detectado</h3>
                <p className="text-xl text-slate-500 font-light mb-8">Nenhum arquiteto manifestou presença nesta linha temporal ainda.</p>
                <Button variant="outline" className="rounded-full h-14 px-8" asChild>
                  <a href="#join">Manifestar Primeiro Universo</a>
                </Button>
              </div>
            )}
            
            {user && !isListLoading && explorers && explorers.length > 0 && (
              <div className="mt-40 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearAll}
                  className="text-slate-300 hover:text-slate-900 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.5em] transition-all"
                >
                  <Trash2 className="h-3 w-3" /> Colapsar Protótipo
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white py-32 border-t border-slate-100">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center gap-20">
            <div className="space-y-8 flex flex-col items-center lg:items-start">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <Logo className="text-slate-900 scale-125" />
              </Link>
              <div className="flex gap-12">
                <a href="https://discord.gg/9znvQram" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-slate-900 transition-colors flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em]">
                  <MessageCircle className="h-5 w-5" /> COMUNIDADE DISCORD
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-center lg:items-end gap-6 text-center lg:text-right">
              <p className="text-sm font-medium text-slate-400">
                © {currentYear || "..."} Projeto Multiverso. Aberto para arquitetos dimensionais.
              </p>
              <div className="flex gap-4">
                <span className="text-[9px] font-black bg-slate-50 px-4 py-2 rounded-full text-slate-400 uppercase tracking-[0.3em] border border-slate-100">Protocolo Místico 3.0</span>
                <span className="text-[9px] font-black bg-slate-900 px-4 py-2 rounded-full text-white uppercase tracking-[0.3em]">Status: Conectado</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <PalmeChat />
    </div>
  );
}
