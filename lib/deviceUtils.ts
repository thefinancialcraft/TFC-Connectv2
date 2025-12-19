/**
 * Utility functions to extract device and browser information from user agent
 */

export interface DeviceInfo {
  deviceName: string;
  browser: string;
  userAgent: string;
  deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown';
}

export function getDeviceInfo(userAgent: string): DeviceInfo {
  const ua = userAgent || '';

  // Detect device type first
  let deviceType: 'mobile' | 'tablet' | 'desktop' | 'unknown' = 'unknown';
  if (ua.match(/Mobile|Android|iPhone|iPod|BlackBerry|Opera Mini|IEMobile/i)) {
    deviceType = 'mobile';
  } else if (ua.match(/iPad|Tablet|PlayBook|Silk/i) || (ua.includes('Android') && !ua.match(/Mobile/i))) {
    deviceType = 'tablet';
  } else if (ua.includes('Windows') || ua.includes('Macintosh') || ua.includes('Linux') || ua.includes('X11')) {
    deviceType = 'desktop';
  }

  // Detect browser
  let browser = 'Unknown';
  if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
    browser = 'Chrome';
  } else if (ua.includes('Firefox')) {
    browser = 'Firefox';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browser = 'Safari';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
  } else if (ua.includes('OPR')) {
    browser = 'Opera';
  } else if (ua.includes('MSIE') || ua.includes('Trident')) {
    browser = 'Internet Explorer';
  }

  // Detect device/OS
  let deviceName = 'Unknown Device';
  if (ua.includes('Windows')) {
    if (ua.includes('Windows NT 10.0')) {
      deviceName = 'Windows 10/11';
    } else if (ua.includes('Windows NT 6.3')) {
      deviceName = 'Windows 8.1';
    } else if (ua.includes('Windows NT 6.2')) {
      deviceName = 'Windows 8';
    } else if (ua.includes('Windows NT 6.1')) {
      deviceName = 'Windows 7';
    } else {
      deviceName = 'Windows';
    }
    deviceName += ` on ${browser}`;
  } else if (ua.includes('Mac OS X') || ua.includes('Macintosh')) {
    if (ua.match(/iPhone|iPod/)) {
      deviceName = 'iPhone';
    } else if (ua.match(/iPad/)) {
      deviceName = 'iPad';
    } else {
      deviceName = 'Mac';
    }
    deviceName += ` on ${browser}`;
  } else if (ua.includes('Android')) {
    deviceName = 'Android';
    if (ua.match(/Mobile/)) {
      deviceName = 'Android Phone';
    } else {
      deviceName = 'Android Tablet';
    }
    deviceName += ` on ${browser}`;
  } else if (ua.includes('Linux')) {
    deviceName = `Linux on ${browser}`;
  } else if (ua.includes('iOS')) {
    if (ua.match(/iPhone|iPod/)) {
      deviceName = 'iPhone';
    } else if (ua.match(/iPad/)) {
      deviceName = 'iPad';
    } else {
      deviceName = 'iOS Device';
    }
    deviceName += ` on ${browser}`;
  } else {
    deviceName = `Unknown Device on ${browser}`;
  }

  return {
    deviceName,
    browser,
    userAgent: ua,
    deviceType,
  };
}

export function getClientIP(req: any): string {
  // Try various headers for IP address
  const forwarded = req.headers?.['x-forwarded-for'];
  const realIP = req.headers?.['x-real-ip'];
  const cfConnectingIP = req.headers?.['cf-connecting-ip'];

  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  if (realIP) {
    return realIP;
  }
  if (cfConnectingIP) {
    return cfConnectingIP;
  }
  if (req.socket?.remoteAddress) {
    return req.socket.remoteAddress;
  }
  
  return 'Unknown';
}

/**
 * Get location from browser geolocation API
 * Returns a promise that resolves to location string or null
 */
export async function getBrowserLocation(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          
          // Use reverse geocoding API to get location name
          // Using a free service (nominatim) - you may want to use a paid service for production
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`,
            {
              headers: {
                'User-Agent': 'TFC-Connect App',
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const address = data.address;
            
            if (address) {
              // Format location string
              const parts = [];
              if (address.city || address.town || address.village) {
                parts.push(address.city || address.town || address.village);
              }
              if (address.state) {
                parts.push(address.state);
              }
              if (address.country) {
                parts.push(address.country);
              }
              
              resolve(parts.length > 0 ? parts.join(', ') : `${latitude}, ${longitude}`);
            } else {
              resolve(`${latitude}, ${longitude}`);
            }
          } else {
            // Fallback to coordinates if API fails
            resolve(`${latitude}, ${longitude}`);
          }
        } catch (error) {
          console.error('Error getting location name:', error);
          resolve(null);
        }
      },
      (error) => {
        // User denied permission or error occurred
        console.log('Geolocation error:', error.message);
        resolve(null);
      },
      {
        timeout: 5000,
        maximumAge: 60000, // Cache for 1 minute
      }
    );
  });
}

/**
 * Get location from IP address using a free geolocation API
 */
export async function getLocationFromIP(ipAddress: string): Promise<string> {
  if (!ipAddress || ipAddress === 'Unknown' || ipAddress === 'localhost' || ipAddress.startsWith('127.')) {
    return 'Unknown Location';
  }

  try {
    // Using ip-api.com (free tier: 45 requests per minute)
    const response = await fetch(`http://ip-api.com/json/${ipAddress}?fields=status,message,country,regionName,city`);
    
    if (response.ok) {
      const data = await response.json();
      
      if (data.status === 'success') {
        const parts = [];
        if (data.city) parts.push(data.city);
        if (data.regionName) parts.push(data.regionName);
        if (data.country) parts.push(data.country);
        
        return parts.length > 0 ? parts.join(', ') : 'Unknown Location';
      }
    }
  } catch (error) {
    console.error('Error getting location from IP:', error);
  }
  
  return 'Unknown Location';
}

