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

  return (
    <UserProvider>
      <SessionProvider>
        <AppLayout hideSidebar={isMinimal} hideHeader={isMinimal}>
          {children}
          <GlobalCallHandler />
          <CallReminderOverlay />
          <LogPip />
        </AppLayout>
      </SessionProvider>
    </UserProvider>
  );
}
