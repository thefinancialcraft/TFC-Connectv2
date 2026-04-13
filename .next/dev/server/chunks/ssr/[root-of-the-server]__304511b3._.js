module.exports = [
"[project]/pages/portal/users/[userId].tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dynamic.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
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
;
// Dynamically import component to prevent hydration errors
const SettingsFormFields = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>__turbopack_context__.A("[project]/components/SettingsFormFields.tsx [ssr] (ecmascript, next/dynamic entry, async loader)"), {
    loadableGenerated: {
        modules: [
            "[project]/components/SettingsFormFields.tsx [client] (ecmascript, next/dynamic entry)"
        ]
    },
    ssr: false
});
function UserProfilePage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { userId } = router.query;
    const { user: currentUser, mounted: userMounted, loading: authLoading } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [userDetail, setUserDetail] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("basic_info");
    const [uploadingAvatar, setUploadingAvatar] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const fileInputRef = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useRef"])(null);
    const [isEditMode, setIsEditMode] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [editFormData, setEditFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({});
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchData = async ()=>{
            if (!userId || typeof userId !== 'string' || !userMounted || !currentUser) {
                if (userMounted && !currentUser && !authLoading) {
                    router.push("/login");
                }
                setLoading(false);
                return;
            }
            try {
                // Fetch user profile details
                const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                if (!session) {
                    setError("Not authenticated");
                    setLoading(false);
                    return;
                }
                // Fetch user profile by ID
                // Try both PK 'id' and Auth UUID 'user_id' for maximum robustness
                console.log("Searching user profile for ID:", userId);
                const { data: profileByRowId, error: rowError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('id', userId).maybeSingle();
                let profileData = profileByRowId;
                if (!profileData && !rowError) {
                    console.log("Not found by Row ID, searching by User UUID...");
                    const { data: profileByUserId, error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('user_id', userId).maybeSingle();
                    profileData = profileByUserId;
                }
                if (rowError || !profileData) {
                    const actualError = rowError || (profileData ? null : "User not found in database");
                    if (actualError) {
                        console.error('Error fetching user profile:', actualError);
                        setError(typeof actualError === 'string' ? actualError : "Failed to load user profile");
                        setLoading(false);
                        return;
                    }
                }
                if (!profileData) {
                    setError("User not found");
                    setLoading(false);
                    return;
                }
                // Map profile data to UserDetail
                const detail = {
                    ...currentUser,
                    id: profileData.id,
                    user_id: profileData.user_id,
                    user_name: profileData.user_name,
                    contact_no: profileData.contact_no,
                    employee_id: profileData.employee_id,
                    role: profileData.role,
                    status: profileData.status,
                    approval_status: profileData.approval_status,
                    super_admin: profileData.super_admin,
                    father_name: profileData.father_name,
                    gender: profileData.gender,
                    pan_number: profileData.pan_number,
                    aadhar_card_no: profileData.aadhar_card_no,
                    date_of_birth: profileData.date_of_birth,
                    date_of_joining: profileData.date_of_joining,
                    in_hand_salary: profileData.in_hand_salary,
                    alternate_contact: profileData.alternate_contact,
                    primary_address: profileData.primary_address,
                    area_pincode: profileData.area_pincode,
                    bank_name: profileData.bank_name,
                    account_holder_name: profileData.account_holder_name,
                    account_number: profileData.account_number,
                    ifsc_code: profileData.ifsc_code,
                    branch_pincode: profileData.branch_pincode,
                    branch_state: profileData.branch_state,
                    branch_city: profileData.branch_city,
                    blood_group: profileData.blood_group,
                    emergency_contact_no: profileData.emergency_contact_no,
                    profile_pic_url: profileData.profile_pic_url,
                    pancard_url: profileData.pancard_url,
                    aadhar_front_url: profileData.aadhar_front_url,
                    aadhar_back_url: profileData.aadhar_back_url,
                    qualification_marksheet_url: profileData.qualification_marksheet_url,
                    bank_passbook_url: profileData.bank_passbook_url,
                    profile_complete: profileData.profile_complete,
                    created_at: profileData.created_at,
                    updated_at: profileData.updated_at,
                    hold_start_date: profileData.hold_start_date,
                    hold_end_date: profileData.hold_end_date,
                    status_reason: profileData.status_reason,
                    user_type: profileData.user_type,
                    work_type: profileData.work_type,
                    department: profileData.department,
                    displayName: profileData.user_name || currentUser?.displayName || null,
                    email: profileData.email || currentUser?.email || '',
                    profilePicUrl: profileData.profile_pic_url || null,
                    is_client: profileData.is_client,
                    joined_at: profileData.joined_at,
                    renewal_at: profileData.renewal_at,
                    expire_at: profileData.expire_at
                };
                setUserDetail(detail);
                // Initialize edit form data
                setEditFormData({
                    email: profileData.email || "",
                    user_name: profileData.user_name || "",
                    contact_no: profileData.contact_no || "",
                    employee_id: profileData.employee_id || "",
                    role: profileData.role || "",
                    father_name: profileData.father_name || "",
                    gender: profileData.gender || "",
                    date_of_birth: profileData.date_of_birth || "",
                    blood_group: profileData.blood_group || "",
                    alternate_contact: profileData.alternate_contact || "",
                    emergency_contact_no: profileData.emergency_contact_no || "",
                    date_of_joining: profileData.date_of_joining || "",
                    in_hand_salary: profileData.in_hand_salary?.toString() || "",
                    primary_address: profileData.primary_address || "",
                    area_pincode: profileData.area_pincode || "",
                    pan_number: profileData.pan_number || "",
                    aadhar_card_no: profileData.aadhar_card_no || "",
                    bank_name: profileData.bank_name || "",
                    account_holder_name: profileData.account_holder_name || "",
                    account_number: profileData.account_number || "",
                    ifsc_code: profileData.ifsc_code || "",
                    branch_city: profileData.branch_city || "",
                    branch_state: profileData.branch_state || "",
                    branch_pincode: profileData.branch_pincode || "",
                    profile_pic_url: profileData.profile_pic_url || "",
                    pancard_url: profileData.pancard_url || "",
                    aadhar_front_url: profileData.aadhar_front_url || "",
                    aadhar_back_url: profileData.aadhar_back_url || "",
                    qualification_marksheet_url: profileData.qualification_marksheet_url || "",
                    bank_passbook_url: profileData.bank_passbook_url || "",
                    // Client Lifecycle
                    is_client: profileData.is_client !== undefined ? String(profileData.is_client) : "false",
                    joined_at: profileData.joined_at ? profileData.joined_at.split('T')[0] : "",
                    renewal_at: profileData.renewal_at ? profileData.renewal_at.split('T')[0] : "",
                    expire_at: profileData.expire_at ? profileData.expire_at.split('T')[0] : ""
                });
            } finally{
                setLoading(false);
            }
        };
        if (mounted && userId && !authLoading) {
            fetchData();
        }
    }, [
        userId,
        router.isReady,
        mounted,
        currentUser,
        authLoading
    ]);
    const formatDate = (dateString)=>{
        if (!dateString) return 'N/A';
        try {
            // Use fixed format to avoid hydration mismatches
            const date = new Date(dateString);
            const day = date.getDate();
            const monthNames = [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ];
            const month = monthNames[date.getMonth()];
            const year = date.getFullYear();
            return `${day} ${month} ${year}`;
        } catch (e) {
            return 'N/A';
        }
    };
    const getStatusBadge = (status)=>{
        if (status === 'active') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold",
                children: "Active"
            }, void 0, false, {
                fileName: "[project]/pages/portal/users/[userId].tsx",
                lineNumber: 271,
                columnNumber: 9
            }, this);
        } else if (status === 'inactive') {
            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                className: "px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold",
                children: "Inactive"
            }, void 0, false, {
                fileName: "[project]/pages/portal/users/[userId].tsx",
                lineNumber: 277,
                columnNumber: 9
            }, this);
        }
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
            className: "px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold",
            children: "Pending"
        }, void 0, false, {
            fileName: "[project]/pages/portal/users/[userId].tsx",
            lineNumber: 283,
            columnNumber: 7
        }, this);
    };
    const getApprovalStatusBadge = (status)=>{
        switch(status){
            case 'approved':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold",
                    children: "Approved"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/users/[userId].tsx",
                    lineNumber: 292,
                    columnNumber: 16
                }, this);
            case 'pending':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-sm font-semibold",
                    children: "Pending"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/users/[userId].tsx",
                    lineNumber: 294,
                    columnNumber: 16
                }, this);
            case 'hold':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm font-semibold",
                    children: "Hold"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/users/[userId].tsx",
                    lineNumber: 296,
                    columnNumber: 16
                }, this);
            case 'suspend':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold",
                    children: "Suspended"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/users/[userId].tsx",
                    lineNumber: 298,
                    columnNumber: 16
                }, this);
            case 'rejected':
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-semibold",
                    children: "Rejected"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/users/[userId].tsx",
                    lineNumber: 300,
                    columnNumber: 16
                }, this);
            default:
                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                    className: "px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-sm font-semibold",
                    children: "Unknown"
                }, void 0, false, {
                    fileName: "[project]/pages/portal/users/[userId].tsx",
                    lineNumber: 302,
                    columnNumber: 16
                }, this);
        }
    };
    const handleLogoutClick = async ()=>{
        const { handleLogout } = await __turbopack_context__.A("[project]/lib/authService.ts [ssr] (ecmascript, async loader)");
        await handleLogout(router);
    };
    const handleChangeAvatar = ()=>{
        fileInputRef.current?.click();
    };
    const handleAvatarFileSelect = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        // Validate file size (5MB for profile pictures)
        if (file.size > 5 * 1024 * 1024) {
            alert("File size must be less than 5MB");
            return;
        }
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert("Please select an image file");
            return;
        }
        setUploadingAvatar(true);
        try {
            const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (sessionError || !session) {
                alert("Please log in to upload avatar");
                setUploadingAvatar(false);
                return;
            }
            // Create file path for profile picture
            const timestamp = Date.now();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `${session.user.id}/profile_pic/${timestamp}-${sanitizedFileName}`;
            // Upload file to Supabase Storage (use user-documents bucket or create profile-pics bucket)
            const { data: uploadData, error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').upload(filePath, file, {
                contentType: file.type,
                upsert: true
            });
            if (uploadError) {
                console.error("Upload error:", uploadError);
                alert(uploadError.message || "Failed to upload avatar");
                setUploadingAvatar(false);
                return;
            }
            // Get signed URL for the file (valid for 1 year)
            const { data: urlData, error: urlError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').createSignedUrl(filePath, 31536000); // 1 year expiry
            if (urlError || !urlData) {
                console.error("URL generation error:", urlError);
                alert("Avatar uploaded but failed to generate URL");
                setUploadingAvatar(false);
                return;
            }
            // Update profile_pic_url in user_profiles table
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                profile_pic_url: urlData.signedUrl
            }).eq('id', userId);
            if (updateError) {
                console.error("Update error:", updateError);
                alert("Failed to update profile picture");
                setUploadingAvatar(false);
                return;
            }
            // Update local state
            setUserDetail((prev)=>prev ? {
                    ...prev,
                    profile_pic_url: urlData.signedUrl
                } : null);
            alert("Avatar updated successfully!");
            setUploadingAvatar(false);
            // Reset file input
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload avatar");
            setUploadingAvatar(false);
        }
    };
    const handleRemoveAvatar = async ()=>{
        if (!confirm("Are you sure you want to remove the avatar?")) {
            return;
        }
        try {
            const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (sessionError || !session) {
                alert("Please log in to remove avatar");
                return;
            }
            // Remove profile_pic_url from user_profiles table
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                profile_pic_url: null
            }).eq('id', userId);
            if (updateError) {
                console.error("Update error:", updateError);
                alert("Failed to remove avatar");
                return;
            }
            // Update local state
            setUserDetail((prev)=>prev ? {
                    ...prev,
                    profile_pic_url: null
                } : null);
            alert("Avatar removed successfully!");
        } catch (error) {
            console.error("Remove error:", error);
            alert(error.message || "Failed to remove avatar");
        }
    };
    // Don't render anything until mounted and on client side to prevent hydration errors
    if ("TURBOPACK compile-time truthy", 1) {
        return null;
    }
    //TURBOPACK unreachable
    ;
}
// Disable SSR to prevent hydration errors
const DynamicUserProfilePage = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>Promise.resolve(UserProfilePage), {
    ssr: false,
    loading: ()=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "flex min-h-screen items-center justify-center",
            style: {
                backgroundColor: "#f6f5f7"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-12 w-12 border-4 border-t-transparent mx-auto mb-4",
                        style: {
                            borderColor: '#4b33e8'
                        }
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/users/[userId].tsx",
                        lineNumber: 899,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-lg",
                        style: {
                            color: "#4b33e8"
                        },
                        children: "Loading..."
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/users/[userId].tsx",
                        lineNumber: 900,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/users/[userId].tsx",
                lineNumber: 898,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/pages/portal/users/[userId].tsx",
            lineNumber: 897,
            columnNumber: 5
        }, ("TURBOPACK compile-time value", void 0))
});
const __TURBOPACK__default__export__ = DynamicUserProfilePage;
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__304511b3._.js.map