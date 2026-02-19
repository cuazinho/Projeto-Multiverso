import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  iconOnly?: boolean;
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <svg
        width="45"
        height="45"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Circle Ring */}
        <circle cx="50" cy="50" r="46" stroke="currentColor" strokeWidth="2.5" opacity="0.8" />
        
        {/* Stylized 'P' with swirl */}
        <path
          d="M38 30V72 M38 32C65 32 65 52 38 52 C28 52 22 60 28 72C35 84 65 84 78 62"
          stroke="currentColor"
          strokeWidth="7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Accent dot or swirl end */}
        <circle cx="78" cy="62" r="3" fill="currentColor" />
      </svg>
      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className="font-headline font-bold text-xl tracking-tight">Projeto</span>
          <span className="font-headline font-bold text-xl tracking-tight -mt-1 opacity-90">Multiverso</span>
        </div>
      )}
    </div>
  );
}
