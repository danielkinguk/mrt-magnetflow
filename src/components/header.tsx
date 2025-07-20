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
          <div className="p-1 border border-border rounded-md h-[36px] w-[100px]">
            <img src="https://placehold.co/100x36.png" alt="App Logo" className="h-full w-full object-contain" data-ai-hint="logo" />
          </div>
        </div>
      </div>
    </header>
  )
}
