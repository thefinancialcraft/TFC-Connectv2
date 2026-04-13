module.exports = [
"[project]/components/ExpiryBadge.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ExpiryBadge
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
;
function ExpiryBadge({ expireDate }) {
    if (!expireDate) return null;
    const now = new Date();
    const expire = new Date(expireDate);
    const diffTime = expire.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let colorClass = 'bg-emerald-100 text-emerald-600';
    let iconClass = 'fi-rr-calendar-clock';
    let text = `${diffDays} Days Left`;
    if (diffDays < 0) {
        colorClass = 'bg-red-100 text-red-600';
        iconClass = 'fi-rr-cross-circle';
        text = 'Expired';
    } else if (diffDays <= 7) {
        colorClass = 'bg-orange-100 text-orange-600';
        iconClass = 'fi-rr-clock';
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
        className: `inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${colorClass}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                className: `fi flex ${iconClass} text-[10px]`
            }, void 0, false, {
                fileName: "[project]/components/ExpiryBadge.tsx",
                lineNumber: 27,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                children: text
            }, void 0, false, {
                fileName: "[project]/components/ExpiryBadge.tsx",
                lineNumber: 28,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ExpiryBadge.tsx",
        lineNumber: 26,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/SignupForm.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>SignupForm
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function SignupForm({ onError, onSuccess, fromAdminPanel = false, defaultOrganizationId, isAuthorised = true, organizationId = null }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: "",
        email: "",
        contactNo: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [userType, setUserType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('employee');
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedOrgId, setSelectedOrgId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(defaultOrganizationId || organizationId || "");
    const [loadingOrgs, setLoadingOrgs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isClient, setIsClient] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [isCaller, setIsCaller] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [joinedAt, setJoinedAt] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date().toISOString().split('T')[0]);
    const [renewalAt, setRenewalAt] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Date().toISOString().split('T')[0]);
    const [expireAt, setExpireAt] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(()=>{
        const today = new Date();
        // Logic: If joined start of month (1st), expiry is 1 month later.
        // If joined mid-month, expiry is end of current month.
        if (today.getDate() === 1) {
            const nextMonth = new Date(today);
            nextMonth.setMonth(today.getMonth() + 1);
            return nextMonth.toISOString().split('T')[0];
        } else {
            const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            const year = lastDay.getFullYear();
            const month = String(lastDay.getMonth() + 1).padStart(2, '0');
            const day = String(lastDay.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
    });
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchOrgs = async ()=>{
            try {
                setLoadingOrgs(true);
                let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name, org_code").eq("is_active", true).order("company_name");
                if (!isAuthorised && organizationId) {
                    query = query.eq("id", organizationId);
                }
                const { data, error } = await query;
                if (!error && data) {
                    setOrganizations(data);
                    // If not authorised and we have a specific org, ensure it's selected
                    if (!isAuthorised && organizationId && !selectedOrgId) {
                        setSelectedOrgId(organizationId);
                    }
                }
            } catch (err) {
                console.error("Error fetching orgs:", err);
            } finally{
                setLoadingOrgs(false);
            }
        };
        fetchOrgs();
    }, []);
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [name]: value
            }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors((prev)=>({
                    ...prev,
                    [name]: ""
                }));
        }
    };
    const validateForm = ()=>{
        const newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = "Name is required";
        }
        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Invalid email format";
        }
        if (!formData.contactNo.trim()) {
            newErrors.contactNo = "Contact number is required";
        } else if (!/^\d{10}$/.test(formData.contactNo)) {
            newErrors.contactNo = "Contact number must be 10 digits";
        }
        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = "Please confirm your password";
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        setIsLoading(true);
        try {
            // Get current session token if from admin panel
            let authToken = null;
            if (fromAdminPanel) {
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                authToken = session?.access_token || null;
            }
            const headers = {
                "Content-Type": "application/json"
            };
            if (authToken) {
                headers["Authorization"] = `Bearer ${authToken}`;
            }
            const response = await fetch("/api/auth/signup", {
                method: "POST",
                headers,
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password,
                    user_name: formData.name,
                    contact_no: formData.contactNo,
                    user_type: userType,
                    organization_id: selectedOrgId || null,
                    from_admin_panel: fromAdminPanel,
                    is_client: isClient,
                    is_caller: isCaller,
                    joined_at: joinedAt,
                    renewal_at: renewalAt,
                    expire_at: expireAt
                })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || "Signup failed");
            }
            // Store user details in localStorage as backup
            localStorage.setItem('signup_name', formData.name);
            localStorage.setItem('signup_email', formData.email);
            // If onSuccess callback is provided (modal mode), call it instead of redirecting
            if (onSuccess) {
                onSuccess();
            } else {
                // Redirect to success page with user details (normal signup flow)
                router.push({
                    pathname: "/signup-success",
                    query: {
                        name: formData.name,
                        email: formData.email
                    }
                });
            }
        } catch (error) {
            const errorMessage = error.message || "An error occurred during signup";
            setErrors({
                submit: errorMessage
            });
            onError?.(errorMessage);
        } finally{
            setIsLoading(false);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "mt-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "text-xl md:text-lg",
                style: {
                    fontWeight: "700",
                    fontFamily: "poppins",
                    color: "#263238",
                    textAlign: "center",
                    marginBottom: "20px"
                },
                children: "Create Account"
            }, void 0, false, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 210,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-2",
                        style: {
                            color: "rgb(38, 50, 56)"
                        },
                        children: "User Type"
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 225,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-1 rounded-lg border border-gray-300 bg-white p-1 h-[42px]",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setUserType('employee'),
                                className: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 flex-1 ${userType === 'employee' ? "bg-[#4b33e8] text-white hover:opacity-90" : "hover:bg-gray-100 text-gray-600"}`,
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: "Employee"
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setUserType('posp_agent'),
                                className: `inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-8 flex-1 ${userType === 'posp_agent' ? "bg-[#4b33e8] text-white hover:opacity-90" : "hover:bg-gray-100 text-gray-600"}`,
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: "POSP Agent"
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 244,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 224,
                columnNumber: 7
            }, this),
            (fromAdminPanel || organizations.length > 0) && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: "rgb(38, 50, 56)"
                        },
                        children: "Assign Organization"
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 262,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-building absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: "#787E9D",
                                    pointerEvents: "none",
                                    zIndex: 1
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 269,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: selectedOrgId,
                                disabled: !isAuthorised || !!organizationId,
                                onChange: (e)=>setSelectedOrgId(e.target.value),
                                className: `w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none appearance-none ${!isAuthorised || !!organizationId ? 'bg-gray-100 cursor-not-allowed text-gray-400' : 'bg-white cursor-pointer'}`,
                                style: {
                                    borderColor: "#DCDEE3",
                                    color: selectedOrgId ? "rgb(38, 50, 56)" : "#787E9D",
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: "45px",
                                    paddingRight: "40px"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = "#4b33e8";
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = "#DCDEE3";
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "",
                                        children: "Select Organization (Optional)"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 296,
                                        columnNumber: 15
                                    }, this),
                                    organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: org.id,
                                            children: [
                                                org.company_name,
                                                " (",
                                                org.org_code,
                                                ")"
                                            ]
                                        }, org.id, true, {
                                            fileName: "[project]/components/SignupForm.tsx",
                                            lineNumber: 298,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 277,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-angle-small-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 303,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 268,
                        columnNumber: 11
                    }, this),
                    loadingOrgs && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-[10px] text-blue-500 mt-1",
                        children: "Loading organizations..."
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 305,
                        columnNumber: 27
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 261,
                columnNumber: 9
            }, this),
            fromAdminPanel && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-6 p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200 animate-in fade-in slide-in-from-top-2 duration-300",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-settings-sliders text-indigo-500 text-xs text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 314,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-[10px] font-bold text-slate-500 uppercase tracking-widest",
                                        children: "Onboarding Lifecycle"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 315,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 313,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setIsClient(!isClient),
                                        className: `flex items-center gap-2 px-3 py-1 rounded-lg transition-all border ${isClient ? 'bg-indigo-500 text-white border-indigo-400 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-indigo-200'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `fi flex ${isClient ? 'fi-rr-check' : 'fi-rr-cross-small'} text-[10px]`
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 327,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-black uppercase tracking-widest",
                                                children: isClient ? 'Client' : 'Personnel'
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 328,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 318,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setIsCaller(!isCaller),
                                        className: `flex items-center gap-2 px-3 py-1 rounded-lg transition-all border ${isCaller ? 'bg-blue-500 text-white border-blue-400 shadow-sm' : 'bg-white text-slate-400 border-slate-200 hover:border-blue-200'}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `fi flex ${isCaller ? 'fi-rr-check' : 'fi-rr-cross-small'} text-[10px]`
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 340,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[9px] font-black uppercase tracking-widest",
                                                children: isCaller ? 'Caller' : 'Non-Caller'
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 341,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 331,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 317,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 312,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                        className: "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-1",
                                        children: "Engagement Date"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 348,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-calendar absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 350,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "date",
                                                value: joinedAt,
                                                onChange: (e)=>setJoinedAt(e.target.value),
                                                className: "w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 351,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 349,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 347,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-2 gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-1",
                                                children: "Next Renewal"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 361,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-refresh absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SignupForm.tsx",
                                                        lineNumber: 363,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        value: renewalAt,
                                                        onChange: (e)=>setRenewalAt(e.target.value),
                                                        className: "w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SignupForm.tsx",
                                                        lineNumber: 364,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 362,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 360,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                className: "text-[10px] font-semibold text-slate-400 uppercase tracking-[0.2em] mb-1.5 block px-1",
                                                children: "Expiration"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 373,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-alarm-clock absolute left-3 top-1/2 -translate-y-1/2 text-slate-300 text-[10px]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SignupForm.tsx",
                                                        lineNumber: 375,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                        type: "date",
                                                        value: expireAt,
                                                        onChange: (e)=>setExpireAt(e.target.value),
                                                        className: "w-full h-10 pl-9 pr-4 bg-white border border-slate-200 rounded-xl text-[11px] font-bold text-slate-700 outline-none focus:border-indigo-500 transition-all"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/SignupForm.tsx",
                                                        lineNumber: 376,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/SignupForm.tsx",
                                                lineNumber: 374,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SignupForm.tsx",
                                        lineNumber: 372,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 359,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 346,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 311,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "name",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: "rgb(38, 50, 56)"
                        },
                        children: "Full Name"
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 391,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-user absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: "#787E9D",
                                    pointerEvents: "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 399,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "name",
                                name: "name",
                                value: formData.name,
                                onChange: handleChange,
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: errors.name ? "#EF4444" : "#DCDEE3",
                                    backgroundColor: "#FFFFFF",
                                    color: "rgb(38, 50, 56)",
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: "45px",
                                    paddingRight: "16px"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = "#4b33e8";
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = errors.name ? "#EF4444" : "#DCDEE3";
                                },
                                placeholder: "Enter your full name",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 406,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 398,
                        columnNumber: 9
                    }, this),
                    errors.name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs mt-1 text-red-500",
                        children: errors.name
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 432,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 390,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "email",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: "rgb(38, 50, 56)"
                        },
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 438,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: "#787E9D",
                                    pointerEvents: "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 446,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "email",
                                id: "email",
                                name: "email",
                                value: formData.email,
                                onChange: handleChange,
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: errors.email ? "#EF4444" : "#DCDEE3",
                                    backgroundColor: "#FFFFFF",
                                    color: "rgb(38, 50, 56)",
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: "45px",
                                    paddingRight: "16px"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = "#4b33e8";
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = errors.email ? "#EF4444" : "#DCDEE3";
                                },
                                placeholder: "Enter your email",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 453,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 445,
                        columnNumber: 9
                    }, this),
                    errors.email && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs mt-1 text-red-500",
                        children: errors.email
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 479,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 437,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "contactNo",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: "rgb(38, 50, 56)"
                        },
                        children: "Contact Number"
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 485,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-phone absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: "#787E9D",
                                    pointerEvents: "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 493,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "tel",
                                id: "contactNo",
                                name: "contactNo",
                                value: formData.contactNo,
                                onChange: handleChange,
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: errors.contactNo ? "#EF4444" : "#DCDEE3",
                                    backgroundColor: "#FFFFFF",
                                    color: "rgb(38, 50, 56)",
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: "45px",
                                    paddingRight: "16px"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = "#4b33e8";
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = errors.contactNo ? "#EF4444" : "#DCDEE3";
                                },
                                placeholder: "Enter your contact number",
                                maxLength: 10,
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 500,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 492,
                        columnNumber: 9
                    }, this),
                    errors.contactNo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs mt-1 text-red-500",
                        children: errors.contactNo
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 527,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 484,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "password",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: "rgb(38, 50, 56)"
                        },
                        children: "Password"
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 533,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: "#787E9D",
                                    pointerEvents: "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 541,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "password",
                                id: "password",
                                name: "password",
                                value: formData.password,
                                onChange: handleChange,
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: errors.password ? "#EF4444" : "#DCDEE3",
                                    backgroundColor: "#FFFFFF",
                                    color: "rgb(38, 50, 56)",
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: "45px",
                                    paddingRight: "16px"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = "#4b33e8";
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = errors.password ? "#EF4444" : "#DCDEE3";
                                },
                                placeholder: "Enter your password",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 548,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 540,
                        columnNumber: 9
                    }, this),
                    errors.password && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs mt-1 text-red-500",
                        children: errors.password
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 574,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 532,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "confirmPassword",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: "rgb(38, 50, 56)"
                        },
                        children: "Confirm Password"
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 580,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: "#787E9D",
                                    pointerEvents: "none"
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 588,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "password",
                                id: "confirmPassword",
                                name: "confirmPassword",
                                value: formData.confirmPassword,
                                onChange: handleChange,
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: errors.confirmPassword ? "#EF4444" : "#DCDEE3",
                                    backgroundColor: "#FFFFFF",
                                    color: "rgb(38, 50, 56)",
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: "45px",
                                    paddingRight: "16px"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = "#4b33e8";
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = errors.confirmPassword ? "#EF4444" : "#DCDEE3";
                                },
                                placeholder: "Confirm your password",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/SignupForm.tsx",
                                lineNumber: 595,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 587,
                        columnNumber: 9
                    }, this),
                    errors.confirmPassword && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-xs mt-1 text-red-500",
                        children: errors.confirmPassword
                    }, void 0, false, {
                        fileName: "[project]/components/SignupForm.tsx",
                        lineNumber: 621,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 579,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: isLoading,
                className: "w-full rounded-full mt-1 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                style: {
                    background: "linear-gradient(to right, #4b33e8)",
                    fontFamily: "'Poppins', sans-serif",
                    marginTop: "10px",
                    marginBottom: "10px"
                },
                onMouseEnter: (e)=>{
                    if (!isLoading) {
                        e.currentTarget.style.background = "linear-gradient(to right, #4b33e8)";
                    }
                },
                onMouseLeave: (e)=>{
                    if (!isLoading) {
                        e.currentTarget.style.background = "linear-gradient(to right, #4b33e8)";
                    }
                },
                children: isLoading ? "Creating Account..." : "Sign Up"
            }, void 0, false, {
                fileName: "[project]/components/SignupForm.tsx",
                lineNumber: 627,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SignupForm.tsx",
        lineNumber: 209,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/crypto-js/sha256.js [external] (crypto-js/sha256.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/sha256.js", () => require("crypto-js/sha256.js"));

module.exports = mod;
}),
"[externals]/crypto-js/aes.js [external] (crypto-js/aes.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/aes.js", () => require("crypto-js/aes.js"));

module.exports = mod;
}),
"[externals]/crypto-js/enc-utf8.js [external] (crypto-js/enc-utf8.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("crypto-js/enc-utf8.js", () => require("crypto-js/enc-utf8.js"));

