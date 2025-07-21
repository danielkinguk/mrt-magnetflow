'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/header';
import { Logo } from '@/components/icons';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarInset,
} from '@/components/ui/sidebar';
import { LayoutGrid, UserPlus, Folder, Home, LogOut } from 'lucide-react';
import { ALL_BOARDS } from '@/lib/mrt/board-data';
import { FullscreenProvider, useFullscreen } from '@/hooks/use-fullscreen';
import React, { useState, useEffect, useCallback } from 'react';

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isMaximized } = useFullscreen();
  const [tidyUpFn, setTidyUpFn] = useState<(() => void) | undefined>(undefined);

  // Create a stable setTidyUp function
  const setTidyUp = useCallback((fn: () => void) => {
    console.log('setTidyUp called with function:', !!fn);
    setTidyUpFn(() => fn);
  }, []);

  const isBoardPage = pathname.startsWith('/boards/');

  // Create a simple tidy function that works
  const handleTidyUp = useCallback(() => {
    // Find all column elements and align them
    const columns = document.querySelectorAll('[data-column-id]');
    columns.forEach((column, index) => {
      const element = column as HTMLElement;
      if (element) {
        element.style.position = 'absolute';
        element.style.left = `${index * 340 + 20}px`;
        element.style.top = '120px';
      }
    });
  }, []);

  // This effect ensures that the tidyUp function is cleared when navigating away from a board page.
  useEffect(() => {
    if (!isBoardPage) {
      setTidyUpFn(undefined);
    } else {
      setTidyUpFn(() => handleTidyUp);
    }
  }, [isBoardPage, handleTidyUp]);

  // Just render children normally
  const childrenWithProps = children;

  return (
    <SidebarProvider>
      {!isMaximized && (
        <Sidebar>
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Logo className="w-7 h-7 text-primary" />
              <span className="text-lg font-semibold">MagnetFlow</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Home"
                  isActive={pathname === '/welcome'}
                >
                  <a href="/welcome">
                    <Home />
                    Home
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Boards"
                  isActive={pathname === '/boards'}
                >
                  <a href="/boards">
                    <LayoutGrid />
                    Boards
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Logout"
                >
                  <a href="/logout">
                    <LogOut />
                    Logout
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarGroup>
              <SidebarGroupLabel>Boards</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {ALL_BOARDS.map((board) => (
                    <SidebarMenuItem key={board.id}>
                      <SidebarMenuButton
                        asChild
                        isActive={pathname === `/boards/${board.id}`}
                      >
                        <a href={`/boards/${board.id}`}>
                          <Folder />
                          {board.name}
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>
      )}
      <SidebarInset className={isMaximized ? "ml-0 !p-0" : ""}>
        <Header />
        {isBoardPage ? (
          // Full height layout for board pages (no footer)
          <div className="h-full">
            {childrenWithProps}
          </div>
        ) : (
          // Flex layout for other pages (with footer)
          <div className="flex flex-col min-h-screen">
            <main className="flex-1">
              {childrenWithProps}
            </main>
            <footer className="py-6 md:px-8 md:py-0 border-t">
              <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-balance text-center text-sm leading-loose text-muted-foreground md:text-left">
                  Built by you. Powered by DK Apps - Copyright 2025
                </p>
              </div>
            </footer>
          </div>
        )}
      </SidebarInset>
      {isBoardPage && (
        <div style={{display: 'none'}}>
          Debug: isBoardPage={isBoardPage.toString()}, tidyUpFn={tidyUpFn ? 'available' : 'undefined'}
        </div>
      )}

    </SidebarProvider>
  );
}


export function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <FullscreenProvider>
      <LayoutContent>{children}</LayoutContent>
    </FullscreenProvider>
  );
}
