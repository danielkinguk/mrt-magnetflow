import { SidebarTrigger } from "./ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import { useFullscreen } from "@/hooks/use-fullscreen";
import { Maximize, Minimize } from "lucide-react";
import { Button } from "./ui/button";

export function Header() {
  const { isMaximized, toggle } = useFullscreen();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
           <Button variant="outline" size="icon" onClick={toggle} title={isMaximized ? 'Minimize' : 'Maximize'}>
            {isMaximized ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </Button>
          <ThemeToggle />
          <div className="p-1 border border-border rounded-md h-[36px] w-auto px-3 flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">DK Apps 2025</span>
          </div>
        </div>
      </div>
    </header>
  )
}
