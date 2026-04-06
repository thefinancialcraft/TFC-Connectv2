import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // App Routes (Masking /portal)
      { source: '/login', destination: '/portal/login' },
      { source: '/signup', destination: '/portal/signup' },
      { source: '/signup-success', destination: '/portal/signup-success' },
      { source: '/dashboard', destination: '/portal/dashboard' },
      { source: '/activity', destination: '/portal/activity' },
      { source: '/followup', destination: '/portal/followup' },
      { source: '/settings', destination: '/portal/settings' },
      { source: '/customer', destination: '/portal/customer' },
      { source: '/campaign', destination: '/portal/campaign' },
      { source: '/campaign/:path*', destination: '/portal/campaign/:path*' },
      { source: '/users/:path*', destination: '/portal/users/:path*' },
      { source: '/organization', destination: '/portal/organization' },
      { source: '/organization/:path*', destination: '/portal/organization/:path*' },
      { source: '/team', destination: '/portal/team' },
      { source: '/team/:path*', destination: '/portal/team/:path*' },
      { source: '/pending', destination: '/portal/pending' },
      { source: '/rejected', destination: '/portal/rejected' },
      { source: '/suspended', destination: '/portal/suspended' },
      { source: '/hold', destination: '/portal/hold' },
      { source: '/profile-completion', destination: '/portal/profile-completion' },
      { source: '/call-sessions', destination: '/portal/call-sessions' },
    ];
  },
};

export default nextConfig;
