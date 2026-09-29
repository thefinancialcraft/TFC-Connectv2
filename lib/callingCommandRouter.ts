import { dispatchCallingMessage } from '@/lib/flutterBridge';
import { resolveActiveCallingProvider, type CallingProviderName } from '@/lib/callingProviderClient';

export type CallingBridgeCommand = 'call_to' | 'call_disconnect';

export interface CallingCommandResult {
  provider: CallingProviderName | null;
  bridgeConnected: boolean;
}

export async function routeCallingCommand(
  command: CallingBridgeCommand,
  payload: string,
  providerOverride?: CallingProviderName | null
): Promise<CallingCommandResult> {
  const provider = providerOverride === undefined
    ? await resolveActiveCallingProvider()
    : providerOverride;

  if (provider !== 'sim') {
    return { provider, bridgeConnected: false };
  }

  return {
    provider,
    bridgeConnected: dispatchCallingMessage(command, payload),
  };
}