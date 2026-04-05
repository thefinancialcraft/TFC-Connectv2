/**
 * Sentinel Monitoring - DISABLED
 * This file is kept as an empty shell to avoid breaking existing imports.
 */

export type LogEventType = 'READ' | 'WRITE' | 'AUTH' | 'SYSTEM' | 'IMPORT';

export interface MonitoringLog {
    event_type: LogEventType;
    description: string;
    path?: string;
    metadata?: any;
    payload_size?: number;
    response_size?: number;
    user_id?: string;
    user_name?: string;
    organization_id?: string;
}

/**
 * Disabled function - does nothing.
 */
export const logSystemEvent = async (_log: MonitoringLog) => {
    // Monitoring completely disabled by user request.
    return;
};

/**
 * Utility kept for type-safety only.
 */
export const estimateSize = (_obj: any): number => {
    return 0;
};