module.exports = mod;
}),
"[project]/lib/phoneUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "computePhoneHash",
    ()=>computePhoneHash,
    "decryptPhone",
    ()=>decryptPhone,
    "encryptPhone",
    ()=>encryptPhone,
    "formatMaskedPhone",
    ()=>formatMaskedPhone
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$sha256$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$sha256$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/sha256.js [external] (crypto-js/sha256.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$aes$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$aes$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/aes.js [external] (crypto-js/aes.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$enc$2d$utf8$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$enc$2d$utf8$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/crypto-js/enc-utf8.js [external] (crypto-js/enc-utf8.js, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [ssr] (ecmascript)");
;
;
;
;
/**
 * Utility for phone number encryption and decryption
 * Currently Active: v1 (Simple XOR) - prefix "__enc__"
 * Supported for Read: v2 (AES-256) - prefix "__v2__"
 */ const SECRET_KEY = ("TURBOPACK compile-time value", "TfcV2_Secure_9Xk2Lp5Nm8Qj4Rs7Vw1Zy3Bd6G") || "RYNXLY_SECURE_PHONE_VAULT";
const computePhoneHash = (phone)=>{
    if (!phone) return null;
    const normalized = phone.replace(/[^0-9]/g, '');
    if (!normalized) return null;
    return (0, __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$sha256$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$sha256$2e$js$2c$__cjs$29$__["default"])(normalized).toString();
};
const encryptPhone = (phone)=>{
    if (!phone) return "";
    // Safety check: Don't re-encrypt
    if (phone.startsWith("__enc__") || phone.startsWith("__v2__")) return phone;
    try {
        // XOR Cipher Logic
        const encrypted = phone.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
        // Convert to Base64 for storage
        return `__enc__${btoa(encrypted)}`;
    } catch (e) {
        console.error("XOR Encryption Failed:", e);
        return phone;
    }
};
const decryptPhone = (phone, orgId)=>{
    if (!phone) return "";
    // CASE 1: Legacy XOR (v1) - Primary
    if (phone.startsWith("__enc__")) {
        try {
            const base64Data = phone.substring(7);
            const encrypted = atob(base64Data);
            const decrypted = encrypted.split('').map((char, i)=>String.fromCharCode(char.charCodeAt(0) ^ SECRET_KEY.charCodeAt(i % SECRET_KEY.length))).join('');
            return decrypted;
        } catch (e) {
            return phone;
        }
    }
    // CASE 2: AES-256 (v2) - Fallback for newly saved data
    if (phone.startsWith("__v2__")) {
        try {
            const INTERNAL_SALT = "TFC_SMART_SHIELD_V2_2024"; // Support for transition data
            const contextOrgId = orgId || (("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "");
            const dynamicKey = SECRET_KEY + (contextOrgId || "");
            const ciphertext = phone.substring(6);
            const bytes = __TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$aes$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$aes$2e$js$2c$__cjs$29$__["default"].decrypt(ciphertext, dynamicKey);
            let decryptedWithSalt = bytes.toString(__TURBOPACK__imported__module__$5b$externals$5d2f$crypto$2d$js$2f$enc$2d$utf8$2e$js__$5b$external$5d$__$28$crypto$2d$js$2f$enc$2d$utf8$2e$js$2c$__cjs$29$__["default"]);
            if (decryptedWithSalt && decryptedWithSalt.endsWith(INTERNAL_SALT)) {
                return decryptedWithSalt.substring(0, decryptedWithSalt.length - INTERNAL_SALT.length);
            }
            return decryptedWithSalt || phone;
        } catch (e) {
            return phone;
        }
    }
    return phone;
};
const formatMaskedPhone = (phone, orgId)=>{
    const realPhone = decryptPhone(phone, orgId);
    if (!realPhone) return "—";
    if (realPhone.length < 4) return realPhone;
    return realPhone.substring(0, 2) + "******" + realPhone.substring(realPhone.length - 2);
};
}),
"[project]/components/ImportCustomersModal.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>ImportCustomersModal
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/phoneUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
function ImportCustomersModal({ show, onClose, onSuccess, preselectedOrgId = "", preselectedCampaignId = "" }) {
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(show);
    const [showMappingModal, setShowMappingModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [importFile, setImportFile] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [importing, setImporting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [importError, setImportError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [importSuccess, setImportSuccess] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [csvColumns, setCsvColumns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [fieldMapping, setFieldMapping] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [mergedFields, setMergedFields] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    const [customFields, setCustomFields] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedFields, setSelectedFields] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        name: true,
        phone: true,
        expiry_date: true
    });
    const [organizations, setOrganizations] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [campaigns, setCampaigns] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedOrgId, setSelectedOrgId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(preselectedOrgId);
    const [selectedCampaignId, setSelectedCampaignId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(preselectedCampaignId);
    const [customExpiryDate, setCustomExpiryDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [duplicates, setDuplicates] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showConflictModal, setShowConflictModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // New states for Step 1 - File Verification
    const [fileConflicts, setFileConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showFileConflictModal, setShowFileConflictModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [selectedFileConflicts, setSelectedFileConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    const [fullyProcessedCustomers, setFullyProcessedCustomers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [isVerificationComplete, setIsVerificationComplete] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [initialRecordCount, setInitialRecordCount] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    // New states for Step 2 - Database Verification
    const [dbConflicts, setDbConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [showDbConflictModal, setShowDbConflictModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isScanningDb, setIsScanningDb] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isDbScanComplete, setIsDbScanComplete] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isFinalizing, setIsFinalizing] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [selectedDbConflicts, setSelectedDbConflicts] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(new Set());
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setShowImportModal(show);
        if (show) {
            if (user?.isClient && user.organization_id) {
                setSelectedOrgId(user.organization_id);
                fetchCampaigns(user.organization_id);
            } else {
                setSelectedOrgId(preselectedOrgId);
                fetchCampaigns(preselectedOrgId);
            }
            setSelectedCampaignId(preselectedCampaignId);
            fetchOrganizations();
        } else {
            // Reset all internal states when modal is closed
            setImportFile(null);
            setCsvColumns([]);
            setFieldMapping({});
            setMergedFields({});
            setCustomFields([]);
            setImportError("");
            setImportSuccess("");
            setDuplicates([]);
            setFileConflicts([]);
            setShowFileConflictModal(false);
            setSelectedFileConflicts(new Set());
            setFullyProcessedCustomers([]);
            setIsVerificationComplete(false);
            setDbConflicts([]);
            setShowDbConflictModal(false);
            setIsScanningDb(false);
            setIsDbScanComplete(false);
            setInitialRecordCount(0);
            setSelectedDbConflicts(new Set());
        }
    }, [
        show,
        preselectedOrgId,
        preselectedCampaignId,
        user
    ]);
    // Re-fetch campaigns when selected organization changes
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (showImportModal && selectedOrgId) {
            fetchCampaigns(selectedOrgId);
            // If we change org, we should probably clear campaign unless it's the preselected one
            if (selectedOrgId !== preselectedOrgId) {
                setSelectedCampaignId("");
            } else {
                setSelectedCampaignId(preselectedCampaignId);
            }
        } else if (showImportModal && !selectedOrgId) {
            setCampaigns([]);
            setSelectedCampaignId("");
        }
    }, [
        selectedOrgId
    ]);
    const fetchCampaigns = async (orgId)=>{
        if (!orgId && !preselectedOrgId) {
            setCampaigns([]);
            return;
        }
        try {
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("campaigns").select("id, name").eq("status", "active").order("name", {
                ascending: true
            });
            const targetOrgId = orgId || preselectedOrgId;
            if (targetOrgId) {
                query = query.eq("organization_id", targetOrgId);
            }
            const { data, error } = await query;
            if (!error) setCampaigns(data || []);
        } catch (err) {
            console.error("Error fetching campaigns:", err);
        }
    };
    const fetchOrganizations = async ()=>{
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("id, company_name, org_code").eq("is_active", true).order("company_name", {
                ascending: true
            });
            if (!error) setOrganizations(data || []);
        } catch (err) {
            console.error("Error fetching organizations:", err);
        }
    };
    const handleClose = ()=>{
        setShowImportModal(false);
        setShowMappingModal(false);
        setShowFileConflictModal(false);
        setShowDbConflictModal(false);
        setShowConflictModal(false);
        setImportFile(null);
        setImportError("");
        setImportSuccess("");
        setFileConflicts([]);
        setFullyProcessedCustomers([]);
        setIsVerificationComplete(false);
        onClose();
    };
    const parseCSVLine = (line)=>{
        const result = [];
        let current = "";
        let inQuotes = false;
        for(let i = 0; i < line.length; i++){
            const char = line[i];
            if (char === '"') inQuotes = !inQuotes;
            else if (char === "," && !inQuotes) {
                result.push(current.trim());
                current = "";
            } else current += char;
        }
        result.push(current.trim());
        return result;
    };
    const getFieldValue = (row, fieldKey, fieldMapping, mergedFields)=>{
        const mainColumn = fieldMapping[fieldKey];
        if (!mainColumn) return "";
        let value = row[mainColumn] || "";
        const merged = mergedFields[fieldKey] || [];
        if (merged.length > 0) {
            const mergedValues = merged.filter((col)=>col && row[col]).map((col)=>row[col]).join(" ");
            if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
        }
        return value.trim();
    };
    const generateLeadId = ()=>{
        return `LEAD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    };
    const verifyFileData = async ()=>{
        if (!importFile) {
            setImportError("Please select a file to upload");
            return;
        }
        if (!selectedOrgId) {
            setImportError("Please select an Organization.");
            return;
        }
        setImporting(true);
        setImportError("");
        setImportSuccess("");
        try {
            const text = await importFile.text();
            const lines = text.split("\n").filter((line)=>line.trim());
            if (lines.length < 2) {
                setImportError("CSV file must contain at least a header row and one data row");
                setImporting(false);
                return;
            }
            const headers = parseCSVLine(lines[0]);
            const customers = [];
            const errors = [];
            for(let i = 1; i < lines.length; i++){
                try {
                    const values = parseCSVLine(lines[i]);
                    if (values.length === 0 || values.every((v)=>!v.trim())) continue;
                    const row = {};
                    headers.forEach((header, index)=>{
                        row[header.trim()] = values[index]?.trim() || "";
                    });
                    const customerName = getFieldValue(row, "name", fieldMapping, mergedFields);
                    const phoneNo = getFieldValue(row, "phone", fieldMapping, mergedFields);
                    const expiryDate = fieldMapping["expiry_date"] === '__CUSTOM_DATE__' ? customExpiryDate : getFieldValue(row, "expiry_date", fieldMapping, mergedFields);
                    if (!customerName || !phoneNo) continue;
                    const customerDetails = {};
                    customFields.forEach((cf)=>{
                        let value = row[cf.mappedTo] || "";
                        const merged = mergedFields[cf.id] || [];
                        if (merged.length > 0) {
                            const mergedValues = merged.filter((col)=>col && row[col]).map((col)=>row[col]).join(" ");
                            if (mergedValues) value = value ? `${value} ${mergedValues}` : mergedValues;
                        }
                        if (value) {
                            const suffix = selectedFields[`custom_${cf.id}`] !== false ? "_checked" : "_unchecked";
                            customerDetails[`${cf.name || cf.mappedTo}${suffix}`] = value.trim();
                        }
                    });
                    // Robust Date parsing
                    let parsedExpiryDate = null;
                    if (expiryDate) {
                        try {
                            const cleanDate = expiryDate.toString().replace(/₹/g, "").trim();
                            const parseDMY = (str)=>{
                                const match = str.match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})$/);
                                if (match) {
                                    let d = match[1].padStart(2, '0'), m = match[2].padStart(2, '0'), y = match[3];
                                    if (y.length === 2) y = "20" + y;
                                    return `${y}-${m}-${d}`;
                                }
                                return null;
                            };
                            const parseYMD = (str)=>{
                                const match = str.match(/^(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})$/);
                                if (match) {
                                    let y = match[1], m = match[2].padStart(2, '0'), d = match[3].padStart(2, '0');
                                    return `${y}-${m}-${d}`;
                                }
                                return null;
                            };
                            parsedExpiryDate = parseDMY(cleanDate) || parseYMD(cleanDate);
                            if (!parsedExpiryDate) {
                                const date = new Date(cleanDate);
                                if (!isNaN(date.getTime())) parsedExpiryDate = date.toISOString().split("T")[0];
                            }
                        } catch (e) {}
                    }
                    customers.push({
                        lead_id: generateLeadId(),
                        customer_name: customerName,
                        phone_no: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["encryptPhone"])(phoneNo),
                        display_phone: phoneNo,
                        phone_search_hash: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$phoneUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["computePhoneHash"])(phoneNo),
                        expiry_date: parsedExpiryDate,
                        campaign_id: selectedCampaignId || null,
                        organization_id: selectedOrgId || null,
                        customer_details: {
                            active_details: "details-1",
                            history: {
                                "details-1": customerDetails
                            }
                        },
                        status: "active"
                    });
                } catch (e) {}
            }
            // STEP 1: Internal File Verification
            const hashCount = {};
            customers.forEach((c, idx)=>{
                if (!c.phone_search_hash) return;
                if (!hashCount[c.phone_search_hash]) hashCount[c.phone_search_hash] = [];
                hashCount[c.phone_search_hash].push(idx);
            });
            const internalConflicts = [];
            const uniqueIndices = new Set();
            const processedHashes = new Set();
            Object.entries(hashCount).forEach(([hash, indices])=>{
                if (indices.length > 1) {
                    // Duplicate found in file
                    internalConflicts.push({
                        hash,
                        indices,
                        records: indices.map((idx)=>customers[idx])
                    });
                } else {
                    uniqueIndices.add(indices[0]);
                }
            });
            if (internalConflicts.length > 0) {
                console.log(`[File Check] Internal duplicates found in file: ${internalConflicts.length} groups.`);
                console.log("[File Check] Conflict details:", internalConflicts);
                setFileConflicts(internalConflicts);
                setFullyProcessedCustomers(customers);
                setInitialRecordCount(customers.length);
                setShowFileConflictModal(true);
                setImportError(`File contains ${internalConflicts.length} duplicate groups out of ${customers.length} total records.`);
            } else {
                console.log("[File Check] No internal duplicates found in file.");
                setFullyProcessedCustomers(customers);
                setInitialRecordCount(customers.length);
                setIsVerificationComplete(true);
                setImportSuccess(`Verification complete! All ${customers.length} records ready for Stage 2.`);
            }
        } catch (err) {
            setImportError(`Error verifying file: ${err}`);
        } finally{
            setImporting(false);
        }
    };
    const handleFileMerge = (conflictIndex)=>{
        const conflict = fileConflicts[conflictIndex];
        const newList = [
            ...fullyProcessedCustomers
        ];
        // Merge this one
        const records = conflict.records;
        const primaryRecord = {
            ...records[0]
        };
        // Combine history from all records
        const newHistory = {};
        let detailCounter = 1;
        records.forEach((rec)=>{
            if (rec.customer_details.history) {
                Object.values(rec.customer_details.history).forEach((hVal)=>{
                    newHistory[`details-${detailCounter++}`] = hVal;
                });
            } else {
                // Fallback for flat structure if any
                newHistory[`details-${detailCounter++}`] = rec.customer_details;
            }
        });
        primaryRecord.customer_details = {
            active_details: "details-1",
            history: newHistory
        };
        const idsToRemove = new Set(records.map((r)=>r.lead_id));
        const filteredList = newList.filter((rec)=>!idsToRemove.has(rec.lead_id));
        filteredList.push(primaryRecord);
        setFullyProcessedCustomers(filteredList);
        const newConflicts = [
            ...fileConflicts
        ];
        newConflicts.splice(conflictIndex, 1);
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set()); // Reset selection
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete! Total: ${initialRecordCount} records. Moving ${filteredList.length} records to Stage 2.`);
        }
    };
    const handleFileReject = (conflictIndex)=>{
        const conflict = fileConflicts[conflictIndex];
        const newList = [
            ...fullyProcessedCustomers
        ];
        const idsToRemove = new Set(conflict.records.slice(1).map((r)=>r.lead_id));
        const filteredList = newList.filter((rec)=>!idsToRemove.has(rec.lead_id));
        setFullyProcessedCustomers(filteredList);
        const newConflicts = [
            ...fileConflicts
        ];
        newConflicts.splice(conflictIndex, 1);
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set()); // Reset selection
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete! Total: ${initialRecordCount} records. Moving ${filteredList.length} records to Stage 2.`);
        }
    };
    const handleBulkFileMerge = ()=>{
        if (selectedFileConflicts.size === 0) return;
        let currentList = [
            ...fullyProcessedCustomers
        ];
        const conflictsToRemoveIndices = Array.from(selectedFileConflicts).sort((a, b)=>b - a); // Sort descending to splice correctly
        conflictsToRemoveIndices.forEach((idx)=>{
            const conflict = fileConflicts[idx];
            const primaryRecord = {
                ...conflict.records[0]
            };
            const newHistory = {};
            let detailCounter = 1;
            conflict.records.forEach((rec)=>{
                if (rec.customer_details.history) {
                    Object.values(rec.customer_details.history).forEach((hVal)=>{
                        newHistory[`details-${detailCounter++}`] = hVal;
                    });
                } else {
                    newHistory[`details-${detailCounter++}`] = rec.customer_details;
                }
            });
            primaryRecord.customer_details = {
                active_details: "details-1",
                history: newHistory
            };
            const idsToRemove = new Set(conflict.records.map((r)=>r.lead_id));
            currentList = currentList.filter((rec)=>!idsToRemove.has(rec.lead_id));
            currentList.push(primaryRecord);
        });
        setFullyProcessedCustomers(currentList);
        const newConflicts = fileConflicts.filter((_, idx)=>!selectedFileConflicts.has(idx));
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set());
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete (Bulk Merge)! Total: ${initialRecordCount} records. Moving ${currentList.length} records to Stage 2.`);
        }
    };
    const handleBulkFileReject = ()=>{
        if (selectedFileConflicts.size === 0) return;
        let currentList = [
            ...fullyProcessedCustomers
        ];
        const conflictsToRemoveIndices = Array.from(selectedFileConflicts);
        conflictsToRemoveIndices.forEach((idx)=>{
            const conflict = fileConflicts[idx];
            const idsToRemove = new Set(conflict.records.slice(1).map((r)=>r.lead_id));
            currentList = currentList.filter((rec)=>!idsToRemove.has(rec.lead_id));
        });
        setFullyProcessedCustomers(currentList);
        const newConflicts = fileConflicts.filter((_, idx)=>!selectedFileConflicts.has(idx));
        setFileConflicts(newConflicts);
        setSelectedFileConflicts(new Set());
        if (newConflicts.length === 0) {
            setShowFileConflictModal(false);
            setIsVerificationComplete(true);
            setImportSuccess(`Deduplication complete (Bulk Reject)! Total: ${initialRecordCount} records. Moving ${currentList.length} records to Stage 2.`);
        }
    };
    const toggleSelectAllConflicts = ()=>{
        if (selectedFileConflicts.size === fileConflicts.length) {
            setSelectedFileConflicts(new Set());
        } else {
            setSelectedFileConflicts(new Set(fileConflicts.map((_, i)=>i)));
        }
    };
    const toggleConflictSelection = (idx)=>{
        const next = new Set(selectedFileConflicts);
        if (next.has(idx)) next.delete(idx);
        else next.add(idx);
        setSelectedFileConflicts(next);
    };
    const uploadCustomersToSupabase = async ()=>{
        if (!fullyProcessedCustomers.length) return;
        setIsScanningDb(true);
        setImportError("");
        setImportSuccess("");
        try {
            const hashes = fullyProcessedCustomers.map((c)=>c.phone_search_hash).filter((h)=>h); // Ensure no empty hashes enter the query
            const batchSize = 100; // Reduced batch size further to prevent URL length (URI Too Long) errors
            let existingRecords = [];
            // Check in batches for 2k+ records support
            for(let i = 0; i < hashes.length; i += batchSize){
                const batch = hashes.slice(i, i + batchSize);
                const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").select("*").in("phone_search_hash", batch).eq("campaign_id", selectedCampaignId).eq("organization_id", selectedOrgId);
                if (error) throw error;
                if (data && data.length > 0) {
                    console.log(`[DB Check] Batch ${Math.floor(i / batchSize) + 1}: Found ${data.length} matches.`);
                    existingRecords = [
                        ...existingRecords,
                        ...data
                    ];
                }
            }
            console.log(`[DB Check] Total existing records found: ${existingRecords.length}`);
            if (existingRecords && existingRecords.length > 0) {
                // Determine conflicts
                const conflicts = existingRecords.map((dbRec)=>{
                    const fileRec = fullyProcessedCustomers.find((f)=>f.phone_search_hash === dbRec.phone_search_hash);
                    return {
                        fileRecord: fileRec,
                        dbRecord: dbRec
                    };
                });
                console.log("[DB Check] Conflicts found:", conflicts);
                setDbConflicts(conflicts);
                setShowDbConflictModal(true);
                setImportError(`Stage 2: Found ${conflicts.length} matches in CRM. ${fullyProcessedCustomers.length - conflicts.length} records are new.`);
            } else {
                setImportSuccess(`Stage 2 Complete! All ${fullyProcessedCustomers.length} records are new and ready for CRM.`);
                setIsDbScanComplete(true);
            }
        } catch (err) {
            console.error("Database Check Error:", err);
            setImportError(`Error checking database: ${err.message || String(err)}`);
        } finally{
            setIsScanningDb(false);
        }
    };
    const handleFinalUpload = async ()=>{
        if (!fullyProcessedCustomers.length || isFinalizing) return;
        setIsFinalizing(true);
        setImportError("");
        setImportSuccess("");
        try {
            // Separate records into updates (with ID) and new inserts (without ID)
            const toUpdate = [];
            const toInsert = [];
            fullyProcessedCustomers.forEach(({ display_phone, ...rest })=>{
                const payload = {
                    ...rest,
                    customer_details: typeof rest.customer_details === 'object' ? JSON.stringify(rest.customer_details) : rest.customer_details
                };
                if (rest.id) {
                    toUpdate.push(payload);
                } else {
                    // For new records, explicitly DO NOT provide the id key
                    const { id, ...insertPayload } = payload;
                    toInsert.push(insertPayload);
                }
            });
            // Perform operations in parallel
            const promises = [];
            if (toUpdate.length > 0) {
                promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").upsert(toUpdate));
            }
            if (toInsert.length > 0) {
                promises.push(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").insert(toInsert));
            }
            const results = await Promise.all(promises);
            const firstError = results.find((r)=>r.error)?.error;
            if (firstError) throw firstError;
            // Log monitoring event
            const totalRecords = toUpdate.length + toInsert.length;
            const inputSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["estimateSize"])([
                ...toUpdate,
                ...toInsert
            ]);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Bulk Import: ${totalRecords} leads processed (${toUpdate.length} updates, ${toInsert.length} new)`,
                metadata: {
                    organization_id: selectedOrgId,
                    campaign_id: selectedCampaignId,
                    record_count: totalRecords
                },
                payload_size: inputSize,
                user_name: user?.displayName || 'System User',
                organization_id: selectedOrgId || undefined
            });
            setImportSuccess(`Import Successful! ${totalRecords} records processed (${toUpdate.length} updated, ${toInsert.length} newly added).`);
            // Short delay to show success then close
            setTimeout(()=>{
                handleClose(); // Resets all states and calls onClose
                onSuccess?.();
            }, 1000);
        } catch (err) {
            console.error("Final Upload Error:", err);
            setImportError(`Error uploading records: ${err.message || err}`);
        } finally{
            setIsFinalizing(false);
        }
    };
    const toggleDbConflictSelection = (idx)=>{
        const newSelected = new Set(selectedDbConflicts);
        if (newSelected.has(idx)) newSelected.delete(idx);
        else newSelected.add(idx);
        setSelectedDbConflicts(newSelected);
    };
    const toggleSelectAllDbConflicts = ()=>{
        if (selectedDbConflicts.size === dbConflicts.length) {
            setSelectedDbConflicts(new Set());
        } else {
            setSelectedDbConflicts(new Set(dbConflicts.map((_, i)=>i)));
        }
    };
    const handleDbMergeSelected = ()=>{
        if (selectedDbConflicts.size === 0) return;
        let workingCustomers = [
            ...fullyProcessedCustomers
        ];
        const conflictsToHandle = Array.from(selectedDbConflicts).sort((a, b)=>b - a);
        conflictsToHandle.forEach((idx)=>{
            const conflict = dbConflicts[idx];
            // Merging Database details into the file record
            // Keep existing DB ID but merge file information or vice versa?
            // User usually wants to update the existing record.
            const dbRec = conflict.dbRecord;
            const fileRec = conflict.fileRecord;
            // Simple merge strategy: Update existing DB record with new CSV details (keeping history)
            const dbDetails = typeof dbRec.customer_details === 'string' ? JSON.parse(dbRec.customer_details) : dbRec.customer_details || {
                active_details: "details-1",
                history: {
                    "details-1": {}
                }
            };
            const fileDetails = fileRec.customer_details;
            // New history entry in DB details
            const newIndex = Object.keys(dbDetails.history || {}).length + 1;
            const newKey = `details-${newIndex}`;
            if (!dbDetails.history) dbDetails.history = {};
            // Source the current active details from file or merge them
            dbDetails.history[newKey] = fileDetails.history?.[fileDetails.active_details] || {};
            dbDetails.active_details = newKey;
            // Updated record for DB (targeting existing ID)
            const mergedRecord = {
                ...fileRec,
                id: dbRec.id,
                customer_details: dbDetails,
                updated_at: new Date().toISOString()
            };
            // Replace or Update in the fullyProcessedCustomers list
            const fIndex = workingCustomers.findIndex((c)=>c.phone_search_hash === fileRec.phone_search_hash);
            if (fIndex !== -1) {
                workingCustomers[fIndex] = mergedRecord;
            }
        });
        setFullyProcessedCustomers(workingCustomers);
        // Remove handled ones from dbConflicts
        const remainingConflicts = dbConflicts.filter((_, i)=>!selectedDbConflicts.has(i));
        setDbConflicts(remainingConflicts);
        setSelectedDbConflicts(new Set());
        if (remainingConflicts.length === 0) {
            setShowDbConflictModal(false);
            setIsDbScanComplete(true);
            setImportSuccess(`Stage 2 Complete! ${workingCustomers.length} records finalized for CRM.`);
        }
    };
    const handleDbSkipSelected = ()=>{
        if (selectedDbConflicts.size === 0) return;
        const phoneHashesToSkip = Array.from(selectedDbConflicts).map((idx)=>dbConflicts[idx].fileRecord.phone_search_hash);
        // Remove these from fullyProcessedCustomers (Rejecting the new import for these phones)
        const workingCustomers = fullyProcessedCustomers.filter((c)=>!phoneHashesToSkip.includes(c.phone_search_hash));
        setFullyProcessedCustomers(workingCustomers);
        // Remove from dbConflicts
        const remainingConflicts = dbConflicts.filter((_, i)=>!selectedDbConflicts.has(i));
        setDbConflicts(remainingConflicts);
        setSelectedDbConflicts(new Set());
        if (remainingConflicts.length === 0) {
            setShowDbConflictModal(false);
            setIsDbScanComplete(true);
            setImportSuccess(`Stage 2 Complete! ${workingCustomers.length} records finalized for CRM.`);
        }
    };
    const handleFileUpload = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        setImportFile(file);
        const text = await file.text();
        const firstLine = text.split("\n")[0];
        if (firstLine) {
            const cols = parseCSVLine(firstLine);
            setCsvColumns(cols);
            const initialMapping = {};
            const coreFields = [
                "name",
                "phone",
                "expiry_date"
            ];
            const mappedCols = new Set();
            coreFields.forEach((f)=>{
                const match = cols.find((c)=>c.toLowerCase().includes(f.toLowerCase()));
                if (match) {
                    initialMapping[f] = match;
                    mappedCols.add(match);
                }
            });
            // Auto-generate custom fields for all other columns
            const autoCustomFields = cols.filter((col)=>!mappedCols.has(col) && col.trim() !== "").map((col)=>({
                    id: `auto_${Date.now()}_${Math.random()}`,
                    name: col,
                    mappedTo: col,
                    isEdited: false
                }));
            setFieldMapping(initialMapping);
            setCustomFields(autoCustomFields);
            setShowMappingModal(true);
        }
    };
    /* Custom Fields Logic */ const addCustomField = ()=>{
        setCustomFields([
            ...customFields,
            {
                id: Date.now().toString(),
                name: "",
                mappedTo: "",
                isEdited: false
            }
        ]);
    };
    const removeCustomField = (id)=>{
        setCustomFields(customFields.filter((f)=>f.id !== id));
    };
    /* Merged Fields Logic */ const addMergedField = (fieldKey)=>{
        setMergedFields((prev)=>({
                ...prev,
                [fieldKey]: [
                    ...prev[fieldKey] || [],
                    ""
                ]
            }));
    };
    const removeMergedField = (fieldKey, index)=>{
        setMergedFields((prev)=>{
            const current = [
                ...prev[fieldKey] || []
            ];
            current.splice(index, 1);
            return {
                ...prev,
                [fieldKey]: current
            };
        });
    };
    const updateMergedField = (fieldKey, index, value)=>{
        setMergedFields((prev)=>{
            const current = [
                ...prev[fieldKey] || []
            ];
            current[index] = value;
            return {
                ...prev,
                [fieldKey]: current
            };
        });
    };
    const updateCustomField = (id, key, value)=>{
        setCustomFields(customFields.map((f)=>{
            if (f.id !== id) return f;
            if (key === "name") {
                return {
                    ...f,
                    name: value,
                    isEdited: true
                };
            } else if (key === "mappedTo") {
                // Auto-fill name if it hasn't been manually edited
                const shouldUpdateName = !f.isEdited;
                return {
                    ...f,
                    mappedTo: value,
                    name: shouldUpdateName ? value : f.name
                };
            }
            return f;
        }));
    };
    // Get set of all currently mapped columns
    const getUsedColumns = ()=>{
        const used = new Set();
        // Add standard field mappings
        Object.values(fieldMapping).forEach((val)=>{
            if (val) used.add(val);
        });
        // Add merged fields
        Object.values(mergedFields).forEach((arr)=>{
            arr.forEach((val)=>{
                if (val) used.add(val);
            });
        });
        // Add custom mapped fields
        customFields.forEach((f)=>{
            if (f.mappedTo) used.add(f.mappedTo);
        });
        return used;
    };
    const handleMergeDuplicate = async (duplicate)=>{
        try {
            const existingDetails = typeof duplicate.existing.customer_details === 'string' ? JSON.parse(duplicate.existing.customer_details) : duplicate.existing.customer_details || {};
            const newDetails = typeof duplicate.new.customer_details === 'string' ? JSON.parse(duplicate.new.customer_details) : duplicate.new.customer_details || {};
            // If newDetails is already structured, extract flat data
            const flatIncoming = newDetails.history && newDetails.active_details ? newDetails.history[newDetails.active_details] : newDetails;
            let finalStructured;
            if (existingDetails.history && existingDetails.active_details) {
                const nextIndex = Object.keys(existingDetails.history).length + 1;
                const nextId = `details-${nextIndex}`;
                finalStructured = {
                    ...existingDetails,
                    active_details: nextId,
                    history: {
                        ...existingDetails.history,
                        [nextId]: flatIncoming
                    }
                };
            } else {
                // Migrate flat to structured
                finalStructured = {
                    active_details: "details-2",
                    history: {
                        "details-1": existingDetails,
                        "details-2": flatIncoming
                    }
                };
            }
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
                customer_details: JSON.stringify(finalStructured)
            }).eq("id", duplicate.existing.id);
            if (error) throw error;
            // Remove from duplicates list
            setDuplicates((prev)=>{
                const remaining = prev.filter((d)=>d.existing.id !== duplicate.existing.id);
                if (remaining.length === 0) {
                    setImportSuccess("All duplicates resolved!");
                    if (onSuccess) onSuccess();
                    setTimeout(handleClose, 1500);
                }
                return remaining;
            });
        } catch (err) {
            console.error("Merge error:", err);
        }
    };
    const handleRejectDuplicate = (id)=>{
        setDuplicates((prev)=>{
            const remaining = prev.filter((d)=>d.existing.id !== id);
            if (remaining.length === 0) {
                setImportSuccess("All duplicates handled.");
                if (onSuccess) onSuccess();
                setTimeout(handleClose, 1500);
            }
            return remaining;
        });
    };
    const handleMergeAll = async ()=>{
        if (!confirm(`Are you sure you want to merge all ${duplicates.length} duplicates? This will update existing records with new information.`)) return;
        setImporting(true);
        let mergedCount = 0;
        try {
            for (const duplicate of duplicates){
                const existingDetails = typeof duplicate.existing.customer_details === 'string' ? JSON.parse(duplicate.existing.customer_details) : duplicate.existing.customer_details || {};
                const newDetails = typeof duplicate.new.customer_details === 'string' ? JSON.parse(duplicate.new.customer_details) : duplicate.new.customer_details || {};
                const flatIncoming = newDetails.history && newDetails.active_details ? newDetails.history[newDetails.active_details] : newDetails;
                let finalStructured;
                if (existingDetails.history && existingDetails.active_details) {
                    const nextIndex = Object.keys(existingDetails.history).length + 1;
                    const nextId = `details-${nextIndex}`;
                    finalStructured = {
                        ...existingDetails,
                        active_details: nextId,
                        history: {
                            ...existingDetails.history,
                            [nextId]: flatIncoming
                        }
                    };
                } else {
                    finalStructured = {
                        active_details: "details-2",
                        history: {
                            "details-1": existingDetails,
                            "details-2": flatIncoming
                        }
                    };
                }
                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("customers").update({
                    customer_details: JSON.stringify(finalStructured)
                }).eq("id", duplicate.existing.id);
                mergedCount++;
            }
            setDuplicates([]);
            setShowConflictModal(false);
            setImportSuccess(`Successfully merged ${mergedCount} duplicates!`);
            if (onSuccess) onSuccess();
            setTimeout(handleClose, 2000);
        } catch (err) {
            console.error("Merge all error:", err);
            setImportError("Error during bulk merge. Some records may not have been updated.");
        } finally{
            setImporting(false);
        }
    };
    const usedColumns = getUsedColumns(); // Calculate for render
    const renderDetailsPreview = (details)=>{
        if (!details) return null;
        let data = details;
        if (typeof details === 'string') {
            try {
                data = JSON.parse(details);
            } catch (e) {
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-[10px] text-gray-400 italic",
                    children: details
                }, void 0, false, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 998,
                    columnNumber: 16
                }, this);
            }
        }
        if (typeof data !== 'object' || data === null) return null;
        // Support structured JSON in preview
        let displayData = data;
        if (data.active_details && data.history) {
            displayData = data.history[data.active_details] || {};
        }
        return Object.entries(displayData).slice(0, 4).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-between text-[11px] gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-gray-400 truncate",
                        children: [
                            k.split('_')[0],
                            ":"
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ImportCustomersModal.tsx",
                        lineNumber: 1011,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "font-semibold text-gray-600 truncate",
                        children: String(v)
                    }, void 0, false, {
                        fileName: "[project]/components/ImportCustomersModal.tsx",
                        lineNumber: 1012,
                        columnNumber: 9
                    }, this)
                ]
            }, k, true, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1010,
                columnNumber: 7
            }, this));
    };
    if (!showImportModal && !showMappingModal && !showConflictModal) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            showImportModal && !showMappingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[60] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-xl font-bold",
                                    style: {
                                        color: "#263238",
                                        fontFamily: "'Poppins', sans-serif"
                                    },
                                    children: "Import Customers"
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1026,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleClose,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1028,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1027,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1025,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-6 p-4 bg-blue-50 rounded-lg text-sm text-gray-700",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                            children: "Instructions:"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1033,
                                            columnNumber: 17
                                        }, this),
                                        " Upload a CSV file with customer data."
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1032,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "text-xs font-bold text-gray-500 uppercase tracking-wider",
                                                        children: "Select Organization"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1039,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1038,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedOrgId || (user?.isClient ? user.organization_id || "" : ""),
                                                    onChange: (e)=>setSelectedOrgId(e.target.value),
                                                    disabled: !!preselectedOrgId || user?.isClient,
                                                    className: `w-full px-4 py-2.5 text-gray-500 border border-gray-200 rounded-xl text-sm ${preselectedOrgId || user?.isClient ? 'opacity-60 cursor-not-allowed bg-gray-100' : 'bg-gray-50'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select Organization"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1047,
                                                            columnNumber: 21
                                                        }, this),
                                                        organizations.map((org)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: org.id,
                                                                children: [
                                                                    org.company_name,
                                                                    " (",
                                                                    org.org_code,
                                                                    ")"
                                                                ]
                                                            }, org.id, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1048,
                                                                columnNumber: 47
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1041,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1037,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1.5",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                        className: "text-xs font-bold text-gray-500 uppercase tracking-wider",
                                                        children: "Select Campaign"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1053,
                                                        columnNumber: 21
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1052,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedCampaignId,
                                                    onChange: (e)=>setSelectedCampaignId(e.target.value),
                                                    disabled: !!preselectedCampaignId,
                                                    className: `w-full px-4 py-2.5 text-gray-500 bg-gray-50 border border-gray-200 rounded-xl text-sm ${preselectedCampaignId ? 'opacity-60 cursor-not-allowed' : ''}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Select Campaign"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1061,
                                                            columnNumber: 21
                                                        }, this),
                                                        campaigns.map((camp)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: camp.id,
                                                                children: camp.name
                                                            }, camp.id, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1062,
                                                                columnNumber: 44
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1055,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1051,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1036,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:border-[#4b33e8] transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            ref: fileInputRef,
                                            type: "file",
                                            accept: ".csv",
                                            onChange: handleFileUpload,
                                            className: "absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1068,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-upload text-3xl text-gray-400 mb-2 justify-center"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1069,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm text-gray-500",
                                            children: "Click or drag CSV file here"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1070,
                                            columnNumber: 17
                                        }, this),
                                        importFile && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "mt-2 text-sm text-[#4b33e8] font-bold",
                                            children: importFile.name
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1071,
                                            columnNumber: 32
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1067,
                                    columnNumber: 15
                                }, this),
                                importError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-3 bg-red-50 text-red-600 rounded text-sm",
                                    children: importError
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1074,
                                    columnNumber: 31
                                }, this),
                                importSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-4 p-3 bg-green-50 text-green-600 rounded text-sm",
                                    children: importSuccess
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1075,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 mt-6",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleClose,
                                        className: "px-6 py-2 bg-gray-100 rounded-lg text-sm font-medium",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1078,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1077,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1031,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1024,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1023,
                columnNumber: 9
            }, this),
            showMappingModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[70] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-gray-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                    className: "text-xl text-[#4b33e8] font-semibold",
                                    children: "Map CSV Columns"
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1090,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: handleClose,
                                    className: "text-gray-400 hover:text-gray-600",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1092,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1091,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1089,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-6",
                                    children: [
                                        "name",
                                        "phone",
                                        "expiry_date"
                                    ].map((field)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-1",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center justify-between",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                            className: "text-xs font-bold text-gray-500 uppercase",
                                                            children: field.replace("_", " ")
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1100,
                                                            columnNumber: 24
                                                        }, this),
                                                        field === 'expiry_date' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "checkbox",
                                                                    id: `check_${field}`,
                                                                    checked: !!selectedFields[field],
                                                                    onChange: (e)=>setSelectedFields({
                                                                            ...selectedFields,
                                                                            [field]: e.target.checked
                                                                        }),
                                                                    className: "w-3 h-3 text-[#4b33e8] border-gray-300 rounded focus:ring-[#4b33e8]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1103,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    htmlFor: `check_${field}`,
                                                                    className: "text-[10px] text-gray-400 cursor-pointer",
                                                                    children: "Show in App"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1110,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1102,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1099,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex gap-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col w-full gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    value: fieldMapping[field] || "",
                                                                    onChange: (e)=>setFieldMapping({
                                                                            ...fieldMapping,
                                                                            [field]: e.target.value
                                                                        }),
                                                                    className: "w-full text-gray-500 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select column..."
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1121,
                                                                            columnNumber: 31
                                                                        }, this),
                                                                        field === 'expiry_date' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "__CUSTOM_DATE__",
                                                                            className: "font-bold text-[#4b33e8]",
                                                                            children: "✨ Set Custom Date"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1123,
                                                                            columnNumber: 33
                                                                        }, this),
                                                                        csvColumns.filter((col)=>!usedColumns.has(col) || col === fieldMapping[field]).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                value: col,
                                                                                children: col
                                                                            }, col, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1125,
                                                                                columnNumber: 122
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1116,
                                                                    columnNumber: 29
                                                                }, this),
                                                                field === 'expiry_date' && fieldMapping[field] === '__CUSTOM_DATE__' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    type: "date",
                                                                    value: customExpiryDate,
                                                                    onChange: (e)=>setCustomExpiryDate(e.target.value),
                                                                    className: "w-full px-3 py-2 bg-[#f0f2ff] border border-[#4b33e8] rounded-lg text-sm text-[#4b33e8] font-bold focus:outline-none focus:ring-1 focus:ring-[#4b33e8] animate-in fade-in slide-in-from-top-1"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1130,
                                                                    columnNumber: 33
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1115,
                                                            columnNumber: 25
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>addMergedField(field),
                                                            className: "p-2 w-9 h-9 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 transition-colors",
                                                            title: "Merge another column",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi fi-rr-plus text-xs"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1143,
                                                                columnNumber: 29
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1138,
                                                            columnNumber: 25
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1114,
                                                    columnNumber: 21
                                                }, this),
                                                mergedFields[field] && mergedFields[field].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-2 mt-1 pl-4 relative",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "absolute left-0 top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1149,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                value: val,
                                                                onChange: (e)=>updateMergedField(field, idx, e.target.value),
                                                                className: "w-full text-gray-500 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                        value: "",
                                                                        children: "Select column to merge..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1155,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    csvColumns.filter((col)=>!usedColumns.has(col) || col === val).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: col,
                                                                            children: col
                                                                        }, col, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1156,
                                                                            columnNumber: 108
                                                                        }, this))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1150,
                                                                columnNumber: 29
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>removeMergedField(field, idx),
                                                                className: "p-2 w-9 h-9 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-trash text-xs"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1162,
                                                                    columnNumber: 33
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1158,
                                                                columnNumber: 29
                                                            }, this)
                                                        ]
                                                    }, idx, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1148,
                                                        columnNumber: 25
                                                    }, this))
                                            ]
                                        }, field, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1098,
                                            columnNumber: 19
                                        }, this))
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1096,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-6 border-t border-gray-100 pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center justify-between mb-3",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "text-xs font-bold text-gray-500 uppercase",
                                                    children: "Additional Columns (Auto-Detected)"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1173,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: addCustomField,
                                                    className: "text-xs text-[#4b33e8] font-bold hover:underline flex items-center gap-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                            className: "fi fi-rr-plus"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1178,
                                                            columnNumber: 22
                                                        }, this),
                                                        " Add Field"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1174,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1172,
                                            columnNumber: 17
                                        }, this),
                                        customFields.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "space-y-3",
                                            children: customFields.map((cf)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex gap-3 items-center",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center pt-2",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                        type: "checkbox",
                                                                        checked: selectedFields[`custom_${cf.id}`] !== false,
                                                                        onChange: (e)=>setSelectedFields({
                                                                                ...selectedFields,
                                                                                [`custom_${cf.id}`]: e.target.checked
                                                                            }),
                                                                        className: "w-4 h-4 text-[#4b33e8] border-gray-300 rounded focus:ring-[#4b33e8]",
                                                                        title: "Show in Customer Details"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1188,
                                                                        columnNumber: 31
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1187,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                    placeholder: "Field Name (e.g. Plan Type)",
                                                                    className: "flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]",
                                                                    value: cf.name,
                                                                    onChange: (e)=>updateCustomField(cf.id, "name", e.target.value)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1196,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                    className: "fi fi-rr-arrow-right text-gray-300"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1202,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1 flex gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                            className: "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]",
                                                                            value: cf.mappedTo,
                                                                            onChange: (e)=>updateCustomField(cf.id, "mappedTo", e.target.value),
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                    value: "",
                                                                                    children: "Select CSV column..."
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1209,
                                                                                    columnNumber: 37
                                                                                }, this),
                                                                                csvColumns.filter((col)=>!usedColumns.has(col) || col === cf.mappedTo).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: col,
                                                                                        children: col
                                                                                    }, col, false, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1211,
                                                                                        columnNumber: 39
                                                                                    }, this))
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1204,
                                                                            columnNumber: 32
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>addMergedField(cf.id),
                                                                            className: "p-2 w-9 h-9 bg-blue-50 text-[#4b33e8] rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0",
                                                                            title: "Merge another column",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi fi-rr-plus text-xs"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1219,
                                                                                columnNumber: 35
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1214,
                                                                            columnNumber: 32
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1203,
                                                                    columnNumber: 28
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                    onClick: ()=>removeCustomField(cf.id),
                                                                    className: "p-2 w-9 h-9 flex items-center justify-center rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition-colors flex-shrink-0",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-trash text-sm"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1226,
                                                                        columnNumber: 30
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1222,
                                                                    columnNumber: 28
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1186,
                                                            columnNumber: 25
                                                        }, this),
                                                        mergedFields[cf.id] && mergedFields[cf.id].map((val, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex gap-2 pl-[calc(2rem_+_1px)] relative",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "absolute left-[1rem] top-1/2 -translate-y-1/2 w-4 h-px bg-gray-300"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1232,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1233,
                                                                        columnNumber: 33
                                                                    }, this),
                                                                    " ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex-1 flex gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                                value: val,
                                                                                onChange: (e)=>updateMergedField(cf.id, idx, e.target.value),
                                                                                className: "w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-500 focus:outline-none focus:ring-1 focus:ring-[#4b33e8]",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                        value: "",
                                                                                        children: "Select column to merge..."
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1240,
                                                                                        columnNumber: 42
                                                                                    }, this),
                                                                                    csvColumns.filter((col)=>!usedColumns.has(col) || col === val).map((col)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                            value: col,
                                                                                            children: col
                                                                                        }, col, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1241,
                                                                                            columnNumber: 117
                                                                                        }, this))
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1235,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>removeMergedField(cf.id, idx),
                                                                                className: "p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors flex-shrink-0",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-trash text-xs"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1247,
                                                                                    columnNumber: 42
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1243,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "w-8"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1249,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            " "
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1234,
                                                                        columnNumber: 33
                                                                    }, this)
                                                                ]
                                                            }, idx, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1231,
                                                                columnNumber: 29
                                                            }, this))
                                                    ]
                                                }, cf.id, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1185,
                                                    columnNumber: 23
                                                }, this))
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1183,
                                            columnNumber: 19
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "text-sm text-gray-400 italic text-center py-2 bg-gray-50 rounded-lg border border-dashed border-gray-200",
                                            children: "No custom fields added"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1257,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1171,
                                    columnNumber: 15
                                }, this),
                                importError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-3 bg-red-50 text-red-600 rounded text-sm",
                                    children: importError
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1263,
                                    columnNumber: 31
                                }, this),
                                importSuccess && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mb-4 p-3 bg-green-50 text-green-600 rounded text-sm",
                                    children: importSuccess
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1264,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex justify-end gap-3 border-t pt-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowMappingModal(false),
                                            className: "px-6 py-2 bg-gray-100 rounded-lg text-sm",
                                            children: "Back"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1267,
                                            columnNumber: 17
                                        }, this),
                                        isVerificationComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: isDbScanComplete ? handleFinalUpload : uploadCustomersToSupabase,
                                            disabled: isScanningDb || isFinalizing,
                                            className: `px-6 py-2 rounded-lg text-sm font-bold flex items-center gap-2 ${isDbScanComplete ? 'bg-indigo-600 hover:bg-indigo-700 animate-pulse-subtle' : 'bg-green-600 hover:bg-green-700'} text-white transition-all`,
                                            children: isScanningDb ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1275,
                                                        columnNumber: 31
                                                    }, this),
                                                    " Checking DB..."
                                                ]
                                            }, void 0, true) : isFinalizing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1277,
                                                        columnNumber: 32
                                                    }, this),
                                                    " Finalizing..."
                                                ]
                                            }, void 0, true) : isDbScanComplete ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi fi-rr-upload text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1279,
                                                        columnNumber: 31
                                                    }, this),
                                                    " Upload Now"
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    "Success: ",
                                                    fullyProcessedCustomers.length,
                                                    " Records Ready - Next Step"
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1269,
                                            columnNumber: 21
                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: verifyFileData,
                                            disabled: importing,
                                            className: "px-6 py-2 bg-[#4b33e8] text-white rounded-lg text-sm font-bold flex items-center gap-2",
                                            children: importing ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1290,
                                                        columnNumber: 40
                                                    }, this),
                                                    " Verifying..."
                                                ]
                                            }, void 0, true) : "Verify File Data"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1285,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1266,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1095,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1088,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1087,
                columnNumber: 9
            }, this),
            showFileConflictModal && fileConflicts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[130] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-4xl shadow-2xl flex flex-col max-h-[80vh] border border-gray-100 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-gray-100 flex items-center justify-between bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: selectedFileConflicts.size === fileConflicts.length && fileConflicts.length > 0,
                                                onChange: toggleSelectAllConflicts,
                                                className: "w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1308,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1307,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-copy-alt text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1316,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1315,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-gray-800",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "File Internal Duplicates"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1319,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-gray-400 font-medium",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-indigo-600 font-bold",
                                                            children: fileConflicts.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1321,
                                                            columnNumber: 29
                                                        }, this),
                                                        " repeating numbers found in this CSV ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-300 mx-1",
                                                            children: "|"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1321,
                                                            columnNumber: 139
                                                        }, this),
                                                        " Total Records: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600 font-bold",
                                                            children: fullyProcessedCustomers.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1321,
                                                            columnNumber: 200
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1320,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1318,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1306,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowFileConflictModal(false),
                                    className: "w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1330,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1326,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1305,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto custom-scrollbar bg-white",
                            children: [
                                fileConflicts.slice(0, 10).map((conflict, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-5 py-2 bg-gray-50/50 flex items-center justify-between border-y border-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedFileConflicts.has(idx),
                                                                onChange: ()=>toggleConflictSelection(idx),
                                                                className: "w-3.5 h-3.5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1341,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-gray-500 uppercase text-[10px] tracking-tight ml-1",
                                                                children: [
                                                                    "Repeating Group #",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1347,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1340,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4 items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-indigo-500 font-bold bg-indigo-50 px-2 py-0.5 rounded uppercase",
                                                                children: [
                                                                    conflict.records.length,
                                                                    " Records Found"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1350,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-px bg-gray-200"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1351,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleFileMerge(idx),
                                                                className: "text-[10px] font-bold text-indigo-600 hover:text-indigo-800 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-check text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1356,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Merge All"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1352,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>handleFileReject(idx),
                                                                className: "text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-trash text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1362,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Reject"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1358,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1349,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1339,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                className: "w-full text-left table-fixed",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                            className: "text-gray-400 uppercase text-[9px] font-bold border-b border-gray-100 bg-gray-50/20",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-3 w-[25%]",
                                                                    children: "Name / Info"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1370,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-3 w-[45%]",
                                                                    children: "Mapped Details"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1371,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-3 py-3 w-[15%]",
                                                                    children: "Row Index"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1372,
                                                                    columnNumber: 43
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                    className: "px-5 py-3 w-[15%] text-right",
                                                                    children: "Status"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1373,
                                                                    columnNumber: 43
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1369,
                                                            columnNumber: 39
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1368,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                        className: "divide-y divide-gray-50",
                                                        children: conflict.records.map((rec, ridx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                className: "hover:bg-gray-50/5 transition-colors group",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-4 align-top",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "font-bold text-gray-800 text-[11px] leading-tight truncate",
                                                                                children: rec.customer_name
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1380,
                                                                                columnNumber: 51
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "text-[10px] text-indigo-500 font-bold mt-1 tracking-tight",
                                                                                children: rec.display_phone || 'N/A'
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1381,
                                                                                columnNumber: 51
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1379,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-4 align-top text-wrap",
                                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1.5",
                                                                            children: Object.entries(rec.customer_details.history?.[rec.customer_details.active_details] || {}).slice(0, 6).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col bg-slate-50 p-1.5 rounded border border-gray-100 min-w-[90px] max-w-[150px]",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[7px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1",
                                                                                            children: k.replace('detail_', '').replace(/_/g, ' ')
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1391,
                                                                                            columnNumber: 63
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[10px] text-slate-700 font-semibold truncate",
                                                                                            children: String(v) || '—'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1394,
                                                                                            columnNumber: 63
                                                                                        }, this)
                                                                                    ]
                                                                                }, k, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1390,
                                                                                    columnNumber: 59
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1386,
                                                                            columnNumber: 51
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1385,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-3 py-4 align-top",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "flex items-center gap-1.5 text-gray-500",
                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "font-mono text-[11px] font-bold",
                                                                                    children: [
                                                                                        "#",
                                                                                        conflict.indices[ridx] + 1
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1403,
                                                                                    columnNumber: 53
                                                                                }, this)
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1402,
                                                                                columnNumber: 51
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                className: "text-[8px] text-gray-400 uppercase mt-1",
                                                                                children: "Row Num"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                lineNumber: 1405,
                                                                                columnNumber: 51
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1401,
                                                                        columnNumber: 47
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                        className: "px-5 py-4 align-top text-right",
                                                                        children: ridx === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100 uppercase tracking-tighter",
                                                                            children: "PRIMARY"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1409,
                                                                            columnNumber: 55
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "text-[9px] font-bold text-amber-500 bg-amber-50 px-2 py-1 rounded-full border border-amber-100 uppercase tracking-tighter",
                                                                            children: "DUPLICATE"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1411,
                                                                            columnNumber: 55
                                                                        }, this)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1407,
                                                                        columnNumber: 47
                                                                    }, this)
                                                                ]
                                                            }, ridx, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1378,
                                                                columnNumber: 43
                                                            }, this))
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1376,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1367,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1337,
                                        columnNumber: 27
                                    }, this)),
                                fileConflicts.length > 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-8 text-center bg-gray-50/50 border-t border-gray-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose",
                                        children: [
                                            "And ",
                                            fileConflicts.length - 10,
                                            " more duplicate clusters...",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1424,
                                                columnNumber: 93
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-medium lowercase",
                                                children: "Please handle these first to proceed."
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1425,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1423,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1422,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1335,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 font-medium",
                                            children: [
                                                "Total groups: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-bold",
                                                    children: fileConflicts.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1435,
                                                    columnNumber: 43
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1434,
                                            columnNumber: 25
                                        }, this),
                                        selectedFileConflicts.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 animate-in slide-in-from-left-2 duration-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-px bg-gray-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1439,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg",
                                                    children: [
                                                        selectedFileConflicts.size,
                                                        " Selected"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1440,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleBulkFileReject,
                                                    className: "px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100",
                                                    children: "Reject Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1443,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleBulkFileMerge,
                                                    className: "px-4 py-1.5 bg-indigo-600 text-white rounded-lg font-bold text-[11px] hover:bg-slate-900 transition-all shadow-lg shadow-indigo-100",
                                                    children: "Merge Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1449,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1438,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1433,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowFileConflictModal(false),
                                        className: "px-5 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-[11px] hover:bg-gray-100 transition-all border border-gray-200",
                                        children: "Review CSV"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1459,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1458,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1432,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1302,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1301,
                columnNumber: 11
            }, this),
            showDbConflictModal && dbConflicts.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-[140] flex items-center justify-center bg-black/30 backdrop-blur-sm p-4 text-xs",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-lg w-full max-w-5xl shadow-2xl flex flex-col max-h-[85vh] border border-gray-100 overflow-hidden",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-4 border-b border-amber-50 flex items-center justify-between bg-white",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-3 mr-2",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: selectedDbConflicts.size === dbConflicts.length && dbConflicts.length > 0,
                                                onChange: toggleSelectAllDbConflicts,
                                                className: "w-4 h-4 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1480,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1479,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-database text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1488,
                                                columnNumber: 28
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1487,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "font-bold text-gray-800",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Database Correlation Check"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1491,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-[10px] text-amber-500 font-bold uppercase tracking-tight",
                                                    children: [
                                                        "Stage 2: ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-amber-600 font-black",
                                                            children: dbConflicts.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1493,
                                                            columnNumber: 38
                                                        }, this),
                                                        " records already exist in CRM (out of ",
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-gray-600",
                                                            children: fullyProcessedCustomers.length
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                            lineNumber: 1493,
                                                            columnNumber: 147
                                                        }, this),
                                                        " total records)"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1492,
                                                    columnNumber: 28
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1490,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1478,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowDbConflictModal(false),
                                    className: "w-8 h-8 rounded-lg hover:bg-gray-50 flex items-center justify-center text-gray-400 transition-colors",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross-small text-xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1502,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1498,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1477,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex-1 overflow-y-auto custom-scrollbar bg-white",
                            children: [
                                dbConflicts.slice(0, 10).map((conflict, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "px-5 py-2 bg-amber-50/20 flex items-center justify-between border-y border-amber-50/50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                type: "checkbox",
                                                                checked: selectedDbConflicts.has(idx),
                                                                onChange: ()=>toggleDbConflictSelection(idx),
                                                                className: "w-3.5 h-3.5 rounded border-gray-300 text-amber-600 focus:ring-amber-500 cursor-pointer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1513,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "font-bold text-amber-700 uppercase text-[10px] tracking-tight ml-1 leading-none",
                                                                children: [
                                                                    "Correlation Match #",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1519,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1512,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex gap-4 items-center",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-[10px] text-gray-400 font-medium",
                                                                children: [
                                                                    "Phone: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-gray-700 font-bold",
                                                                        children: conflict.fileRecord.display_phone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1522,
                                                                        columnNumber: 101
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1522,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "h-4 w-px bg-amber-100"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1523,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setSelectedDbConflicts(new Set([
                                                                        idx
                                                                    ]));
                                                                    handleDbMergeSelected();
                                                                },
                                                                className: "text-[10px] font-bold text-amber-600 hover:text-amber-800 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-check text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1531,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Merge Choice"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1524,
                                                                columnNumber: 38
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                onClick: ()=>{
                                                                    setSelectedDbConflicts(new Set([
                                                                        idx
                                                                    ]));
                                                                    handleDbSkipSelected();
                                                                },
                                                                className: "text-[10px] font-bold text-rose-500 hover:text-rose-700 transition-colors flex items-center gap-1",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-cross text-[9px]"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1540,
                                                                        columnNumber: 41
                                                                    }, this),
                                                                    " Reject New"
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1533,
                                                                columnNumber: 38
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1521,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1511,
                                                columnNumber: 31
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 divide-x divide-gray-100 border-b border-gray-50",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-indigo-50/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[9px] font-black text-indigo-400 uppercase tracking-widest",
                                                                    children: "Incoming Data"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1550,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1549,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: "text-[11px] font-bold text-gray-800 leading-tight",
                                                                            children: conflict.fileRecord.customer_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1554,
                                                                            columnNumber: 47
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1 mt-2",
                                                                            children: Object.entries(conflict.fileRecord.customer_details.history?.[conflict.fileRecord.customer_details.active_details] || {}).slice(0, 4).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "bg-white px-2 py-1 rounded border border-indigo-100 text-[10px]",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-gray-400 font-bold text-[8px] mr-1",
                                                                                            children: [
                                                                                                k.replace('_checked', '').replace(/_/g, ' '),
                                                                                                ":"
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1560,
                                                                                            columnNumber: 60
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-indigo-600 font-bold",
                                                                                            children: String(v)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                            lineNumber: 1561,
                                                                                            columnNumber: 60
                                                                                        }, this)
                                                                                    ]
                                                                                }, k, true, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1559,
                                                                                    columnNumber: 56
                                                                                }, this))
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1555,
                                                                            columnNumber: 47
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1553,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1552,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1548,
                                                        columnNumber: 35
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "p-4 bg-amber-50/5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between mb-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[9px] font-black text-amber-500 uppercase tracking-widest",
                                                                        children: "Database Record"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1572,
                                                                        columnNumber: 43
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[9px] font-bold border border-amber-200 uppercase tracking-tighter",
                                                                        children: "EXISTS IN CRM"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1573,
                                                                        columnNumber: 43
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1571,
                                                                columnNumber: 39
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start gap-3",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex-1",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                            className: `text-[11px] font-bold leading-tight ${conflict.dbRecord.customer_name !== conflict.fileRecord.customer_name ? 'text-rose-500' : 'text-gray-800'}`,
                                                                            children: [
                                                                                conflict.dbRecord.customer_name,
                                                                                conflict.dbRecord.customer_name !== conflict.fileRecord.customer_name && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "block text-[8px] font-medium italic mt-0.5 uppercase",
                                                                                    children: "(Name Mismatch)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                    lineNumber: 1580,
                                                                                    columnNumber: 55
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1577,
                                                                            columnNumber: 47
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex flex-wrap gap-1 mt-2",
                                                                            children: (()=>{
                                                                                const dbDetails = typeof conflict.dbRecord.customer_details === 'string' ? JSON.parse(conflict.dbRecord.customer_details) : conflict.dbRecord.customer_details || {};
                                                                                const historyKey = dbDetails.active_details || Object.keys(dbDetails.history || {})[0] || 'details-1';
                                                                                const currentDetails = dbDetails.history?.[historyKey] || {};
                                                                                return Object.entries(currentDetails).slice(0, 4).map(([k, v])=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                        className: "bg-white px-2 py-1 rounded border border-amber-100 text-[10px]",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "text-gray-400 font-bold text-[8px] mr-1",
                                                                                                children: [
                                                                                                    k.replace('_checked', '').replace(/_/g, ' '),
                                                                                                    ":"
                                                                                                ]
                                                                                            }, void 0, true, {
                                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                                lineNumber: 1594,
                                                                                                columnNumber: 65
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                className: "text-amber-600 font-bold",
                                                                                                children: String(v)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                                lineNumber: 1595,
                                                                                                columnNumber: 65
                                                                                            }, this)
                                                                                        ]
                                                                                    }, k, true, {
                                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                                        lineNumber: 1593,
                                                                                        columnNumber: 61
                                                                                    }, this));
                                                                            })()
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                            lineNumber: 1583,
                                                                            columnNumber: 47
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                    lineNumber: 1576,
                                                                    columnNumber: 43
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1575,
                                                                columnNumber: 39
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1570,
                                                        columnNumber: 35
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1546,
                                                columnNumber: 31
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1509,
                                        columnNumber: 27
                                    }, this)),
                                dbConflicts.length > 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-8 text-center bg-gray-50/50 border-t border-gray-100",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-gray-400 uppercase tracking-widest leading-loose",
                                        children: [
                                            "And ",
                                            dbConflicts.length - 10,
                                            " more Database matches found...",
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1610,
                                                columnNumber: 95
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-[10px] font-medium lowercase italic",
                                                children: "Conflict strategy must be chosen for all."
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1611,
                                                columnNumber: 35
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1609,
                                        columnNumber: 31
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1608,
                                    columnNumber: 27
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1507,
                            columnNumber: 19
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "px-5 py-3 border-t border-gray-100 flex items-center justify-between bg-white rounded-b-lg shadow-[0_-4px_10px_rgba(0,0,0,0.02)]",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-gray-400 font-medium",
                                            children: [
                                                "Total overlaps: ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-gray-700 font-bold",
                                                    children: dbConflicts.length
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1621,
                                                    columnNumber: 45
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1620,
                                            columnNumber: 25
                                        }, this),
                                        selectedDbConflicts.size > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 animate-in slide-in-from-left-2 duration-200",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "h-4 w-px bg-gray-200"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1625,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-[11px] font-bold text-amber-600 bg-amber-50 px-3 py-1 rounded-lg",
                                                    children: [
                                                        selectedDbConflicts.size,
                                                        " Selected"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1626,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleDbSkipSelected,
                                                    className: "px-4 py-1.5 bg-rose-50 text-rose-600 rounded-lg font-bold text-[11px] hover:bg-rose-100 transition-all border border-rose-100",
                                                    children: "Reject Selected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1629,
                                                    columnNumber: 33
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleDbMergeSelected,
                                                    className: "px-4 py-1.5 bg-amber-600 text-white rounded-lg font-bold text-[11px] hover:bg-amber-700 transition-all shadow-lg shadow-amber-100",
                                                    children: "Merge & Update CRM"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1635,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1624,
                                            columnNumber: 29
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1619,
                                    columnNumber: 23
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex gap-2",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowDbConflictModal(false),
                                        className: "px-5 py-2 bg-gray-50 text-gray-600 rounded-lg font-bold text-[11px] hover:bg-gray-100 transition-all border border-gray-200",
                                        children: "Back to Map"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1645,
                                        columnNumber: 25
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1644,
                                    columnNumber: 23
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1618,
                            columnNumber: 19
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1474,
                    columnNumber: 15
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1473,
                columnNumber: 11
            }, this),
            showConflictModal && duplicates.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 backdrop-blur-lg flex items-center justify-center z-[80] p-4",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-100",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex items-center justify-between p-6 border-b border-amber-100 bg-amber-50/50",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shadow-inner",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-triangle-warning text-xl"
                                            }, void 0, false, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1664,
                                                columnNumber: 20
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1663,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                                    className: "text-xl font-bold text-amber-900",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Duplicate Conflicts Detected"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1667,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs font-medium text-amber-600 uppercase tracking-widest",
                                                    children: [
                                                        duplicates.length,
                                                        " overlapping records found"
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1668,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1666,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1662,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>setShowConflictModal(false),
                                    className: "w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-cross text-lg"
                                    }, void 0, false, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1672,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1671,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1661,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-8 overflow-y-auto flex-1 custom-scrollbar space-y-6 bg-slate-50/30",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-4 bg-white border border-amber-100 rounded-xl text-sm text-amber-800 flex items-start gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-info mt-0.5"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1678,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            children: [
                                                "The following customers are already in your database. You can choose to ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Merge"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1679,
                                                    columnNumber: 93
                                                }, this),
                                                " the new information (update existing record) or ",
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                    children: "Reject"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                                    lineNumber: 1679,
                                                    columnNumber: 164
                                                }, this),
                                                " the new entry (keep existing data)."
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1679,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1677,
                                    columnNumber: 15
                                }, this),
                                duplicates.slice(0, 10).map((dup, idx)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-slate-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-xs font-bold text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full",
                                                                children: [
                                                                    "#",
                                                                    idx + 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1686,
                                                                columnNumber: 24
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-sm font-bold text-slate-700",
                                                                children: "Phone Conflict"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1687,
                                                                columnNumber: 24
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1685,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-mono text-slate-400 bg-white px-2 py-1 rounded border border-gray-100",
                                                        children: [
                                                            "HASH: ",
                                                            dup.existing.phone_search_hash?.substring(0, 8),
                                                            "..."
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1689,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1684,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-2 gap-px bg-gray-100",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "bg-white p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-200",
                                                                        children: "DB"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1695,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-black text-slate-400 uppercase tracking-widest",
                                                                        children: "Existing Record"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1696,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1694,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-lg font-bold text-slate-900 mb-4",
                                                                children: dup.existing.customer_name || "Unnamed Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1698,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-100 min-h-[100px]",
                                                                children: [
                                                                    renderDetailsPreview(dup.existing.customer_details),
                                                                    !dup.existing.customer_details && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-[11px] text-slate-400 italic",
                                                                        children: "No details available"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1701,
                                                                        columnNumber: 60
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1699,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1693,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "bg-white p-6",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-2 mb-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-[10px] font-bold text-white shadow-lg shadow-indigo-100",
                                                                        children: "CSV"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1707,
                                                                        columnNumber: 25
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                        className: "text-[10px] font-black text-indigo-600 uppercase tracking-widest",
                                                                        children: "Incoming Row"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                        lineNumber: 1708,
                                                                        columnNumber: 25
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1706,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "text-lg font-bold text-slate-900 mb-4",
                                                                children: dup.new.customer_name || "Unnamed Customer"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1710,
                                                                columnNumber: 23
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "space-y-2 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50 min-h-[100px]",
                                                                children: renderDetailsPreview(dup.new.customer_details)
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                                lineNumber: 1711,
                                                                columnNumber: 23
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1705,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1691,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "p-4 bg-slate-50 border-t border-gray-100 flex justify-end gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleRejectDuplicate(dup.existing.id),
                                                        className: "px-5 py-2 rounded-xl text-xs font-bold text-slate-500 hover:bg-white hover:text-slate-700 transition-all border border-transparent hover:border-slate-200",
                                                        children: "Reject Entry"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1717,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleMergeDuplicate(dup),
                                                        className: "px-6 py-2 rounded-xl text-xs font-bold bg-indigo-600 text-white hover:bg-slate-900 transition-all shadow-lg shadow-indigo-200 active:scale-95",
                                                        children: "Merge & Update"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                                        lineNumber: 1723,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/ImportCustomersModal.tsx",
                                                lineNumber: 1716,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, idx, true, {
                                        fileName: "[project]/components/ImportCustomersModal.tsx",
                                        lineNumber: 1683,
                                        columnNumber: 17
                                    }, this)),
                                duplicates.length > 10 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "py-8 text-center bg-white rounded-2xl border border-dashed border-slate-200",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-bold text-slate-400 uppercase tracking-widest",
                                            children: [
                                                "+",
                                                duplicates.length - 10,
                                                " more conflicts remaining"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1734,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-xs text-slate-300 mt-1",
                                            children: "Please resolve the visible items to see more."
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1735,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1733,
                                    columnNumber: 18
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1676,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "p-6 border-t border-gray-200 bg-white flex justify-between items-center",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: ()=>{
                                        if (confirm("Are you sure you want to reject all remaining duplicates?")) {
                                            setDuplicates([]);
                                            setShowConflictModal(false);
                                            setImportSuccess("Import complete. All duplicates were rejected.");
                                            if (onSuccess) onSuccess();
                                            setTimeout(handleClose, 2000);
                                        }
                                    },
                                    className: "text-xs font-bold text-slate-400 hover:text-red-500 transition-colors uppercase tracking-widest px-4",
                                    children: "Reject All Remaining"
                                }, void 0, false, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1741,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-4",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-xs font-bold text-slate-400",
                                            children: [
                                                duplicates.length,
                                                " items left"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1756,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: handleMergeAll,
                                            disabled: importing,
                                            className: "px-6 py-3 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xl hover:bg-slate-900 transition-all active:scale-95 disabled:opacity-50",
                                            children: importing ? "Merging..." : `Merge All (${duplicates.length})`
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1758,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowConflictModal(false),
                                            className: "px-8 py-3 bg-slate-200 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-300 transition-all active:scale-95",
                                            children: "Close"
                                        }, void 0, false, {
                                            fileName: "[project]/components/ImportCustomersModal.tsx",
                                            lineNumber: 1766,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ImportCustomersModal.tsx",
                                    lineNumber: 1755,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ImportCustomersModal.tsx",
                            lineNumber: 1740,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ImportCustomersModal.tsx",
                    lineNumber: 1660,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ImportCustomersModal.tsx",
                lineNumber: 1659,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/hooks/useDashboardStats.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDashboardStats",
    ()=>useDashboardStats
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
const CACHE_TTL = 60 * 1000; // 60 seconds
function useDashboardStats() {
    const [stats, setStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        totalCustomers: 0,
        totalPremium: 0,
        totalConverted: 0,
        conversionRate: 0,
        totalDials: 0,
        totalTalktime: 0,
        activeCampaigns: 0,
        teamSize: 0,
        efficiencyScore: 75
    });
    const [secondaryStats, setSecondaryStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        todayCalls: 0,
        freshProspects: 0,
        followupCalls: 0,
        overdueFollowups: 0,
        newProspects: 0,
        assignedMembers: 0
    });
    const [performanceMetrics, setPerformanceMetrics] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        avgDuration: "0m 0s",
        connectedRate: "0%",
        roi: "1.0x"
    });
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])({});
    // Clean up abort controller on unmount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    const fetchStats = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (orgId, dateFilter = "this_month", userId)=>{
        const cacheKey = `${orgId || 'all'}-${dateFilter}-${userId || 'all'}`;
        // Check cache
        const cached = cacheRef.current[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setStats(cached.data.stats);
            setSecondaryStats(cached.data.secondaryStats);
            setPerformanceMetrics(cached.data.performanceMetrics);
            loading && setLoading(false); // Ensure loading is false if cache hit
            return;
        }
        // Cancel previous request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
            setLoading(true);
            setError(null);
            // Wait for session using the robust helper (handles hydration race conditions)
            const { ensureValidSession } = await __turbopack_context__.A("[project]/lib/sessionManager.ts [ssr] (ecmascript, async loader)");
            const session = await ensureValidSession();
            if (!session) throw new Error("Not authenticated");
            const params = new URLSearchParams({
                dateFilter,
                ...orgId && {
                    orgId
                },
                ...userId && {
                    userId
                }
            });
            const response = await fetch(`/api/dashboard_overview?${params}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                signal: controller.signal
            });
            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error(`API error: ${response.status}`);
            }
            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || `API error: ${response.status}`);
            }
            const data = {
                stats: result.data.stats,
                secondaryStats: result.data.secondaryStats,
                performanceMetrics: result.data.performanceMetrics
            };
            // Update State
            setStats(data.stats);
            setSecondaryStats(data.secondaryStats);
            setPerformanceMetrics(data.performanceMetrics);
            // Update Cache
            cacheRef.current[cacheKey] = {
                data,
                timestamp: Date.now()
            };
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Dashboard Stats Fetch Error:", err);
            setError(err.message || "Unknown error");
        } finally{
            if (controller.signal.aborted) {
            // Do nothing
            } else {
                setLoading(false);
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                }
            }
        }
    }, []);
    return {
        stats,
        secondaryStats,
        performanceMetrics,
        loading,
        error,
        fetchStats
    };
}
}),
"[project]/hooks/useDashboardCharts.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDashboardCharts",
    ()=>useDashboardCharts
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
const CACHE_TTL = 60 * 1000;
function useDashboardCharts() {
    const [chartData, setChartData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [pieData, setPieData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [heatmapData, setHeatmapData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [campaignData, setCampaignData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [hourlyStats, setHourlyStats] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const cacheRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])({});
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    const fetchChartData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (orgId, dateFilter = "this_month", customRange, userId)=>{
        const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}-${userId || 'all'}`;
        const cached = cacheRef.current[cacheKey];
        if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setChartData(cached.data.chartData);
            setPieData(cached.data.pieData);
            setHeatmapData(cached.data.heatmapData);
            setCampaignData(cached.data.campaignData);
            setHourlyStats(cached.data.hourlyStats);
            loading && setLoading(false);
            return;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
            setLoading(true);
            setError(null);
            // Wait for session using the robust helper (handles hydration race conditions)
            const { ensureValidSession } = await __turbopack_context__.A("[project]/lib/sessionManager.ts [ssr] (ecmascript, async loader)");
            const session = await ensureValidSession();
            if (!session) throw new Error("Not authenticated");
            const params = new URLSearchParams({
                dateFilter,
                ...orgId && {
                    orgId
                },
                ...customRange && {
                    startDate: customRange.start,
                    endDate: customRange.end
                },
                ...userId && {
                    userId
                }
            });
            const response = await fetch(`/api/dashboard_charts?${params}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                signal: controller.signal
            });
            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error(`API error: ${response.status}`);
            }
            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || `API error: ${response.status}`);
            }
            const data = result.data;
            setChartData(data.chartData);
            setPieData(data.pieData);
            setHeatmapData(data.heatmapData);
            setCampaignData(data.campaignData);
            setHourlyStats(data.hourlyStats);
            cacheRef.current[cacheKey] = {
                data,
                timestamp: Date.now()
            };
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Dashboard Charts Fetch Error:", err);
            setError(err.message || "Unknown error");
        } finally{
            if (controller.signal.aborted) {
            // Do nothing
            } else {
                // Only turn off loading if THIS was the active request
                if (abortControllerRef.current === controller) {
                    setLoading(false);
                    abortControllerRef.current = null;
                }
            }
        }
    }, []);
    return {
        chartData,
        pieData,
        heatmapData,
        campaignData,
        hourlyStats,
        loading,
        error,
        fetchChartData
    };
}
}),
"[project]/hooks/useAgentPerformance.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useAgentPerformance",
    ()=>useAgentPerformance
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
const CACHE_TTL = 60 * 1000;
// Global cache to persist across remounts/tab switches
const globalCache = {};
function useAgentPerformance() {
    const [agentData, setAgentData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [totalDials, setTotalDials] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [totalDuration, setTotalDuration] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, []);
    const fetchAgentPerformance = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (orgId, dateFilter = "this_month", customRange, force = false, userId)=>{
        const cacheKey = `${orgId || 'all'}-${dateFilter}-${customRange ? JSON.stringify(customRange) : ''}-${userId || 'all'}`;
        const cached = globalCache[cacheKey];
        if (!force && cached && Date.now() - cached.timestamp < CACHE_TTL) {
            setAgentData(cached.data.agentData);
            setTotalDials(cached.data.totalDials);
            setTotalDuration(cached.data.totalDuration);
            if (loading) setLoading(false);
            return;
        }
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        const controller = new AbortController();
        abortControllerRef.current = controller;
        try {
            setLoading(true);
            setError(null);
            // Wait for session using the robust helper (handles hydration race conditions)
            const { ensureValidSession } = await __turbopack_context__.A("[project]/lib/sessionManager.ts [ssr] (ecmascript, async loader)");
            const session = await ensureValidSession();
            if (!session) throw new Error("Not authenticated");
            const params = new URLSearchParams({
                dateFilter,
                ...orgId && {
                    orgId
                },
                ...customRange && {
                    startDate: customRange.start,
                    endDate: customRange.end
                },
                ...userId && {
                    userId
                }
            });
            const response = await fetch(`/api/agent_performance?${params}`, {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                },
                signal: controller.signal
            });
            let result;
            try {
                result = await response.json();
            } catch (e) {
                throw new Error(`API error: ${response.status}`);
            }
            if (!response.ok || !result.success || !result.data) {
                throw new Error(result.error || `API error: ${response.status}`);
            }
            const data = {
                agentData: result.data.agents,
                totalDials: result.data.totalDials || 0,
                totalDuration: result.data.totalDuration || 0
            };
            setAgentData(data.agentData);
            setTotalDials(data.totalDials);
            setTotalDuration(data.totalDuration);
            globalCache[cacheKey] = {
                data,
                timestamp: Date.now()
            };
        } catch (err) {
            if (err.name === 'AbortError') return;
            console.error("Agent Performance Fetch Error:", err);
            setError(err.message || "Unknown error");
        } finally{
            if (controller.signal.aborted) {
            // Do nothing
            } else {
                setLoading(false);
                if (abortControllerRef.current === controller) {
                    abortControllerRef.current = null;
                }
            }
        }
    }, []);
    return {
        agentData,
        totalDials,
        totalDuration,
        loading,
        error,
        fetchAgentPerformance
    };
}
}),
"[project]/lib/dateUtils.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * Shared date range utilities for dashboard APIs
 * All calculations are standardized to Asia/Kolkata (IST)
 */ __turbopack_context__.s([
    "calculateMonthsToTarget",
    ()=>calculateMonthsToTarget,
    "calculateNewExpiryDate",
    ()=>calculateNewExpiryDate,
    "formatDate",
    ()=>formatDate,
    "getISTDateRange",
    ()=>getISTDateRange
]);
function getISTDateRange(filter) {
    const now = new Date();
    // Get date string in YYYY-MM-DD for IST
    const istDateString = now.toLocaleDateString("en-CA", {
        timeZone: "Asia/Kolkata"
    });
    // Midnight IST in ISO format
    const todayStart = new Date(`${istDateString}T00:00:00+05:30`).toISOString();
    // End of day IST in ISO format
    const todayEnd = new Date(`${istDateString}T23:59:59+05:30`).toISOString();
    let start = todayStart;
    let end = todayEnd;
    switch(filter){
        case "yesterday":
            {
                const yesterday = new Date(`${istDateString}T00:00:00+05:30`);
                yesterday.setDate(yesterday.getDate() - 1);
                const yStr = yesterday.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });
                start = new Date(`${yStr}T00:00:00+05:30`).toISOString();
                end = new Date(`${yStr}T23:59:59+05:30`).toISOString();
                break;
            }
        case "this_week":
            {
                const d = new Date(`${istDateString}T00:00:00+05:30`);
                const day = d.getDay();
                const diff = day === 0 ? -6 : 1 - day; // Monday
                d.setDate(d.getDate() + diff);
                const monStr = d.toLocaleDateString("en-CA", {
                    timeZone: "Asia/Kolkata"
                });
                start = new Date(`${monStr}T00:00:00+05:30`).toISOString();
                break;
            }
        case "last_7_days":
            {
                const d = new Date(now);
                d.setDate(d.getDate() - 7);
                start = d.toISOString();
                break;
            }
        case "this_month":
            {
                const parts = istDateString.split("-");
                start = new Date(`${parts[0]}-${parts[1]}-01T00:00:00+05:30`).toISOString();
                break;
            }
        case "last_month":
            {
                const parts = istDateString.split("-");
                let year = parseInt(parts[0]);
                let month = parseInt(parts[1]) - 1;
                if (month === 0) {
                    month = 12;
                    year--;
                }
                const prevMonthStr = month.toString().padStart(2, '0');
                start = new Date(`${year}-${prevMonthStr}-01T00:00:00+05:30`).toISOString();
                const lastDay = new Date(year, month, 0).getDate();
                end = new Date(`${year}-${prevMonthStr}-${lastDay}T23:59:59+05:30`).toISOString();
                break;
            }
        case "this_year":
            const yStr = istDateString.split("-")[0];
            start = new Date(`${yStr}-01-01T00:00:00+05:30`).toISOString();
            break;
        case "multi_year":
            const yearInt = parseInt(istDateString.split("-")[0]);
            start = new Date(`${yearInt - 3}-01-01T00:00:00+05:30`).toISOString();
            break;
        case "all_time":
            start = "2020-01-01T00:00:00.000Z";
            break;
    }
    return {
        start,
        end
    };
}
function formatDate(date) {
    if (!date) return "N/A";
    const d = new Date(date);
    if (isNaN(d.getTime())) return "N/A";
    return d.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    });
}
function calculateNewExpiryDate(currentExpiry, monthsToAdd) {
    const baseDate = currentExpiry ? new Date(currentExpiry) : new Date();
    if (isNaN(baseDate.getTime())) return new Date().toISOString().split('T')[0];
    const newDate = new Date(baseDate);
    newDate.setMonth(newDate.getMonth() + monthsToAdd);
    return newDate.toISOString().split('T')[0];
}
function calculateMonthsToTarget(year, month) {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); // 0-11
    const targetYear = typeof year === 'string' ? parseInt(year) : year;
    const targetMonth = typeof month === 'string' ? parseInt(month) : month;
    if (isNaN(targetYear) || isNaN(targetMonth)) return 0;
    // Note: targetMonth expected as 1-12 from UI select, convert to 0-11
    return (targetYear - currentYear) * 12 + (targetMonth - 1 - currentMonth);
}
}),
"[project]/hooks/useDateFilter.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "useDateFilter",
    ()=>useDateFilter
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [ssr] (ecmascript)");
;
;
function useDateFilter(initialFilter = "this_month") {
    const [selectedFilter, setSelectedFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(initialFilter);
    const dateRange = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["getISTDateRange"])(selectedFilter);
    }, [
        selectedFilter
    ]);
    const setFilter = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((filter)=>{
        setSelectedFilter(filter);
        // Optionally persist to localStorage
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, []);
    const getDateRangeLabel = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((filter)=>{
        switch(filter){
            case "today":
                return "Today";
            case "yesterday":
                return "Yesterday";
            case "this_week":
                return "This Week";
            case "last_7_days":
                return "Last 7 Days";
            case "this_month":
                return "This Month";
            case "last_month":
                return "Last Month";
            case "this_year":
                return "1 Year Report";
            case "multi_year":
                return "Multi-Year Report";
            case "all_time":
                return "All Time";
            default:
                return filter;
        }
    }, []);
    return {
        selectedFilter,
        dateRange,
        setFilter,
        getDateRangeLabel
    };
}
}),
"[project]/hooks/useOrganizationDetailData.ts [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "useOrganizationDetailData",
    ()=>useOrganizationDetailData
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
function useOrganizationDetailData(organizationId) {
    const [organization, setOrganization] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [orgUsers, setOrgUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [searchQuery, setSearchQuery] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const abortControllerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fetchData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async (isBackground = false)=>{
        if (!organizationId || Array.isArray(organizationId)) return;
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        abortControllerRef.current = new AbortController();
        try {
            if (!isBackground) setLoading(true);
            setError("");
            // 1. Fetch Organization Details
            const { data: orgData, error: orgError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").select("*").eq("id", organizationId).single();
            if (orgError) throw orgError;
            setOrganization(orgData);
            // 2. Fetch Users associated with this organization
            const { data: userData, error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").select("id, user_name, email, role, status, profile_pic_url, employee_id, expire_at, is_client").eq("organization_id", organizationId).order("user_name", {
                ascending: true
            });
            if (userError) throw userError;
            setOrgUsers(userData || []);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error("Error fetching organization detail data:", err);
                setError("Failed to load organization details");
            }
        } finally{
            if (!isBackground) setLoading(false);
        }
    }, [
        organizationId
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchData();
        return ()=>{
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [
        fetchData
    ]);
    const refreshData = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])((isBackground = false)=>{
        return fetchData(isBackground);
    }, [
        fetchData
    ]);
    const stats = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const totalMembers = orgUsers.length;
        const activeLicenses = orgUsers.filter((u)=>u.status === "active").length;
        // Expiring soon: within 30 days
        const now = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(now.getDate() + 30);
        const expiringSoon = orgUsers.filter((u)=>{
            if (!u.expire_at) return false;
            const expiryDate = new Date(u.expire_at);
            return expiryDate > now && expiryDate <= thirtyDaysFromNow;
        }).length;
        return {
            totalMembers,
            activeLicenses,
            expiringSoon
        };
    }, [
        orgUsers
    ]);
    const filteredUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        const query = searchQuery.toLowerCase().trim();
        if (!query) return orgUsers;
        return orgUsers.filter((u)=>(u.user_name?.toLowerCase() || "").includes(query) || (u.email?.toLowerCase() || "").includes(query) || (u.employee_id?.toLowerCase() || "").includes(query));
    }, [
        orgUsers,
        searchQuery
    ]);
    return {
        loading,
        organization,
        setOrganization,
        orgUsers,
        setOrgUsers,
        stats,
        filteredUsers,
        searchQuery,
        setSearchQuery,
        refreshData
    };
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/hooks/index.ts [ssr] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

