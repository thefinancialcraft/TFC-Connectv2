import React from 'react';
import SessionRedirect from "./SessionRedirect";
import { UserProvider } from "./UserProvider";
import LogPip from "./LogPip";
import GlobalCallHandler from "./GlobalCallHandler";
import CallReminderOverlay from "./CallReminderOverlay";

interface PortalContainerProps {
  children: React.ReactNode;
}

export default function PortalContainer({ children }: PortalContainerProps) {
  return (
    <UserProvider>
      <SessionRedirect />
      <GlobalCallHandler />
      <CallReminderOverlay />
      <LogPip />
      {children}
    </UserProvider>
  );
}
