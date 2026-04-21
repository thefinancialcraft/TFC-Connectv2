self.__BUILD_MANIFEST = {
  "/": [
    "static/chunks/pages/index.js"
  ],
  "/portal/call-sessions": [
    "static/chunks/pages/portal/call-sessions.js"
  ],
  "/portal/customer": [
    "static/chunks/pages/portal/customer.js"
  ],
  "/portal/dashboard": [
    "static/chunks/pages/portal/dashboard.js"
  ],
  "/portal/login": [
    "static/chunks/pages/portal/login.js"
  ],
  "/portal/users": [
    "static/chunks/pages/portal/users.js"
  ],
  "__rewrites": {
    "afterFiles": [
      {
        "source": "/login",
        "destination": "/portal/login"
      },
      {
        "source": "/signup",
        "destination": "/portal/signup"
      },
      {
        "source": "/signup-success",
        "destination": "/portal/signup-success"
      },
      {
        "source": "/dashboard",
        "destination": "/portal/dashboard"
      },
      {
        "source": "/activity",
        "destination": "/portal/activity"
      },
      {
        "source": "/followup",
        "destination": "/portal/followup"
      },
      {
        "source": "/settings",
        "destination": "/portal/settings"
      },
      {
        "source": "/customer",
        "destination": "/portal/customer"
      },
      {
        "source": "/campaign",
        "destination": "/portal/campaign"
      },
      {
        "source": "/campaign/:path*",
        "destination": "/portal/campaign/:path*"
      },
      {
        "source": "/users/:path*",
        "destination": "/portal/users/:path*"
      },
      {
        "source": "/organization",
        "destination": "/portal/organization"
      },
      {
        "source": "/organization/:path*",
        "destination": "/portal/organization/:path*"
      },
      {
        "source": "/team",
        "destination": "/portal/team"
      },
      {
        "source": "/team/:path*",
        "destination": "/portal/team/:path*"
      },
      {
        "source": "/pending",
        "destination": "/portal/pending"
      },
      {
        "source": "/rejected",
        "destination": "/portal/rejected"
      },
      {
        "source": "/suspended",
        "destination": "/portal/suspended"
      },
      {
        "source": "/hold",
        "destination": "/portal/hold"
      },
      {
        "source": "/profile-completion",
        "destination": "/portal/profile-completion"
      },
      {
        "source": "/call-sessions",
        "destination": "/portal/call-sessions"
      }
    ],
    "beforeFiles": [],
    "fallback": []
  },
  "sortedPages": [
    "/",
    "/_app",
    "/_error",
    "/api/agent_performance",
    "/api/ai/copilot",
    "/api/auth/activate-session",
    "/api/auth/active-sessions",
    "/api/auth/batch-status",
    "/api/auth/bulk-delete-users",
    "/api/auth/bulk-import",
    "/api/auth/callback",
    "/api/auth/deactivate-session",
    "/api/auth/delete-session",
    "/api/auth/delete-user",
    "/api/auth/forgot-email",
    "/api/auth/get-email-by-id",
    "/api/auth/heartbeat",
    "/api/auth/import-user",
    "/api/auth/login",
    "/api/auth/login-userid",
    "/api/auth/quick-login",
    "/api/auth/reset-password",
    "/api/auth/revoke-session",
    "/api/auth/send-invite",
    "/api/auth/signup",
    "/api/auth/store-session",
    "/api/auth/update-account-info",
    "/api/auth/update-call-session",
    "/api/auth/update-profile",
    "/api/auth/update-session-meta",
    "/api/auth/update-user-metadata",
    "/api/auth/update-user-profile",
    "/api/auth/user-profile",
    "/api/auth/verify-session",
    "/api/call/history",
    "/api/customer/find-by-phone",
    "/api/customer/resolve-names",
    "/api/dashboard_charts",
    "/api/dashboard_overview",
    "/api/google/create-event",
    "/api/google/fetch-holidays",
    "/api/notifications/delete",
    "/api/notifications/mark-as-seen",
    "/api/otp/generate",
    "/api/otp/verify",
    "/blog",
    "/contact",
    "/faq",
    "/features",
    "/how-it-works",
    "/leadership",
    "/portal/activity",
    "/portal/auth/callback",
    "/portal/call-sessions",
    "/portal/campaign",
    "/portal/campaign/[id]",
    "/portal/campaign/[id]/[customerId]",
    "/portal/customer",
    "/portal/dashboard",
    "/portal/dashboard_report",
    "/portal/followup",
    "/portal/hold",
    "/portal/login",
    "/portal/organization",
    "/portal/organization/create",
    "/portal/organization/[id]",
    "/portal/pending",
    "/portal/profile-completion",
    "/portal/rejected",
    "/portal/settings",
    "/portal/signup",
    "/portal/signup-success",
    "/portal/suspended",
    "/portal/team",
    "/portal/team/[id]",
    "/portal/users",
    "/portal/users/[userId]",
    "/pricing"
  ]
};self.__BUILD_MANIFEST_CB && self.__BUILD_MANIFEST_CB()