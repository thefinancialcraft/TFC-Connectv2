import React from 'react';
import { UserProvider } from "./UserProvider";
import AppLayout from "./AppLayout";
import GlobalCallHandler from "./GlobalCallHandler";
import { useRouter } from "next/router";
import CallReminderOverlay from "./CallReminderOverlay";
import LogPip from "./LogPip";
import { SessionProvider } from '../context/SessionContext';

export default function PortalContainer({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  
  // Minimal Layout Pages (No Sidebar/Header)
  const minimalPages = [
    '/portal/login',
    '/portal/signup',
    '/portal/signup-success',
    '/portal/hold',
    '/portal/pending', 
    '/portal/suspended',
    '/portal/rejected',
    '/portal/profile-completion'
  ];

  const isMinimal = minimalPages.includes(router.pathname);
  const hideGlobalHeader = isMinimal || router.pathname === '/portal/dashboard_v2';

  return (
    <UserProvider>
      <SessionProvider>
        <AppLayout hideSidebar={isMinimal} hideHeader={hideGlobalHeader}>
          {children}
          <GlobalCallHandler />
          <CallReminderOverlay />
          <LogPip />
        </AppLayout>
      </SessionProvider>
    </UserProvider>
  );
}
