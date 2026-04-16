module.exports = [
"[project]/components/ForgotUserIdForm.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ForgotUserIdForm
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function ForgotUserIdForm({ onBack, onError }) {
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(Array(6).fill(""));
    const [uniqueId, setUniqueId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [showOtp, setShowOtp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showUserId, setShowUserId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [foundUserId, setFoundUserId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const otpInputRefs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])([]);
    const requestOtp = async ()=>{
        if (!email.trim()) {
            const errorMsg = "Please enter your email address";
            onError?.(errorMsg);
            return;
        }
        setIsLoading(true);
        try {
            // Call Next.js API route (proxy) - avoids CORS issues
            const response = await fetch("/api/otp/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    purpose: "forgot_user_id"
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to send OTP");
            }
            // Store unique_id from response
            if (data.unique_id) {
                setUniqueId(data.unique_id);
            }
            // Show OTP input if OTP sent successfully
            setShowOtp(true);
        } catch (error) {
            const errorMessage = error.message || "An error occurred while sending OTP";
            onError?.(errorMessage);
        } finally{
            setIsLoading(false);
        }
    };
    const handleEmailSubmit = async (e)=>{
        e.preventDefault();
        await requestOtp();
    };
    const handleRequestAgain = async ()=>{
        // Reset OTP fields
        setOtp(Array(6).fill(""));
        setUniqueId("");
        // Request OTP again
        await requestOtp();
    };
    const handleFindUserId = async (e)=>{
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            onError?.("Please enter complete OTP");
            return;
        }
        if (!uniqueId) {
            onError?.("OTP session expired. Please request a new OTP.");
            return;
        }
        setIsLoading(true);
        try {
            // Verify OTP with unique_id
            const response = await fetch("/api/otp/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    unique_id: uniqueId,
                    otp_code: otpCode
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Invalid OTP");
            }
            // OTP verified, show user ID
            if (data.employee_id) {
                setFoundUserId(data.employee_id);
                setShowUserId(true);
            } else {
                onError?.("User ID not found for this email");
            }
        } catch (error) {
            const errorMessage = error.message || "Failed to verify OTP";
            onError?.(errorMessage);
        } finally{
            setIsLoading(false);
        }
    };
    const handleOtpChange = (index, value)=>{
        // Only allow single digit
        if (value.length > 1) return;
        const newOtp = [
            ...otp
        ];
        newOtp[index] = value;
        setOtp(newOtp);
        // Auto focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };
    const handleOtpKeyDown = (index, e)=>{
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
        // Prevent form submission on Enter key
        if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            // If all OTP fields are filled, trigger Find User ID
            const otpCode = otp.join("");
            if (otpCode.length === 6) {
                handleFindUserId();
            }
        }
    };
    // Show User ID Display
    if (showUserId) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "mt-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-xl md:text-lg mb-4",
                    style: {
                        fontWeight: '700',
                        fontFamily: 'poppins',
                        color: '#263238',
                        textAlign: 'center'
                    },
                    children: "Here is your Employee ID"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotUserIdForm.tsx",
                    lineNumber: 163,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "text-center mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "inline-block px-6 py-4 rounded-full border-2",
                        style: {
                            borderColor: '#4A32E7',
                            backgroundColor: '#f6f5ff'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-2xl font-bold",
                            style: {
                                color: '#4A32E7',
                                fontFamily: "'Roboto', sans-serif"
                            },
                            children: foundUserId
                        }, void 0, false, {
                            fileName: "[project]/components/ForgotUserIdForm.tsx",
                            lineNumber: 182,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotUserIdForm.tsx",
                        lineNumber: 175,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ForgotUserIdForm.tsx",
                    lineNumber: 174,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-sm text-center",
                    style: {
                        color: 'rgb(38, 50, 56)',
                        fontFamily: "'Roboto', sans-serif"
                    },
                    children: "Hurray! We've found your Employee ID! Keep it safe for your next adventure with us!"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotUserIdForm.tsx",
                    lineNumber: 194,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onBack,
                        className: "text-sm font-semibold hover:underline",
                        style: {
                            color: '#4A32E7'
                        },
                        children: "Back to Login"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotUserIdForm.tsx",
                        lineNumber: 205,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ForgotUserIdForm.tsx",
                    lineNumber: 204,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ForgotUserIdForm.tsx",
            lineNumber: 162,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "mt-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "mb-6 md:mb-0 text-xl md:text-lg",
                style: {
                    fontWeight: '700',
                    fontFamily: 'poppins',
                    color: '#263238',
                    textAlign: 'center'
                },
                children: "Forgot Employee ID"
            }, void 0, false, {
                fileName: "[project]/components/ForgotUserIdForm.tsx",
                lineNumber: 220,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "email",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotUserIdForm.tsx",
                        lineNumber: 233,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: '#787E9D',
                                    pointerEvents: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/ForgotUserIdForm.tsx",
                                lineNumber: 241,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "email",
                                id: "email",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: '45px',
                                    paddingRight: '16px'
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4A32E7';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                },
                                placeholder: "Enter your Email",
                                required: true,
                                disabled: showOtp
                            }, void 0, false, {
                                fileName: "[project]/components/ForgotUserIdForm.tsx",
                                lineNumber: 248,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ForgotUserIdForm.tsx",
                        lineNumber: 240,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ForgotUserIdForm.tsx",
                lineNumber: 232,
                columnNumber: 7
            }, this),
            !showOtp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleEmailSubmit,
                disabled: isLoading,
                className: "w-full rounded-full mt-2 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                style: {
                    background: 'linear-gradient(to right, #4A32E7)',
                    fontFamily: "'Poppins', sans-serif"
                },
                children: isLoading ? "Sending OTP..." : "Request OTP"
            }, void 0, false, {
                fileName: "[project]/components/ForgotUserIdForm.tsx",
                lineNumber: 277,
                columnNumber: 9
            }, this),
            showOtp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-end mt-1",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: handleRequestAgain,
                    disabled: isLoading,
                    className: "text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
                    style: {
                        fontSize: '12px',
                        color: '#4A32E7',
                        background: 'none',
                        border: 'none',
                        padding: 0
                    },
                    children: isLoading ? "Sending OTP..." : "Request Again?"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotUserIdForm.tsx",
                    lineNumber: 294,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ForgotUserIdForm.tsx",
                lineNumber: 293,
                columnNumber: 9
            }, this),
            showOtp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "Enter OTP"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotUserIdForm.tsx",
                        lineNumber: 315,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 justify-center",
                        children: otp.map((digit, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                ref: (el)=>{
                                    otpInputRefs.current[index] = el;
                                },
                                type: "text",
                                inputMode: "numeric",
                                maxLength: 1,
                                value: digit,
                                onChange: (e)=>handleOtpChange(index, e.target.value),
                                onKeyDown: (e)=>handleOtpKeyDown(index, e),
                                className: "w-11 h-11 rounded-full border-2 text-center text-lg font-semibold transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4A32E7';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                }
                            }, index, false, {
                                fileName: "[project]/components/ForgotUserIdForm.tsx",
                                lineNumber: 323,
                                columnNumber: 16
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotUserIdForm.tsx",
                        lineNumber: 321,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ForgotUserIdForm.tsx",
                lineNumber: 314,
                columnNumber: 9
            }, this),
            showOtp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: (e)=>handleFindUserId(e),
                className: "w-full rounded-full mt-4 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg",
                style: {
                    background: 'linear-gradient(to right, #4A32E7)',
                    fontFamily: "'Poppins', sans-serif"
                },
                children: "Find Employee ID"
            }, void 0, false, {
                fileName: "[project]/components/ForgotUserIdForm.tsx",
                lineNumber: 355,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-center mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onBack,
                    className: "text-sm font-semibold hover:underline",
                    style: {
                        color: '#4A32E7'
                    },
                    children: "Back to Login"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotUserIdForm.tsx",
                    lineNumber: 369,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ForgotUserIdForm.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ForgotUserIdForm.tsx",
        lineNumber: 219,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ForgotPasswordForm.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ForgotPasswordForm
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function ForgotPasswordForm({ onBack, onError }) {
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [otp, setOtp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(Array(6).fill(""));
    const [uniqueId, setUniqueId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [showOtp, setShowOtp] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showResetForm, setShowResetForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [showSuccess, setShowSuccess] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const otpInputRefs = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])([]);
    const handleEmailSubmit = async (e)=>{
        e.preventDefault();
        if (!email.trim()) {
            const errorMsg = "Please enter your email address";
            onError?.(errorMsg);
            return;
        }
        setIsLoading(true);
        try {
            // Call Next.js API route (proxy) - avoids CORS issues
            const response = await fetch("/api/otp/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email.trim().toLowerCase(),
                    purpose: "forgot_password"
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to send OTP");
            }
            // Store unique_id from response
            if (data.unique_id) {
                setUniqueId(data.unique_id);
            }
            // Show OTP input if OTP sent successfully
            setShowOtp(true);
        } catch (error) {
            const errorMessage = error.message || "An error occurred while sending OTP";
            onError?.(errorMessage);
        } finally{
            setIsLoading(false);
        }
    };
    const handleOtpChange = (index, value)=>{
        // Only allow single digit
        if (value.length > 1) return;
        const newOtp = [
            ...otp
        ];
        newOtp[index] = value;
        setOtp(newOtp);
        // Auto focus next input
        if (value && index < 5) {
            otpInputRefs.current[index + 1]?.focus();
        }
    };
    const handleOtpKeyDown = (index, e)=>{
        // Handle backspace
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            otpInputRefs.current[index - 1]?.focus();
        }
    };
    const handleResetPassword = async ()=>{
        // Validate OTP and proceed to reset form
        const otpCode = otp.join("");
        if (otpCode.length !== 6) {
            onError?.("Please enter complete OTP");
            return;
        }
        if (!uniqueId) {
            onError?.("OTP session expired. Please request a new OTP.");
            return;
        }
        setIsLoading(true);
        try {
            // Verify OTP with unique_id
            const response = await fetch("/api/otp/verify", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    unique_id: uniqueId,
                    otp_code: otpCode
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Invalid OTP");
            }
            // OTP verified, show reset form
            setShowResetForm(true);
        } catch (error) {
            const errorMessage = error.message || "Failed to verify OTP";
            onError?.(errorMessage);
        } finally{
            setIsLoading(false);
        }
    };
    const handlePasswordSubmit = async (e)=>{
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            onError?.("Passwords do not match!");
            return;
        }
        if (newPassword.length < 6) {
            onError?.("Password must be at least 6 characters");
            return;
        }
        if (!uniqueId) {
            onError?.("OTP session expired. Please request a new OTP.");
            return;
        }
        setIsLoading(true);
        try {
            // Reset password using unique_id
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    unique_id: uniqueId,
                    new_password: newPassword
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to reset password");
            }
            setShowSuccess(true);
        } catch (error) {
            const errorMessage = error.message || "An error occurred while resetting password";
            onError?.(errorMessage);
        } finally{
            setIsLoading(false);
        }
    };
    // Show Success Message
    if (showSuccess) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "mt-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "mb-6 md:mb-0 text-xl md:text-lg mb-4",
                    style: {
                        fontWeight: '700',
                        fontFamily: 'poppins',
                        color: '#263238',
                        textAlign: 'center'
                    },
                    children: "Password Reset Successful!"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                    lineNumber: 181,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "text-center mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "inline-block px-6 py-4 rounded-full",
                        style: {
                            backgroundColor: '#f6f5ff'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-lg",
                            style: {
                                color: '#4b33e8',
                                fontFamily: "'Roboto', sans-serif"
                            },
                            children: "✓ Your password has been reset successfully!"
                        }, void 0, false, {
                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                            lineNumber: 199,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotPasswordForm.tsx",
                        lineNumber: 193,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                    lineNumber: 192,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onBack,
                        className: "text-sm font-semibold hover:underline",
                        style: {
                            color: '#4b33e8'
                        },
                        children: "Back to Login"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotPasswordForm.tsx",
                        lineNumber: 212,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                    lineNumber: 211,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ForgotPasswordForm.tsx",
            lineNumber: 180,
            columnNumber: 7
        }, this);
    }
    // Show Reset Password Form
    if (showResetForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "mt-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-xl md:text-lg",
                    style: {
                        fontWeight: '700',
                        fontFamily: 'poppins',
                        color: '#263238',
                        textAlign: 'center'
                    },
                    children: "Reset Your Password"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                    lineNumber: 229,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                    onSubmit: handlePasswordSubmit,
                    className: "mt-4",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    htmlFor: "newPassword",
                                    className: "block text-sm font-medium mb-1",
                                    style: {
                                        color: 'rgb(38, 50, 56)'
                                    },
                                    children: "New Password"
                                }, void 0, false, {
                                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                                    lineNumber: 243,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                            style: {
                                                color: '#787E9D',
                                                pointerEvents: 'none'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                                            lineNumber: 251,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            id: "newPassword",
                                            value: newPassword,
                                            onChange: (e)=>setNewPassword(e.target.value),
                                            className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                            style: {
                                                borderColor: '#DCDEE3',
                                                backgroundColor: '#FFFFFF',
                                                color: 'rgb(38, 50, 56)',
                                                fontFamily: "'Roboto', sans-serif",
                                                paddingLeft: '45px',
                                                paddingRight: '16px'
                                            },
                                            onFocus: (e)=>{
                                                e.currentTarget.style.borderColor = '#4b33e8';
                                            },
                                            onBlur: (e)=>{
                                                e.currentTarget.style.borderColor = '#DCDEE3';
                                            },
                                            placeholder: "Enter new password",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                                    lineNumber: 250,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                            lineNumber: 242,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                    htmlFor: "confirmPassword",
                                    className: "block text-sm font-medium mb-1",
                                    style: {
                                        color: 'rgb(38, 50, 56)'
                                    },
                                    children: "Confirm Password"
                                }, void 0, false, {
                                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                                    lineNumber: 286,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "relative",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                            style: {
                                                color: '#787E9D',
                                                pointerEvents: 'none'
                                            }
                                        }, void 0, false, {
                                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                                            lineNumber: 294,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "password",
                                            id: "confirmPassword",
                                            value: confirmPassword,
                                            onChange: (e)=>setConfirmPassword(e.target.value),
                                            className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                            style: {
                                                borderColor: '#DCDEE3',
                                                backgroundColor: '#FFFFFF',
                                                color: 'rgb(38, 50, 56)',
                                                fontFamily: "'Roboto', sans-serif",
                                                paddingLeft: '45px',
                                                paddingRight: '16px'
                                            },
                                            onFocus: (e)=>{
                                                e.currentTarget.style.borderColor = '#4b33e8';
                                            },
                                            onBlur: (e)=>{
                                                e.currentTarget.style.borderColor = '#DCDEE3';
                                            },
                                            placeholder: "Confirm new password",
                                            required: true
                                        }, void 0, false, {
                                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                                            lineNumber: 301,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                                    lineNumber: 293,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                            lineNumber: 285,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "submit",
                            className: "w-full rounded-full mt-2 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg",
                            style: {
                                background: 'linear-gradient(to right, #4b33e8)',
                                fontFamily: "'Poppins', sans-serif"
                            },
                            children: "Reset Password"
                        }, void 0, false, {
                            fileName: "[project]/components/ForgotPasswordForm.tsx",
                            lineNumber: 328,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                    lineNumber: 240,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onBack,
                        className: "text-sm font-semibold hover:underline",
                        style: {
                            color: '#4b33e8'
                        },
                        children: "Back to Login"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotPasswordForm.tsx",
                        lineNumber: 341,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                    lineNumber: 340,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ForgotPasswordForm.tsx",
            lineNumber: 228,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "mt-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "mb-6 md:mb-0 text-xl md:text-lg",
                style: {
                    fontWeight: '700',
                    fontFamily: 'poppins',
                    color: '#263238',
                    textAlign: 'center'
                },
                children: "Forgot Password"
            }, void 0, false, {
                fileName: "[project]/components/ForgotPasswordForm.tsx",
                lineNumber: 356,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "email",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotPasswordForm.tsx",
                        lineNumber: 369,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: '#787E9D',
                                    pointerEvents: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/ForgotPasswordForm.tsx",
                                lineNumber: 377,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "email",
                                id: "email",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: '45px',
                                    paddingRight: '16px'
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4b33e8';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                },
                                placeholder: "Enter your Email",
                                required: true,
                                disabled: showOtp
                            }, void 0, false, {
                                fileName: "[project]/components/ForgotPasswordForm.tsx",
                                lineNumber: 384,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ForgotPasswordForm.tsx",
                        lineNumber: 376,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ForgotPasswordForm.tsx",
                lineNumber: 368,
                columnNumber: 7
            }, this),
            !showOtp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleEmailSubmit,
                disabled: isLoading,
                className: "w-full rounded-full mt-2 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                style: {
                    background: 'linear-gradient(to right, #4b33e8)',
                    fontFamily: "'Poppins', sans-serif"
                },
                children: isLoading ? "Sending OTP..." : "Request OTP"
            }, void 0, false, {
                fileName: "[project]/components/ForgotPasswordForm.tsx",
                lineNumber: 413,
                columnNumber: 9
            }, this),
            showOtp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mt-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "Enter OTP"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotPasswordForm.tsx",
                        lineNumber: 430,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex gap-2 justify-center",
                        children: otp.map((digit, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                ref: (el)=>{
                                    otpInputRefs.current[index] = el;
                                },
                                type: "text",
                                inputMode: "numeric",
                                maxLength: 1,
                                value: digit,
                                onChange: (e)=>handleOtpChange(index, e.target.value),
                                onKeyDown: (e)=>handleOtpKeyDown(index, e),
                                className: "w-11 h-11 rounded-full border-2 text-center text-lg font-semibold transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif"
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4b33e8';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                }
                            }, index, false, {
                                fileName: "[project]/components/ForgotPasswordForm.tsx",
                                lineNumber: 438,
                                columnNumber: 16
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotPasswordForm.tsx",
                        lineNumber: 436,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ForgotPasswordForm.tsx",
                lineNumber: 429,
                columnNumber: 9
            }, this),
            showOtp && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "button",
                onClick: handleResetPassword,
                className: "w-full rounded-full mt-4 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg",
                style: {
                    background: 'linear-gradient(to right, #4b33e8)',
                    fontFamily: "'Poppins', sans-serif"
                },
                children: "Reset Password"
            }, void 0, false, {
                fileName: "[project]/components/ForgotPasswordForm.tsx",
                lineNumber: 470,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-center mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onBack,
                    className: "text-sm font-semibold hover:underline",
                    style: {
                        color: '#4b33e8'
                    },
                    children: "Back to Login"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotPasswordForm.tsx",
                    lineNumber: 484,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ForgotPasswordForm.tsx",
                lineNumber: 483,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ForgotPasswordForm.tsx",
        lineNumber: 355,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/loginFormUserId.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>LoginFormUserId
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotUserIdForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ForgotUserIdForm.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotPasswordForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ForgotPasswordForm.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
function LoginFormUserId({ showForgotForm = false, showForgotPasswordForm = false, onForgotFormToggle, onForgotPasswordFormToggle, onError }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [userId, setUserId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [rememberMe, setRememberMe] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Load remembered creds
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const savedId = undefined;
        const savedPass = undefined;
        const rememberPref = undefined;
    }, []);
    const handleRememberMeChange = (e)=>{
        const checked = e.target.checked;
        setRememberMe(checked);
        localStorage.setItem('remember_me_userId_pref', checked ? 'true' : 'false');
        if (!checked) {
            localStorage.removeItem('remembered_user_id');
            localStorage.removeItem('_upid_data');
        }
    };
    const handleForgotFormToggle = (show)=>{
        onForgotFormToggle?.(show);
    };
    const handleForgotPasswordFormToggle = (show)=>{
        onForgotPasswordFormToggle?.(show);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setIsLoading(true);
        if (rememberMe) {
            localStorage.setItem('remembered_user_id', userId.trim());
            localStorage.setItem('_upid_data', window.btoa(password)); // Obfuscate password
        } else {
            localStorage.removeItem('remembered_user_id');
            localStorage.removeItem('_upid_data');
        }
        try {
            const inputId = userId.trim();
            console.log("🔍 [Login] Starting login for ID:", inputId);
            // Fetch email using secure API (bypasses RLS)
            const emailRes = await fetch('/api/auth/get-email-by-id', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    employeeId: inputId
                })
            });
            const emailData = await emailRes.json();
            if (!emailRes.ok || !emailData.email) {
                console.error("❌ [Login] Email lookup failed:", emailData.error || "Not found");
                throw new Error(emailData.error || "Invalid Employee ID. Please check and try again.");
            }
            const email = emailData.email;
            console.log("📧 [Login] Found email via API:", email);
            // Simple Supabase Sign In
            const { data, error: signInError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                email,
                password
            });
            if (signInError) {
                console.error("❌ [Login] Supabase sign-in error:", signInError.message);
                throw new Error(signInError.message);
            }
            if (data.session) {
                console.log("✅ [Login] Supabase Auth successful for user:", data.user.id);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                    event_type: 'AUTH',
                    description: `User Login: ${inputId} successful`,
                    metadata: {
                        method: 'userId',
                        employee_id: inputId
                    },
                    payload_size: 0,
                    user_name: inputId
                });
                // Fetch profile for redirection
                const { data: profileData, error: fetchError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('profile_complete, approval_status, status').ilike('employee_id', inputId).maybeSingle();
                if (fetchError) {
                    console.error("⚠️ [Login] Profile re-fetch error:", fetchError);
                }
                console.log("📋 [Login] Profile status:", {
                    complete: profileData?.profile_complete,
                    approval: profileData?.approval_status,
                    status: profileData?.status
                });
                if (profileData?.profile_complete === false) {
                    console.log("➡️ [Login] Redirecting to profile completion");
                    router.push("/profile-completion");
                    return;
                }
                const pathMap = {
                    rejected: "/rejected",
                    pending: "/pending",
                    suspend: "/suspended",
                    hold: "/hold"
                };
                const redirectPath = pathMap[profileData?.approval_status || ''] || pathMap[profileData?.status || ''] || "/dashboard";
                console.log("🚀 [Login] Final redirect to:", redirectPath);
                router.push(redirectPath);
            }
        } catch (error) {
            const errorMessage = error.message || "An error occurred during login";
            console.error("🔴 [Login] Fatal error:", errorMessage);
            setError(errorMessage);
            onError?.(errorMessage);
            setIsLoading(false);
        }
    };
    if (showForgotForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotUserIdForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            onBack: ()=>handleForgotFormToggle(false),
            onError: onError
        }, void 0, false, {
            fileName: "[project]/components/loginFormUserId.tsx",
            lineNumber: 171,
            columnNumber: 12
        }, this);
    }
    if (showForgotPasswordForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotPasswordForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            onBack: ()=>handleForgotPasswordFormToggle(false),
            onError: onError
        }, void 0, false, {
            fileName: "[project]/components/loginFormUserId.tsx",
            lineNumber: 175,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "mt-0",
        style: {
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "mb-6 md:mb-2 text-xl md:text-lg",
                style: {
                    fontWeight: '700',
                    fontFamily: 'poppins',
                    color: '#263238',
                    textAlign: 'center'
                },
                children: "Login With User ID"
            }, void 0, false, {
                fileName: "[project]/components/loginFormUserId.tsx",
                lineNumber: 180,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "userId",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "User ID"
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 193,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-user absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: '#787E9D',
                                    pointerEvents: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormUserId.tsx",
                                lineNumber: 201,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "text",
                                id: "userId",
                                name: "username",
                                autoComplete: "username",
                                value: userId,
                                onChange: (e)=>setUserId(e.target.value),
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: '45px',
                                    paddingRight: '16px'
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4b33e8';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                },
                                placeholder: "Enter User ID",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormUserId.tsx",
                                lineNumber: 208,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 200,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "text-sm ",
                            style: {
                                fontSize: '12px',
                                color: '#4b33e8'
                            },
                            onClick: (e)=>{
                                e.preventDefault();
                                handleForgotFormToggle(true);
                            },
                            children: "Forgot User ID?"
                        }, void 0, false, {
                            fileName: "[project]/components/loginFormUserId.tsx",
                            lineNumber: 235,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 234,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/loginFormUserId.tsx",
                lineNumber: 192,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "password",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "Password"
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 253,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: '#787E9D',
                                    pointerEvents: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormUserId.tsx",
                                lineNumber: 261,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: showPassword ? "text" : "password",
                                id: "password",
                                name: "password",
                                autoComplete: "current-password",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: '45px',
                                    paddingRight: '45px'
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4b33e8';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                },
                                placeholder: "Enter your Password",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormUserId.tsx",
                                lineNumber: 268,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowPassword(!showPassword),
                                className: "absolute right-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base focus:outline-none",
                                style: {
                                    color: '#787E9D',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${showPassword ? 'fi-rr-eye' : 'fi-rr-eye-crossed'}`
                                }, void 0, false, {
                                    fileName: "[project]/components/loginFormUserId.tsx",
                                    lineNumber: 307,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormUserId.tsx",
                                lineNumber: 293,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 260,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleForgotPasswordFormToggle(true),
                            className: "text-[12px] font-semibold hover:underline",
                            style: {
                                color: '#4b33e8'
                            },
                            children: "Forgot Password?"
                        }, void 0, false, {
                            fileName: "[project]/components/loginFormUserId.tsx",
                            lineNumber: 311,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 310,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/loginFormUserId.tsx",
                lineNumber: 252,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-4 px-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        id: "rememberMe",
                        checked: rememberMe,
                        onChange: handleRememberMeChange,
                        className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8]",
                        style: {
                            cursor: 'pointer'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 324,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "rememberMe",
                        className: "text-sm cursor-pointer select-none",
                        style: {
                            color: '#787E9D',
                            fontWeight: '500'
                        },
                        children: "Remember Me"
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormUserId.tsx",
                        lineNumber: 332,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/loginFormUserId.tsx",
                lineNumber: 323,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: isLoading,
                className: "w-full rounded-full mt-4 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                style: {
                    background: '#4b33e8',
                    fontFamily: "'Poppins', sans-serif"
                },
                children: isLoading ? "Logging in..." : "Login"
            }, void 0, false, {
                fileName: "[project]/components/loginFormUserId.tsx",
                lineNumber: 342,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/loginFormUserId.tsx",
        lineNumber: 179,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/ForgotEmailForm.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ForgotEmailForm
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
function ForgotEmailForm({ onBack, onError }) {
    const [employeeId, setEmployeeId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [dateOfBirth, setDateOfBirth] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [showEmail, setShowEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [foundEmail, setFoundEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const handleDateChange = (e)=>{
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        // Format as dd/mm/yyyy
        if (value.length >= 2) {
            value = value.substring(0, 2) + '/' + value.substring(2);
        }
        if (value.length >= 5) {
            value = value.substring(0, 5) + '/' + value.substring(5, 9);
        }
        setDateOfBirth(value);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        if (!employeeId.trim()) {
            onError?.("Please enter your Employee ID");
            return;
        }
        if (!dateOfBirth.trim() || dateOfBirth.length !== 10) {
            onError?.("Please enter your Date of Birth in DD/MM/YYYY format");
            return;
        }
        // Validate date format
        const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
        if (!dateRegex.test(dateOfBirth)) {
            onError?.("Please enter Date of Birth in DD/MM/YYYY format");
            return;
        }
        setIsLoading(true);
        try {
            // Call API to find email
            const response = await fetch("/api/auth/forgot-email", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    employee_id: employeeId.trim(),
                    date_of_birth: dateOfBirth
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to find email");
            }
            // Show email if found
            if (data.email) {
                setFoundEmail(data.email);
                setShowEmail(true);
            } else {
                onError?.("Email not found for the provided Employee ID and Date of Birth");
            }
        } catch (error) {
            const errorMessage = error.message || "An error occurred while finding email";
            onError?.(errorMessage);
        } finally{
            setIsLoading(false);
        }
    };
    // Show Email Display
    if (showEmail) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "mt-0",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                    className: "text-xl md:text-lg mb-4",
                    style: {
                        fontWeight: '700',
                        fontFamily: 'poppins',
                        color: '#263238',
                        textAlign: 'center'
                    },
                    children: "Here is your Email"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotEmailForm.tsx",
                    lineNumber: 89,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "text-center mb-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "inline-block px-6 py-4 rounded-full border-2",
                        style: {
                            borderColor: '#4b33e8',
                            backgroundColor: '#f6f5ff'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                            className: "text-lg font-semibold break-all",
                            style: {
                                color: '#4b33e8',
                                fontFamily: "'Roboto', sans-serif"
                            },
                            children: foundEmail
                        }, void 0, false, {
                            fileName: "[project]/components/ForgotEmailForm.tsx",
                            lineNumber: 108,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotEmailForm.tsx",
                        lineNumber: 101,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ForgotEmailForm.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-sm text-center",
                    style: {
                        color: 'rgb(38, 50, 56)',
                        fontFamily: "'Roboto', sans-serif"
                    },
                    children: "Hurray! We've found your email! Keep it safe for your next adventure with us!"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotEmailForm.tsx",
                    lineNumber: 120,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex justify-center mt-6",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: onBack,
                        className: "text-sm font-semibold hover:underline",
                        style: {
                            color: '#4b33e8'
                        },
                        children: "Back to Login"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotEmailForm.tsx",
                        lineNumber: 131,
                        columnNumber: 11
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ForgotEmailForm.tsx",
                    lineNumber: 130,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/ForgotEmailForm.tsx",
            lineNumber: 88,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "mt-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "text-xl md:text-lg",
                style: {
                    fontWeight: '700',
                    fontFamily: 'poppins',
                    color: '#263238',
                    textAlign: 'center'
                },
                children: "Forgot Email"
            }, void 0, false, {
                fileName: "[project]/components/ForgotEmailForm.tsx",
                lineNumber: 146,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
                onSubmit: handleSubmit,
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-4 mt-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                htmlFor: "employeeId",
                                className: "block text-sm font-medium mb-1",
                                style: {
                                    color: 'rgb(38, 50, 56)'
                                },
                                children: "Employee ID"
                            }, void 0, false, {
                                fileName: "[project]/components/ForgotEmailForm.tsx",
                                lineNumber: 160,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-user absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                        style: {
                                            color: '#787E9D',
                                            pointerEvents: 'none'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/ForgotEmailForm.tsx",
                                        lineNumber: 168,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "employeeId",
                                        value: employeeId,
                                        onChange: (e)=>setEmployeeId(e.target.value),
                                        className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                        style: {
                                            borderColor: '#DCDEE3',
                                            backgroundColor: '#FFFFFF',
                                            color: 'rgb(38, 50, 56)',
                                            fontFamily: "'Roboto', sans-serif",
                                            paddingLeft: '45px',
                                            paddingRight: '16px'
                                        },
                                        onFocus: (e)=>{
                                            e.currentTarget.style.borderColor = '#4b33e8';
                                        },
                                        onBlur: (e)=>{
                                            e.currentTarget.style.borderColor = '#DCDEE3';
                                        },
                                        placeholder: "Enter your Employee ID",
                                        required: true,
                                        disabled: isLoading
                                    }, void 0, false, {
                                        fileName: "[project]/components/ForgotEmailForm.tsx",
                                        lineNumber: 175,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ForgotEmailForm.tsx",
                                lineNumber: 167,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ForgotEmailForm.tsx",
                        lineNumber: 159,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                htmlFor: "dateOfBirth",
                                className: "block text-sm font-medium mb-1",
                                style: {
                                    color: 'rgb(38, 50, 56)'
                                },
                                children: "Date of Birth"
                            }, void 0, false, {
                                fileName: "[project]/components/ForgotEmailForm.tsx",
                                lineNumber: 204,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-calendar absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                        style: {
                                            color: '#787E9D',
                                            pointerEvents: 'none'
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/ForgotEmailForm.tsx",
                                        lineNumber: 212,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        id: "dateOfBirth",
                                        value: dateOfBirth,
                                        onChange: handleDateChange,
                                        maxLength: 10,
                                        className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                        style: {
                                            borderColor: '#DCDEE3',
                                            backgroundColor: '#FFFFFF',
                                            color: 'rgb(38, 50, 56)',
                                            fontFamily: "'Roboto', sans-serif",
                                            paddingLeft: '45px',
                                            paddingRight: '16px'
                                        },
                                        onFocus: (e)=>{
                                            e.currentTarget.style.borderColor = '#4b33e8';
                                        },
                                        onBlur: (e)=>{
                                            e.currentTarget.style.borderColor = '#DCDEE3';
                                        },
                                        placeholder: "DD/MM/YYYY",
                                        required: true,
                                        disabled: isLoading
                                    }, void 0, false, {
                                        fileName: "[project]/components/ForgotEmailForm.tsx",
                                        lineNumber: 219,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/ForgotEmailForm.tsx",
                                lineNumber: 211,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/ForgotEmailForm.tsx",
                        lineNumber: 203,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "submit",
                        disabled: isLoading,
                        className: "w-full rounded-full mt-2 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                        style: {
                            background: 'linear-gradient(to right, #4b33e8)',
                            fontFamily: "'Poppins', sans-serif"
                        },
                        children: isLoading ? "Finding Email..." : "Find Email"
                    }, void 0, false, {
                        fileName: "[project]/components/ForgotEmailForm.tsx",
                        lineNumber: 248,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/ForgotEmailForm.tsx",
                lineNumber: 157,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex justify-center mt-6",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                    type: "button",
                    onClick: onBack,
                    className: "text-sm font-semibold hover:underline",
                    style: {
                        color: '#4b33e8'
                    },
                    children: "Back to Login"
                }, void 0, false, {
                    fileName: "[project]/components/ForgotEmailForm.tsx",
                    lineNumber: 262,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/ForgotEmailForm.tsx",
                lineNumber: 261,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ForgotEmailForm.tsx",
        lineNumber: 145,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/loginFormEmailId.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>LoginFormEmailId
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotPasswordForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ForgotPasswordForm.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotEmailForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ForgotEmailForm.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
function LoginFormEmailId({ showForgotPasswordForm = false, onForgotPasswordFormToggle, onError }) {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [email, setEmail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [password, setPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [rememberMe, setRememberMe] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showPassword, setShowPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showForgotEmailForm, setShowForgotEmailForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Load remembered creds
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        const savedEmail = undefined;
        const savedPass = undefined;
        const rememberPref = undefined;
    }, []);
    const handleRememberMeChange = (e)=>{
        const checked = e.target.checked;
        setRememberMe(checked);
        localStorage.setItem('remember_me_pref', checked ? 'true' : 'false');
        if (!checked) {
            localStorage.removeItem('remembered_email');
            localStorage.removeItem('_upsa_data');
        }
    };
    const handleForgotPasswordFormToggle = (show)=>{
        onForgotPasswordFormToggle?.(show);
    };
    const handleForgotEmailFormToggle = (show)=>{
        setShowForgotEmailForm(show);
    };
    const handleSubmit = async (e)=>{
        e.preventDefault();
        setError("");
        setIsLoading(true);
        if (rememberMe) {
            localStorage.setItem('remembered_email', email.trim());
            localStorage.setItem('_upsa_data', window.btoa(password)); // Obfuscate password
        } else {
            localStorage.removeItem('remembered_email');
            localStorage.removeItem('_upsa_data');
        }
        try {
            const { data, error: signInError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithPassword({
                email: email.trim(),
                password
            });
            if (signInError) {
                throw new Error(signInError.message);
            }
            if (data.session) {
                console.log("✅ Email Login successful");
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                    event_type: 'AUTH',
                    description: `User Login: ${email.trim()} successful`,
                    metadata: {
                        method: 'email',
                        email: email.trim()
                    },
                    payload_size: 0,
                    user_name: email.trim()
                });
                // Fetch profile for redirection
                const { data: profile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('profile_complete, approval_status, status').eq('user_id', data.user.id).maybeSingle();
                if (profile?.profile_complete === false) {
                    router.push("/profile-completion");
                    return;
                }
                const pathMap = {
                    rejected: "/rejected",
                    pending: "/pending",
                    suspend: "/suspended",
                    hold: "/hold"
                };
                const redirectPath = pathMap[profile?.approval_status || ''] || pathMap[profile?.status || ''] || "/dashboard";
                router.push(redirectPath);
            }
        } catch (error) {
            const errorMessage = error.message || "An error occurred during login";
            setError(errorMessage);
            onError?.(errorMessage);
            setIsLoading(false);
        }
    };
    if (showForgotPasswordForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotPasswordForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            onBack: ()=>handleForgotPasswordFormToggle(false),
            onError: onError
        }, void 0, false, {
            fileName: "[project]/components/loginFormEmailId.tsx",
            lineNumber: 132,
            columnNumber: 12
        }, this);
    }
    if (showForgotEmailForm) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ForgotEmailForm$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
            onBack: ()=>handleForgotEmailFormToggle(false),
            onError: onError
        }, void 0, false, {
            fileName: "[project]/components/loginFormEmailId.tsx",
            lineNumber: 136,
            columnNumber: 12
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("form", {
        onSubmit: handleSubmit,
        className: "mt-0",
        style: {
            position: 'relative'
        },
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                className: "mb-6 md:mb-2 text-xl md:text-lg",
                style: {
                    fontWeight: '700',
                    fontFamily: 'poppins',
                    color: '#263238',
                    textAlign: 'center'
                },
                children: "Login With Email"
            }, void 0, false, {
                fileName: "[project]/components/loginFormEmailId.tsx",
                lineNumber: 141,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-0",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "email",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "Email"
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 154,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-envelope absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: '#787E9D',
                                    pointerEvents: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormEmailId.tsx",
                                lineNumber: 162,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: "email",
                                id: "email",
                                name: "email",
                                autoComplete: "email",
                                value: email,
                                onChange: (e)=>setEmail(e.target.value),
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: '45px',
                                    paddingRight: '16px'
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4b33e8';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                },
                                placeholder: "Enter your Email",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormEmailId.tsx",
                                lineNumber: 169,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 161,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mt-1 mb-0",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                            href: "#",
                            className: "text-sm ",
                            style: {
                                fontSize: '12px',
                                color: '#4b33e8'
                            },
                            onClick: (e)=>{
                                e.preventDefault();
                                handleForgotEmailFormToggle(true);
                            },
                            children: "Forgot Email?"
                        }, void 0, false, {
                            fileName: "[project]/components/loginFormEmailId.tsx",
                            lineNumber: 196,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 195,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/loginFormEmailId.tsx",
                lineNumber: 153,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "mb-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "password",
                        className: "block text-sm font-medium mb-1",
                        style: {
                            color: 'rgb(38, 50, 56)'
                        },
                        children: "Password"
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 214,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base",
                                style: {
                                    color: '#787E9D',
                                    pointerEvents: 'none'
                                }
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormEmailId.tsx",
                                lineNumber: 222,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                type: showPassword ? "text" : "password",
                                id: "password",
                                name: "password",
                                autoComplete: "current-password",
                                value: password,
                                onChange: (e)=>setPassword(e.target.value),
                                className: "w-full rounded-full border-2 py-3 md:py-[11px] md:text-[13px] transition-all focus:outline-none",
                                style: {
                                    borderColor: '#DCDEE3',
                                    backgroundColor: '#FFFFFF',
                                    color: 'rgb(38, 50, 56)',
                                    fontFamily: "'Roboto', sans-serif",
                                    paddingLeft: '45px',
                                    paddingRight: '45px'
                                },
                                onFocus: (e)=>{
                                    e.currentTarget.style.borderColor = '#4b33e8';
                                },
                                onBlur: (e)=>{
                                    e.currentTarget.style.borderColor = '#DCDEE3';
                                },
                                placeholder: "Enter your Password",
                                required: true
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormEmailId.tsx",
                                lineNumber: 229,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setShowPassword(!showPassword),
                                className: "absolute right-4 top-1/2 transform -translate-y-1/2 text-lg md:text-base focus:outline-none",
                                style: {
                                    color: '#787E9D',
                                    border: 'none',
                                    background: 'none',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    padding: '0'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: `fi flex ${showPassword ? 'fi-rr-eye' : 'fi-rr-eye-crossed'}`
                                }, void 0, false, {
                                    fileName: "[project]/components/loginFormEmailId.tsx",
                                    lineNumber: 268,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/loginFormEmailId.tsx",
                                lineNumber: 254,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 221,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex justify-end mt-1",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleForgotPasswordFormToggle(true),
                            className: "text-[12px] font-semibold hover:underline",
                            style: {
                                color: '#4b33e8'
                            },
                            children: "Forgot Password?"
                        }, void 0, false, {
                            fileName: "[project]/components/loginFormEmailId.tsx",
                            lineNumber: 272,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 271,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/loginFormEmailId.tsx",
                lineNumber: 213,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center gap-2 mb-4 px-1",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                        type: "checkbox",
                        id: "rememberMe",
                        checked: rememberMe,
                        onChange: handleRememberMeChange,
                        className: "w-4 h-4 rounded border-gray-300 text-[#4b33e8] focus:ring-[#4b33e8]",
                        style: {
                            cursor: 'pointer'
                        }
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 285,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        htmlFor: "rememberMe",
                        className: "text-sm cursor-pointer select-none",
                        style: {
                            color: '#787E9D',
                            fontWeight: '500'
                        },
                        children: "Remember Me"
                    }, void 0, false, {
                        fileName: "[project]/components/loginFormEmailId.tsx",
                        lineNumber: 293,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/loginFormEmailId.tsx",
                lineNumber: 284,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                type: "submit",
                disabled: isLoading,
                className: "w-full rounded-full mt-4 px-4 py-3 md:py-[11px] md:text-[13px] font-semibold text-white transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed",
                style: {
                    background: '#4b33e8',
                    fontFamily: "'Poppins', sans-serif"
                },
                children: isLoading ? "Logging in..." : "Login"
            }, void 0, false, {
                fileName: "[project]/components/loginFormEmailId.tsx",
                lineNumber: 303,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/loginFormEmailId.tsx",
        lineNumber: 140,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/SocialLoginButtons.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>SocialLoginButtons
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
function SocialLoginButtons({ formType, onToggleForm }) {
    const [isColumnLayout, setIsColumnLayout] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const containerRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const checkWidth = ()=>{
            if (containerRef.current) {
                const width = containerRef.current.offsetWidth;
                setIsColumnLayout(width < 300);
            }
        };
        // Check on mount
        checkWidth();
        // Check on resize
        window.addEventListener('resize', checkWidth);
        return ()=>window.removeEventListener('resize', checkWidth);
    }, []);
    const handleGoogleSignIn = async ()=>{
        try {
            setLoading(true);
            const isMobile = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window.flutter_inappwebview;
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                    skipBrowserRedirect: isMobile,
                    queryParams: {
                        access_type: 'offline',
                        prompt: 'consent'
                    }
                }
            });
            if (error) throw error;
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                event_type: 'AUTH',
                description: `Initiate Google Login`,
                metadata: {
                    provider: 'google'
                },
                user_name: 'Anonymous'
            });
            if (isMobile && data?.url) //TURBOPACK unreachable
            ;
        } catch (error) {
            console.error("Error logging in with Google:", error);
            alert("Failed to initiate Google Login");
        } finally{
            setLoading(false);
        }
    };
    const handleEmailSignIn = ()=>{
        // Toggle between User ID and Email forms
        onToggleForm();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        ref: containerRef,
        className: `flex gap-3 ${isColumnLayout ? 'flex-col' : 'flex-row'}`,
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: handleGoogleSignIn,
                disabled: loading,
                className: "group relative flex-1 rounded-full border-2 px-6 py-3 md:py-[7px] text-center font-semibold transition-all hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed",
                style: {
                    borderColor: '#DCDEE3',
                    backgroundColor: '#FFFFFF',
                    color: 'rgb(38, 50, 56)'
                },
                onMouseEnter: (e)=>{
                    if (!loading) {
                        e.currentTarget.style.borderColor = '#4b33e8';
                        e.currentTarget.style.backgroundColor = '#DCDEE3';
                    }
                },
                onMouseLeave: (e)=>{
                    if (!loading) {
                        e.currentTarget.style.borderColor = '#DCDEE3';
                        e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2",
                    children: loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin"
                    }, void 0, false, {
                        fileName: "[project]/components/SocialLoginButtons.tsx",
                        lineNumber: 104,
                        columnNumber: 14
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                className: "h-5 w-5 md:h-4 md:w-4",
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                        d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z",
                                        fill: "#4285F4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SocialLoginButtons.tsx",
                                        lineNumber: 112,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                        d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z",
                                        fill: "#34A853"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SocialLoginButtons.tsx",
                                        lineNumber: 113,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                        d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z",
                                        fill: "#FBBC05"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SocialLoginButtons.tsx",
                                        lineNumber: 114,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                        d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z",
                                        fill: "#EA4335"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SocialLoginButtons.tsx",
                                        lineNumber: 115,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SocialLoginButtons.tsx",
                                lineNumber: 107,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: "Google"
                            }, void 0, false, {
                                fileName: "[project]/components/SocialLoginButtons.tsx",
                                lineNumber: 117,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/components/SocialLoginButtons.tsx",
                    lineNumber: 102,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SocialLoginButtons.tsx",
                lineNumber: 80,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: handleEmailSignIn,
                className: "group relative flex-1 rounded-full border-2 px-6 py-3 md:py-[7px] text-center font-semibold transition-all hover:shadow-lg",
                style: {
                    borderColor: '#DCDEE3',
                    backgroundColor: '#FFFFFF',
                    color: 'rgb(38, 50, 56)'
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.borderColor = '#4b33e8';
                    e.currentTarget.style.backgroundColor = '#DCDEE3';
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.borderColor = '#DCDEE3';
                    e.currentTarget.style.backgroundColor = '#FFFFFF';
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-center gap-2",
                    children: formType === "userId" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                className: "h-5 w-5 md:h-4 md:w-4",
                                viewBox: "0 0 24 24",
                                fill: "currentColor",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                    d: "M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z",
                                    fill: "currentColor"
                                }, void 0, false, {
                                    fileName: "[project]/components/SocialLoginButtons.tsx",
                                    lineNumber: 149,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/SocialLoginButtons.tsx",
                                lineNumber: 144,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: "Email"
                            }, void 0, false, {
                                fileName: "[project]/components/SocialLoginButtons.tsx",
                                lineNumber: 151,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("svg", {
                                className: "h-5 w-5 md:h-4 md:w-4",
                                viewBox: "0 0 24 24",
                                fill: "none",
                                stroke: "currentColor",
                                strokeWidth: "2",
                                strokeLinecap: "round",
                                strokeLinejoin: "round",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("path", {
                                        d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SocialLoginButtons.tsx",
                                        lineNumber: 164,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("circle", {
                                        cx: "12",
                                        cy: "7",
                                        r: "4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SocialLoginButtons.tsx",
                                        lineNumber: 165,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SocialLoginButtons.tsx",
                                lineNumber: 155,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                children: "User ID"
                            }, void 0, false, {
                                fileName: "[project]/components/SocialLoginButtons.tsx",
                                lineNumber: 167,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true)
                }, void 0, false, {
                    fileName: "[project]/components/SocialLoginButtons.tsx",
                    lineNumber: 141,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/SocialLoginButtons.tsx",
                lineNumber: 124,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/SocialLoginButtons.tsx",
        lineNumber: 75,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/HeroSection.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HeroSection
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
const slides = [
    {
        title: "Welcome to Rynxly",
        image: "https://lh3.googleusercontent.com/d/1At7HgezDw8fFlfowrDBWtmIWVJMhpQI9",
        description: "Transform the way you work with seamless tools designed just for you!"
    },
    {
        title: "One Dashboard, Infinite Possibilities",
        image: "https://lh3.googleusercontent.com/d/1FWD6JK0ADAeh8PGt6C3z3cZbVoWPO-XN",
        description: "Streamline your workflow with an all-in-one platform that adapts to your needs!"
    },
    {
        title: "Effortlessly Track Your Records",
        image: "https://lh3.googleusercontent.com/d/1V7pbwWy8xcET8l5fz9aR6ZSwgtFl4v6n",
        description: "Stay organized and informed with intuitive tracking that keeps you in control!"
    },
    {
        title: "Manage Your Customers",
        image: "https://lh3.googleusercontent.com/d/13JN_m24KBSRqYXACgmQ-zeqVkP_81GqP",
        description: "Simplify customer management with our user-friendly customer feature that saves you time!"
    },
    {
        title: "Celebrate Your Achievements",
        image: "https://lh3.googleusercontent.com/d/1DUvzrq8Wuv2NExXmtRwx0KE_fDxbfbl0",
        description: "Reflect on your journey and stay inspired with clear visibility into your progress!"
    },
    {
        title: "Watch Your Profits Soar",
        image: "https://lh3.googleusercontent.com/d/11xHrJBtBcTx4L7q9fytqQj6415z4RemQ",
        description: "Stay connected to your financial growth with real-time insights and updates"
    },
    {
        title: "Unlock More Exciting Features",
        image: "https://lh3.googleusercontent.com/d/1sYGFJj3guFOM2L7GwLOJXNTO27UptrKP",
        description: "Discover a world of additional tools designed to supercharge your productivity"
    }
];
function HeroSection() {
    const [currentIndex, setCurrentIndex] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(0);
    const sliderRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const interval = setInterval(()=>{
            setCurrentIndex((prev)=>{
                const nextIndex = prev + 1;
                // Loop back to first slide after the last one
                if (nextIndex >= slides.length) {
                    return 0;
                }
                return nextIndex;
            });
        }, 3000); // Change slide every 3 seconds
        return ()=>clearInterval(interval);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (sliderRef.current) {
            // Each slide takes 100/slides.length% of the slider width
            // To move to slide N, we translate by N * (100/slides.length)%
            const translateX = -currentIndex * (100 / slides.length);
            sliderRef.current.style.transform = `translateX(${translateX}%)`;
            sliderRef.current.style.transition = 'transform 0.5s ease-in-out';
        }
    }, [
        currentIndex
    ]);
    const handleSwipe = ()=>{
        setCurrentIndex((prev)=>(prev + 1) % slides.length);
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "hero-container h-full flex flex-col overflow-hidden",
        style: {
            fontFamily: "'Roboto', sans-serif",
            backgroundColor: '#f6f5ff'
        },
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex-1 relative overflow-hidden",
            style: {
                width: '100%'
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                ref: sliderRef,
                className: "slider flex",
                style: {
                    width: `${slides.length * 100}%`,
                    height: '100%',
                    transform: `translateX(0%)`
                },
                children: slides.map((slide, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "slide flex-shrink-0 flex flex-col items-center justify-center text-center px-4",
                        style: {
                            width: `${100 / slides.length}%`,
                            minWidth: `${100 / slides.length}%`,
                            height: '100%'
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: "mb-6",
                                style: {
                                    fontFamily: "'Roboto', sans-serif",
                                    color: '#4931e7',
                                    fontWeight: 600,
                                    width: '80%',
                                    fontSize: '1.7vw'
                                },
                                children: slide.title
                            }, void 0, false, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 99,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mb-6 flex items-center justify-center",
                                style: {
                                    width: '100%',
                                    minHeight: '180px',
                                    maxHeight: '250px'
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                    src: slide.image,
                                    alt: slide.title,
                                    style: {
                                        width: 'auto',
                                        height: 'auto',
                                        maxWidth: '100%',
                                        maxHeight: '250px',
                                        objectFit: 'contain',
                                        display: 'block'
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/components/HeroSection.tsx",
                                    lineNumber: 112,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 111,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                style: {
                                    fontFamily: "'Roboto', sans-serif",
                                    color: '#847fa5',
                                    width: '70%',
                                    fontSize: '1.1vw',
                                    fontWeight: 400
                                },
                                children: slide.description
                            }, void 0, false, {
                                fileName: "[project]/components/HeroSection.tsx",
                                lineNumber: 125,
                                columnNumber: 15
                            }, this)
                        ]
                    }, index, true, {
                        fileName: "[project]/components/HeroSection.tsx",
                        lineNumber: 94,
                        columnNumber: 13
                    }, this))
            }, void 0, false, {
                fileName: "[project]/components/HeroSection.tsx",
                lineNumber: 84,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/HeroSection.tsx",
            lineNumber: 83,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/HeroSection.tsx",
        lineNumber: 81,
        columnNumber: 5
    }, this);
}
}),
"[project]/components/ErrorNotification.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ErrorNotification
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/styled-jsx/style.js [external] (styled-jsx/style.js, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
;
;
;
function ErrorNotification({ message, onClose, autoClose = true, duration = 5000 }) {
    const [isExiting, setIsExiting] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (autoClose && onClose) {
            const timer = setTimeout(()=>{
                setIsExiting(true);
                setTimeout(()=>{
                    onClose();
                }, 300); // Wait for animation to complete
            }, duration);
            return ()=>clearTimeout(timer);
        }
    }, [
        autoClose,
        duration,
        onClose
    ]);
    const handleClose = ()=>{
        setIsExiting(true);
        setTimeout(()=>{
            onClose?.();
        }, 300); // Wait for animation to complete
    };
    if (!message) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        id: "error-message",
        style: {
            display: 'inline-flex',
            alignItems: 'center',
            backgroundColor: 'rgb(255, 72, 72)',
            color: '#FFFFFF',
            padding: '12px 20px',
            fontSize: '14px',
            fontFamily: "'Roboto', sans-serif",
            fontWeight: '500',
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            animation: isExiting ? 'slideUp 0.3s ease-out forwards' : 'slideDown 0.3s ease-out'
        },
        className: "jsx-2a55613f8155a789",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "jsx-2a55613f8155a789",
                children: message
            }, void 0, false, {
                fileName: "[project]/components/ErrorNotification.tsx",
                lineNumber: 57,
                columnNumber: 7
            }, this),
            onClose && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                onClick: handleClose,
                style: {
                    background: 'transparent',
                    border: 'none',
                    color: '#FFFFFF',
                    cursor: 'pointer',
                    fontSize: '18px',
                    fontWeight: 'bold',
                    padding: '0',
                    marginLeft: '5px',
                    lineHeight: '1',
                    display: 'inline-flex',
                    alignItems: 'center'
                },
                onMouseEnter: (e)=>{
                    e.currentTarget.style.opacity = '0.7';
                },
                onMouseLeave: (e)=>{
                    e.currentTarget.style.opacity = '1';
                },
                className: "jsx-2a55613f8155a789",
                children: "×"
            }, void 0, false, {
                fileName: "[project]/components/ErrorNotification.tsx",
                lineNumber: 59,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$styled$2d$jsx$2f$style$2e$js__$5b$external$5d$__$28$styled$2d$jsx$2f$style$2e$js$2c$__cjs$29$__["default"], {
                id: "2a55613f8155a789",
                children: "@keyframes slideDown{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes slideUp{0%{opacity:1;transform:translateY(0)}to{opacity:0;transform:translateY(-10px)}}"
            }, void 0, false, void 0, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/ErrorNotification.tsx",
        lineNumber: 41,
        columnNumber: 5
    }, this);
}
}),
"[project]/pages/portal/login.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Login
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppLogo.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormUserId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/loginFormUserId.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormEmailId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/loginFormEmailId.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SocialLoginButtons$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SocialLoginButtons.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/HeroSection.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorNotification$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ErrorNotification.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/monitoring.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormUserId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormEmailId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SocialLoginButtons$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormUserId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormEmailId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SocialLoginButtons$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
function Login() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const [formType, setFormType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("userId");
    const [showForgotForm, setShowForgotForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [showForgotPasswordForm, setShowForgotPasswordForm] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [checkingSession, setCheckingSession] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        let isMounted = true;
        // 🛡️ SAFETY FALLBACK: If checking takes too long (e.g. 12s), force show login form.
        const safetyTimer = setTimeout(()=>{
            if (isMounted) {
                console.warn("⚠️ [Login] Session check timed out. Showing login form.");
                setCheckingSession(false);
            }
        }, 12000);
        const checkUser = async ()=>{
            try {
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (session && isMounted) {
                    console.log("🔄 [Login] Active session found, retrieving profile...");
                    // ⏳ DATABASE TIMEOUT: If profile fetch takes too long (e.g. 8s), fallback
                    const timeoutPromise = new Promise((_, reject)=>setTimeout(()=>reject(new Error("Database Timeout")), 8000));
                    const profilePromise = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('profile_complete, approval_status, status').eq('user_id', session.user.id).maybeSingle();
                    try {
                        const result = await Promise.race([
                            profilePromise,
                            timeoutPromise
                        ]);
                        const profile = result?.data || result; // Handle both RPC and Select response formats
                        if (profile && isMounted) {
                            if (profile.profile_complete === false) {
                                router.push("/profile-completion");
                                return;
                            }
                            const pathMap = {
                                rejected: "/rejected",
                                pending: "/pending",
                                suspend: "/suspended",
                                hold: "/hold"
                            };
                            const redirectPath = pathMap[profile.approval_status || ''] || pathMap[profile.status || ''] || "/dashboard";
                            console.log("🚀 [Login] Existing session, redirecting to:", redirectPath);
                            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$monitoring$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["logSystemEvent"])({
                                event_type: 'AUTH',
                                description: `Session Recovered: Redirecting to ${redirectPath}`,
                                user_id: session.user.id,
                                metadata: {
                                    redirect_path: redirectPath
                                }
                            });
                            router.push(redirectPath);
                        } else if (isMounted) {
                            // Session exists but no profile found - likely a stale or broken session
                            console.error("❌ [Login] Session exists but profile missing. Signing out.");
                            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.signOut();
                            setCheckingSession(false);
                        }
                    } catch (fetchErr) {
                        console.error("❌ [Login] Profile fetch error or timeout:", fetchErr);
                        if (isMounted) setCheckingSession(false);
                    }
                } else if (isMounted) {
                    setCheckingSession(false);
                }
            } catch (err) {
                console.error("Error checking session:", err);
                if (isMounted) setCheckingSession(false);
            }
        };
        checkUser();
        return ()=>{
            isMounted = false;
            clearTimeout(safetyTimer);
        };
    }, [
        router
    ]);
    const toggleForm = ()=>{
        setFormType(formType === "userId" ? "email" : "userId");
    };
    if (checkingSession) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex flex-col min-h-screen items-center justify-center bg-[#f6f5ff]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "scale-125 mb-4",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/portal/login.tsx",
                            lineNumber: 112,
                            columnNumber: 13
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/login.tsx",
                        lineNumber: 111,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col items-center gap-3",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-12 h-12 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/login.tsx",
                                lineNumber: 115,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-[#263238] font-bold text-lg animate-pulse",
                                style: {
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: "Retrieving logged details..."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/login.tsx",
                                lineNumber: 116,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-[#787E9D] text-sm font-medium",
                                children: "Please wait while we sync your session"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/login.tsx",
                                lineNumber: 119,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/login.tsx",
                        lineNumber: 114,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/login.tsx",
                lineNumber: 110,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/login.tsx",
            lineNumber: 109,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex min-h-screen items-center justify-center bg-transparent md:bg-[#e7e3ff]",
        style: {
            position: 'relative'
        },
        children: [
            error && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                style: {
                    position: 'fixed',
                    top: '10px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    zIndex: 9999
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ErrorNotification$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                    message: error,
                    onClose: ()=>setError("")
                }, void 0, false, {
                    fileName: "[project]/pages/portal/login.tsx",
                    lineNumber: 143,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/login.tsx",
                lineNumber: 134,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "w-full md:flex md:items-stretch md:justify-center md:gap-6 md:max-w-6xl md:px-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "hidden md:flex md:rounded-2xl md:p-[39px] md:shadow-2xl md:backdrop-blur-sm md:min-h-[512px] md:flex-col",
                        style: {
                            backgroundColor: '#f6f5ff',
                            border: '1.5px solid #ffffff',
                            width: '100%',
                            minWidth: '360px'
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$HeroSection$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                            fileName: "[project]/pages/portal/login.tsx",
                            lineNumber: 160,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/login.tsx",
                        lineNumber: 151,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "w-full md:h-auto md:max-w-[380px] md:mx-auto",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "w-full min-h-screen md:h-full md:rounded-2xl p-6 sm:p-8 md:p-[39px] md:shadow-2xl md:backdrop-blur-sm md:min-h-[512px] flex flex-col md:mt-0 gap-4 md:gap-[5px] justify-start md:justify-center overflow-y-auto hide-scrollbar py-12 md:py-[39px]",
                            style: {
                                backgroundColor: '#FFFFFF',
                                border: '1.5px solid #ffffff'
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex justify-center mb-6 md:mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                        fileName: "[project]/pages/portal/login.tsx",
                                        lineNumber: 174,
                                        columnNumber: 13
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/login.tsx",
                                    lineNumber: 173,
                                    columnNumber: 11
                                }, this),
                                formType === "userId" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormUserId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    onError: setError,
                                    showForgotForm: showForgotForm,
                                    showForgotPasswordForm: showForgotPasswordForm,
                                    onForgotFormToggle: (show)=>setShowForgotForm(show),
                                    onForgotPasswordFormToggle: (show)=>setShowForgotPasswordForm(show)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/login.tsx",
                                    lineNumber: 178,
                                    columnNumber: 15
                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$loginFormEmailId$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    onError: setError,
                                    showForgotPasswordForm: showForgotPasswordForm,
                                    onForgotPasswordFormToggle: (show)=>setShowForgotPasswordForm(show)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/login.tsx",
                                    lineNumber: 186,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "mt-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SocialLoginButtons$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        formType: formType,
                                        onToggleForm: toggleForm
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/login.tsx",
                                        lineNumber: 195,
                                        columnNumber: 15
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/login.tsx",
                                    lineNumber: 194,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/login.tsx",
                            lineNumber: 165,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/login.tsx",
                        lineNumber: 164,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/login.tsx",
                lineNumber: 149,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/pages/portal/login.tsx",
        lineNumber: 128,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__c8d1d944._.js.map