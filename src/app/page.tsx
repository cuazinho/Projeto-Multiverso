"use client"

import { useState, useEffect } from "react";
import { Navbar } from "@/components/multiverso/navbar";
import { ProfileForm } from "@/components/multiverso/profile-form";
import { ExplorerCard } from "@/components/multiverso/explorer-card";
import { Button } from "@/components/ui/button";
import { Globe, Users, ArrowDown, Sparkles } from "lucide-react";

interface Explorer {
  name: string;
  idName: string;
  purpose: string;
  universe: string;
  profileImage?: string;
}

const MOCK_EXPLORERS: Explorer[] = [
  {
    name: "Arthur Dent",
    idName: "tea_lover",
    purpose: "Simplesmente sobreviver à demolição da Terra e encontrar uma boa xícara de chá.",
    universe: "Via Láctea (Setor ZZ9 Plural Z Alpha)",
    profileImage: "https://picsum.photos/seed/arthur/200/200"
  },
  {
    name: "Rick Sanchez",
    idName: "wubbalubba",
    purpose: "A busca infinita por inteligência e diversão amoral através das dimensões.",
    universe: "Dimensão C-137",
    profileImage: "https://picsum.photos/seed/rick/200/200"
  },
  {
    name: "Peter Parker",
    idName: "friendly_neighborhood",
    purpose: "Proteger os inocentes enquanto tenta equilibrar a vida de um estudante comum.",
    universe: "Terra-616",
    profileImage: "https://picsum.photos/seed/spidey/200/200"
  }
];

export default function Home() {
  const [explorers, setExplorers] = useState<Explorer[]>([]);

  useEffect(() => {
    // In a real app, this would come from a database. 
    // We'll initialize with some mock data.
    setExplorers(MOCK_EXPLORERS);
  }, []);

  const addExplorer = (newExplorer: Explorer) => {
    setExplorers((prev) => [newExplorer, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://picsum.photos/seed/multiverse-bg/1920/1080" 
              alt="Multiverso" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
              data-ai-hint="space galaxy"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/50 via-transparent to-background" />
          </div>
          
          <div className="container mx-auto px-4 z-10 text-center text-white space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 backdrop-blur-sm border border-accent/30 rounded-full text-accent-foreground animate-bounce">
              <Sparkles className="h-4 w-4" />
              <span className="text-sm font-bold uppercase tracking-widest">Inscrições Abertas</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-headline font-bold leading-tight">
              PROJETO <br /> <span className="text-accent">MULTIVERSO</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80 font-light italic">
              "Existem infinitos mundos, infinitas versões de você. <br /> 
              Aqui, todas as identidades se encontram."
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold rounded-full px-8 h-14" asChild>
                <a href="#join">Criar Minha Ficha</a>
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-primary font-bold rounded-full px-8 h-14" asChild>
                <a href="#explorers">Ver Exploradores</a>
              </Button>
            </div>
            <div className="pt-12 animate-pulse">
              <ArrowDown className="mx-auto h-8 w-8 opacity-50" />
            </div>
          </div>
        </section>

        {/* Join Section */}
        <section id="join" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-6">
                <h2 className="text-4xl font-headline font-bold text-primary">Deixe sua Marca no Infinito</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Ao se inscrever no Projeto Multiverso, você não apenas registra sua presença, mas abre portas para conexões interdimensionais. Defina seu propósito, identifique seu universo e mostre quem você realmente é através das realidades.
                </p>
                <ul className="space-y-4">
                  {[
                    "Registro universal único",
                    "Compartilhamento de propósitos",
                    "Mapa de universos conhecidos",
                    "Identidade visual personalizada"
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="bg-accent/10 p-1 rounded-full">
                        <Globe className="h-5 w-5 text-accent" />
                      </div>
                      <span className="font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <ProfileForm onAddExplorer={addExplorer} />
              </div>
            </div>
          </div>
        </section>

        {/* Explorers List Section */}
        <section id="explorers" className="py-24 bg-secondary/30">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16 space-y-4">
              <div className="flex justify-center items-center gap-2 text-primary font-bold uppercase tracking-tighter text-sm">
                <Users className="h-5 w-5" /> Catalogação Ativa
              </div>
              <h2 className="text-4xl font-headline font-bold">Diretório de Exploradores</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Todos que cruzaram o portal e registraram sua jornada. Conheça seus vizinhos de outras dimensões.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {explorers.map((explorer, index) => (
                <ExplorerCard key={`${explorer.idName}-${index}`} explorer={explorer} />
              ))}
            </div>

            {explorers.length === 0 && (
              <div className="text-center py-20 bg-card rounded-2xl border-2 border-dashed border-primary/20">
                <Globe className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <p className="text-muted-foreground">Nenhum explorador catalogado ainda. Seja o primeiro!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground py-12 border-t border-accent/20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-md">
                <Globe className="h-5 w-5 text-primary" />
              </div>
              <span className="font-headline text-lg font-bold tracking-tight">PROJETO MULTIVERSO</span>
            </div>
            
            <p className="text-sm text-primary-foreground/60 text-center">
              © {new Date().getFullYear()} Projeto Multiverso. Todos os direitos reservados através de todas as dimensões.
            </p>

            <div className="flex gap-4">
              <span className="text-xs font-mono bg-accent/20 px-3 py-1 rounded-full text-accent-foreground">Versão: Omega-01</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
