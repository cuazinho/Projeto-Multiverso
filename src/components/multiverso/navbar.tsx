import { Globe, Users, UserPlus } from 'lucide-react';
import Link from 'next/link';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="bg-primary p-2 rounded-lg">
            <Globe className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-headline text-xl font-bold tracking-tight">PROJETO MULTIVERSO</span>
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#explorers" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Exploradores</span>
          </Link>
          <Link href="#join" className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all">
            <UserPlus className="h-4 w-4" />
            <span>Participar</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
