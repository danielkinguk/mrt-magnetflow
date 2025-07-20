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

export function MainLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
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
              <SidebarMenuButton href="/welcome" tooltip="Home" isActive={pathname === '/welcome' || pathname === '/'}>
                <Home />
                Home
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/boards/mrt-board" tooltip="Boards" isActive={pathname.startsWith('/boards')}>
                <LayoutGrid />
                Boards
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/invite" tooltip="Invite">
                <UserPlus />
                Invite
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/logout" tooltip="Logout">
                <LogOut />
                Logout
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
                      href={`/boards/${board.id}`}
                      isActive={pathname === `/boards/${board.id}`}
                    >
                      <Folder />
                      {board.name}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <Header />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