// Dashboard Hooks - Centralized exports
__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuthGuard.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardStats$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardStats.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDashboardCharts$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDashboardCharts.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAgentPerformance$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAgentPerformance.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useDateFilter$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useDateFilter.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useOrganizationDetailData.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/pages/portal/organization/[id].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>OrganizationDetail
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/head.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExpiryBadge$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ExpiryBadge.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SignupForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SignupForm.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ImportCustomersModal.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/hooks/index.ts [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useOrganizationDetailData.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dateUtils.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SignupForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SignupForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$index$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
;
;
;
function OrganizationDetail() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { id } = router.query;
    const { user, mounted, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    // Page level protection logic (Strict: Wait for auth to finalize)
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (mounted && !authLoading && user) {
            const allowedRoles = [
                'ceo',
                'admin',
                'super_admin'
            ];
            const userDesignation = user.designation?.toLowerCase().replace(/\s+/g, '_') || '';
            const isOrgVisible = user.isClient === false || user.isClient === true && allowedRoles.includes(userDesignation);
            if (!isOrgVisible) {
                console.warn("Unauthorized access to organization detail, redirecting...");
                router.replace('/dashboard');
            }
        }
    }, [
        mounted,
        user,
        authLoading,
        router
    ]);
    const { loading, organization, setOrganization, orgUsers, setOrgUsers, stats, filteredUsers, searchQuery, setSearchQuery, refreshData } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useOrganizationDetailData$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useOrganizationDetailData"])(id);
    const [showUserModal, setShowUserModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showSignupModal, setShowSignupModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [unassignedUsers, setUnassignedUsers] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [selectedUserToAdd, setSelectedUserToAdd] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [addingUser, setAddingUser] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showRenewalModal, setShowRenewalModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [renewalMonths, setRenewalMonths] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("1");
    const [customMonth, setCustomMonth] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [customYear, setCustomYear] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [renewingOrg, setRenewingOrg] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [previewExpiryDate, setPreviewExpiryDate] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [showImportModal, setShowImportModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const unassignedAbortRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const fetchUnassignedUsers = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useCallback"])(async ()=>{
        if (unassignedAbortRef.current) unassignedAbortRef.current.abort();
        unassignedAbortRef.current = new AbortController();
        try {
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('id, user_name, email').is('organization_id', null).abortSignal(unassignedAbortRef.current.signal);
            if (data) setUnassignedUsers(data);
        } catch (err) {
            if (err.name !== 'AbortError') {
                console.error('Error fetching unassigned users:', err);
            }
        }
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (id) {
            fetchUnassignedUsers();
        }
        return ()=>{
            if (unassignedAbortRef.current) unassignedAbortRef.current.abort();
        };
    }, [
        id,
        fetchUnassignedUsers
    ]);
    // Reset modal-related state on close
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!showUserModal) {
            setSelectedUserToAdd("");
        }
    }, [
        showUserModal
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!showRenewalModal) {
            setRenewalMonths("1");
            setCustomMonth("");
            setCustomYear("");
            setPreviewExpiryDate(null);
        }
    }, [
        showRenewalModal
    ]);
    const handleAddUser = async ()=>{
        if (!selectedUserToAdd || !organization) return;
        try {
            setAddingUser(true);
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                organization_id: organization.id,
                status: 'active'
            }).eq('id', selectedUserToAdd);
            if (error) throw error;
            setShowUserModal(false);
            // Redundant refetch avoided by doing refreshData() which is the only way to get full accurate list with profile pics etc easily
            // However, requirement says "Avoid redundant refetch after optimistic updates".
            // But adding a user involves moving them from "unassigned" to "assigned".
            // I'll refresh data to keep it consistent.
            refreshData(true);
            fetchUnassignedUsers();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Add member to ${organization.company_name}`,
                metadata: {
                    organization_id: organization.id,
                    user_id: selectedUserToAdd
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error adding user:", err);
            alert("Failed to add user");
        } finally{
            setAddingUser(false);
        }
    };
    const handleRemoveUser = async (userId, userName)=>{
        if (!confirm(`Remove ${userName} from this organization?`)) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                organization_id: null,
                status: 'inactive'
            }).eq('id', userId);
            if (error) throw error;
            // Optimistic update
            setOrgUsers((prev)=>prev.filter((u)=>u.id !== userId));
            fetchUnassignedUsers();
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Remove member from ${organization?.company_name}`,
                metadata: {
                    organization_id: organization?.id,
                    user_id: userId,
                    user_name: userName
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error removing user:", err);
        }
    };
    const toggleUserStatus = async (userId, currentStatus)=>{
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                status: newStatus
            }).eq('id', userId);
            if (error) throw error;
            // Optimistically update local state & stats (requirement 5)
            setOrgUsers((prev)=>prev.map((u)=>u.id === userId ? {
                        ...u,
                        status: newStatus
                    } : u));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Toggle member status to ${newStatus}`,
                metadata: {
                    organization_id: organization?.id,
                    user_id: userId,
                    status: newStatus
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error updating status:", err);
        }
    };
    const handleRenewalOrganization = async ()=>{
        if (!organization) return;
        try {
            setRenewingOrg(true);
            let monthsToAdd = 0;
            if (renewalMonths === "custom") {
                if (!customMonth || !customYear) {
                    alert("Please select both month and year for custom renewal");
                    return;
                }
                monthsToAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["calculateMonthsToTarget"])(customYear, customMonth);
                if (monthsToAdd <= 0) {
                    alert("Please select a future date for renewal");
                    return;
                }
            } else {
                monthsToAdd = parseInt(renewalMonths);
            }
            const newExpiryString = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["calculateNewExpiryDate"])(organization.expiry_date, monthsToAdd);
            const renewalDateString = new Date().toISOString().split('T')[0];
            // Update organization
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("organizations").update({
                expiry_date: newExpiryString,
                renewal_date: renewalDateString,
                is_active: true
            }).eq("id", organization.id);
            if (error) throw error;
            // Update all users assigned to this organization
            const { error: userUpdateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from("user_profiles").update({
                renewal_at: renewalDateString,
                expire_at: newExpiryString
            }).eq("organization_id", organization.id);
            if (userUpdateError) {
                console.error("Error updating user dates:", userUpdateError);
            }
            await refreshData(true);
            setShowRenewalModal(false);
            alert("Organization renewed successfully!");
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'WRITE',
                description: `Renew Organization: ${organization.company_name} for ${monthsToAdd} months`,
                metadata: {
                    organization_id: organization.id,
                    months_added: monthsToAdd,
                    new_expiry: newExpiryString
                },
                user_name: user?.displayName || 'Admin',
                organization_id: user?.organization_id || undefined
            });
        } catch (err) {
            console.error("Error renewing organization:", err);
            alert("Failed to renew organization");
        } finally{
            setRenewingOrg(false);
        }
    };
    // Calculate preview expiry date
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (!organization || !showRenewalModal) {
            setPreviewExpiryDate(null);
            return;
        }
        try {
            let monthsToAdd = 0;
            if (renewalMonths === "custom") {
                if (!customMonth || !customYear) {
                    setPreviewExpiryDate(null);
                    return;
                }
                monthsToAdd = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["calculateMonthsToTarget"])(customYear, customMonth);
                if (monthsToAdd <= 0) {
                    setPreviewExpiryDate(null);
                    return;
                }
            } else if (renewalMonths) {
                monthsToAdd = parseInt(renewalMonths);
            } else {
                setPreviewExpiryDate(null);
                return;
            }
            setPreviewExpiryDate((0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["calculateNewExpiryDate"])(organization.expiry_date, monthsToAdd));
        } catch (err) {
            setPreviewExpiryDate(null);
        }
    }, [
        renewalMonths,
        customMonth,
        customYear,
        organization,
        showRenewalModal
    ]);
    if (loading) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#f6f5f7]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "animate-spin rounded-full h-12 w-12 border-4 border-[#4b33e8] border-t-transparent"
            }, void 0, false, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 311,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/organization/[id].tsx",
            lineNumber: 310,
            columnNumber: 7
        }, this);
    }
    if (!organization) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center bg-[#f6f5f7]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center font-poppins",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                        className: "text-2xl font-semibold text-gray-800 mb-2",
                        children: "Organization not found"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 320,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        onClick: ()=>router.push("/organization"),
                        className: "text-[#4b33e8] font-semibold hover:underline",
                        children: "Back to Organizations"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 319,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/organization/[id].tsx",
            lineNumber: 318,
            columnNumber: 7
        }, this);
    }
    // Calculate Org Days Left
    const getOrgDaysLeft = ()=>{
        if (!organization.expiry_date) return null;
        const now = new Date();
        const exp = new Date(organization.expiry_date);
        const diff = Math.ceil((exp.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };
    const orgDaysLeft = getOrgDaysLeft();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$head$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("title", {
                    children: [
                        organization.company_name,
                        " • TFC Nexus"
                    ]
                }, void 0, true, {
                    fileName: "[project]/pages/portal/organization/[id].tsx",
                    lineNumber: 341,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 340,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 flex flex-col w-full min-w-0 font-poppins",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex-1 pb-12",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "relative w-full overflow-hidden  pb-10",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-500/5 rounded-full blur-[100px] -mr-64 -mt-64 pointer-events-none"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 349,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "container mx-auto px-3 sm:px-4 md:px-6 py-6 sm:py-8 pb-20 sm:pb-24 lg:pb-8 max-w-7xl relative z-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex items-center gap-2 text-xs text-slate-400 mb-6 font-semibold tracking-wide text-left",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "cursor-pointer hover:text-indigo-600 transition-colors",
                                                    onClick: ()=>router.push("/organization"),
                                                    children: "Organizations"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi flex fi-rr-angle-small-right text-[10px]"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 355,
                                                    columnNumber: 20
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                    className: "text-slate-600",
                                                    children: organization.company_name
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 356,
                                                    columnNumber: 20
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 353,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "relative bg-white rounded-2xl p-8 md:p-10 shadow-xl shadow-slate-200/40 overflow-hidden group",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "absolute top-0 right-0 p-12 opacity-[0.02] transform group-hover:scale-110 transition-transform duration-1000 pointer-events-none",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-building text-[12rem]"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 362,
                                                        columnNumber: 26
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 361,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white shadow-2xl shadow-indigo-200",
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                className: "text-3xl font-semibold",
                                                                children: organization.company_name.charAt(0)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 368,
                                                                columnNumber: 30
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 367,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex-1 min-w-0 text-left",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap items-center gap-4 mb-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                                                            className: "text-3xl md:text-4xl font-semibold text-slate-800 tracking-tight",
                                                                            children: organization.company_name
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 373,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        organization.is_active ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-emerald-700 text-[10px] font-semibold border border-emerald-200",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 377,
                                                                                    columnNumber: 42
                                                                                }, this),
                                                                                "Active"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 376,
                                                                            columnNumber: 38
                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100/80 text-red-700 text-[10px] font-semibold border border-red-200",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-1.5 h-1.5 rounded-full bg-red-500"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 382,
                                                                                    columnNumber: 42
                                                                                }, this),
                                                                                "Inactive"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 381,
                                                                            columnNumber: 38
                                                                        }, this),
                                                                        organization.org_code && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "px-3 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-semibold border border-slate-200",
                                                                            children: organization.org_code
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 388,
                                                                            columnNumber: 39
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 372,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-slate-500 text-sm md:text-base max-w-2xl leading-relaxed mb-6",
                                                                    children: organization.description || "Comprehensive organizational profile managing client assets, licenses, and operational compliance within the Nexus infrastructure."
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 394,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex flex-wrap gap-6",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-500",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-briefcase text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 401,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 400,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[9px] font-semibold text-slate-400",
                                                                                            children: "Industry"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 404,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs font-semibold text-slate-700",
                                                                                            children: organization.company_type || 'General'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 405,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 403,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 399,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-500",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-marker text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 411,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 410,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[9px] font-semibold text-slate-400",
                                                                                            children: "Headquarters"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 414,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs font-semibold text-slate-700 truncate max-w-[150px]",
                                                                                            title: organization.address || '',
                                                                                            children: organization.address ? organization.address.split(',')[0] : 'Remote'
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 415,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 413,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 409,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-2",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-purple-500",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-calendar-check text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 423,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 422,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "flex flex-col",
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-[9px] font-semibold text-slate-400",
                                                                                            children: "Joined On"
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 426,
                                                                                            columnNumber: 42
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                            className: "text-xs font-semibold text-slate-700",
                                                                                            children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatDate"])(organization.company_joined)
                                                                                        }, void 0, false, {
                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                            lineNumber: 427,
                                                                                            columnNumber: 42
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 425,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 421,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>setShowRenewalModal(true),
                                                                            className: "px-8 ml-3 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-[12px] font-medium hover:shadow-lg hover:scale-105 transition-all flex items-center gap-1.5",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi flex fi-rr-refresh text-[10px]"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 436,
                                                                                    columnNumber: 39
                                                                                }, this),
                                                                                "Renew"
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 432,
                                                                            columnNumber: 37
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 398,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 371,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 365,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 360,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 md:grid-cols-4 gap-6 mt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-users-alt text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 451,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 450,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Total"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 453,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 449,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: stats.totalMembers
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 456,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Deployed Personnel"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 457,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 455,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 448,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-id-badge text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 465,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 464,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Active"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 467,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 463,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: stats.activeLicenses
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 470,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Valid Licenses"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 471,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 469,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 462,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform",
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-alarm-clock text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 479,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 478,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Warning"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 481,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 477,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: stats.expiringSoon
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 484,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Expire in 30 Days"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 485,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 483,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 476,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "bg-white p-6 rounded-2xl hover:shadow-md transition-all group relative overflow-hidden text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: `absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl -mr-10 -mt-10 ${orgDaysLeft && orgDaysLeft < 30 ? 'bg-red-500/20' : 'bg-indigo-500/10'}`
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 491,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between mb-4 relative z-10",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `w-10 h-10 rounded-xl flex items-center justify-center text-white group-hover:scale-110 transition-transform ${orgDaysLeft && orgDaysLeft < 30 ? 'bg-red-500' : 'bg-indigo-500'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                        className: "fi flex fi-rr-crown text-lg"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 498,
                                                                        columnNumber: 34
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 495,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-semibold text-slate-300",
                                                                    children: "Validity"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 500,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 494,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col relative z-10",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-3xl font-semibold text-slate-800",
                                                                    children: orgDaysLeft !== null ? orgDaysLeft : '∞'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 503,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-[10px] font-semibold text-slate-400",
                                                                    children: "Days Remaining"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 504,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 502,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 490,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 446,
                                            columnNumber: 18
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "lg:col-span-1 space-y-8 text-left",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "bg-white rounded-2xl p-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    className: "text-xs font-semibold text-slate-400 mb-6 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-shield-check text-indigo-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 517,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        "Compliance Info"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 516,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-4",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "p-4 rounded-xl bg-slate-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[9px] font-semibold text-slate-400 mb-1 font-poppins",
                                                                                    children: "Tax Identity (GSTIN)"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 523,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-semibold text-slate-700 tracking-wide font-mono",
                                                                                    children: organization.gst_no || 'N/A'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 524,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 522,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "p-4 rounded-xl bg-slate-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[9px] font-semibold text-slate-400 mb-1 font-poppins",
                                                                                    children: "Company Code"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 527,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-semibold text-slate-700 tracking-wide font-mono",
                                                                                    children: organization.company_code || 'N/A'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 528,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 526,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "p-4 rounded-xl bg-slate-50",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[9px] font-semibold text-slate-400 mb-1 font-poppins",
                                                                                    children: "Full Address"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 531,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-xs font-semibold text-slate-600 leading-relaxed",
                                                                                    children: organization.address || '—'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 532,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 530,
                                                                            columnNumber: 34
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 521,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 515,
                                                            columnNumber: 26
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "bg-white rounded-2xl p-6",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                    className: "text-xs font-semibold text-slate-400 mb-6 flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                            className: "fi flex fi-rr-address-book text-emerald-500"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 540,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        "Principal Contact"
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 539,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-4 mb-6",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold text-lg font-poppins",
                                                                            children: organization.owner_name?.charAt(0) || 'O'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 545,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-semibold text-slate-800",
                                                                                    children: organization.owner_name || 'Unknown'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 549,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[10px] font-semibold text-slate-400 tracking-wide font-poppins",
                                                                                    children: "Owner / Admin"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 550,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 548,
                                                                            columnNumber: 34
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 544,
                                                                    columnNumber: 30
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3 text-xs font-medium text-slate-600",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-phone-call"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 557,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 556,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "font-poppins",
                                                                                    children: organization.owner_phone_no || 'No Phone'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 559,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 555,
                                                                            columnNumber: 34
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3 text-xs font-medium text-slate-600",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: "w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400",
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-envelope"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 563,
                                                                                        columnNumber: 42
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 562,
                                                                                    columnNumber: 38
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                    className: "truncate font-poppins",
                                                                                    children: organization.email || 'No Email'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 565,
                                                                                    columnNumber: 38
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 561,
                                                                            columnNumber: 34
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 554,
                                                                    columnNumber: 30
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 538,
                                                            columnNumber: 26
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 513,
                                                    columnNumber: 22
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "lg:col-span-2 space-y-8 text-left",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "bg-white rounded-2xl overflow-hidden flex flex-col min-h-[500px]",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                                        className: "text-sm font-bold text-slate-700 flex items-center gap-2",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi flex fi-rr-users-alt text-indigo-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 576,
                                                                                columnNumber: 38
                                                                            }, this),
                                                                            "Member Directory"
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 575,
                                                                        columnNumber: 34
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "flex items-center gap-3",
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "relative",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 581,
                                                                                        columnNumber: 43
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                        type: "text",
                                                                                        placeholder: "Search members...",
                                                                                        value: searchQuery,
                                                                                        onChange: (e)=>setSearchQuery(e.target.value),
                                                                                        className: "pl-8 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-48 placeholder:text-slate-400"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 582,
                                                                                        columnNumber: 43
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 580,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setShowUserModal(true),
                                                                                className: "flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl text-xs font-bold transition-all font-poppins",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-user-add"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 595,
                                                                                        columnNumber: 47
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        children: "Assign"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 596,
                                                                                        columnNumber: 47
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 591,
                                                                                columnNumber: 43
                                                                            }, this),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setShowSignupModal(true),
                                                                                className: "flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-indigo-200 font-poppins",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-plus"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 604,
                                                                                        columnNumber: 43
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        children: "Add"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 605,
                                                                                        columnNumber: 43
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 600,
                                                                                columnNumber: 39
                                                                            }, this),
                                                                            user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                onClick: ()=>setShowImportModal(true),
                                                                                className: "flex items-center gap-2 px-4 py-2 bg-indigo-50 text-[#4b33e8] border border-indigo-100 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-all uppercase tracking-widest font-poppins",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: "fi flex fi-rr-upload"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 613,
                                                                                        columnNumber: 47
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                        children: "Import"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 614,
                                                                                        columnNumber: 47
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 609,
                                                                                columnNumber: 43
                                                                            }, this)
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 579,
                                                                        columnNumber: 35
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 574,
                                                                columnNumber: 30
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex-1 overflow-x-auto",
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("table", {
                                                                    className: "w-full text-left border-collapse",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("thead", {
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                                className: "bg-slate-50/50 border-b border-slate-100",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "Member Profile"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 624,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "Role"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 625,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "Status"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 626,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 font-poppins",
                                                                                        children: "License Expiry"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 627,
                                                                                        columnNumber: 46
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("th", {
                                                                                        className: "p-4 text-[10px] font-bold text-slate-400 text-right font-poppins",
                                                                                        children: "Actions"
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 628,
                                                                                        columnNumber: 46
                                                                                    }, this)
                                                                                ]
                                                                            }, void 0, true, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 623,
                                                                                columnNumber: 42
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 622,
                                                                            columnNumber: 38
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tbody", {
                                                                            className: "divide-y divide-slate-50",
                                                                            children: [
                                                                                filteredUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                                        className: "group hover:bg-indigo-50/10 transition-colors",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center gap-3 text-left",
                                                                                                    children: [
                                                                                                        u.profile_pic_url ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                                                                                            src: u.profile_pic_url,
                                                                                                            className: "w-9 h-9 rounded-xl object-cover bg-white",
                                                                                                            alt: ""
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 637,
                                                                                                            columnNumber: 63
                                                                                                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                            className: "w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center text-slate-500 font-semibold text-xs font-poppins",
                                                                                                            children: (u.user_name || u.email || 'U').charAt(0).toUpperCase()
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 639,
                                                                                                            columnNumber: 63
                                                                                                        }, this),
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                            children: [
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                                    className: "text-sm font-semibold text-slate-700",
                                                                                                                    children: u.user_name || 'Unnamed'
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                    lineNumber: 644,
                                                                                                                    columnNumber: 63
                                                                                                                }, this),
                                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                                    className: "text-[10px] font-semibold text-slate-400 font-poppins",
                                                                                                                    children: u.employee_id || 'ID Pending'
                                                                                                                }, void 0, false, {
                                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                    lineNumber: 645,
                                                                                                                    columnNumber: 63
                                                                                                                }, this)
                                                                                                            ]
                                                                                                        }, void 0, true, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 643,
                                                                                                            columnNumber: 59
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 635,
                                                                                                    columnNumber: 54
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 634,
                                                                                                columnNumber: 50
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center gap-2 text-left",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "text-xs font-semibold text-slate-600 capitalize font-poppins",
                                                                                                            children: u.role || 'Employee'
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 651,
                                                                                                            columnNumber: 58
                                                                                                        }, this),
                                                                                                        u.is_client && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                            className: "px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-600 text-[9px] font-semibold uppercase font-poppins",
                                                                                                            children: "Client"
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 653,
                                                                                                            columnNumber: 62
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 650,
                                                                                                    columnNumber: 54
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 649,
                                                                                                columnNumber: 50
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4 text-left",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: `inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-semibold uppercase tracking-wider font-poppins ${u.status === 'active' ? 'bg-green-50 text-green-600' : 'bg-slate-100 text-slate-500'}`,
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                            className: `w-1.5 h-1.5 rounded-full ${u.status === 'active' ? 'bg-green-500' : 'bg-slate-400'}`
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 661,
                                                                                                            columnNumber: 58
                                                                                                        }, this),
                                                                                                        u.status || 'Pending'
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 658,
                                                                                                    columnNumber: 55
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 657,
                                                                                                columnNumber: 51
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4 text-left",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ExpiryBadge$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                                                                    expireDate: u.expire_at
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 666,
                                                                                                    columnNumber: 54
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 665,
                                                                                                columnNumber: 50
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                                className: "p-4 text-right",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                    className: "flex items-center justify-end gap-2",
                                                                                                    children: [
                                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>toggleUserStatus(u.id, u.status),
                                                                                                            className: `w-8 h-8 rounded-lg flex items-center justify-center transition-all ${u.status === 'active' ? 'text-amber-500 bg-amber-50 hover:bg-amber-100' : 'text-emerald-500 bg-emerald-50 hover:bg-emerald-100'}`,
                                                                                                            title: u.status === 'active' ? 'Deactivate Member' : 'Activate Member',
                                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                className: `fi flex ${u.status === 'active' ? 'fi-rr-power' : 'fi-rr-bolt'}`
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                lineNumber: 679,
                                                                                                                columnNumber: 63
                                                                                                            }, this)
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 670,
                                                                                                            columnNumber: 59
                                                                                                        }, this),
                                                                                                        user?.isClient === false && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                                                            onClick: ()=>handleRemoveUser(u.id, u.user_name || 'User'),
                                                                                                            className: "w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors",
                                                                                                            title: "Remove from Organization",
                                                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                                className: "fi flex fi-rr-trash"
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                                lineNumber: 688,
                                                                                                                columnNumber: 65
                                                                                                            }, this)
                                                                                                        }, void 0, false, {
                                                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                            lineNumber: 683,
                                                                                                            columnNumber: 61
                                                                                                        }, this)
                                                                                                    ]
                                                                                                }, void 0, true, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 669,
                                                                                                    columnNumber: 55
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 668,
                                                                                                columnNumber: 51
                                                                                            }, this)
                                                                                        ]
                                                                                    }, u.id, true, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 633,
                                                                                        columnNumber: 46
                                                                                    }, this)),
                                                                                orgUsers.length === 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("tr", {
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("td", {
                                                                                        colSpan: 5,
                                                                                        className: "p-12 text-center",
                                                                                        children: [
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                className: "inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 mb-3",
                                                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                                    className: "fi flex fi-rr-users text-slate-300"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                    lineNumber: 700,
                                                                                                    columnNumber: 58
                                                                                                }, this)
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 699,
                                                                                                columnNumber: 54
                                                                                            }, this),
                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                className: "text-sm font-semibold text-slate-400 font-poppins",
                                                                                                children: "No members deployed yet."
                                                                                            }, void 0, false, {
                                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                                lineNumber: 702,
                                                                                                columnNumber: 54
                                                                                            }, this)
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                        lineNumber: 698,
                                                                                        columnNumber: 50
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                    lineNumber: 697,
                                                                                    columnNumber: 46
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 631,
                                                                            columnNumber: 38
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 621,
                                                                    columnNumber: 34
                                                                }, this)
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 620,
                                                                columnNumber: 30
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 573,
                                                        columnNumber: 26
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 572,
                                                    columnNumber: 22
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 510,
                                            columnNumber: 18
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 351,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 348,
                            columnNumber: 12
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 345,
                        columnNumber: 9
                    }, this),
                    showSignupModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "relative bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 overflow-y-auto max-h-[90vh]",
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "p-8",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setShowSignupModal(false),
                                        className: "absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-cross-small"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 726,
                                            columnNumber: 23
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                        lineNumber: 722,
                                        columnNumber: 20
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SignupForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        onSuccess: ()=>{
                                            setShowSignupModal(false);
                                            refreshData(true);
                                        },
                                        defaultOrganizationId: organization?.id,
                                        fromAdminPanel: true
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                        lineNumber: 728,
                                        columnNumber: 20
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                lineNumber: 721,
                                columnNumber: 16
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 720,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 719,
                        columnNumber: 11
                    }, this),
                    showUserModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold text-slate-800",
                                            children: "Assign Member"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 746,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowUserModal(false),
                                            className: "w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-800 transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-cross-small"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                lineNumber: 748,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 747,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 745,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "p-6 space-y-6 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-poppins",
                                                    children: "Select User"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 754,
                                                    columnNumber: 29
                                                }, this),
                                                unassignedUsers.length > 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                    value: selectedUserToAdd,
                                                    onChange: (e)=>setSelectedUserToAdd(e.target.value),
                                                    className: "w-full text-slate-600 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 appearance-none font-poppins",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                            value: "",
                                                            children: "Choose a user..."
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 761,
                                                            columnNumber: 37
                                                        }, this),
                                                        unassignedUsers.map((u)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                value: u.id,
                                                                children: [
                                                                    u.user_name || u.email,
                                                                    " (",
                                                                    u.email,
                                                                    ")"
                                                                ]
                                                            }, u.id, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 763,
                                                                columnNumber: 41
                                                            }, this))
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 756,
                                                    columnNumber: 33
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "p-4 rounded-xl bg-slate-50 text-center border border-slate-100 border-dashed",
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                        className: "text-sm font-semibold text-slate-500 font-poppins",
                                                        children: "No unassigned users available."
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 770,
                                                        columnNumber: 37
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 769,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 753,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3 pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowUserModal(false),
                                                    className: "flex-1 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-50 transition-colors font-poppins",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 776,
                                                    columnNumber: 30
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleAddUser,
                                                    disabled: !selectedUserToAdd || addingUser,
                                                    className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed font-poppins",
                                                    children: addingUser ? 'Assigning...' : 'Assign Selected User'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 782,
                                                    columnNumber: 30
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 775,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 752,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 744,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 743,
                        columnNumber: 13
                    }, this),
                    showRenewalModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10 text-left",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                            className: "text-xl font-semibold text-gray-800",
                                            style: {
                                                fontFamily: "'Poppins', sans-serif"
                                            },
                                            children: "Renew Organization"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 800,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setShowRenewalModal(false),
                                            className: "text-gray-500 hover:text-gray-700 transition-colors",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-cross text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                lineNumber: 807,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 803,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 799,
                                    columnNumber: 21
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "px-6 py-6 space-y-6 text-left font-poppins",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                    className: "block text-sm font-medium mb-3 text-gray-700",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Select Renewal Period"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 813,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-4 gap-3 mb-4",
                                                    children: [
                                                        "1",
                                                        "2",
                                                        "3",
                                                        "custom"
                                                    ].map((option)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                            onClick: ()=>setRenewalMonths(option),
                                                            className: `py-3 px-4 rounded-xl font-bold text-sm transition-all ${renewalMonths === option ? "bg-indigo-600 text-white shadow-lg shadow-indigo-200" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`,
                                                            children: option === "custom" ? "Custom" : `${option}M`
                                                        }, option, false, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 819,
                                                            columnNumber: 37
                                                        }, this))
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 817,
                                                    columnNumber: 29
                                                }, this),
                                                renewalMonths === "custom" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "grid grid-cols-2 gap-3 mt-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "block t text-xs font-medium mb-2 text-gray-600 font-poppins",
                                                                    children: "Month"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 836,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    value: customMonth,
                                                                    onChange: (e)=>setCustomMonth(e.target.value),
                                                                    className: "w-full px-3 text-slate-600 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select Month"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 842,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        Array.from({
                                                                            length: 12
                                                                        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                value: i + 1,
                                                                                children: new Date(2000, i, 1).toLocaleString('default', {
                                                                                    month: 'long'
                                                                                })
                                                                            }, i + 1, false, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 844,
                                                                                columnNumber: 49
                                                                            }, this))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 837,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 835,
                                                            columnNumber: 37
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                    className: "block text-xs font-medium mb-2 text-gray-600 font-poppins",
                                                                    children: "Year"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 851,
                                                                    columnNumber: 41
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                                                    value: customYear,
                                                                    onChange: (e)=>setCustomYear(e.target.value),
                                                                    className: "w-full px-3 text-slate-600 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 font-poppins",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                            value: "",
                                                                            children: "Select Year"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                            lineNumber: 857,
                                                                            columnNumber: 45
                                                                        }, this),
                                                                        Array.from({
                                                                            length: 10
                                                                        }, (_, i)=>{
                                                                            const year = new Date().getFullYear() + i;
                                                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                                                                value: year,
                                                                                children: year
                                                                            }, year, false, {
                                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                                lineNumber: 860,
                                                                                columnNumber: 56
                                                                            }, this);
                                                                        })
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                    lineNumber: 852,
                                                                    columnNumber: 41
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                                            lineNumber: 850,
                                                            columnNumber: 37
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 834,
                                                    columnNumber: 33
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 812,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "bg-blue-50 border border-blue-200 rounded-lg p-4 font-poppins",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex items-start gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi flex fi-rr-info text-blue-600 text-sm mt-0.5"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 870,
                                                        columnNumber: 33
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                        className: "text-xs text-blue-700",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                className: "font-semibold mb-1",
                                                                children: "Renewal Information"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 872,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "• Current Expiry: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatDate"])(organization?.expiry_date)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 873,
                                                                        columnNumber: 58
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 873,
                                                                columnNumber: 37
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "• Renewal Date: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatDate"])(new Date().toISOString())
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 874,
                                                                        columnNumber: 56
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 874,
                                                                columnNumber: 37
                                                            }, this),
                                                            previewExpiryDate && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: [
                                                                    "• New Expiry: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("strong", {
                                                                        className: "text-indigo-600",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dateUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["formatDate"])(previewExpiryDate)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                        lineNumber: 876,
                                                                        columnNumber: 58
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 876,
                                                                columnNumber: 41
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                children: "• Organization will be marked as Active"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                                lineNumber: 878,
                                                                columnNumber: 37
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/organization/[id].tsx",
                                                        lineNumber: 871,
                                                        columnNumber: 33
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/organization/[id].tsx",
                                                lineNumber: 869,
                                                columnNumber: 29
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 868,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex gap-3 pt-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: ()=>setShowRenewalModal(false),
                                                    className: "flex-1 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors font-poppins",
                                                    children: "Cancel"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 884,
                                                    columnNumber: 29
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleRenewalOrganization,
                                                    disabled: renewingOrg,
                                                    className: "flex-1 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed font-poppins",
                                                    children: renewingOrg ? 'Renewing...' : 'Confirm Renewal'
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                                    lineNumber: 890,
                                                    columnNumber: 29
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/organization/[id].tsx",
                                            lineNumber: 883,
                                            columnNumber: 25
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/organization/[id].tsx",
                                    lineNumber: 811,
                                    columnNumber: 21
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/organization/[id].tsx",
                            lineNumber: 798,
                            columnNumber: 17
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 797,
                        columnNumber: 13
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ImportCustomersModal$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                        show: showImportModal,
                        onClose: ()=>setShowImportModal(false),
                        onSuccess: ()=>{
                            refreshData(true);
                        },
                        preselectedOrgId: organization?.id || "",
                        preselectedCampaignId: ""
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/organization/[id].tsx",
                        lineNumber: 904,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/organization/[id].tsx",
                lineNumber: 344,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__7fa01540._.js.map