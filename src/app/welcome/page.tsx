import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Logo } from '@/components/icons';
import Image from 'next/image';

export default function WelcomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="container z-40 bg-background">
        <div className="flex h-20 items-center justify-between py-6">
          <div className="flex gap-6 items-center ml-4 md:ml-6 lg:ml-8">
            <Link href="/" className="flex items-center space-x-2">
              <Logo className="w-7 h-7 text-primary" />
              <span className="font-bold text-lg">MagnetFlow</span>
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-4xl px-4 md:px-6">
          <div className="flex flex-col items-center space-y-8">
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_100%] animate-pulse-light">
                Visualise Your Ideas, Unleash Your Flow
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl mx-auto">
                MagnetFlow provides a digital canvas for your team. Use our magnetic boards to organize tasks, brainstorm concepts, and manage projects with intuitive drag-and-drop simplicity.
              </p>
            </div>
            
            {/* DK Apps Logo */}
            <div className="flex justify-center">
              <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-200 flex items-center justify-center min-h-[80px] min-w-[140px]">
                <Image
                  src="/logo.png"
                  alt="DK Apps Logo"
                  width={120}
                  height={60}
                  className="object-contain"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Get Started Button - Positioned at bottom */}
      <div className="flex justify-center pb-16">
        <Button asChild size="lg" className="text-lg px-8 py-4">
          <Link href="/boards">
            Get Started <ArrowRight className="ml-2" />
          </Link>
        </Button>
      </div>
      
      <footer className="py-6 md:px-8 md:py-0 border-t">
        <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
          <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
            Built by you. Powered by DK Apps - Copyright 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
