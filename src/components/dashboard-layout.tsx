'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
} from '@/components/ui/sidebar';
import { EdHubLogo } from '@/components/icons/edhub-logo';
import { UserRole } from '@/lib/types';
import { navLinks } from '@/lib/constants';
import { LogOut, Loader2 } from 'lucide-react';
import { DashboardHeader } from './dashboard-header';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';

type DashboardLayoutProps = {
  children: React.ReactNode;
  role: UserRole;
};

export function DashboardLayout({
  children,
  role,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const auth = useAuth();
  const { user, isUserLoading, userError } = useUser();

  const navigation = navLinks[role];
  const dashboardTitle = `${role.charAt(0).toUpperCase() + role.slice(1)} Dashboard`;

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (isUserLoading) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
      </div>
    );
  }

  if (userError || !user) {
    // Redirect to login if not authenticated
    if (typeof window !== 'undefined') {
      router.push('/');
    }
    return null;
  }
  
  const userProfile = {
      name: user.displayName || 'User',
      email: user.email || '',
      avatar: user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`,
  }


  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="p-4">
             <div className="flex items-center gap-2">
               <EdHubLogo className="h-8 w-8 text-primary" />
               <h1 className="text-2xl font-headline font-bold text-foreground">EdHub</h1>
             </div>
             <p className="text-sm text-muted-foreground mt-1">{dashboardTitle}</p>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              {navigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={handleLogout} tooltip="Logout">
                    <LogOut />
                    <span>Logout</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>
        </Sidebar>
        <SidebarInset className="flex-1">
          <DashboardHeader user={userProfile} />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}