(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/SettingsFormFields.tsx [client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>SettingsFormFields
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/jsx-dev-runtime.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/react/index.js [client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/supabase.ts [client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
;
;
const DocumentUploadField = ({ fieldName, label, acceptedTypes = "image/*,.pdf", formData, handleInputChange, onFileUpload, copiedField, handleCopy })=>{
    _s();
    const [uploading, setUploading] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const [deleting, setDeleting] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useState(false);
    const fileInputRef = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useRef(null);
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
            const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
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
            const { data: uploadData, error: uploadError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').upload(filePath, file, {
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
            const { data: urlData, error: urlError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').createSignedUrl(filePath, 31536000); // 1 year expiry
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "space-y-2",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center justify-between",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
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
                    hasValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>handleCopy(fieldName, fileUrl),
                        className: "flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors",
                        title: copiedField === fieldName ? "Copied!" : "Copy",
                        children: copiedField === fieldName ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                            className: "fi flex fi-rr-check text-xs text-green-600"
                        }, void 0, false, {
                            fileName: "[project]/components/SettingsFormFields.tsx",
                            lineNumber: 127,
                            columnNumber: 15
                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex flex-col gap-2",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        onClick: ()=>fileInputRef.current?.click(),
                        disabled: uploading,
                        className: "flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed",
                        style: {
                            borderColor: "#E0E0E0",
                            color: "#263238",
                            fontFamily: "'Roboto', sans-serif"
                        },
                        children: uploading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 158,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    children: "Uploading..."
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 159,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            ]
                        }, void 0, true) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["Fragment"], {
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                    className: "fi flex fi-rr-upload text-base"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 163,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0)),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                    fileUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 p-3 rounded-md border relative",
                        style: {
                            borderColor: "#E0E0E0",
                            backgroundColor: "#F9FAFB"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: async ()=>{
                                    if (!confirm(`Are you sure you want to delete ${label}?`)) {
                                        return;
                                    }
                                    setDeleting(true);
                                    try {
                                        const { data: { session }, error: sessionError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].auth.getSession();
                                        if (sessionError || !session) {
                                            alert("Please log in to delete files");
                                            setDeleting(false);
                                            return;
                                        }
                                        // List all files in the user's directory for this document type
                                        const pathPrefix = `${session.user.id}/${fieldName}/`;
                                        const { data: files, error: listError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').list(pathPrefix, {
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
                                        const { error: deleteError } = await __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$supabase$2e$ts__$5b$client$5d$__$28$ecmascript$29$__["supabase"].storage.from('user-documents').remove(pathsToDelete);
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
                                children: deleting ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    className: "animate-spin rounded-full h-4 w-4 border-b-2 border-white"
                                }, void 0, false, {
                                    fileName: "[project]/components/SettingsFormFields.tsx",
                                    lineNumber: 250,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                            isImage ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
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
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                        href: fileUrl,
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                        className: "inline-flex items-center gap-2 text-sm text-blue-600 hover:underline",
                                        style: {
                                            fontFamily: "'Roboto', sans-serif"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                                className: "fi flex fi-rr-eye text-base"
                                            }, void 0, false, {
                                                fileName: "[project]/components/SettingsFormFields.tsx",
                                                lineNumber: 284,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                href: fileUrl,
                                target: "_blank",
                                rel: "noopener noreferrer",
                                className: "inline-flex items-center gap-2 text-sm text-blue-600 hover:underline font-medium",
                                style: {
                                    fontFamily: "'Roboto', sans-serif"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                        className: "fi flex fi-rr-file text-base"
                                    }, void 0, false, {
                                        fileName: "[project]/components/SettingsFormFields.tsx",
                                        lineNumber: 296,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
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
_s(DocumentUploadField, "/kNy8rM1gHiiYYRiqlo0Hq39PkU=");
_c = DocumentUploadField;
function SettingsFormFields({ formData, handleInputChange, category, onFileUpload, userId, readOnly = false }) {
    _s1();
    const [copiedField, setCopiedField] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$index$2e$js__$5b$client$5d$__$28$ecmascript$29$__["default"].useState(null);
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-2",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "flex items-center justify-between",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                            htmlFor: id,
                            className: "text-sm font-medium leading-none",
                            style: {
                                color: "#263238",
                                fontFamily: "'Poppins', sans-serif"
                            },
                            children: [
                                label,
                                " ",
                                required && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
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
                        hasValue && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            type: "button",
                            onClick: ()=>handleCopy(id, fieldValue),
                            className: "flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors",
                            title: copiedField === id ? "Copied!" : "Copy",
                            children: copiedField === id ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
                                className: "fi flex fi-rr-check text-xs text-green-600"
                            }, void 0, false, {
                                fileName: "[project]/components/SettingsFormFields.tsx",
                                lineNumber: 388,
                                columnNumber: 17
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("i", {
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
                type === "textarea" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                    id: id,
                    value: fieldValue,
                    onChange: handleInputChange,
                    rows: rows || 3,
                    placeholder: placeholder,
                    disabled: isDisabled,
                    className: "flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    style: {
                        borderColor: "#E0E0E0",
                        backgroundColor: isDisabled ? "#F5F5F5" : "#FFFFFF",
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
                }, this) : type === "select" ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                    id: id,
                    value: fieldValue,
                    onChange: handleInputChange,
                    disabled: isDisabled,
                    className: "flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    style: {
                        borderColor: "#E0E0E0",
                        backgroundColor: isDisabled ? "#F5F5F5" : "#FFFFFF",
                        color: "#000000",
                        fontFamily: "'Roboto', sans-serif"
                    },
                    onFocus: (e)=>{
                        if (!isDisabled) e.currentTarget.style.borderColor = "#4b33e8";
                    },
                    onBlur: (e)=>{
                        e.currentTarget.style.borderColor = "#E0E0E0";
                    },
                    children: options?.map((opt)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
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
                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                    type: type,
                    id: id,
                    value: fieldValue,
                    onChange: handleInputChange,
                    required: required,
                    disabled: isDisabled,
                    placeholder: placeholder,
                    maxLength: maxLength,
                    className: "flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    style: {
                        borderColor: "#E0E0E0",
                        backgroundColor: isDisabled ? "#F5F5F5" : "#FFFFFF",
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-6",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "space-y-4",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                    className: "text-sm",
                    style: {
                        color: "#787E9D",
                        fontFamily: "'Roboto', sans-serif"
                    },
                    children: "Upload your documents. Maximum file size: 10MB. Accepted formats: Images (JPG, PNG, WEBP) and PDF."
                }, void 0, false, {
                    fileName: "[project]/components/SettingsFormFields.tsx",
                    lineNumber: 580,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    className: "grid grid-cols-1 sm:grid-cols-2 gap-6",
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentUploadField, {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentUploadField, {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentUploadField, {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentUploadField, {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentUploadField, {
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
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$client$5d$__$28$ecmascript$29$__["jsxDEV"])(DocumentUploadField, {
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
_s1(SettingsFormFields, "kNxAVcE58ZSBLegF2sBuEyY2bmc=");
_c1 = SettingsFormFields;
var _c, _c1;
__turbopack_context__.k.register(_c, "DocumentUploadField");
__turbopack_context__.k.register(_c1, "SettingsFormFields");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/SettingsFormFields.tsx [client] (ecmascript, next/dynamic entry)", ((__turbopack_context__) => {

__turbopack_context__.n(__turbopack_context__.i("[project]/components/SettingsFormFields.tsx [client] (ecmascript)"));
}),
]);

//# sourceMappingURL=components_SettingsFormFields_tsx_ab3b4225._.js.map