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
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        {/* Outer Swirl Ring */}
        <path
          d="M192 42C108.6 42 41 109.6 41 193C41 276.4 108.6 344 192 344C244 344 289.4 317.8 316.5 278M192 42C275.4 42 343 109.6 343 193C343 276.4 275.4 344 192 344"
          stroke="currentColor"
          strokeWidth="24"
          strokeLinecap="round"
          opacity="0.9"
        />
        
        {/* The Stylized 'P' with fluid curves based on user image */}
        <path
          d="M178 95V340M178 100C230 100 280 120 280 185C280 250 230 270 178 270 M340 160C340 250 250 340 150 340"
          stroke="currentColor"
          strokeWidth="32"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Tapered swirl end from the image */}
        <path
          d="M280 185C280 230 240 280 178 310"
          stroke="currentColor"
          strokeWidth="12"
          strokeLinecap="round"
          opacity="0.6"
        />
      </svg>
      {!iconOnly && (
        <div className="flex flex-col leading-tight">
          <span className="font-headline font-bold text-xl tracking-tight uppercase">Projeto</span>
          <span className="font-headline font-bold text-xl tracking-tight -mt-1 opacity-80 uppercase">Multiverso</span>
        </div>
      )}
    </div>
  );
}