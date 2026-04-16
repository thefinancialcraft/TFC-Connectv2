module.exports = [
"[project]/components/SettingsFormFields.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>SettingsFormFields
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
const DocumentUploadField = ({ fieldName, label, acceptedTypes = "image/*,.pdf", formData, handleInputChange, onFileUpload, copiedField, handleCopy })=>{
    const [uploading, setUploading] = __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].useState(false);
    const [deleting, setDeleting] = __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].useState(false);
    const fileInputRef = __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].useRef(null);
    const handleFileSelect = async (e)=>{
        const file = e.target.files?.[0];
        if (!file) return;
        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert("File size must be less than 10MB");
            return;
        }
        setUploading(true);
        try {
            // Get session
            const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (sessionError || !session) {
                alert("Please log in to upload files");
                setUploading(false);
                return;
            }
            // Create user-specific file path: {userId}/{documentType}/{timestamp}-{fileName}
            const timestamp = Date.now();
            const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
            const filePath = `${session.user.id}/${fieldName}/${timestamp}-${sanitizedFileName}`;
            // Upload file directly to Supabase Storage
            const { data: uploadData, error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').upload(filePath, file, {
                contentType: file.type,
                upsert: true
            });
            if (uploadError) {
                console.error("Upload error:", uploadError);
                alert(uploadError.message || "Failed to upload file");
                setUploading(false);
                return;
            }
            // Get signed URL for the file (valid for 1 year)
            const { data: urlData, error: urlError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').createSignedUrl(filePath, 31536000); // 1 year expiry
            if (urlError || !urlData) {
                console.error("URL generation error:", urlError);
                alert("File uploaded but failed to generate URL");
                setUploading(false);
                return;
            }
            // Update form data with the signed URL
            handleInputChange({
                target: {
                    id: fieldName,
                    value: urlData.signedUrl
                }
            });
            // Call onFileUpload callback if provided
            onFileUpload?.(fieldName, urlData.signedUrl);
            setUploading(false);
        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message || "Failed to upload file");
            setUploading(false);
        }
    };
    const fileUrl = formData[fieldName];
    const isImage = fileUrl && (fileUrl.toLowerCase().includes('.jpg') || fileUrl.toLowerCase().includes('.jpeg') || fileUrl.toLowerCase().includes('.png') || fileUrl.toLowerCase().includes('.webp') || fileUrl.includes('image/') // Some signed URLs might have type in query
    );
    const hasValue = fileUrl && fileUrl.toString().trim() !== '';
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                        className: "text-sm font-medium leading-none",
                        style: {
                            color: "#263238",
                            fontFamily: "'Poppins', sans-serif"
                        },
                        children: label
                    }, void 0, false, {
                        fileName: "[project]/components/SettingsFormFields.tsx",
                        lineNumber: 113,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    hasValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>handleCopy(fieldName, fileUrl),
                        className: "flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors",
                        title: copiedField === fieldName ? "Copied!" : "Copy",
                        children: copiedField === fieldName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-check text-xs text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 127,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-copy text-xs text-gray-500"
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 129,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0))
                    }, void 0, false, {
                        fileName: "[project]/components/SettingsFormFields.tsx",
                        lineNumber: 120,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/SettingsFormFields.tsx",
                lineNumber: 112,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                ref: fileInputRef,
                type: "file",
                accept: acceptedTypes,
                onChange: handleFileSelect,
                className: "hidden",
                disabled: uploading
            }, void 0, false, {
                fileName: "[project]/components/SettingsFormFields.tsx",
                lineNumber: 135,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>fileInputRef.current?.click(),
                        disabled: uploading,
                        className: "flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
                        style: {
                            borderColor: "#E0E0E0",
                            color: "#263238",
                            fontFamily: "'Roboto', sans-serif"
                        },
                        children: uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    children: "Uploading..."
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi flex fi-rr-upload text-base"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    children: fileUrl ? "Replace File" : "Upload File"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 164,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true)
                    }, void 0, false, {
                        fileName: "[project]/components/SettingsFormFields.tsx",
                        lineNumber: 145,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    fileUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mt-2 p-3 rounded-md border relative",
                        style: {
                            borderColor: "#E0E0E0",
                            backgroundColor: "#F9FAFB"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: async ()=>{
                                    if (!confirm(`Are you sure you want to delete ${label}?`)) {
                                        return;
                                    }
                                    setDeleting(true);
                                    try {
                                        const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                                        if (sessionError || !session) {
                                            alert("Please log in to delete files");
                                            setDeleting(false);
                                            return;
                                        }
                                        // List all files in the user's directory for this document type
                                        const pathPrefix = `${session.user.id}/${fieldName}/`;
                                        const { data: files, error: listError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').list(pathPrefix, {
                                            limit: 100,
                                            offset: 0
                                        });
                                        if (listError) {
                                            console.error("List error:", listError);
                                            alert(listError.message || "Failed to list files");
                                            setDeleting(false);
                                            return;
                                        }
                                        if (!files || files.length === 0) {
                                            handleInputChange({
                                                target: {
                                                    id: fieldName,
                                                    value: ""
                                                }
                                            });
                                            setDeleting(false);
                                            return;
                                        }
                                        // Delete all files in this directory
                                        const pathsToDelete = files.map((f)=>`${pathPrefix}${f.name}`);
                                        const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').remove(pathsToDelete);
                                        if (deleteError) {
                                            console.error("Delete error:", deleteError);
                                            alert(deleteError.message || "Failed to delete file");
                                            setDeleting(false);
                                            return;
                                        }
                                        // Clear form field
                                        handleInputChange({
                                            target: {
                                                id: fieldName,
                                                value: ""
                                            }
                                        });
                                        // Reset file input
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                        setDeleting(false);
                                    } catch (error) {
                                        console.error("Delete error:", error);
                                        alert(error.message || "Failed to delete file");
                                        setDeleting(false);
                                    }
                                },
                                disabled: deleting,
                                className: "absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
                                style: {
                                    zIndex: 10
                                },
                                title: "Delete file",
                                children: deleting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 250,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi flex fi-rr-cross-small text-sm"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 252,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/components/SettingsFormFields.tsx",
                                lineNumber: 172,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            isImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("img", {
                                        src: fileUrl,
                                        alt: label,
                                        className: "w-full max-w-xs h-auto rounded border",
                                        style: {
                                            borderColor: "#E0E0E0"
                                        },
                                        onError: (e)=>{
                                            const target = e.target;
                                            target.style.display = 'none';
                                            const parent = target.parentElement;
                                            if (parent) {
                                                const link = document.createElement('a');
                                                link.href = fileUrl;
                                                link.target = "_blank";
                                                link.className = "text-blue-600 hover:underline text-sm font-medium";
                                                link.textContent = "View Document";
                                                parent.appendChild(link);
                                            }
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/components/SettingsFormFields.tsx",
                                        lineNumber: 258,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                        href: fileUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "inline-flex items-center gap-2 text-sm text-blue-600 hover:underline",
                                        style: {
                                            fontFamily: "'Roboto', sans-serif"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-eye text-base"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SettingsFormFields.tsx",
                                                lineNumber: 284,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: "View Full Size"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SettingsFormFields.tsx",
                                                lineNumber: 285,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/SettingsFormFields.tsx",
                                        lineNumber: 277,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SettingsFormFields.tsx",
                                lineNumber: 257,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("a", {
                                href: fileUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium",
                                style: {
                                    fontFamily: "'Roboto', sans-serif"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-file text-base"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SettingsFormFields.tsx",
                                        lineNumber: 296,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        children: "View Document"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SettingsFormFields.tsx",
                                        lineNumber: 297,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/SettingsFormFields.tsx",
                                lineNumber: 289,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/SettingsFormFields.tsx",
                        lineNumber: 170,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/components/SettingsFormFields.tsx",
                lineNumber: 144,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                type: "hidden",
                id: fieldName,
                value: fileUrl || "",
                onChange: handleInputChange
            }, void 0, false, {
                fileName: "[project]/components/SettingsFormFields.tsx",
                lineNumber: 304,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/components/SettingsFormFields.tsx",
        lineNumber: 111,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
function SettingsFormFields({ formData, handleInputChange, category, onFileUpload, userId, readOnly = false }) {
    const [copiedField, setCopiedField] = __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["default"].useState(null);
    const handleCopy = async (fieldId, value)=>{
        const textToCopy = value?.toString() || '';
        if (!textToCopy || textToCopy.trim() === '') {
            return;
        }
        try {
            await navigator.clipboard.writeText(textToCopy);
            setCopiedField(fieldId);
            setTimeout(()=>setCopiedField(null), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
            const textArea = document.createElement('textarea');
            textArea.value = textToCopy;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            try {
                document.execCommand('copy');
                setCopiedField(fieldId);
                setTimeout(()=>setCopiedField(null), 2000);
            } catch (fallbackErr) {
                console.error('Fallback copy failed:', fallbackErr);
            }
            document.body.removeChild(textArea);
        }
    };
    const renderField = (id, label, type = "text", required = false, disabled = false, placeholder, maxLength, rows, options)=>{
        const isDisabled = readOnly || disabled;
        const fieldValue = formData[id] || "";
        const hasValue = fieldValue && fieldValue.toString().trim() !== '';
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                            htmlFor: id,
                            className: "text-sm font-medium leading-none",
                            style: {
                                color: "#263238",
                                fontFamily: "'Poppins', sans-serif"
                            },
                            children: [
                                label,
                                " ",
                                required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    style: {
                                        color: "#EF4444"
                                    },
                                    children: "*"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 378,
                                    columnNumber: 34
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 373,
                            columnNumber: 11
                        }, this),
                        hasValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleCopy(id, fieldValue),
                            className: "flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors",
                            title: copiedField === id ? "Copied!" : "Copy",
                            children: copiedField === id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-check text-xs text-green-600"
                            }, void 0, false, {
                                fileName: "[project]/components/SettingsFormFields.tsx",
                                lineNumber: 388,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-copy text-xs text-gray-500"
                            }, void 0, false, {
                                fileName: "[project]/components/SettingsFormFields.tsx",
                                lineNumber: 390,
                                columnNumber: 17
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 381,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 372,
                    columnNumber: 9
                }, this),
                type === "textarea" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("textarea", {
                    id: id,
                    value: fieldValue,
                    onChange: handleInputChange,
                    rows: rows || 3,
                    placeholder: placeholder,
                    disabled: isDisabled,
                    className: "flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
                    style: {
                        borderColor: "#E0E0E0",
                        backgroundColor: isDisabled ? "#FFFFFF" : "#FFFFFF",
                        color: "#000000",
                        fontFamily: "'Roboto', sans-serif"
                    },
                    onFocus: (e)=>{
                        if (!isDisabled) e.currentTarget.style.borderColor = "#4b33e8";
                    },
                    onBlur: (e)=>{
                        e.currentTarget.style.borderColor = "#E0E0E0";
                    }
                }, void 0, false, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 396,
                    columnNumber: 11
                }, this) : type === "select" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                    id: id,
                    value: fieldValue,
                    onChange: handleInputChange,
                    disabled: isDisabled,
                    className: "flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
                    style: {
                        borderColor: "#E0E0E0",
                        backgroundColor: isDisabled ? "#FFFFFF" : "#FFFFFF",
                        color: "#000000",
                        fontFamily: "'Roboto', sans-serif"
                    },
                    onFocus: (e)=>{
                        if (!isDisabled) e.currentTarget.style.borderColor = "#4b33e8";
                    },
                    onBlur: (e)=>{
                        e.currentTarget.style.borderColor = "#E0E0E0";
                    },
                    children: options?.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                            value: opt.value,
                            children: opt.label
                        }, opt.value, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 438,
                            columnNumber: 15
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 418,
                    columnNumber: 11
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                    type: type,
                    id: id,
                    value: fieldValue,
                    onChange: handleInputChange,
                    required: required,
                    disabled: isDisabled,
                    placeholder: placeholder,
                    maxLength: maxLength,
                    className: "flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed",
                    style: {
                        borderColor: "#E0E0E0",
                        backgroundColor: isDisabled ? "#FFFFFF" : "#FFFFFF",
                        color: "#000000",
                        fontFamily: "'Roboto', sans-serif"
                    },
                    onFocus: (e)=>{
                        if (!isDisabled) e.currentTarget.style.borderColor = "#4b33e8";
                    },
                    onBlur: (e)=>{
                        e.currentTarget.style.borderColor = "#E0E0E0";
                    }
                }, void 0, false, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 444,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 371,
            columnNumber: 7
        }, this);
    };
    if (category === "basic_info") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                        renderField("user_name", "Full Name", "text", true),
                        renderField("email", "Email", "email", false, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 475,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                        renderField("contact_no", "Contact Number", "tel", true, false, "8882558932", 10),
                        renderField("employee_id", "Employee ID", "text", false, true)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 479,
                    columnNumber: 9
                }, this),
                renderField("role", "Role", "text", false, true)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 474,
            columnNumber: 7
        }, this);
    }
    if (category === "personal_info") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                        renderField("father_name", "Father's Name"),
                        renderField("gender", "Gender", "select", false, false, undefined, undefined, undefined, [
                            {
                                value: "",
                                label: "Select Gender"
                            },
                            {
                                value: "Male",
                                label: "Male"
                            },
                            {
                                value: "Female",
                                label: "Female"
                            },
                            {
                                value: "Other",
                                label: "Other"
                            }
                        ])
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 491,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                        renderField("date_of_birth", "Date of Birth", "date"),
                        renderField("blood_group", "Blood Group", "text", false, false, "e.g., O+, A-, B+")
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 500,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                        renderField("alternate_contact", "Alternate Contact", "tel", false, false, "Alternative phone number", 10),
                        renderField("emergency_contact_no", "Emergency Contact", "tel", false, false, "Emergency contact number", 10)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 504,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 490,
            columnNumber: 7
        }, this);
    }
    if (category === "employment_info") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
            children: [
                renderField("date_of_joining", "Date of Joining", "date"),
                renderField("in_hand_salary", "In Hand Salary", "number", false, false, "Enter amount")
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 514,
            columnNumber: 7
        }, this);
    }
    if (category === "address_info") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                renderField("primary_address", "Primary Address", "textarea", false, false, "Enter your full address", undefined, 3),
                renderField("area_pincode", "Area Pincode", "text", false, false, "e.g., 110001", 6)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 523,
            columnNumber: 7
        }, this);
    }
    if (category === "kyc_info") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm",
            children: [
                renderField("pan_number", "PAN Number", "text", false, false, "e.g., ABCDE1234F"),
                renderField("aadhar_card_no", "Aadhar Card Number", "text", false, false, "12-digit Aadhar number", 12)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 532,
            columnNumber: 7
        }, this);
    }
    if (category === "bank_info") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                        renderField("bank_name", "Bank Name"),
                        renderField("account_holder_name", "Account Holder Name")
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 542,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                    children: [
                        renderField("account_number", "Account Number", "text", false, false, "Bank account number"),
                        renderField("ifsc_code", "IFSC Code", "text", false, false, "e.g., SBIN0001234")
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 546,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-3 gap-4",
                    children: [
                        renderField("branch_city", "Branch City"),
                        renderField("branch_state", "Branch State"),
                        renderField("branch_pincode", "Branch Pincode", "text", false, false, "Branch pincode", 6)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 550,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 541,
            columnNumber: 7
        }, this);
    }
    if (category === "client_lifecycle") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                    children: [
                        renderField("is_client", "Is this a Client?", "select", false, false, undefined, undefined, undefined, [
                            {
                                value: "false",
                                label: "No (Personnel)"
                            },
                            {
                                value: "true",
                                label: "Yes (Client)"
                            }
                        ]),
                        renderField("joined_at", "joined at", "date")
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 562,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                    children: [
                        renderField("renewal_at", "renewal at", "date"),
                        renderField("expire_at", "expire at", "date")
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 569,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 561,
            columnNumber: 7
        }, this);
    }
    if (category === "documents") {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                    className: "text-sm",
                    style: {
                        color: "#263238",
                        fontFamily: "'Roboto', sans-serif"
                    },
                    children: "Upload your documents. Maximum file size: 10MB. Accepted formats: Images (JPG, PNG, WEBP) and PDF."
                }, void 0, false, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 580,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DocumentUploadField, {
                            fieldName: "profile_pic_url",
                            label: "Profile Picture",
                            acceptedTypes: "image/*",
                            formData: formData,
                            handleInputChange: handleInputChange,
                            onFileUpload: onFileUpload,
                            copiedField: copiedField,
                            handleCopy: handleCopy
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 584,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DocumentUploadField, {
                            fieldName: "pancard_url",
                            label: "PAN Card",
                            acceptedTypes: "image/*,.pdf",
                            formData: formData,
                            handleInputChange: handleInputChange,
                            onFileUpload: onFileUpload,
                            copiedField: copiedField,
                            handleCopy: handleCopy
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 585,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DocumentUploadField, {
                            fieldName: "aadhar_front_url",
                            label: "Aadhar Card (Front)",
                            acceptedTypes: "image/*,.pdf",
                            formData: formData,
                            handleInputChange: handleInputChange,
                            onFileUpload: onFileUpload,
                            copiedField: copiedField,
                            handleCopy: handleCopy
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 586,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DocumentUploadField, {
                            fieldName: "aadhar_back_url",
                            label: "Aadhar Card (Back)",
                            acceptedTypes: "image/*,.pdf",
                            formData: formData,
                            handleInputChange: handleInputChange,
                            onFileUpload: onFileUpload,
                            copiedField: copiedField,
                            handleCopy: handleCopy
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 587,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DocumentUploadField, {
                            fieldName: "qualification_marksheet_url",
                            label: "Qualification Marksheet",
                            acceptedTypes: "image/*,.pdf",
                            formData: formData,
                            handleInputChange: handleInputChange,
                            onFileUpload: onFileUpload,
                            copiedField: copiedField,
                            handleCopy: handleCopy
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 588,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(DocumentUploadField, {
                            fieldName: "bank_passbook_url",
                            label: "Bank Passbook",
                            acceptedTypes: "image/*,.pdf",
                            formData: formData,
                            handleInputChange: handleInputChange,
                            onFileUpload: onFileUpload,
                            copiedField: copiedField,
                            handleCopy: handleCopy
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 589,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 583,
                    columnNumber: 9
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/components/SettingsFormFields.tsx",
            lineNumber: 579,
            columnNumber: 7
        }, this);
    }
    return null;
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/settings/FlutterBridgeTab.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>FlutterBridgeTab
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/hooks/useAuthGuard.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/flutterBridge.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/bridgeLogger.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
function FlutterBridgeTab() {
    const [messages, setMessages] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [testType, setTestType] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('test_event');
    const [testValue, setTestValue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [isBridgeActive, setIsBridgeActive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Load messages from globalBridgeLogger on mount
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMessages(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalBridgeLogger"].getLogs());
        const handleNewLog = ()=>{
            setMessages(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalBridgeLogger"].getLogs());
        };
        const handleCleared = ()=>{
            setMessages([]);
        };
        window.addEventListener('tfc-new-bridge-log', handleNewLog);
        window.addEventListener('tfc-bridge-logs-cleared', handleCleared);
        return ()=>{
            window.removeEventListener('tfc-new-bridge-log', handleNewLog);
            window.removeEventListener('tfc-bridge-logs-cleared', handleCleared);
        };
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        // Check if bridge exists and keep checking for a few seconds if it doesn't
        const checkBridge = ()=>{
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            return false;
        };
        if (!checkBridge()) {
            const interval = setInterval(()=>{
                if (checkBridge()) clearInterval(interval);
            }, 500);
            setTimeout(()=>clearInterval(interval), 5000);
        }
    }, []);
    const sendToFlutter = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])(testType, testValue);
    };
    const clearLogs = ()=>{
        __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalBridgeLogger"].clearLogs();
    };
    // Sync User Info Hook
    const { user } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$hooks$2f$useAuthGuard$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["useAuthGuard"])();
    const syncUserInfoToFlutter = ()=>{
        if (!user) {
            __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$bridgeLogger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalBridgeLogger"].addLog('out', 'sync_user_info_error', 'No user data available to sync');
            return;
        }
        // notifyFlutter handles the logging and sending
        const userInfoPayload = {
            user_name: user.displayName,
            employee_id: user.employeeId,
            email: user.email,
            role: user.role,
            designation: user.role,
            department: null,
            createdAt: user.createdAt,
            lastSignInAt: user.lastSignInAt,
            profilePicUrl: user.profilePicUrl
        };
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('sync_user_info', userInfoPayload);
    };
    const openDevMode = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('isdevmode_open', true);
    };
    const sendLoginEvent = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('login', true);
    };
    const sendLogoutEvent = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('logout', true);
    };
    const sendDummyEvent = ()=>{
        const testNumber = "198";
        console.log("📤 [Web] Triggering Test Call to:", testNumber);
        const bridgeConnected = (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('call_to', testNumber);
        if (!bridgeConnected) {
            window.location.href = `tel:${testNumber}`;
        }
    };
    const sendDisconnectEvent = ()=>{
        const testNumber = "198";
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["notifyFlutter"])('call_disconnect', testNumber);
    };
    const handleRequestDeviceInfo = ()=>{
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$flutterBridge$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["requestDeviceInfoFromFlutter"])();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden",
            style: {
                borderColor: "#E0E0E0"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-6 sm:p-8",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-10 h-10 rounded-xl bg-[#4b33e8]/10 flex items-center justify-center text-[#4b33e8]",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-data-transfer text-lg"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                            lineNumber: 131,
                                            columnNumber: 17
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 130,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold text-[#263238]",
                                                style: {
                                                    fontFamily: "'Poppins', sans-serif"
                                                },
                                                children: "Bridge Debugger"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 134,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[#787E9D]",
                                                children: "Monitor web-to-app communication"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 137,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 133,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 129,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: `flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all ${isBridgeActive ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: `h-2 w-2 rounded-full animate-pulse ${isBridgeActive ? 'bg-emerald-500' : 'bg-rose-500'}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 146,
                                        columnNumber: 15
                                    }, this),
                                    isBridgeActive ? 'Bridge Active' : 'Native Bridge Missing'
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 141,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                        lineNumber: 128,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-gray-50/50 p-5 rounded-2xl mb-8 border border-gray-100",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-paper-plane text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 154,
                                        columnNumber: 16
                                    }, this),
                                    "Send Message to Flutter"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 153,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-4 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "md:col-span-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Event Type",
                                            className: "w-full h-11 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4b33e8]/20 outline-none transition-all",
                                            value: testType,
                                            onChange: (e)=>setTestType(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                            lineNumber: 159,
                                            columnNumber: 18
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 158,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "md:col-span-2",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                            type: "text",
                                            placeholder: "Payload Value",
                                            className: "w-full h-11 px-4 bg-white text-gray-700 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-[#4b33e8]/20 outline-none transition-all",
                                            value: testValue,
                                            onChange: (e)=>setTestValue(e.target.value)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                            lineNumber: 168,
                                            columnNumber: 18
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 167,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: sendToFlutter,
                                        className: "h-11 px-6 bg-[#4b33e8] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#4b33e8]/20 hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-paper-plane-top flex"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 180,
                                                columnNumber: 19
                                            }, this),
                                            "Send"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 176,
                                        columnNumber: 16
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 157,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                        lineNumber: 152,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                className: "text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-bolt text-[10px]"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 190,
                                        columnNumber: 16
                                    }, this),
                                    "Quick Actions"
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 189,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: syncUserInfoToFlutter,
                                        className: "px-4 py-3 bg-white border border-gray-100 text-[#4b33e8] rounded-xl text-xs font-bold hover:border-[#4b33e8] hover:bg-gray-50 transition-all flex items-center gap-3 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-[#4b33e8]/10 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-refresh flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 199,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 198,
                                                columnNumber: 19
                                            }, this),
                                            "Sync User Info"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 194,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: openDevMode,
                                        className: "px-4 py-3 bg-white border border-gray-100 text-indigo-600 rounded-xl text-xs font-bold hover:border-indigo-600 hover:bg-gray-50 transition-all flex items-center gap-3 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-code-compare flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 209,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 208,
                                                columnNumber: 19
                                            }, this),
                                            "Toggle Dev Mode"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 204,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: sendLoginEvent,
                                        className: "px-4 py-3 bg-white border border-gray-100 text-emerald-600 rounded-xl text-xs font-bold hover:border-emerald-600 hover:bg-gray-50 transition-all flex items-center gap-3 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-sign-in-alt flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 219,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 218,
                                                columnNumber: 19
                                            }, this),
                                            "Manual Login"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 214,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: sendLogoutEvent,
                                        className: "px-4 py-3 bg-white border border-gray-100 text-rose-600 rounded-xl text-xs font-bold hover:border-rose-600 hover:bg-gray-50 transition-all flex items-center gap-3 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-sign-out-alt flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 229,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 228,
                                                columnNumber: 19
                                            }, this),
                                            "Manual Logout"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 224,
                                        columnNumber: 16
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: sendDummyEvent,
                                        className: "px-4 py-3 bg-white border border-gray-100 text-amber-600 rounded-xl text-xs font-bold hover:border-amber-600 hover:bg-gray-50 transition-all flex items-center gap-3 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-phone-call flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 239,
                                                    columnNumber: 22
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 238,
                                                columnNumber: 20
                                            }, this),
                                            "Place Test Call (198)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 234,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: sendDisconnectEvent,
                                        className: "px-4 py-3 bg-white border border-gray-100 text-rose-500 rounded-xl text-xs font-bold hover:border-rose-500 hover:bg-gray-50 transition-all flex items-center gap-3 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-rose-50 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-phone-slash flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 249,
                                                    columnNumber: 22
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 248,
                                                columnNumber: 20
                                            }, this),
                                            "Disconnect Call (198)"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 244,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: handleRequestDeviceInfo,
                                        className: "px-4 py-3 bg-white border border-gray-100 text-blue-600 rounded-xl text-xs font-bold hover:border-blue-600 hover:bg-gray-50 transition-all flex items-center gap-3 group",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:scale-110 transition-transform",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-mobile-button flex"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 259,
                                                    columnNumber: 22
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 258,
                                                columnNumber: 20
                                            }, this),
                                            "Request Device Info"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 254,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 193,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                        lineNumber: 188,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "border border-gray-100 rounded-[20px] overflow-hidden bg-white shadow-sm",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-gray-50 px-5 py-4 border-b border-gray-100 flex justify-between items-center",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-black text-gray-500 uppercase tracking-widest",
                                                children: "Communication Log"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 270,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                className: "px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-[10px] font-bold",
                                                children: messages.length
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 271,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 269,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: clearLogs,
                                        className: "text-[10px] font-bold text-[#4b33e8] hover:underline flex items-center gap-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi fi-rr-trash text-[10px]"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                lineNumber: 277,
                                                columnNumber: 19
                                            }, this),
                                            "Clear Logs"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 273,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 268,
                                columnNumber: 14
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "h-[450px] overflow-y-auto p-4 sm:p-6 space-y-4 bg-gray-50/30",
                                children: messages.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "h-full flex flex-col items-center justify-center text-gray-400 opacity-60 py-10",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-layer-group text-4xl mb-4"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                            lineNumber: 285,
                                            columnNumber: 21
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-sm font-medium italic",
                                            children: "Waiting for communications..."
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                            lineNumber: 286,
                                            columnNumber: 21
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                    lineNumber: 284,
                                    columnNumber: 19
                                }, this) : messages.map((msg)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: `flex ${msg.direction === 'out' ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-top-1`,
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: `max-w-[90%] sm:max-w-[80%] rounded-2xl p-4 shadow-sm border transition-all ${msg.direction === 'out' ? 'bg-white border-[#4b33e8]/10 text-gray-700' : 'bg-[#4b33e8] border-[#4b33e8] text-white'}`,
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: `flex items-center gap-3 mb-3 pb-2 border-b ${msg.direction === 'out' ? 'border-gray-100' : 'border-white/10'}`,
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: `w-6 h-6 rounded-full flex items-center justify-center text-[10px] ${msg.direction === 'out' ? 'bg-[#4b33e8]/10 text-[#4b33e8]' : 'bg-white/20 text-white'}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: `fi ${msg.direction === 'out' ? 'fi-rr-arrow-up' : 'fi-rr-arrow-down'} flex`
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                                lineNumber: 302,
                                                                columnNumber: 31
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                            lineNumber: 299,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "font-black uppercase text-[10px] tracking-wider opacity-80",
                                                            children: msg.direction === 'out' ? 'Sent to Native' : 'Received from Native'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                            lineNumber: 304,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                            className: "text-[10px] font-bold opacity-60 ml-auto",
                                                            children: new Date(msg.timestamp).toLocaleTimeString([], {
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                            lineNumber: 307,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 296,
                                                    columnNumber: 27
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-2",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `text-[10px] font-bold uppercase ${msg.direction === 'out' ? 'text-gray-400' : 'text-white/60'}`,
                                                                    children: "Type"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                                    lineNumber: 314,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: "text-xs font-black tracking-wide",
                                                                    children: msg.type
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                                    lineNumber: 315,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                            lineNumber: 313,
                                                            columnNumber: 29
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `text-[10px] font-bold uppercase ${msg.direction === 'out' ? 'text-gray-400' : 'text-white/60'}`,
                                                                    children: "Payload"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                                    lineNumber: 319,
                                                                    columnNumber: 31
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `p-3 rounded-xl font-mono text-[11px] overflow-x-auto break-all whitespace-pre-wrap ${msg.direction === 'out' ? 'bg-gray-50 text-gray-600' : 'bg-white/10 text-white'}`,
                                                                    children: typeof msg.payload === 'object' ? JSON.stringify(msg.payload, null, 2) : String(msg.payload)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                                    lineNumber: 320,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                            lineNumber: 318,
                                                            columnNumber: 29
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                                    lineNumber: 312,
                                                    columnNumber: 27
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                            lineNumber: 291,
                                            columnNumber: 24
                                        }, this)
                                    }, msg.id, false, {
                                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                        lineNumber: 290,
                                        columnNumber: 21
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                                lineNumber: 282,
                                columnNumber: 14
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                        lineNumber: 267,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
                lineNumber: 127,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
            lineNumber: 126,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/settings/FlutterBridgeTab.tsx",
        lineNumber: 125,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/settings/DevicesTab.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>DevicesTab
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
function DevicesTab({ employeeId }) {
    const [devices, setDevices] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(true);
    const [localDeviceInfo, setLocalDeviceInfo] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isBridgeActive, setIsBridgeActive] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // OTP Verification State
    const [showOTPModal, setShowOTPModal] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [otpValue, setOtpValue] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [verifyingDeviceId, setVerifyingDeviceId] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    const [isVerifying, setIsVerifying] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [otpError, setOtpError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const checkBridge = ()=>{
            const active = !!window.flutter_inappwebview?.callHandler;
            if (active !== isBridgeActive) setIsBridgeActive(active);
        };
        checkBridge();
        const interval = setInterval(checkBridge, 1000);
        return ()=>clearInterval(interval);
    }, [
        isBridgeActive
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        fetchDevices();
        // Check localstorage for current device info
        if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
        ;
    }, [
        employeeId
    ]);
    const fetchDevices = async ()=>{
        setLoading(true);
        try {
            let query = __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').select('*');
            if (employeeId) {
                query = query.eq('employee_id', employeeId);
            }
            const { data, error } = await query.order('last_seen', {
                ascending: false
            });
            if (error) throw error;
            setDevices(data || []);
        } catch (err) {
            console.error('Error fetching devices:', err);
        } finally{
            setLoading(false);
        }
    };
    const formatTime = (dateString)=>{
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleString([], {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const setPrimary = async (targetId)=>{
        if (!employeeId) return;
        try {
            // 1. Reset all your devices to not primary and status to 'inactive'
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
                is_primary: false,
                status: 'inactive'
            }).eq('employee_id', employeeId);
            // 2. Set the target device as primary and status to 'pending'
            // Note: We set to pending to force a re-handshake/verification
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
                is_primary: true,
                status: 'pending'
            }).eq('id', targetId);
            if (error) throw error;
            fetchDevices(); // Refresh list
        } catch (err) {
            console.error('Error setting primary device:', err);
        }
    };
    const deleteDevice = async (targetId)=>{
        if (!window.confirm("Are you sure you want to remove this device? This cannot be undone.")) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').delete().eq('id', targetId);
            if (error) throw error;
            setDevices((prev)=>prev.filter((d)=>d.id !== targetId));
        } catch (err) {
            console.error('Error deleting device:', err);
        }
    };
    const acceptConnection = async (targetId, email)=>{
        try {
            setVerifyingDeviceId(targetId);
            setIsVerifying(true);
            setOtpError(null);
            console.log("🚀 [Devices] Requesting activation OTP for:", email);
            // Using our own API as a proxy for better security and no-cors prevention
            const response = await fetch('/api/otp/generate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    purpose: 'device_activation'
                })
            });
            const data = await response.json();
            if (!response.ok || !data.success) {
                throw new Error(data.error || "Failed to send verification code");
            }
            setVerifyingDeviceId(targetId);
            setShowOTPModal(true);
            setIsVerifying(false);
        } catch (err) {
            console.error('❌ [Devices] Activation error:', err);
            setIsVerifying(false);
            alert(`Error: ${err.message || 'Unknown error'}`);
        }
    };
    const verifyOTPAndConnect = async ()=>{
        if (!verifyingDeviceId || otpValue.length !== 6) return;
        try {
            setIsVerifying(true);
            setOtpError(null);
            // Verify OTP in Supabase
            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('otp_verifications').select('*').eq('otp_code', otpValue).eq('purpose', 'device_activation').eq('is_used', false).gt('expires_at', new Date().toISOString()).order('created_at', {
                ascending: false
            }).limit(1);
            if (error || !data || data.length === 0) {
                setOtpError("Invalid or expired code");
                setIsVerifying(false);
                return;
            }
            // Mark OTP as used
            await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('otp_verifications').update({
                is_used: true,
                used_at: new Date().toISOString()
            }).eq('id', data[0].id);
            // Finalize device connection
            const { error: updateError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
                status: 'connected'
            }).eq('id', verifyingDeviceId);
            if (updateError) throw updateError;
            setShowOTPModal(false);
            setOtpValue('');
            setVerifyingDeviceId(null);
            fetchDevices();
        } catch (err) {
            console.error('Error verifying OTP:', err);
            setOtpError("Verification failed");
        } finally{
            setIsVerifying(false);
        }
    };
    const declineConnection = async (targetId)=>{
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
                status: 'inactive'
            }).eq('id', targetId);
            if (error) throw error;
            fetchDevices();
        } catch (err) {
            console.error('Error declining connection:', err);
        }
    };
    const disconnectDevice = async (targetId)=>{
        if (!window.confirm("Disconnect this device? It will stop receiving call notifications.")) return;
        try {
            const { error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('sync_meta').update({
                status: 'inactive',
                is_primary: false
            }).eq('id', targetId);
            if (error) throw error;
            fetchDevices();
        } catch (err) {
            console.error('Error disconnecting device:', err);
        }
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "rounded-[24px] border border-gray-100 bg-white shadow-sm overflow-hidden",
                style: {
                    borderColor: "#E0E0E0"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "p-6 sm:p-8",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex items-center gap-3",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: "fi flex  fi-rr-devices text-lg"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                                lineNumber: 259,
                                                columnNumber: 17
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                    className: "text-lg font-bold text-[#263238]",
                                                    style: {
                                                        fontFamily: "'Poppins', sans-serif"
                                                    },
                                                    children: "Connected Devices"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                    lineNumber: 262,
                                                    columnNumber: 17
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                    className: "text-xs text-[#787E9D]",
                                                    children: "Manage devices synced with your account"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                    lineNumber: 265,
                                                    columnNumber: 17
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 261,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 257,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                    onClick: fetchDevices,
                                    className: "flex items-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-xl text-xs font-bold transition-all border border-gray-100",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi flex  fi-rr-refresh flex"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 273,
                                            columnNumber: 15
                                        }, this),
                                        "Refresh"
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 269,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DevicesTab.tsx",
                            lineNumber: 256,
                            columnNumber: 11
                        }, this),
                        localDeviceInfo && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "mb-8 p-4 bg-[#4b33e8]/5 border border-[#4b33e8]/10 rounded-2xl flex items-center gap-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-10 h-10 rounded-full bg-[#4b33e8] flex items-center justify-center text-white shrink-0",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex  fi-rr-smartphone"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                        lineNumber: 282,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 281,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "flex-1 min-w-0",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                            className: "text-[10px] font-black text-[#4b33e8] uppercase tracking-wider",
                                            children: "Current Session Device"
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 285,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                            className: "text-sm font-bold text-[#263238] truncate",
                                            children: localDeviceInfo.model || localDeviceInfo.device_model || 'Unknown Device'
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 286,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 284,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "hidden sm:block text-right",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "px-2 py-1 bg-emerald-100 text-emerald-600 rounded-md text-[10px] font-black uppercase",
                                        children: "Active Now"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                        lineNumber: 289,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 288,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DevicesTab.tsx",
                            lineNumber: 280,
                            columnNumber: 13
                        }, this),
                        loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "py-20 flex flex-col items-center justify-center space-y-4",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-8 h-8 border-4 border-[#4b33e8] border-t-transparent rounded-full animate-spin"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 296,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-gray-400 font-medium italic",
                                    children: "Scanning for devices..."
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 297,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DevicesTab.tsx",
                            lineNumber: 295,
                            columnNumber: 13
                        }, this) : devices.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "py-20 flex flex-col items-center justify-center text-gray-400 opacity-60",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center mb-4",
                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi flex  fi-rr-search-alt text-3xl"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                        lineNumber: 302,
                                        columnNumber: 17
                                    }, this)
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 301,
                                    columnNumber: 15
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm font-medium italic",
                                    children: "No devices found for this account"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 304,
                                    columnNumber: 15
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/components/settings/DevicesTab.tsx",
                            lineNumber: 300,
                            columnNumber: 13
                        }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                            children: devices.map((device)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: `p-5 rounded-[20px] border transition-all hover:shadow-md ${device.is_primary ? 'border-[#4b33e8]/20 bg-[#4b33e8]/5' : 'border-gray-100 bg-white'}`,
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "flex justify-between items-start mb-4",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "flex items-center gap-3",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: `w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${device.is_primary ? 'bg-[#4b33e8] text-white' : 'bg-gray-100 text-gray-500'}`,
                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: `fi ${device.on_call ? 'fi-rr-phone-call animate-pulse' : 'fi-rr-smartphone'} text-lg`
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                lineNumber: 320,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 317,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "min-w-0",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                            className: "text-sm font-bold text-[#263238] truncate",
                                                                            children: device.device_model || 'Unknown Model'
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                            lineNumber: 324,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        device.is_primary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "px-1.5 py-0.5 bg-[#4b33e8] text-white rounded text-[8px] font-black uppercase",
                                                                            children: "Primary"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                            lineNumber: 328,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                    lineNumber: 323,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-[10px] text-gray-400 font-mono truncate",
                                                                    children: device.android_id || 'No ID'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                    lineNumber: 331,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 322,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                    lineNumber: 316,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "text-right",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: `text-[10px] font-black uppercase mb-1 ${!device.is_primary ? 'text-gray-400' : device.status !== 'connected' ? 'text-amber-500' : new Date().getTime() - new Date(device.last_seen).getTime() < 300000 ? 'text-emerald-500' : 'text-gray-400'}`,
                                                            children: !device.is_primary ? 'Inactive' : device.status !== 'connected' ? 'Pending' : new Date().getTime() - new Date(device.last_seen).getTime() < 300000 ? 'Online' : 'Offline'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 335,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] text-gray-400",
                                                            children: formatTime(device.last_seen)
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 349,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                    lineNumber: 334,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 315,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-2 gap-3 mt-4 pt-4 border-t border-gray-50",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] font-black text-gray-400 uppercase tracking-widest",
                                                            children: "User"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 355,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-xs font-bold text-gray-700 truncate",
                                                            children: device.user_name || 'Anonymous'
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 356,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                    lineNumber: 354,
                                                    columnNumber: 21
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-1",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                            className: "text-[9px] font-black text-gray-400 uppercase tracking-widest",
                                                            children: "Status"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 359,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center gap-1.5",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                    className: `w-1.5 h-1.5 rounded-full ${!device.is_primary ? 'bg-gray-300' : device.status !== 'connected' ? 'bg-amber-400' : device.on_call ? 'bg-amber-500' : 'bg-emerald-500'}`
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                    lineNumber: 361,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                    className: "text-xs font-bold text-gray-700",
                                                                    children: !device.is_primary ? 'Inactive Device' : device.status !== 'connected' ? 'Pending Verification' : device.on_call ? 'In Call' : 'Available'
                                                                }, void 0, false, {
                                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                    lineNumber: 366,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                                            lineNumber: 360,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                    lineNumber: 358,
                                                    columnNumber: 21
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 353,
                                            columnNumber: 19
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "mt-5 flex items-center gap-2",
                                            children: device.is_primary && device.status === 'pending' && isBridgeActive && localDeviceInfo && device.entry_id === `${employeeId}_${localDeviceInfo.android_id || localDeviceInfo.androidId}` ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>acceptConnection(device.id, device.email),
                                                        disabled: isVerifying,
                                                        className: "flex-1 py-2 bg-emerald-600 text-white rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed",
                                                        children: [
                                                            isVerifying && verifyingDeviceId === device.id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                lineNumber: 386,
                                                                columnNumber: 29
                                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex fi-rr-check flex"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                lineNumber: 388,
                                                                columnNumber: 29
                                                            }, this),
                                                            isVerifying && verifyingDeviceId === device.id ? 'Sending...' : 'Confirm'
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                                        lineNumber: 380,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>declineConnection(device.id),
                                                        className: "flex-1 py-2 bg-gray-100 text-gray-600 rounded-lg text-[10px] font-black uppercase tracking-tighter hover:bg-gray-200 transition-all flex items-center justify-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                className: "fi flex  fi-rr-cross-small flex"
                                                            }, void 0, false, {
                                                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                                                lineNumber: 396,
                                                                columnNumber: 27
                                                            }, this),
                                                            "Decline"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                                        lineNumber: 392,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                children: [
                                                    !device.is_primary && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setPrimary(device.id),
                                                        className: "flex-1 py-2 bg-[#4b33e8] text-white rounded-lg text-[11px] font-bold hover:bg-[#3b27b8] transition-all",
                                                        children: "Set Primary"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                                        lineNumber: 403,
                                                        columnNumber: 27
                                                    }, this),
                                                    device.status === 'connected' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>disconnectDevice(device.id),
                                                        className: "flex-1 py-2 bg-gray-50 text-gray-500 rounded-lg text-[11px] font-bold hover:bg-gray-100 transition-all border border-gray-100",
                                                        children: "Disconnect"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                                        lineNumber: 411,
                                                        columnNumber: 27
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>deleteDevice(device.id),
                                                        className: `py-2 px-4 border border-rose-100 text-rose-500 rounded-lg text-[11px] font-bold hover:bg-rose-50 transition-all ${!device.is_primary && device.status !== 'connected' ? '' : 'flex-1'}`,
                                                        children: "Remove"
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                                        lineNumber: 418,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, void 0, true)
                                        }, void 0, false, {
                                            fileName: "[project]/components/settings/DevicesTab.tsx",
                                            lineNumber: 375,
                                            columnNumber: 19
                                        }, this)
                                    ]
                                }, device.id, true, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 309,
                                    columnNumber: 17
                                }, this))
                        }, void 0, false, {
                            fileName: "[project]/components/settings/DevicesTab.tsx",
                            lineNumber: 307,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/components/settings/DevicesTab.tsx",
                    lineNumber: 255,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/DevicesTab.tsx",
                lineNumber: 254,
                columnNumber: 7
            }, this),
            showOTPModal && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-[32px] w-full max-w-sm overflow-hidden shadow-2xl border border-gray-100 animate-in zoom-in-95 duration-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-8 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-shield-check text-2xl"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                    lineNumber: 440,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                lineNumber: 439,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-bold text-gray-900 mb-2",
                                children: "Verify Device"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                lineNumber: 442,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mb-8",
                                children: "Enter the 6-digit code sent to your email to activate this device."
                            }, void 0, false, {
                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                lineNumber: 443,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        maxLength: 6,
                                        value: otpValue,
                                        onChange: (e)=>setOtpValue(e.target.value.replace(/\D/g, '')),
                                        placeholder: "000000",
                                        className: `w-full text-center text-3xl font-black tracking-[12px] py-4 rounded-2xl border-2 transition-all outline-none ${otpError ? 'border-rose-200 bg-rose-50 text-rose-500' : 'border-gray-100 bg-gray-50 text-gray-900 focus:border-[#4b33e8]/30'}`
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                        lineNumber: 448,
                                        columnNumber: 17
                                    }, this),
                                    otpError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                        className: "text-xs font-bold text-rose-500 animate-bounce",
                                        children: otpError
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                        lineNumber: 460,
                                        columnNumber: 19
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex gap-3 pt-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setShowOTPModal(false);
                                                    setOtpValue('');
                                                    setOtpError(null);
                                                },
                                                className: "flex-1 py-3 px-4 rounded-xl text-xs font-bold text-gray-500 hover:bg-gray-50 transition-all",
                                                children: "Cancel"
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                                lineNumber: 464,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: verifyOTPAndConnect,
                                                disabled: otpValue.length !== 6 || isVerifying,
                                                className: `flex-[1.5] py-3 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${otpValue.length === 6 && !isVerifying ? 'bg-[#4b33e8] text-white shadow-lg shadow-[#4b33e8]/20 hover:scale-[1.02]' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`,
                                                children: isVerifying ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/settings/DevicesTab.tsx",
                                                    lineNumber: 484,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
                                                    children: "Verify & Connect"
                                                }, void 0, false)
                                            }, void 0, false, {
                                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                                lineNumber: 474,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/settings/DevicesTab.tsx",
                                        lineNumber: 463,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/DevicesTab.tsx",
                                lineNumber: 447,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/DevicesTab.tsx",
                        lineNumber: 438,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/DevicesTab.tsx",
                    lineNumber: 437,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/DevicesTab.tsx",
                lineNumber: 436,
                columnNumber: 9
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/DevicesTab.tsx",
        lineNumber: 253,
        columnNumber: 5
    }, this);
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[project]/components/settings/ConsoleLogsTab.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ConsoleLogsTab
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/logger.ts [ssr] (ecmascript)");
;
;
;
function ConsoleLogsTab() {
    const [logs, setLogs] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [filter, setFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('');
    const [levelFilter, setLevelFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('all');
    const [catFilter, setCatFilter] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])('all');
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setLogs(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalLogger"].getLogs());
        const handleNewLog = ()=>{
            setLogs(__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalLogger"].getLogs());
        };
        const handleCleared = ()=>{
            setLogs([]);
        };
        window.addEventListener('tfc-new-log', handleNewLog);
        window.addEventListener('tfc-logs-cleared', handleCleared);
        return ()=>{
            window.removeEventListener('tfc-new-log', handleNewLog);
            window.removeEventListener('tfc-logs-cleared', handleCleared);
        };
    }, []);
    const categories = Array.from(new Set(logs.map((l)=>l.category || 'Global')));
    const filteredLogs = logs.filter((log)=>{
        const matchesSearch = log.message.toLowerCase().includes(filter.toLowerCase());
        const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
        const matchesCat = catFilter === 'all' || (log.category || 'Global') === catFilter;
        return matchesSearch && matchesLevel && matchesCat;
    });
    const getLevelColor = (level)=>{
        switch(level){
            case 'error':
                return 'text-red-500 bg-red-50 border-red-100';
            case 'warn':
                return 'text-amber-500 bg-amber-50 border-amber-100';
            case 'info':
                return 'text-blue-500 bg-blue-50 border-blue-100';
            default:
                return 'text-gray-500 bg-gray-50 border-gray-100';
        }
    };
    const copyToClipboard = ()=>{
        const text = logs.map((l)=>`[${l.timestamp}] ${l.level.toUpperCase()}: ${l.message}`).join('\n');
        navigator.clipboard.writeText(text);
        alert('Logs copied to clipboard');
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
        className: "flex flex-col h-[600px] bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-4 border-b border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between bg-gray-50/50",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-3 w-full md:w-auto",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "relative flex-1 md:w-64",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                        className: "fi fi-rr-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                        lineNumber: 61,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search logs...",
                                        value: filter,
                                        onChange: (e)=>setFilter(e.target.value),
                                        className: "w-full h-10 pl-9 pr-4 bg-white border border-gray-200 rounded-xl text-xs focus:ring-2 focus:ring-[#4b33e8]/20 outline-none transition-all"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                        lineNumber: 62,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 60,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: levelFilter,
                                onChange: (e)=>setLevelFilter(e.target.value),
                                className: "h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "Levels"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                        lineNumber: 75,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "error",
                                        children: "Errors"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                        lineNumber: 76,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "warn",
                                        children: "Warnings"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                        lineNumber: 77,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "info",
                                        children: "Info"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                        lineNumber: 78,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 70,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("select", {
                                value: catFilter,
                                onChange: (e)=>setCatFilter(e.target.value),
                                className: "h-10 px-3 bg-white border border-gray-200 rounded-xl text-xs font-bold outline-none cursor-pointer max-w-[150px]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                        value: "all",
                                        children: "All Pages"
                                    }, void 0, false, {
                                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                        lineNumber: 85,
                                        columnNumber: 25
                                    }, this),
                                    categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("option", {
                                            value: cat,
                                            children: (cat === '/' ? 'Home' : cat.split('/').pop()) || 'Global'
                                        }, cat, false, {
                                            fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                            lineNumber: 87,
                                            columnNumber: 29
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 80,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                        lineNumber: 59,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex items-center gap-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const current = localStorage.getItem('tfc_log_pip_open') === 'true';
                                    window.dispatchEvent(new CustomEvent('tfc-toggle-log-pip', {
                                        detail: !current
                                    }));
                                },
                                className: "p-2.5 bg-white border rounded-lg text-gray-500 hover:text-[#4b33e8] transition-all",
                                title: "Floating Logs (PIP)",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-expand flex text-xs"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                    lineNumber: 103,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 95,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: copyToClipboard,
                                className: "p-2.5 bg-white border rounded-lg text-gray-500 hover:text-[#4b33e8] transition-all",
                                title: "Copy all logs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-copy flex text-xs"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                    lineNumber: 110,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 105,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    const text = filteredLogs.map((l)=>`[${new Date(l.timestamp).toLocaleString()}] [${l.level.toUpperCase()}] [${l.category}] ${l.message}`).join('\n');
                                    const blob = new Blob([
                                        text
                                    ], {
                                        type: 'text/plain'
                                    });
                                    const url = URL.createObjectURL(blob);
                                    const a = document.createElement('a');
                                    a.href = url;
                                    a.download = `tfc_logs_${new Date().getTime()}.txt`;
                                    a.click();
                                    URL.revokeObjectURL(url);
                                },
                                className: "p-2.5 bg-white border rounded-lg text-gray-500 hover:text-[#4b33e8] transition-all",
                                title: "Download logs",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-download flex text-xs"
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                    lineNumber: 126,
                                    columnNumber: 25
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 112,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>__TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$logger$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["globalLogger"].clearLogs(),
                                className: "px-4 py-2 bg-red-50 text-red-600 rounded-lg text-[10px] font-bold border border-red-100 hover:bg-red-100 transition-all",
                                children: "Clear"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 128,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                        lineNumber: 94,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                lineNumber: 58,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "flex-1 overflow-auto p-4 bg-[#0d1117]",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "min-w-full inline-block space-y-2 font-mono text-[11px]",
                    children: filteredLogs.length > 0 ? filteredLogs.map((log)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            className: "flex gap-3 group animate-in slide-in-from-left duration-200 hover:bg-white/5 p-1 rounded transition-colors group",
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-gray-500 shrink-0 w-32",
                                    children: [
                                        new Date(log.timestamp).toLocaleTimeString([], {
                                            hour12: false,
                                            hour: '2-digit',
                                            minute: '2-digit',
                                            second: '2-digit'
                                        }),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                            className: "text-[9px] opacity-50 ml-1",
                                            children: [
                                                ".",
                                                new Date(log.timestamp).getMilliseconds()
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                            lineNumber: 145,
                                            columnNumber: 33
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                    lineNumber: 143,
                                    columnNumber: 33
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: `px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0 h-fit ${log.level === 'error' ? 'bg-red-500/20 text-red-400' : log.level === 'warn' ? 'bg-amber-500/20 text-amber-400' : log.level === 'info' ? 'bg-blue-500/20 text-blue-400' : 'bg-gray-500/20 text-gray-400'}`,
                                    children: log.level
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                    lineNumber: 147,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: "text-[9px] px-1.5 py-0.5 bg-gray-600/30 text-gray-400 rounded font-bold shrink-0 h-fit uppercase",
                                    children: !log.category || log.category === '/' ? 'Home' : log.category.split('/').pop() || 'Global'
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                    lineNumber: 155,
                                    columnNumber: 29
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                    className: `break-all whitespace-pre leading-relaxed ${log.level === 'error' ? 'text-red-300' : log.level === 'warn' ? 'text-amber-200' : log.level === 'info' ? 'text-blue-200' : 'text-gray-300'}`,
                                    children: log.message
                                }, void 0, false, {
                                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                    lineNumber: 158,
                                    columnNumber: 29
                                }, this)
                            ]
                        }, log.id, true, {
                            fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                            lineNumber: 142,
                            columnNumber: 29
                        }, this)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "h-full flex flex-col items-center justify-center text-gray-500 space-y-2",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                className: "fi fi-rr-list text-2xl opacity-20"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 170,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "italic uppercase tracking-widest text-[10px]",
                                children: "No logs to display"
                            }, void 0, false, {
                                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                                lineNumber: 171,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                        lineNumber: 169,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                    lineNumber: 139,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                lineNumber: 138,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "p-3 bg-gray-50 border-t border-gray-100 flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-gray-400 font-medium",
                        children: [
                            "Total: ",
                            logs.length,
                            " logs | Shown: ",
                            filteredLogs.length
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                        lineNumber: 179,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                        className: "text-[10px] text-gray-400 italic",
                        children: "Persisting in LocalStorage"
                    }, void 0, false, {
                        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                        lineNumber: 182,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
                lineNumber: 178,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/settings/ConsoleLogsTab.tsx",
        lineNumber: 56,
        columnNumber: 9
    }, this);
}
}),
"[project]/pages/portal/settings.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "default",
    ()=>Settings
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react/jsx-dev-runtime [external] (react/jsx-dev-runtime, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/react [external] (react, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/router.js [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dialogUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SettingsFormFields.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$localStorageUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/localStorageUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$FlutterBridgeTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/FlutterBridgeTab.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$DevicesTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/DevicesTab.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ConsoleLogsTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/settings/ConsoleLogsTab.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$FlutterBridgeTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$DevicesTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$FlutterBridgeTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$DevicesTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
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
function Settings() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [activeNav] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("settings");
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("profile");
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("basic_info");
    // Form state
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        email: "",
        user_name: "",
        contact_no: "",
        employee_id: "",
        role: "",
        father_name: "",
        gender: "",
        date_of_birth: "",
        blood_group: "",
        alternate_contact: "",
        emergency_contact_no: "",
        date_of_joining: "",
        in_hand_salary: "",
        is_client: "false",
        joined_at: "",
        renewal_at: "",
        expire_at: "",
        primary_address: "",
        area_pincode: "",
        pan_number: "",
        aadhar_card_no: "",
        bank_name: "",
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        branch_city: "",
        branch_state: "",
        branch_pincode: "",
        profile_pic_url: "",
        pancard_url: "",
        aadhar_front_url: "",
        aadhar_back_url: "",
        qualification_marksheet_url: "",
        bank_passbook_url: ""
    });
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Security tab states
    const [currentPassword, setCurrentPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("");
    const [isUpdatingPassword, setIsUpdatingPassword] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [twoFactorEnabled, setTwoFactorEnabled] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [activeSessions, setActiveSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])([]);
    const [isLoadingSessions, setIsLoadingSessions] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const currentUserId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }, []);
    const currentTokenId = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useMemo"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return null;
        //TURBOPACK unreachable
        ;
    }, []);
    const [showIdentityErrorPopup, setShowIdentityErrorPopup] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    // Check for OAuth errors in URL
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
        // Check both query params and hash for errors
        const params = undefined;
        const hashParams = undefined;
        const error = undefined;
        const errorCode = undefined;
        const errorDescription = undefined;
    }, []);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchProfileData = async ()=>{
            if (!user) return;
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (session) {
                try {
                    console.log("📥 [Settings] Fetching user profile from API...");
                    const profileResponse = await fetch("/api/auth/user-profile", {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`
                        }
                    });
                    const profileData = await profileResponse.json();
                    console.log("📥 [Settings] API Profile Data received:", profileData.success ? "Success" : "Failed");
                    if (profileData.success && profileData.user) {
                        console.log("📥 [Settings] Fetching full profile from DB for ID:", user.uid);
                        const { data: fullProfile, error: dbError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('user_id', user.uid).maybeSingle();
                        if (dbError) console.error("❌ [Settings] DB Profile Error:", dbError);
                        else console.log("✅ [Settings] DB Profile fetched successfully.");
                        // Capture provider token if available (persist for calendar usage)
                        if (session.provider_token) {
                            localStorage.setItem("google_provider_token", session.provider_token);
                            console.log("✅ [Settings] Google Token persisted via AuthGuard.");
                        }
                        setFormData((prev)=>({
                                ...prev,
                                email: profileData.user.email || fullProfile?.email || "",
                                user_name: fullProfile?.user_name || profileData.user.displayName || "",
                                contact_no: fullProfile?.contact_no || profileData.user.phone || "",
                                employee_id: fullProfile?.employee_id || profileData.user.employeeId || "",
                                role: fullProfile?.role || profileData.user.role || "",
                                father_name: fullProfile?.father_name || "",
                                gender: fullProfile?.gender || "",
                                date_of_birth: fullProfile?.date_of_birth || "",
                                blood_group: fullProfile?.blood_group || "",
                                alternate_contact: fullProfile?.alternate_contact || "",
                                emergency_contact_no: fullProfile?.emergency_contact_no || "",
                                date_of_joining: fullProfile?.date_of_joining || "",
                                in_hand_salary: fullProfile?.in_hand_salary?.toString() || "",
                                is_client: String(fullProfile?.is_client || "false"),
                                joined_at: fullProfile?.joined_at?.split('T')[0] || "",
                                renewal_at: fullProfile?.renewal_at?.split('T')[0] || "",
                                expire_at: fullProfile?.expire_at?.split('T')[0] || "",
                                primary_address: fullProfile?.primary_address || "",
                                area_pincode: fullProfile?.area_pincode || "",
                                pan_number: fullProfile?.pan_number || "",
                                aadhar_card_no: fullProfile?.aadhar_card_no || "",
                                bank_name: fullProfile?.bank_name || "",
                                account_holder_name: fullProfile?.account_holder_name || "",
                                account_number: fullProfile?.account_number || "",
                                ifsc_code: fullProfile?.ifsc_code || "",
                                branch_city: fullProfile?.branch_city || "",
                                branch_state: fullProfile?.branch_state || "",
                                branch_pincode: fullProfile?.branch_pincode || "",
                                profile_pic_url: fullProfile?.profile_pic_url || "",
                                pancard_url: fullProfile?.pancard_url || "",
                                aadhar_front_url: fullProfile?.aadhar_front_url || "",
                                aadhar_back_url: fullProfile?.aadhar_back_url || "",
                                qualification_marksheet_url: fullProfile?.qualification_marksheet_url || "",
                                bank_passbook_url: fullProfile?.bank_passbook_url || ""
                            }));
                    }
                } catch (err) {
                    console.error(err);
                }
            }
        };
        if (mounted && user) fetchProfileData();
    }, [
        mounted,
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        if (activeTab === "security" && user) fetchActiveSessions();
    }, [
        activeTab,
        user
    ]);
    const handleInputChange = (e)=>{
        const { id, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [id]: value
            }));
    };
    const handleFileUpload = async (fieldName, fileUrl)=>{
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    [fieldName]: fileUrl
                })
            });
            setFormData((prev)=>({
                    ...prev,
                    [fieldName]: fileUrl
                }));
        } catch (error) {
            console.error(error);
        }
    };
    const handleSaveChanges = async ()=>{
        setIsSaving(true);
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("Authentication required", "Error");
                return;
            }
            console.log("📤 [Settings] Saving changes to profile...", formData);
            const res = await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify(formData)
            });
            const result = await res.json();
            if (res.ok) {
                console.log("✅ [Settings] Profile update successful:", result);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showSuccess"])("Profile saved", "Success");
            } else {
                console.error("❌ [Settings] Profile update failed:", result);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("Failed to save", "Error");
            }
        } catch (error) {
            console.error("❌ [Settings] Connection error while saving:", error);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("An error occurred", "Error");
        } finally{
            setIsSaving(false);
        }
    };
    const fetchActiveSessions = async ()=>{
        setIsLoadingSessions(true);
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            const res = await fetch("/api/auth/active-sessions", {
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });
            const data = await res.json();
            if (data.success) {
                console.log("📱 [Settings] Fetched Active Sessions:", data.sessions);
                setActiveSessions(data.sessions);
            }
        } catch (error) {
            console.error(error);
        } finally{
            setIsLoadingSessions(false);
        }
    };
    const handleUpdateAuthField = async (field)=>{
        if (!window.confirm(`Are you sure you want to update your ${field.replace('_', ' ')}?`)) return;
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("Authentication required", "Error");
                return;
            }
            const res = await fetch("/api/auth/update-account-info", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    field,
                    value: formData[field]
                })
            });
            const data = await res.json();
            if (data.success) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showSuccess"])(`${field.replace('_', ' ')} updated successfully`, "Success");
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(data.error || "Update failed", "Error");
            }
        } catch (e) {
            console.error(e);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(e.message || "Failed to update", "Error");
        }
    };
    const handleRevokeSession = async (sessionId)=>{
        if (!window.confirm("Are you sure you want to revoke this session?")) return;
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) return;
            const res = await fetch("/api/auth/revoke-session", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    session_id: sessionId
                })
            });
            const data = await res.json();
            if (data.success) {
                // 1. Remove from Multi-Account Storage (local storage)
                const { removeAccount } = await __turbopack_context__.A("[project]/lib/sessionManager.ts [ssr] (ecmascript, async loader)");
                if (data.revoked_token_id) {
                    removeAccount(data.revoked_token_id);
                    console.log(`🗑️ [Settings] Removed session ${data.revoked_token_id} from local storage`);
                    // 2. Refresh UI
                    if (data.revoked_token_id === currentTokenId) {
                        router.push('/login');
                        return;
                    }
                }
                fetchActiveSessions();
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showSuccess"])("Session revoked successfully", "Success");
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(data.error || "Failed to revoke session", "Error");
            }
        } catch (error) {
            console.error(error);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("An error occurred", "Error");
        }
    };
    const calculateProfileCompletion = ()=>{
        const fields = [
            "user_name",
            "contact_no",
            "father_name",
            "gender",
            "date_of_birth",
            "blood_group",
            "primary_address",
            "pan_number",
            "aadhar_card_no",
            "bank_name",
            "account_number",
            "ifsc_code"
        ];
        let filled = 0;
        fields.forEach((f)=>{
            if (formData[f]?.toString().trim()) filled++;
        });
        return Math.round(filled / fields.length * 100);
    };
    const profileCompletion = calculateProfileCompletion();
    const formatTimeAgo = (dateString)=>{
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        if (diffMins < 1) return "Active now";
        if (diffMins < 60) return `${diffMins}m ago`;
        const diffHours = Math.floor(diffMins / 60);
        if (diffHours < 24) return `${diffHours}h ago`;
        return date.toLocaleDateString();
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "container mx-auto px-3 sm:px-4 md:px-6 py-4 space-y-6 pb-24 max-w-7xl",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col md:flex-row md:items-center justify-between gap-6",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                    className: "text-xl sm:text-3xl font-bold text-[#263238] font-poppins",
                                    children: "Settings"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 404,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-[#787E9D]",
                                    children: "Manage your account and preferences"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 405,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/pages/portal/settings.tsx",
                            lineNumber: 403,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/settings.tsx",
                        lineNumber: 402,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "flex flex-col lg:flex-row lg:items-center justify-between gap-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "inline-flex h-12 items-center rounded-xl p-1 bg-white border overflow-x-auto no-scrollbar",
                                style: {
                                    borderColor: "#E0E0E0"
                                },
                                children: [
                                    {
                                        id: "profile",
                                        label: "Profile",
                                        icon: "fi-rr-user"
                                    },
                                    {
                                        id: "security",
                                        label: "Security",
                                        icon: "fi-rr-lock"
                                    },
                                    {
                                        id: "devices",
                                        label: "Devices",
                                        icon: "fi-rr-devices"
                                    },
                                    {
                                        id: "integrations",
                                        label: "Integrations",
                                        icon: "fi-rr-apps"
                                    },
                                    {
                                        id: "flutter_bridge",
                                        label: "Bridge",
                                        icon: "fi-rr-smartphone"
                                    },
                                    {
                                        id: "console_logs",
                                        label: "Logs",
                                        icon: "fi-rr-journal"
                                    }
                                ].map((tab)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setActiveTab(tab.id),
                                        className: `flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-[#4b33e8] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`,
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `fi ${tab.icon} flex text-xs`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 429,
                                                columnNumber: 17
                                            }, this),
                                            tab.label
                                        ]
                                    }, tab.id, true, {
                                        fileName: "[project]/pages/portal/settings.tsx",
                                        lineNumber: 422,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 413,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "bg-white border rounded-2xl p-3 flex items-center gap-4 min-w-[200px]",
                                style: {
                                    borderColor: "#E0E0E0"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex-1",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "flex justify-between items-center mb-1",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-[10px] font-bold text-gray-400 uppercase",
                                                        children: "Profile Strength"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                        lineNumber: 439,
                                                        columnNumber: 17
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-bold text-[#4b33e8]",
                                                        children: [
                                                            profileCompletion,
                                                            "%"
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                        lineNumber: 440,
                                                        columnNumber: 17
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 438,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "h-1.5 w-full bg-gray-100 rounded-full overflow-hidden",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "h-full bg-[#4b33e8] transition-all duration-1000",
                                                    style: {
                                                        width: `${profileCompletion}%`
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                    lineNumber: 443,
                                                    columnNumber: 17
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 442,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/settings.tsx",
                                        lineNumber: 437,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "w-8 h-8 rounded-lg bg-[#4b33e8] flex items-center justify-center text-white",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                            className: "fi fi-rr-badge-check text-sm"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/settings.tsx",
                                            lineNumber: 450,
                                            columnNumber: 15
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/settings.tsx",
                                        lineNumber: 449,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 436,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/settings.tsx",
                        lineNumber: 412,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "min-h-[500px]",
                        children: [
                            activeTab === "profile" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "flex overflow-x-auto gap-2 pb-2 no-scrollbar",
                                        children: [
                                            {
                                                id: "basic_info",
                                                label: "Basic",
                                                icon: "fi-rr-user"
                                            },
                                            {
                                                id: "personal_info",
                                                label: "Personal",
                                                icon: "fi-rr-info"
                                            },
                                            {
                                                id: "employment_info",
                                                label: "Employment",
                                                icon: "fi-rr-briefcase"
                                            },
                                            {
                                                id: "client_lifecycle",
                                                label: "Lifecycle",
                                                icon: "fi-rr-refresh"
                                            },
                                            {
                                                id: "address_info",
                                                label: "Address",
                                                icon: "fi-rr-map-marker"
                                            },
                                            {
                                                id: "kyc_info",
                                                label: "KYC",
                                                icon: "fi-rr-shield-check"
                                            },
                                            {
                                                id: "bank_info",
                                                label: "Bank",
                                                icon: "fi-rr-credit-card"
                                            },
                                            {
                                                id: "documents",
                                                label: "Files",
                                                icon: "fi-rr-file"
                                            }
                                        ].filter((cat)=>{
                                            if (cat.id === "client_lifecycle") {
                                                return user?.isClient === false && user?.role === "super_admin" && (user?.designation?.toLowerCase() === "ceo" || user?.designation?.toLowerCase() === "developer");
                                            }
                                            return true;
                                        }).map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                onClick: ()=>setActiveCategory(cat.id),
                                                className: `flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${activeCategory === cat.id ? "bg-[#4b33e8] text-white" : "bg-white border border-gray-100 text-gray-500 hover:border-[#4b33e8]"}`,
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: `fi ${cat.icon} flex`
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                        lineNumber: 488,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                        className: activeCategory === cat.id ? "inline" : "hidden sm:inline",
                                                        children: cat.label
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                        lineNumber: 489,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, cat.id, true, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 481,
                                                columnNumber: 19
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/settings.tsx",
                                        lineNumber: 460,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                        className: "bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8",
                                        style: {
                                            borderColor: "#E0E0E0"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                                className: "text-lg font-bold mb-6 text-[#263238] flex items-center gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                        className: "fi fi-rr-edit text-[#4b33e8] text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                        lineNumber: 497,
                                                        columnNumber: 19
                                                    }, this),
                                                    activeCategory.replace("_", " ").toUpperCase()
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 496,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                                formData: formData,
                                                handleInputChange: handleInputChange,
                                                category: activeCategory === "client_lifecycle" && !(user?.isClient === false && user?.role === "super_admin" && (user?.designation?.toLowerCase() === "ceo" || user?.designation?.toLowerCase() === "developer")) ? "basic_info" : activeCategory,
                                                onFileUpload: handleFileUpload
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 501,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "mt-8 pt-6 border-t flex justify-end",
                                                style: {
                                                    borderColor: "#F1F1F1"
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                    onClick: handleSaveChanges,
                                                    disabled: isSaving,
                                                    className: "w-full sm:w-auto px-10 py-3 bg-[#4b33e8] text-white rounded-xl text-sm font-bold shadow-lg shadow-[#4b33e8]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50",
                                                    children: isSaving ? "Saving..." : "Save Changes"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                    lineNumber: 519,
                                                    columnNumber: 19
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 518,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/settings.tsx",
                                        lineNumber: 495,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 458,
                                columnNumber: 13
                            }, this),
                            activeTab === "security" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8",
                                    style: {
                                        borderColor: "#E0E0E0"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold mb-8 text-[#263238]",
                                            children: "Security Center"
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/settings.tsx",
                                            lineNumber: 534,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 lg:grid-cols-2 gap-10",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-8",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                    children: "Update Password"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 542,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "space-y-3",
                                                                    children: [
                                                                        [
                                                                            "Current",
                                                                            "New",
                                                                            "Confirm"
                                                                        ].map((p)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                className: "space-y-1.5",
                                                                                children: [
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("label", {
                                                                                        className: "text-xs font-bold text-gray-600",
                                                                                        children: [
                                                                                            p,
                                                                                            " Password"
                                                                                        ]
                                                                                    }, void 0, true, {
                                                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                                                        lineNumber: 546,
                                                                                        columnNumber: 29
                                                                                    }, this),
                                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                        type: "password",
                                                                                        className: "w-full h-11 px-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm",
                                                                                        placeholder: `Enter ${p.toLowerCase()} password`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                                                        lineNumber: 547,
                                                                                        columnNumber: 29
                                                                                    }, this)
                                                                                ]
                                                                            }, p, true, {
                                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                                lineNumber: 545,
                                                                                columnNumber: 27
                                                                            }, this)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            className: "w-full py-3 bg-gray-900 text-white rounded-xl text-xs font-bold hover:bg-black transition-all shadow-lg shadow-gray-200",
                                                                            children: "Change Password"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 554,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 543,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 541,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "h-px bg-gray-100"
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 560,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                    children: "Display Name"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 564,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "relative flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-user absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 567,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    value: formData.user_name,
                                                                                    onChange: (e)=>setFormData({
                                                                                            ...formData,
                                                                                            user_name: e.target.value
                                                                                        }),
                                                                                    className: "w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm font-bold text-slate-700",
                                                                                    placeholder: "Display Name"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 568,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 566,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleUpdateAuthField('user_name'),
                                                                            className: "px-6 bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#4b33e8]/20",
                                                                            children: "Update"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 576,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 565,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 563,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                    children: "Email Address"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 587,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "relative flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 590,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "email",
                                                                                    value: formData.email,
                                                                                    onChange: (e)=>setFormData({
                                                                                            ...formData,
                                                                                            email: e.target.value
                                                                                        }),
                                                                                    className: "w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm font-bold text-slate-700",
                                                                                    placeholder: "Email Address"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 591,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 589,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleUpdateAuthField('email'),
                                                                            className: "px-6 bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#4b33e8]/20",
                                                                            children: "Update"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 599,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 588,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 586,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                    children: "Phone Number"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 610,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "relative flex-1",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                    className: "fi fi-rr-smartphone absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 613,
                                                                                    columnNumber: 33
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("input", {
                                                                                    type: "text",
                                                                                    value: formData.contact_no,
                                                                                    onChange: (e)=>setFormData({
                                                                                            ...formData,
                                                                                            contact_no: e.target.value
                                                                                        }),
                                                                                    className: "w-full h-11 pl-10 pr-4 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-[#4b33e8]/20 outline-none text-sm font-bold text-slate-700",
                                                                                    placeholder: "Phone Number"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 614,
                                                                                    columnNumber: 33
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 612,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleUpdateAuthField('contact_no'),
                                                                            className: "px-6 bg-[#4b33e8]/10 text-[#4b33e8] hover:bg-[#4b33e8] hover:text-white rounded-xl text-xs font-bold transition-all border border-[#4b33e8]/20",
                                                                            children: "Update"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 622,
                                                                            columnNumber: 29
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 611,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 609,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                    lineNumber: 539,
                                                    columnNumber: 19
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h4", {
                                                                    className: "text-xs font-bold text-gray-400 uppercase tracking-widest",
                                                                    children: "Active Sessions"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 634,
                                                                    columnNumber: 23
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-2",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: fetchActiveSessions,
                                                                            disabled: isLoadingSessions,
                                                                            className: "p-1.5 bg-gray-50 text-gray-400 hover:text-[#4b33e8] hover:bg-[#4b33e8]/5 rounded-lg transition-all border border-gray-100 disabled:opacity-50",
                                                                            title: "Refresh Sessions",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: `fi fi-rr-refresh flex text-[10px] ${isLoadingSessions ? 'animate-spin' : ''}`
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                                lineNumber: 642,
                                                                                columnNumber: 27
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 636,
                                                                            columnNumber: 25
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: "px-2 py-0.5 bg-gray-100 text-gray-500 text-[10px] font-bold rounded-full border border-gray-200",
                                                                            children: [
                                                                                activeSessions.length,
                                                                                " ",
                                                                                activeSessions.length === 1 ? 'Session' : 'Sessions'
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 644,
                                                                            columnNumber: 25
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 635,
                                                                    columnNumber: 23
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 633,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3",
                                                            children: isLoadingSessions ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-col items-center justify-center py-10 gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: "w-6 h-6 border-2 border-[#4b33e8]/30 border-t-[#4b33e8] rounded-full animate-spin"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                                        lineNumber: 654,
                                                                        columnNumber: 27
                                                                    }, this),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                        className: "text-[10px] font-bold text-gray-400",
                                                                        children: "Loading sessions..."
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                                        lineNumber: 655,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                lineNumber: 653,
                                                                columnNumber: 25
                                                            }, this) : activeSessions.length > 0 ? activeSessions.map((s)=>{
                                                                const isCurrentSession = s.token_id === currentTokenId;
                                                                const sessionId = s.id || s.token_id;
                                                                console.log(`Debug Session ${sessionId}: type=${s.device_type}`);
                                                                return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: `p-4 rounded-2xl flex items-center justify-between border transition-all ${isCurrentSession ? 'bg-[#4b33e8]/5 border-[#4b33e8] ring-1 ring-[#4b33e8]/20' : 'bg-gray-50 border-gray-100'}`,
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "flex items-center gap-3",
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    className: `w-9 h-9 rounded-xl flex items-center justify-center border transition-colors ${s.is_active ? 'bg-green-50 text-green-600 border-green-200' : isCurrentSession ? 'bg-[#4b33e8]/5 text-[#4b33e8] border-[#4b33e8]/20' : 'bg-white text-gray-400 border-gray-100'}`,
                                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                        className: `fi flex text-xl ${s.device_type?.toLowerCase() === 'mobile' ? 'fi-rr-smartphone' : 'fi-rr-laptop'}`
                                                                                    }, void 0, false, {
                                                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                                                        lineNumber: 680,
                                                                                        columnNumber: 33
                                                                                    }, this)
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 675,
                                                                                    columnNumber: 31
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                    children: [
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                            className: "flex items-center gap-2",
                                                                                            children: [
                                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                                    className: "text-xs font-bold text-[#263238]",
                                                                                                    children: s.device_name || "Device"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                                    lineNumber: 689,
                                                                                                    columnNumber: 35
                                                                                                }, this),
                                                                                                isCurrentSession && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                                                    className: "px-1.5 py-0.5 bg-[#4b33e8] text-white text-[8px] font-bold rounded-md uppercase tracking-wider",
                                                                                                    children: "Current"
                                                                                                }, void 0, false, {
                                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                                    lineNumber: 691,
                                                                                                    columnNumber: 37
                                                                                                }, this),
                                                                                                (()=>{
                                                                                                    const lastSeen = new Date(s.last_accessed_at).getTime();
                                                                                                    const diffSeconds = (Date.now() - lastSeen) / 1000;
                                                                                                    let dotColor = "bg-gray-300"; // Offline (> 3 min)
                                                                                                    let statusText = "Offline";
                                                                                                    if (diffSeconds < 60) {
                                                                                                        dotColor = "bg-green-500"; // Online (< 1 min)
                                                                                                        statusText = "Online";
                                                                                                    } else if (diffSeconds < 180) {
                                                                                                        dotColor = "bg-yellow-400"; // Recently (< 3 min)
                                                                                                        statusText = "Recently Online";
                                                                                                    }
                                                                                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                        className: "group relative flex items-center",
                                                                                                        children: [
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: `w-2 h-2 rounded-full ${dotColor} relative`
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                                                                lineNumber: 712,
                                                                                                                columnNumber: 45
                                                                                                            }, this),
                                                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                                                                className: "absolute left-4 opacity-0 group-hover:opacity-100 transition-opacity bg-black text-white text-[9px] px-2 py-1 rounded pointer-events-none whitespace-nowrap z-10",
                                                                                                                children: statusText
                                                                                                            }, void 0, false, {
                                                                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                                                                lineNumber: 713,
                                                                                                                columnNumber: 45
                                                                                                            }, this)
                                                                                                        ]
                                                                                                    }, void 0, true, {
                                                                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                                                                        lineNumber: 711,
                                                                                                        columnNumber: 41
                                                                                                    }, this);
                                                                                                })()
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                                            lineNumber: 688,
                                                                                            columnNumber: 33
                                                                                        }, this),
                                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                            className: "text-[10px] text-gray-400",
                                                                                            children: [
                                                                                                s.location || "Unknown",
                                                                                                " • ",
                                                                                                formatTimeAgo(s.last_accessed_at)
                                                                                            ]
                                                                                        }, void 0, true, {
                                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                                            lineNumber: 721,
                                                                                            columnNumber: 33
                                                                                        }, this)
                                                                                    ]
                                                                                }, void 0, true, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 687,
                                                                                    columnNumber: 31
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 674,
                                                                            columnNumber: 29
                                                                        }, this),
                                                                        !isCurrentSession && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                                                            onClick: ()=>handleRevokeSession(sessionId),
                                                                            className: "px-3 py-1.5 bg-red-50 text-red-600 hover:bg-red-500 hover:text-white rounded-lg text-[10px] font-bold transition-all border border-red-100",
                                                                            children: "Revoke"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 727,
                                                                            columnNumber: 31
                                                                        }, this)
                                                                    ]
                                                                }, sessionId, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 663,
                                                                    columnNumber: 27
                                                                }, this);
                                                            }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                className: "text-center py-10 text-gray-400 text-xs",
                                                                children: "No active sessions found"
                                                            }, void 0, false, {
                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                lineNumber: 739,
                                                                columnNumber: 25
                                                            }, this)
                                                        }, void 0, false, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 651,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                    lineNumber: 632,
                                                    columnNumber: 19
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/settings.tsx",
                                            lineNumber: 536,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 533,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 532,
                                columnNumber: 13
                            }, this),
                            activeTab === "flutter_bridge" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "animate-in fade-in slide-in-from-bottom-2 duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$FlutterBridgeTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 751,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 750,
                                columnNumber: 13
                            }, this),
                            activeTab === "devices" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "animate-in fade-in slide-in-from-bottom-2 duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$DevicesTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    employeeId: user?.employeeId
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 757,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 756,
                                columnNumber: 13
                            }, this),
                            activeTab === "integrations" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 sm:p-8",
                                    style: {
                                        borderColor: "#E0E0E0"
                                    },
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                            className: "text-lg font-bold mb-8 text-[#263238] flex items-center gap-2",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                    className: "fi fi-rr-apps text-[#4b33e8] text-sm"
                                                }, void 0, false, {
                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                    lineNumber: 765,
                                                    columnNumber: 19
                                                }, this),
                                                "Connected Apps"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/pages/portal/settings.tsx",
                                            lineNumber: 764,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                            className: "grid grid-cols-1 md:grid-cols-2 gap-6",
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                className: "bg-white rounded-[2rem] border border-gray-100 shadow-sm p-6 group transition-all hover:shadow-xl hover:shadow-indigo-500/5",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                    className: "space-y-4",
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: "w-10 h-10 bg-white rounded-full flex items-center justify-center border border-gray-100 shadow-sm transform group-hover:-rotate-6 transition-transform",
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi fi-brands-google text-lg flex text-indigo-600"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                                lineNumber: 777,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 776,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            children: [
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-sm font-bold text-gray-900",
                                                                                    children: "Google Calendar"
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 780,
                                                                                    columnNumber: 29
                                                                                }, this),
                                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                                                                    className: "text-[10px] text-gray-500 font-medium",
                                                                                    children: user?.googleCalendarConnected ? `Connected as ${user.email || 'team@rynxly.in'}` : 'Sync reminders & schedules'
                                                                                }, void 0, false, {
                                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                                    lineNumber: 781,
                                                                                    columnNumber: 29
                                                                                }, this)
                                                                            ]
                                                                        }, void 0, true, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 779,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 775,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    onClick: async ()=>{
                                                                        if (user?.googleCalendarConnected) {
                                                                            if (!confirm("Are you sure you want to disconnect Google Calendar?")) return;
                                                                            try {
                                                                                setLoading(true); // Optional: show loading state if you have one available here
                                                                                // 1. Check if unlinking is possible/needed
                                                                                const { data: { user: currentUser }, error: userError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getUser();
                                                                                if (userError) throw userError;
                                                                                let googleIdentity = currentUser?.identities?.find((id)=>id.provider === 'google');
                                                                                if (googleIdentity) {
                                                                                    // Check if this is the only identity (prevent lockout)
                                                                                    if ((currentUser?.identities?.length || 0) <= 1) {
                                                                                        throw new Error("You cannot disconnect Google as it is your only login method. Please set a password first in Security settings.");
                                                                                    }
                                                                                    // Attempt Unlink
                                                                                    const { error: unlinkError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.unlinkIdentity(googleIdentity);
                                                                                    if (unlinkError) throw unlinkError;
                                                                                    console.log("✅ [Settings] Google Identity unlinked.");
                                                                                    // CRITICAL: Refresh session to remove the identity from the JWT/Session state
                                                                                    await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.refreshSession();
                                                                                } else {
                                                                                    console.warn("⚠️ [Settings] No Google identity found to unlink. Proceeding to DB update.");
                                                                                }
                                                                                // 2. Update DB Profile
                                                                                await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').update({
                                                                                    google_calendar_connected: false,
                                                                                    google_calendar_skipped: false
                                                                                }).eq('user_id', user.uid);
                                                                                // 3. Clear Local State
                                                                                localStorage.removeItem("google_provider_token");
                                                                                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showSuccess"])("Google Calendar disconnected successfully.");
                                                                                setTimeout(()=>window.location.reload(), 1000);
                                                                            } catch (err) {
                                                                                console.error("Disconnect failed:", err);
                                                                                if (err.message?.includes("password") || err.message?.includes("only identity")) {
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("You must set a password or link another account before disconnecting Google.", "Cannot Disconnect");
                                                                                } else {
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(err.message || "Failed to disconnect.", "Disconnection Error");
                                                                                }
                                                                            } finally{
                                                                                setLoading(false);
                                                                            }
                                                                        } else {
                                                                            // Connect Logic
                                                                            const { data: { session: currentSession } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                                                                            if (currentSession) {
                                                                                sessionStorage.setItem('oauth_restore_user_id', currentSession.user.id);
                                                                                sessionStorage.setItem('oauth_restore_access_token', currentSession.access_token);
                                                                                sessionStorage.setItem('oauth_restore_refresh_token', currentSession.refresh_token);
                                                                            }
                                                                            const isMobile = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && !!window.flutter_inappwebview;
                                                                            // Use linkIdentity to attach Google to CURRENT user instead of logging in as new user
                                                                            const { data, error } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.linkIdentity({
                                                                                provider: 'google',
                                                                                options: {
                                                                                    queryParams: {
                                                                                        access_type: 'offline',
                                                                                        prompt: 'consent'
                                                                                    },
                                                                                    scopes: 'https://www.googleapis.com/auth/calendar.events',
                                                                                    redirectTo: `${window.location.origin}/settings`,
                                                                                    skipBrowserRedirect: isMobile
                                                                                }
                                                                            });
                                                                            if (error) {
                                                                                if (error.message.includes("Manual linking is disabled")) {
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("Please go to Supabase > Authentication > Providers > Google and enable 'Manual Linking' (or in Settings > Security).", "Configuration Required");
                                                                                } else {
                                                                                    (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(error.message, "Connection Error");
                                                                                }
                                                                                return;
                                                                            }
                                                                            if (isMobile && data?.url) //TURBOPACK unreachable
                                                                            ;
                                                                        }
                                                                    },
                                                                    className: `w-10 h-6 rounded-full relative cursor-pointer transition-all duration-300 ${user?.googleCalendarConnected ? 'bg-green-500' : 'bg-gray-200'}`,
                                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                        className: `absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all duration-300 ${user?.googleCalendarConnected ? 'right-1' : 'left-1'}`
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/pages/portal/settings.tsx",
                                                                        lineNumber: 881,
                                                                        columnNumber: 27
                                                                    }, this)
                                                                }, void 0, false, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 790,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 774,
                                                            columnNumber: 23
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                            className: "space-y-3 pl-2",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: `w-5 h-5 rounded flex items-center justify-center text-white text-[10px] transition-all ${user?.googleCalendarConnected ? 'bg-[#4b33e8]' : 'bg-gray-200'}`,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi fi-rr-check flex"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                                lineNumber: 889,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 888,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: `text-sm font-medium ${user?.googleCalendarConnected ? 'text-gray-600' : 'text-gray-400'}`,
                                                                            children: "Sync Call Schedules"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 891,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 887,
                                                                    columnNumber: 25
                                                                }, this),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                    className: "flex items-center gap-3",
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                                                            className: `w-5 h-5 rounded flex items-center justify-center text-white text-[10px] transition-all ${user?.googleCalendarConnected ? 'bg-[#4b33e8]' : 'bg-gray-200'}`,
                                                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                                                className: "fi fi-rr-check flex"
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/pages/portal/settings.tsx",
                                                                                lineNumber: 895,
                                                                                columnNumber: 29
                                                                            }, this)
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 894,
                                                                            columnNumber: 27
                                                                        }, this),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                                            className: `text-sm font-medium ${user?.googleCalendarConnected ? 'text-gray-600' : 'text-gray-400'}`,
                                                                            children: "Sync Reminders"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                                            lineNumber: 897,
                                                                            columnNumber: 27
                                                                        }, this)
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                                    lineNumber: 893,
                                                                    columnNumber: 25
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/pages/portal/settings.tsx",
                                                            lineNumber: 886,
                                                            columnNumber: 23
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/pages/portal/settings.tsx",
                                                    lineNumber: 772,
                                                    columnNumber: 21
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/settings.tsx",
                                                lineNumber: 771,
                                                columnNumber: 19
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/pages/portal/settings.tsx",
                                            lineNumber: 769,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 763,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 762,
                                columnNumber: 13
                            }, this),
                            activeTab === "console_logs" && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "animate-in fade-in slide-in-from-bottom-2 duration-300",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$settings$2f$ConsoleLogsTab$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {}, void 0, false, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 909,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 908,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/settings.tsx",
                        lineNumber: 456,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/settings.tsx",
                lineNumber: 400,
                columnNumber: 7
            }, this),
            showIdentityErrorPopup && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                    className: "bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "p-6 text-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                    className: "fi fi-rr-cross-circle text-3xl text-red-500 flex"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/settings.tsx",
                                    lineNumber: 920,
                                    columnNumber: 17
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 919,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                className: "text-xl font-bold text-gray-900 mb-2",
                                children: "Account Already Linked"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 923,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-600 mb-6 leading-relaxed",
                                children: [
                                    "This Google account is already connected to another user.",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/pages/portal/settings.tsx",
                                        lineNumber: 927,
                                        columnNumber: 17
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("br", {}, void 0, false, {
                                        fileName: "[project]/pages/portal/settings.tsx",
                                        lineNumber: 927,
                                        columnNumber: 22
                                    }, this),
                                    "Please use a different Google account or log in with the existing account associated with this email."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 925,
                                columnNumber: 15
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowIdentityErrorPopup(false),
                                className: "w-full py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 transition-all active:scale-95",
                                children: "Okay, I understand"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/settings.tsx",
                                lineNumber: 931,
                                columnNumber: 15
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/settings.tsx",
                        lineNumber: 918,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/pages/portal/settings.tsx",
                    lineNumber: 917,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/pages/portal/settings.tsx",
                lineNumber: 916,
                columnNumber: 9
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

//# sourceMappingURL=%5Broot-of-the-server%5D__9a6c737c._.js.map