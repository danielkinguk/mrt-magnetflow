import { SidebarTrigger } from "./ui/sidebar";
import { ThemeToggle } from "./theme-toggle";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          <div className="p-1 border border-border rounded-md h-[36px] w-auto px-3 flex items-center justify-center">
            <span className="text-sm font-semibold text-foreground whitespace-nowrap">DK Apps 2025</span>
          </div>
        </div>
      </div>
    </header>
  )
}
