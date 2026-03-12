import { supabase } from './supabase';

export type LogEventType = 'READ' | 'WRITE' | 'AUTH' | 'SYSTEM' | 'IMPORT';

interface MonitoringLog {
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
 * Logs a system event to the monitoring table.
 * Used for real-time tracking of app usage and database requests.
 */
export const logSystemEvent = async (log: MonitoringLog) => {
    try {
        // Attempt to get user info if not provided
        let finalUserId = log.user_id;
        let finalUserName = log.user_name;
        let finalOrgId = log.organization_id;

        if (!finalUserId) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                finalUserId = user.id;
                // Since we don't have the profile here easily without an extra query, 
                // we'll rely on the caller to provide user_name if possible, 
                // otherwise it stays null/provided value.
            }
        }

        const { error } = await supabase
            .from('system_monitoring_logs')
            .insert({
                user_id: finalUserId,
                user_name: finalUserName || 'System/Anonymous',
                event_type: log.event_type,
                description: log.description,
                path: log.path || (typeof window !== 'undefined' ? window.location.pathname : undefined),
                metadata: log.metadata || {},
                payload_size: log.payload_size || 0,
                response_size: log.response_size || 0,
                organization_id: finalOrgId
            });

        if (error) {
            console.error('[Sentinel] Failed to log event:', error);
        }
    } catch (err) {
        // Fail silently to not disrupt the main app flow
        console.warn('[Sentinel] Logging error:', err);
    }
};

/**
 * Utility to estimate size of objects/payloads for Ingress/Egress tracking
 */
export const estimateSize = (obj: any): number => {
    try {
        return JSON.stringify(obj).length;
    } catch {
        return 0;
    }
};
