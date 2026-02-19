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
        <div className="flex items-center gap-4 sm:gap-6">
          <Link href="#explorers" className="flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors text-muted-foreground">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Exploradores</span>
          </Link>
          
          <a 
            href="https://discord.gg/9znvQram" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm font-medium hover:text-[#5865F2] transition-colors text-muted-foreground"
            title="Entrar no Discord"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 127.14 96.36" 
              fill="currentColor" 
              xmlns="http://www.w3.org/2000/svg"
              className="shrink-0"
            >
              <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.71,32.65-1.82,56.6.48,80.21a105.73,105.73,0,0,0,32.28,16.15,77.7,77.7,0,0,0,7.37-12,67.39,67.39,0,0,1-11.87-5.65c.99-.73,2-1.48,2.92-2.26a74.35,74.35,0,0,0,64.59,0c.95.78,1.93,1.53,2.92,2.26a67.85,67.85,0,0,1-11.89,5.65,77.89,77.89,0,0,0,7.37,12,105.3,105.3,0,0,0,32.31-16.15C130.58,52.2,121.81,28.7,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.07,65.69,82.45,65.69Z"/>
            </svg>
            <span className="hidden md:inline">Discord</span>
          </a>

          <Link href="#join" className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-sm font-bold hover:bg-accent hover:text-accent-foreground transition-all shadow-md">
            <UserPlus className="h-4 w-4" />
            <span>Participar</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
