import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';
import DashboardSidebar from './_component/DashboardSidebar';
import DashboardHeader from './_component/DashboardHeader';
import { Toaster } from '@/components/ui/sonner';

export default function DashboardLayout({children}: {children: React.ReactNode}) {
    return (
        <SidebarProvider>
            {/* sidebar left side */}
            <DashboardSidebar />
            {/* sidebar right side */}
            <main className='bg-gray-100 w-full'>
                <DashboardHeader />
                {/* main content */}
                {children}
            </main>
        </SidebarProvider> 
    )
}