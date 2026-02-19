"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/multiverso/navbar";
import { ProfileForm } from "@/components/multiverso/profile-form";
import { ExplorerCard } from "@/components/multiverso/explorer-card";
import { Logo } from "@/components/multiverso/logo";
import { Button } from "@/components/ui/button";
import { Users, ArrowDown, Sparkles, Globe, ShieldCheck, MessageCircle, Trash2 } from "lucide-react";
import { useCollection, useMemoFirebase, useFirestore, useAuth, useUser, deleteDocumentNonBlocking } from "@/firebase";
import { collection, query, orderBy, doc } from "firebase/firestore";
import { initiateAnonymousSignIn } from "@/firebase/non-blocking-login";
import { toast } from "@/hooks/use-toast";

export default function Home() {
  const { firestore, auth } = useFirestore() ? { firestore: useFirestore(), auth: useAuth() } : { firestore: null, auth: null };
  const { user, isUserLoading } = useUser();
  const [currentYear, setCurrentYear] = useState<number | null>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  useEffect(() => {
    if (!isUserLoading && !user && auth) {
      initiateAnonymousSignIn(auth);
    }
  }, [user, isUserLoading, auth]);

  const explorersQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, "explorer_profiles"), orderBy("createdAt", "desc"));
  }, [firestore]);

  const { data: explorers, isLoading: isListLoading } = useCollection(explorersQuery);

  const handleClearAll = async () => {
    if (!firestore || !explorers || explorers.length === 0) return;
    
    if (!confirm("⚠️ ATENÇÃO: Você deseja apagar TODOS os exploradores desta linha temporal? Esta ação é irreversível.")) {
      return;
    }

    explorers.forEach((explorer) => {
      const docRef = doc(firestore, "explorer_profiles", explorer.id);
      deleteDocumentNonBlocking(docRef);
    });

    toast({
      title: "Protocolo de Limpeza Iniciado",
      description: "Todos os registros estão sendo removidos da base de dados.",
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[85vh] flex items-center justify-center overflow-hidden bg-slate-50">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/multiverse-neutral/1920/1080" 
              alt="Multiverso" 
              className="w-full h-full object-cover grayscale opacity-10"
              data-ai-hint="minimalist space"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/80 to-background" />
          </div>
          
          <div className="container mx-auto px-4 z-10 text-center space-y-8">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-primary/5 backdrop-blur-sm border border-primary/10 rounded-full text-primary animate-fade-in">
              <ShieldCheck className="h-4 w-4" />
              <span className="text-xs font-bold uppercase tracking-[0.2em]">Acesso Autenticado</span>
            </div>
            
            <h1 className="text-6xl md:text-9xl font-headline font-bold leading-none tracking-tighter text-primary">
              PROJETO <br /> <span className="text-accent opacity-60">MULTIVERSO</span>
            </h1>
            
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              "Existem infinitos mundos, infinitas versões de você. <br /> 
              Manifeste a realidade que você deseja criar."
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-full px-10 h-16 shadow-2xl transition-all hover:scale-105" asChild>
                <a href="#join">Manifestar Universo</a>
              </Button>
              <Button size="lg" variant="outline" className="border-primary/20 text-primary hover:bg-primary/5 font-bold rounded-full px-10 h-16 transition-all" asChild>
                <a href="https://discord.gg/9znvQram" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" /> Comunidade Discord
                </a>
              </Button>
            </div>
            
            <div className="pt-16 animate-bounce opacity-30">
              <ArrowDown className="mx-auto h-6 w-6" />
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section id="join" className="py-32 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-24 items-center">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-5xl font-headline font-bold text-primary tracking-tight">Arquitete seu Destino</h2>
                  <div className="h-1.5 w-24 bg-accent/20 rounded-full" />
                </div>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Ao ingressar no Projeto Multiverso, você não é apenas um observador. Você é o arquiteto fundamental de uma nova linha temporal.
                </p>
                <div className="grid sm:grid-cols-2 gap-6">
                  {[
                    "Manifestação Dimensional",
                    "Propósitos Autênticos",
                    "Conexão de Criadores",
                    "Segurança de Dados Real"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border bg-secondary/20">
                      <div className="bg-primary/10 p-2 rounded-lg text-primary">
                        <Sparkles className="h-5 w-5" />
                      </div>
                      <span className="font-semibold text-sm">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute -inset-4 bg-primary/5 blur-3xl rounded-full" />
                <div className="relative">
                  <ProfileForm />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Explorers List Section */}
        <section id="explorers" className="py-32 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20 space-y-4">
              <div className="inline-flex items-center gap-2 text-accent font-bold uppercase tracking-widest text-xs py-1 px-3 border border-accent/20 rounded-full">
                <Users className="h-3 w-3" /> Catalogação de Criadores
              </div>
              <h2 className="text-5xl font-headline font-bold text-primary">Exploradores Ativos</h2>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Visualizando apenas perfis verificados e arquiteturas universais genuínas.
              </p>
            </div>

            {isListLoading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-6">
                <div className="relative">
                  <div className="h-16 w-16 border-4 border-primary/10 border-t-primary rounded-full animate-spin" />
                  <Globe className="h-6 w-6 text-primary absolute inset-0 m-auto animate-pulse" />
                </div>
                <p className="text-muted-foreground font-medium animate-pulse">Sintonizando frequências reais...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
                {explorers?.map((explorer) => (
                  <ExplorerCard key={explorer.id} explorer={explorer} />
                ))}
              </div>
            )}

            {!isListLoading && (!explorers || explorers.length === 0) && (
              <div className="text-center py-24 bg-white/50 backdrop-blur-md rounded-3xl border-2 border-dashed border-primary/10">
                <Globe className="h-16 w-16 text-primary/20 mx-auto mb-6" />
                <p className="text-xl text-muted-foreground font-medium">Nenhum criador catalogado nesta linha temporal.</p>
                <p className="text-sm text-muted-foreground/60 mt-2">Seja o primeiro a manifestar seu universo.</p>
              </div>
            )}
            
            {!isListLoading && explorers && explorers.length > 0 && (
              <div className="mt-20 flex justify-center">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleClearAll}
                  className="text-muted-foreground hover:text-destructive flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] opacity-30 hover:opacity-100 transition-all"
                >
                  <Trash2 className="h-3 w-3" /> Reiniciar Protótipo (Limpar Tudo)
                </Button>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-white py-16 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12">
            <div className="space-y-6 flex flex-col items-center md:items-start">
              <Link href="/" className="hover:opacity-70 transition-opacity">
                <Logo className="text-primary scale-110" />
              </Link>
              <div className="flex gap-6">
                <a href="https://discord.gg/9znvQram" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-[#5865F2] transition-colors flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
                  <MessageCircle className="h-4 w-4" /> Discord do Projeto
                </a>
              </div>
            </div>
            
            <div className="flex flex-col items-center md:items-end gap-4 text-center md:text-right">
              <p className="text-sm font-medium text-muted-foreground">
                © {currentYear || "..."} Projeto Multiverso. Todos os dados são protegidos por criptografia dimensional.
              </p>
              <div className="flex gap-4">
                <span className="text-[10px] font-mono bg-secondary px-3 py-1 rounded-full text-muted-foreground uppercase tracking-widest">Protocolo: V-2.0</span>
                <span className="text-[10px] font-mono bg-green-50 px-3 py-1 rounded-full text-green-700 uppercase tracking-widest border border-green-100">Status: Sincronizado</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}