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
"[project]/pages/portal/profile-completion.tsx [ssr] (ecmascript)", ((__turbopack_context__) => {
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
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/components/AppLayout.tsx [ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/context/UserContext.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/dialogUtils.ts [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/SettingsFormFields.tsx [ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/AppLogo.tsx [ssr] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__,
    __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__
]);
[__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLayout$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__, __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
;
;
;
function ProfileCompletion() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$router$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    const { user, mounted: authMounted } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$context$2f$UserContext$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["useUser"])();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    const [activeCategory, setActiveCategory] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])("basic_info");
    // Form state - organized by categories
    const [formData, setFormData] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])({
        // basic_info
        email: "",
        user_name: "",
        contact_no: "",
        employee_id: "",
        role: "",
        // personal_info
        father_name: "",
        gender: "",
        date_of_birth: "",
        blood_group: "",
        alternate_contact: "",
        emergency_contact_no: "",
        // employment_info
        date_of_joining: "",
        in_hand_salary: "",
        // address_info
        primary_address: "",
        area_pincode: "",
        // kyc_info
        pan_number: "",
        aadhar_card_no: "",
        // bank_info
        bank_name: "",
        account_holder_name: "",
        account_number: "",
        ifsc_code: "",
        branch_city: "",
        branch_state: "",
        branch_pincode: "",
        // documents (URLs - handled separately)
        profile_pic_url: "",
        pancard_url: "",
        aadhar_front_url: "",
        aadhar_back_url: "",
        qualification_marksheet_url: "",
        bank_passbook_url: ""
    });
    const [isSaving, setIsSaving] = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        const fetchProfile = async ()=>{
            if (!authMounted || !user) return;
            // Fetch full profile data from API
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (session) {
                try {
                    const profileResponse = await fetch("/api/auth/user-profile", {
                        headers: {
                            Authorization: `Bearer ${session.access_token}`
                        }
                    });
                    const profileData = await profileResponse.json();
                    if (profileData.success && profileData.user) {
                        // Fetch all fields directly from user_profiles
                        const { data: fullProfile } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].from('user_profiles').select('*').eq('user_id', user.uid).maybeSingle();
                        // Format dates for input fields (YYYY-MM-DD format) - client-only, fixed format
                        const formatDateForInput = (dateString)=>{
                            if ("TURBOPACK compile-time truthy", 1) return "";
                            //TURBOPACK unreachable
                            ;
                        };
                        setFormData({
                            // basic_info
                            email: String(profileData.user.email || fullProfile?.email || ""),
                            user_name: String(fullProfile?.user_name || profileData.user.displayName || ""),
                            contact_no: String(fullProfile?.contact_no || profileData.user.phone || ""),
                            employee_id: String(fullProfile?.employee_id || profileData.user.employeeId || ""),
                            role: String(fullProfile?.role || profileData.user.role || ""),
                            // personal_info
                            father_name: String(fullProfile?.father_name || ""),
                            gender: String(fullProfile?.gender || ""),
                            date_of_birth: formatDateForInput(fullProfile?.date_of_birth),
                            blood_group: String(fullProfile?.blood_group || ""),
                            alternate_contact: String(fullProfile?.alternate_contact || ""),
                            emergency_contact_no: String(fullProfile?.emergency_contact_no || ""),
                            // employment_info
                            date_of_joining: formatDateForInput(fullProfile?.date_of_joining),
                            in_hand_salary: String(fullProfile?.in_hand_salary || ""),
                            // address_info
                            primary_address: String(fullProfile?.primary_address || ""),
                            area_pincode: String(fullProfile?.area_pincode || ""),
                            // kyc_info
                            pan_number: String(fullProfile?.pan_number || ""),
                            aadhar_card_no: String(fullProfile?.aadhar_card_no || ""),
                            // bank_info
                            bank_name: String(fullProfile?.bank_name || ""),
                            account_holder_name: String(fullProfile?.account_holder_name || ""),
                            account_number: String(fullProfile?.account_number || ""),
                            ifsc_code: String(fullProfile?.ifsc_code || ""),
                            branch_city: String(fullProfile?.branch_city || ""),
                            branch_state: String(fullProfile?.branch_state || ""),
                            branch_pincode: String(fullProfile?.branch_pincode || ""),
                            // documents
                            profile_pic_url: String(fullProfile?.profile_pic_url || ""),
                            pancard_url: String(fullProfile?.pancard_url || ""),
                            aadhar_front_url: String(fullProfile?.aadhar_front_url || ""),
                            aadhar_back_url: String(fullProfile?.aadhar_back_url || ""),
                            qualification_marksheet_url: String(fullProfile?.qualification_marksheet_url || ""),
                            bank_passbook_url: String(fullProfile?.bank_passbook_url || "")
                        });
                        // Check if profile is already complete, redirect if so
                        if (fullProfile?.profile_complete) {
                            router.push("/pending");
                            return;
                        }
                    }
                } catch (err) {
                    console.error('Error fetching profile:', err);
                    // Fallback to basic data - ensure all values are strings
                    setFormData((prev)=>({
                            ...prev,
                            email: String(user.email || ""),
                            user_name: String(user.displayName || ""),
                            contact_no: String(user.phone || ""),
                            employee_id: String(user.employeeId || ""),
                            role: String(user.role || "")
                        }));
                }
            }
        };
        fetchProfile();
    }, [
        authMounted,
        user,
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react__$5b$external$5d$__$28$react$2c$__cjs$29$__["useEffect"])(()=>{
        setMounted(true);
    }, []);
    const handleInputChange = (e)=>{
        const { id, value } = e.target;
        setFormData((prev)=>({
                ...prev,
                [id]: value
            }));
    };
    const handleFileUpload = async (fieldName, fileUrl)=>{
        // Update form data immediately
        setFormData((prev)=>({
                ...prev,
                [fieldName]: fileUrl
            }));
        // Immediately save to database
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("You must be logged in to save changes", "Authentication Error");
                return;
            }
            // Update only the specific field in database
            const response = await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    [fieldName]: fileUrl
                })
            });
            const data = await response.json();
            if (!response.ok) {
                console.error('Failed to save file URL:', data.error);
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(data.error || "Failed to save file URL", "Error");
                // Revert form data on error
                setFormData((prev)=>({
                        ...prev,
                        [fieldName]: ""
                    }));
            } else {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showSuccess"])(`${fieldName.replace('_', ' ')} uploaded and saved successfully!`, "Success");
            }
        } catch (error) {
            console.error('Error saving file URL:', error);
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(error.message || "An error occurred while saving", "Error");
            // Revert form data on error
            setFormData((prev)=>({
                    ...prev,
                    [fieldName]: ""
                }));
        }
    };
    const handleSaveAndComplete = async ()=>{
        // Validate required fields
        if (!formData.user_name || !formData.contact_no) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("Please fill in required fields: Full Name and Contact Number", "Validation Error");
            return;
        }
        setIsSaving(true);
        try {
            const { data: { session } } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
            if (!session) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])("You must be logged in to save changes", "Authentication Error");
                setIsSaving(false);
                return;
            }
            // Update profile with profile_complete flag
            const response = await fetch("/api/auth/update-profile", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`
                },
                body: JSON.stringify({
                    ...formData,
                    profile_complete: true
                })
            });
            const data = await response.json();
            if (!response.ok) {
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(data.error || "Failed to save changes", "Error");
                setIsSaving(false);
                return;
            }
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showSuccess"])("Profile completed successfully! Your application is now pending approval.", "Success");
            // Redirect to pending page after a short delay
            setTimeout(()=>{
                router.push("/pending");
            }, 1500);
        } catch (error) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$dialogUtils$2e$ts__$5b$ssr$5d$__$28$ecmascript$29$__["showError"])(error.message || "An error occurred while saving", "Error");
            setIsSaving(false);
        }
    };
    // Calculate profile completion percentage - only after mount to avoid hydration issues
    const calculateProfileCompletion = ()=>{
        if (!mounted) return 0; // Return 0 during SSR/initial render
        const fieldsToCheck = [
            {
                key: 'user_name',
                required: true
            },
            {
                key: 'contact_no',
                required: true
            },
            {
                key: 'father_name',
                required: false
            },
            {
                key: 'gender',
                required: false
            },
            {
                key: 'date_of_birth',
                required: false
            },
            {
                key: 'blood_group',
                required: false
            },
            {
                key: 'alternate_contact',
                required: false
            },
            {
                key: 'emergency_contact_no',
                required: false
            },
            {
                key: 'date_of_joining',
                required: false
            },
            {
                key: 'in_hand_salary',
                required: false
            },
            {
                key: 'primary_address',
                required: false
            },
            {
                key: 'area_pincode',
                required: false
            },
            {
                key: 'pan_number',
                required: false
            },
            {
                key: 'aadhar_card_no',
                required: false
            },
            {
                key: 'bank_name',
                required: false
            },
            {
                key: 'account_holder_name',
                required: false
            },
            {
                key: 'account_number',
                required: false
            },
            {
                key: 'ifsc_code',
                required: false
            },
            {
                key: 'branch_city',
                required: false
            },
            {
                key: 'branch_state',
                required: false
            },
            {
                key: 'branch_pincode',
                required: false
            }
        ];
        let filledCount = 0;
        const totalFields = fieldsToCheck.length;
        fieldsToCheck.forEach((field)=>{
            const value = formData[field.key];
            if (value && String(value).trim() !== '') {
                filledCount++;
            }
        });
        // Use Math.round for deterministic calculation
        return Math.round(filledCount / totalFields * 100);
    };
    if (!mounted || !authMounted || !user) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center",
            style: {
                backgroundColor: "#e7e3ff"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "text-center",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto mb-4"
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/profile-completion.tsx",
                        lineNumber: 305,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                        className: "text-gray-600",
                        style: {
                            fontFamily: "'Roboto', sans-serif"
                        },
                        children: "Loading profile..."
                    }, void 0, false, {
                        fileName: "[project]/pages/portal/profile-completion.tsx",
                        lineNumber: 306,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/profile-completion.tsx",
                lineNumber: 304,
                columnNumber: 9
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/profile-completion.tsx",
            lineNumber: 303,
            columnNumber: 7
        }, this);
    }
    // Calculate profile completion only after mount (client-side only)
    const profileCompletion = calculateProfileCompletion();
    const categories = [
        {
            id: "basic_info",
            label: "Basic Details",
            icon: "fi-rr-user"
        },
        {
            id: "personal_info",
            label: "Personal Info",
            icon: "fi-rr-id-card"
        },
        {
            id: "employment_info",
            label: "Employment",
            icon: "fi-rr-briefcase"
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
            label: "Bank Details",
            icon: "fi-rr-credit-card"
        },
        {
            id: "documents",
            label: "Documents",
            icon: "fi-rr-file"
        }
    ];
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["Fragment"], {
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
            className: "min-h-screen py-8",
            style: {
                backgroundColor: "#e7e3ff"
            },
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                className: "max-w-5xl mx-auto px-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "text-center mb-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "mb-6",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$AppLogo$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                    size: "default"
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/profile-completion.tsx",
                                    lineNumber: 332,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 331,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h1", {
                                className: "text-3xl sm:text-4xl font-bold mb-2",
                                style: {
                                    color: "#263238",
                                    fontFamily: "'Poppins', sans-serif"
                                },
                                children: "Complete Your Profile"
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 334,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-gray-600 max-w-2xl mx-auto",
                                style: {
                                    fontFamily: "'Roboto', sans-serif"
                                },
                                children: [
                                    "Please fill in your profile information to proceed. Required fields are marked with ",
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-red-500",
                                        children: "*"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 338,
                                        columnNumber: 97
                                    }, this),
                                    "."
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 337,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/profile-completion.tsx",
                        lineNumber: 330,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between mb-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h2", {
                                        className: "text-lg font-semibold",
                                        style: {
                                            color: "#263238",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: "Profile Completion"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 345,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                        className: "text-xl font-bold",
                                        style: {
                                            color: profileCompletion === 100 ? "#10B981" : profileCompletion >= 50 ? "#F59E0B" : "#EF4444",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: [
                                            profileCompletion,
                                            "%"
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 348,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 344,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "w-full h-3 rounded-full overflow-hidden bg-gray-200",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                    className: "h-full transition-all duration-300",
                                    style: {
                                        width: `${profileCompletion}%`,
                                        backgroundColor: profileCompletion === 100 ? "#10B981" : profileCompletion >= 50 ? "#F59E0B" : "#EF4444"
                                    }
                                }, void 0, false, {
                                    fileName: "[project]/pages/portal/profile-completion.tsx",
                                    lineNumber: 359,
                                    columnNumber: 15
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 358,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/profile-completion.tsx",
                        lineNumber: 343,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-lg border border-gray-100 p-6 mb-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap gap-2 mb-6 pb-4 border-b",
                                style: {
                                    borderColor: "#E0E0E0"
                                },
                                children: categories.map((category)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setActiveCategory(category.id),
                                        className: `inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === category.id ? "text-white" : "bg-gray-50 text-gray-700 hover:bg-gray-100"}`,
                                        style: {
                                            backgroundColor: activeCategory === category.id ? "#4b33e8" : undefined,
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("i", {
                                                className: `fi flex ${category.icon}`
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                                lineNumber: 388,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("span", {
                                                children: category.label
                                            }, void 0, false, {
                                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                                lineNumber: 389,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, category.id, true, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 372,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("h3", {
                                        className: "text-xl font-semibold mb-4",
                                        style: {
                                            color: "#263238",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: categories.find((c)=>c.id === activeCategory)?.label
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 396,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$SettingsFormFields$2e$tsx__$5b$ssr$5d$__$28$ecmascript$29$__["default"], {
                                        formData: formData,
                                        handleInputChange: handleInputChange,
                                        category: activeCategory,
                                        onFileUpload: handleFileUpload
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 395,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/profile-completion.tsx",
                        lineNumber: 370,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                        className: "bg-white rounded-xl shadow-lg border border-gray-100 p-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("div", {
                                className: "flex flex-col sm:flex-row gap-4 justify-end",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>router.push("/login"),
                                        className: "px-6 py-3 rounded-lg text-gray-700 font-medium transition hover:bg-gray-50",
                                        style: {
                                            fontFamily: "'Poppins', sans-serif",
                                            border: "1px solid #E0E0E0"
                                        },
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 413,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleSaveAndComplete,
                                        disabled: isSaving,
                                        className: "px-8 py-3 rounded-lg text-white font-medium transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed",
                                        style: {
                                            backgroundColor: "#4b33e8",
                                            fontFamily: "'Poppins', sans-serif"
                                        },
                                        children: isSaving ? "Saving..." : "Save & Complete Profile"
                                    }, void 0, false, {
                                        fileName: "[project]/pages/portal/profile-completion.tsx",
                                        lineNumber: 424,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 412,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$externals$5d2f$react$2f$jsx$2d$dev$2d$runtime__$5b$external$5d$__$28$react$2f$jsx$2d$dev$2d$runtime$2c$__cjs$29$__["jsxDEV"])("p", {
                                className: "text-sm text-gray-500 mt-4 text-center",
                                style: {
                                    fontFamily: "'Roboto', sans-serif"
                                },
                                children: "After completing your profile, your application will be submitted for approval."
                            }, void 0, false, {
                                fileName: "[project]/pages/portal/profile-completion.tsx",
                                lineNumber: 437,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/pages/portal/profile-completion.tsx",
                        lineNumber: 411,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/pages/portal/profile-completion.tsx",
                lineNumber: 328,
                columnNumber: 7
            }, this)
        }, void 0, false, {
            fileName: "[project]/pages/portal/profile-completion.tsx",
            lineNumber: 327,
            columnNumber: 7
        }, this)
    }, void 0, false);
}
const __TURBOPACK__default__export__ = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dynamic$2e$js__$5b$ssr$5d$__$28$ecmascript$29$__["default"])(()=>Promise.resolve(ProfileCompletion), {
    ssr: false
});
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__a62a50ee._.js.map