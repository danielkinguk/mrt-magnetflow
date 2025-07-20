import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function RootPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 items-center">
            <Link href="/" className="flex items-center space-x-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-7 h-7 text-primary"
              >
                <path d="M15 7h2a5 5 0 0 1 0 10h-2" />
                <path d="M9 17H7A5 5 0 0 1 7 7h2" />
                <path d="M8 12h8" />
              </svg>
              <span className="font-bold text-lg">MagnetFlow</span>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid gap-6 items-center">
              <div className="flex flex-col justify-center space-y-4 text-center">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                    Visualize Your Ideas, Unleash Your Flow
                  </h1>
                  <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                    MagnetFlow provides a digital canvas for your team. Use our magnetic boards to organize tasks, brainstorm concepts, and manage projects with intuitive drag-and-drop simplicity.
                  </p>
                </div>
                <div className="w-full max-w-sm sm:max-w-md mx-auto">
                   <Button asChild size="lg">
                    <Link href="/boards/mrt-board">
                      Get Started <ArrowRight className="ml-2" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by you. Powered by AI.
          </p>
        </div>
      </footer>
    </div>
  );
}
