import { SidebarTrigger } from "./ui/sidebar";
import { ThemeToggle } from "./theme-toggle";
import Image from 'next/image';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="flex items-center gap-2">
            <SidebarTrigger />
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <div className="p-1 border border-gray-200 rounded-md">
            <Image src="/images/logo.png" alt="DK Apps Logo" width={100} height={36} />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
