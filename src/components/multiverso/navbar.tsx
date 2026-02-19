import { Users, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './logo';

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          <Logo className="text-primary" />
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#explorers" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Exploradores</span>
          </Link>
          <Link href="#join" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:bg-accent hover:text-accent-foreground transition-all shadow-md">
            <UserPlus className="h-4 w-4" />
            <span>Participar</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
