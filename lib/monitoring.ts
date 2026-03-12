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

// Cache to store user profile name during the session to avoid redundant queries
let cachedUserName: string | null = null;

/**
 * Logs a system event to the monitoring table.
 * Used for real-time tracking of app usage and database requests.
 */
export const logSystemEvent = async (log: MonitoringLog) => {
    try {
        let finalUserId = log.user_id;
        let finalUserName = log.user_name;
        let finalOrgId = log.organization_id;

        // 1. Resolve User ID and Name
        if (!finalUserId || !finalUserName) {
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
                finalUserId = finalUserId || user.id;
                
                if (!finalUserName) {
                    // Check cache first
                    if (cachedUserName) {
                        finalUserName = cachedUserName;
                    } else {
                        // Attempt to get name from profile table
                        const { data: profile } = await supabase
                            .from('user_profiles')
                            .select('user_name')
                            .eq('id', user.id)
                            .single();
                        
                        if (profile?.user_name) {
                            finalUserName = profile.user_name;
                            cachedUserName = profile.user_name; // Cache it
                        }

                    }
                }
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
