import React from "react";

interface SettingsFormFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  category: string;
  onFileUpload?: (fieldName: string, fileUrl: string) => void;
  userId?: string;
  readOnly?: boolean;
}

export default function SettingsFormFields({ formData, handleInputChange, category, onFileUpload, userId, readOnly = false }: SettingsFormFieldsProps) {
  const [copiedField, setCopiedField] = React.useState<string | null>(null);

  const handleCopy = async (fieldId: string, value: string | null | undefined) => {
    const textToCopy = value?.toString() || '';
    if (!textToCopy || textToCopy.trim() === '') {
      return;
    }

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = textToCopy;
      textArea.style.position = 'fixed';
      textArea.style.opacity = '0';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopiedField(fieldId);
        setTimeout(() => setCopiedField(null), 2000);
      } catch (fallbackErr) {
        console.error('Fallback copy failed:', fallbackErr);
      }
      document.body.removeChild(textArea);
    }
  };

  const renderField = (
    id: string,
    label: string,
    type: string = "text",
    required: boolean = false,
    disabled: boolean = false,
    placeholder?: string,
    maxLength?: number,
    rows?: number,
    options?: { value: string; label: string }[]
  ) => {
    // If readOnly is true, make all fields disabled (except those already disabled)
    const isDisabled = readOnly || disabled;
    const fieldValue = formData[id] || "";
    const hasValue = fieldValue && fieldValue.toString().trim() !== '';
    
    return (
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label
            htmlFor={id}
            className="text-sm font-medium leading-none"
            style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
          >
            {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
          </label>
          {hasValue && (
            <button
              type="button"
              onClick={() => handleCopy(id, fieldValue)}
              className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors"
              title={copiedField === id ? "Copied!" : "Copy"}
            >
              {copiedField === id ? (
                <i className="fi flex fi-rr-check text-xs text-green-600"></i>
              ) : (
                <i className="fi flex fi-rr-copy text-xs text-gray-500"></i>
              )}
            </button>
          )}
        </div>
        {type === "textarea" ? (
          <textarea
            id={id}
            value={fieldValue}
            onChange={handleInputChange}
            rows={rows || 3}
            placeholder={placeholder}
            disabled={isDisabled}
            className="flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: "#E0E0E0",
              backgroundColor: isDisabled ? "#F5F5F5" : "#FFFFFF",
              color: "#000000",
              fontFamily: "'Roboto', sans-serif",
            }}
            onFocus={(e) => {
              if (!isDisabled) e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E0E0E0";
            }}
          />
        ) : type === "select" ? (
          <select
            id={id}
            value={fieldValue}
            onChange={handleInputChange}
            disabled={isDisabled}
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: "#E0E0E0",
              backgroundColor: isDisabled ? "#F5F5F5" : "#FFFFFF",
              color: "#000000",
              fontFamily: "'Roboto', sans-serif",
            }}
            onFocus={(e) => {
              if (!isDisabled) e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E0E0E0";
            }}
          >
            {options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            id={id}
            value={fieldValue}
            onChange={handleInputChange}
            required={required}
            disabled={isDisabled}
            placeholder={placeholder}
            maxLength={maxLength}
            className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            style={{
              borderColor: "#E0E0E0",
              backgroundColor: isDisabled ? "#F5F5F5" : "#FFFFFF",
              color: "#000000",
              fontFamily: "'Roboto', sans-serif",
            }}
            onFocus={(e) => {
              if (!isDisabled) e.currentTarget.style.borderColor = "#4b33e8";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "#E0E0E0";
            }}
          />
        )}
      </div>
    );
  };

  if (category === "basic_info") {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("user_name", "Full Name", "text", true)}
          {renderField("email", "Email", "email", false, true)}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("contact_no", "Contact Number", "tel", true, false, "8882558932", 10)}
          {renderField("employee_id", "Employee ID", "text", false, true)}
        </div>
        {renderField("role", "Role", "text", false, true)}
      </div>
    );
  }

  if (category === "personal_info") {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("father_name", "Father's Name")}
          {renderField("gender", "Gender", "select", false, false, undefined, undefined, undefined, [
            { value: "", label: "Select Gender" },
            { value: "Male", label: "Male" },
            { value: "Female", label: "Female" },
            { value: "Other", label: "Other" },
          ])}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("date_of_birth", "Date of Birth", "date")}
          {renderField("blood_group", "Blood Group", "text", false, false, "e.g., O+, A-, B+")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("alternate_contact", "Alternate Contact", "tel", false, false, "Alternative phone number", 10)}
          {renderField("emergency_contact_no", "Emergency Contact", "tel", false, false, "Emergency contact number", 10)}
        </div>
      </>
    );
  }

  if (category === "employment_info") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField("date_of_joining", "Date of Joining", "date")}
        {renderField("in_hand_salary", "In Hand Salary", "number", false, false, "Enter amount")}
      </div>
    );
  }

  if (category === "address_info") {
    return (
      <>
        {renderField("primary_address", "Primary Address", "textarea", false, false, "Enter your full address", undefined, 3)}
        {renderField("area_pincode", "Area Pincode", "text", false, false, "e.g., 110001", 6)}
      </>
    );
  }

  if (category === "kyc_info") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {renderField("pan_number", "PAN Number", "text", false, false, "e.g., ABCDE1234F")}
        {renderField("aadhar_card_no", "Aadhar Card Number", "text", false, false, "12-digit Aadhar number", 12)}
      </div>
    );
  }

  if (category === "bank_info") {
    return (
      <>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("bank_name", "Bank Name")}
          {renderField("account_holder_name", "Account Holder Name")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("account_number", "Account Number", "text", false, false, "Bank account number")}
          {renderField("ifsc_code", "IFSC Code", "text", false, false, "e.g., SBIN0001234")}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {renderField("branch_city", "Branch City")}
          {renderField("branch_state", "Branch State")}
          {renderField("branch_pincode", "Branch Pincode", "text", false, false, "Branch pincode", 6)}
        </div>
      </>
    );
  }

  if (category === "documents") {
      const DocumentUploadField = ({ fieldName, label, acceptedTypes = "image/*,.pdf" }: { fieldName: string; label: string; acceptedTypes?: string }) => {
      const [uploading, setUploading] = React.useState(false);
      const [deleting, setDeleting] = React.useState(false);
      const fileInputRef = React.useRef<HTMLInputElement>(null);

      const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file size (10MB)
        if (file.size > 10 * 1024 * 1024) {
          alert("File size must be less than 10MB");
          return;
        }

        setUploading(true);

        try {
          // Get Supabase client and session
          const { supabase } = await import("../lib/supabase");
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          
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
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('user-documents')
            .upload(filePath, file, {
              contentType: file.type,
              upsert: true,
            });

          if (uploadError) {
            console.error("Upload error:", uploadError);
            alert(uploadError.message || "Failed to upload file");
            setUploading(false);
            return;
          }

          // Get signed URL for the file (valid for 1 year)
          const { data: urlData, error: urlError } = await supabase.storage
            .from('user-documents')
            .createSignedUrl(filePath, 31536000); // 1 year expiry

          if (urlError || !urlData) {
            console.error("URL generation error:", urlError);
            alert("File uploaded but failed to generate URL");
            setUploading(false);
            return;
          }

          // Update form data with the signed URL
          handleInputChange({
            target: { id: fieldName, value: urlData.signedUrl }
          } as any);

          // Call onFileUpload callback if provided
          onFileUpload?.(fieldName, urlData.signedUrl);

          setUploading(false);
        } catch (error: any) {
          console.error("Upload error:", error);
          alert(error.message || "Failed to upload file");
          setUploading(false);
        }
      };

      const fileUrl = formData[fieldName];
      const isImage = fileUrl && (fileUrl.includes('.jpg') || fileUrl.includes('.jpeg') || fileUrl.includes('.png') || fileUrl.includes('.webp'));

      const hasValue = fileUrl && fileUrl.toString().trim() !== '';
      
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              className="text-sm font-medium leading-none"
              style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
            >
              {label}
            </label>
            {hasValue && (
              <button
                type="button"
                onClick={() => handleCopy(fieldName, fileUrl)}
                className="flex items-center justify-center w-6 h-6 rounded hover:bg-gray-100 transition-colors"
                title={copiedField === fieldName ? "Copied!" : "Copy"}
              >
                {copiedField === fieldName ? (
                  <i className="fi flex fi-rr-check text-xs text-green-600"></i>
                ) : (
                  <i className="fi flex fi-rr-copy text-xs text-gray-500"></i>
                )}
              </button>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedTypes}
            onChange={handleFileSelect}
            className="hidden"
            disabled={uploading}
          />

          <div className="flex flex-col gap-2">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-md border text-sm font-medium transition hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                borderColor: "#E0E0E0",
                color: "#263238",
                fontFamily: "'Roboto', sans-serif",
              }}
            >
              {uploading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span>Uploading...</span>
                </>
              ) : (
                <>
                  <i className="fi flex fi-rr-upload text-base"></i>
                  <span>{fileUrl ? "Replace File" : "Upload File"}</span>
                </>
              )}
            </button>

            {fileUrl && (
              <div className="mt-2 p-3 rounded-md border relative" style={{ borderColor: "#E0E0E0", backgroundColor: "#F9FAFB" }}>
                {/* Delete Button */}
                <button
                  type="button"
                  onClick={async () => {
                    if (!confirm(`Are you sure you want to delete ${label}?`)) {
                      return;
                    }

                    setDeleting(true);

                    try {
                      // Get Supabase client and session
                      const { supabase } = await import("../lib/supabase");
                      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
                      
                      if (sessionError || !session) {
                        alert("Please log in to delete files");
                        setDeleting(false);
                        return;
                      }

                      // List all files in the user's directory for this document type
                      // Since we use upsert: true, there might be multiple versions, delete all
                      const pathPrefix = `${session.user.id}/${fieldName}/`;
                      const { data: files, error: listError } = await supabase.storage
                        .from('user-documents')
                        .list(pathPrefix, {
                          limit: 100,
                          offset: 0,
                        });

                      if (listError) {
                        console.error("List error:", listError);
                        alert(listError.message || "Failed to list files");
                        setDeleting(false);
                        return;
                      }

                      if (!files || files.length === 0) {
                        // File might already be deleted, just clear the form
                        handleInputChange({
                          target: { id: fieldName, value: "" }
                        } as any);
                        setDeleting(false);
                        return;
                      }

                      // Delete all files in this directory
                      const pathsToDelete = files.map(f => `${pathPrefix}${f.name}`);
                      const { error: deleteError } = await supabase.storage
                        .from('user-documents')
                        .remove(pathsToDelete);

                      if (deleteError) {
                        console.error("Delete error:", deleteError);
                        alert(deleteError.message || "Failed to delete file");
                        setDeleting(false);
                        return;
                      }

                      // Clear form field
                      handleInputChange({
                        target: { id: fieldName, value: "" }
                      } as any);

                      // Reset file input
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }

                      setDeleting(false);
                    } catch (error: any) {
                      console.error("Delete error:", error);
                      alert(error.message || "Failed to delete file");
                      setDeleting(false);
                    }
                  }}
                  disabled={deleting}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-red-500 hover:bg-red-600 text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ zIndex: 10 }}
                  title="Delete file"
                >
                  {deleting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <i className="fi flex fi-rr-cross-small text-sm"></i>
                  )}
                </button>

                {isImage ? (
                  <div className="space-y-2">
                    <img
                      src={fileUrl}
                      alt={label}
                      className="w-full max-w-xs h-auto rounded border"
                      style={{ borderColor: "#E0E0E0" }}
                      onError={(e) => {
                        // If image fails to load, show as link
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `<a href="${fileUrl}" target="_blank" class="text-blue-600 hover:underline">View Document</a>`;
                        }
                      }}
                    />
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      <i className="fi flex fi-rr-eye text-base"></i>
                      <span>View Full Size</span>
                    </a>
                  </div>
                ) : (
                  <a
                    href={fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:underline"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    <i className="fi flex fi-rr-file text-base"></i>
                    <span>View Document</span>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Hidden input to store URL in form data */}
          <input
            type="hidden"
            id={fieldName}
            value={fileUrl || ""}
            onChange={handleInputChange}
          />
        </div>
      );
    };

    return (
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
          Upload your documents. Maximum file size: 10MB. Accepted formats: Images (JPG, PNG, WEBP) and PDF.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <DocumentUploadField fieldName="profile_pic_url" label="Profile Picture" acceptedTypes="image/*" />
          <DocumentUploadField fieldName="pancard_url" label="PAN Card" acceptedTypes="image/*,.pdf" />
          <DocumentUploadField fieldName="aadhar_front_url" label="Aadhar Card (Front)" acceptedTypes="image/*,.pdf" />
          <DocumentUploadField fieldName="aadhar_back_url" label="Aadhar Card (Back)" acceptedTypes="image/*,.pdf" />
          <DocumentUploadField fieldName="qualification_marksheet_url" label="Qualification Marksheet" acceptedTypes="image/*,.pdf" />
          <DocumentUploadField fieldName="bank_passbook_url" label="Bank Passbook" acceptedTypes="image/*,.pdf" />
        </div>
      </div>
    );
  }

  return null;
}

