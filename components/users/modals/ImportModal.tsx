import React, { useState, useRef } from "react";
import { supabase } from "../../../lib/supabase";
import { useUser } from "../../AppLayout";

interface Organization {
  id: string;
  company_name: string;
}

interface ImportModalProps {
  show: boolean;
  onClose: () => void;
  onSuccess: () => void;
  organizations: Organization[];
}

export function ImportModal({
  show,
  onClose,
  onSuccess,
  organizations,
}: ImportModalProps) {
  const { user } = useUser();
  const [selectedImportOrgId, setSelectedImportOrgId] = useState("");

  React.useEffect(() => {
    if (show && user?.isClient && user.organization_id) {
      setSelectedImportOrgId(user.organization_id);
    }
  }, [show, user]);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [importError, setImportError] = useState("");
  const [importSuccess, setImportSuccess] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleClose = () => {
    onClose();
    setImportFile(null);
    setImportError("");
    setImportSuccess("");
    setSelectedImportOrgId("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 backdrop-blur-md flex items-center justify-center p-4"
      style={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.3)",
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          handleClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2
            className="text-xl font-semibold"
            style={{
              color: "#263238",
              fontFamily: "'Poppins', sans-serif",
            }}
          >
            Import Users (Bulk Creation)
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div className="px-6 py-4">
          {importError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {importError}
            </div>
          )}
          {importSuccess && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm whitespace-pre-wrap">
              {importSuccess}
            </div>
          )}

          {/* CSV Format Info */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3
              className="text-sm font-semibold mb-2"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              CSV Format Required:
            </h3>
            <ul
              className="text-xs text-gray-700 space-y-1"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              <li>
                • <strong>User Name</strong> - Full name of the user
              </li>
              <li>
                • <strong>Employee ID</strong> - Unique employee ID (e.g.,
                TFC-001)
              </li>
              <li>
                • <strong>Email</strong> - Valid email address
              </li>
              <li>
                • <strong>Contact No</strong> - 10-digit phone number
              </li>
              <li>
                • <strong>User Type</strong> - &quot;employee&quot; or
                &quot;posp_agent&quot;
              </li>
              <li>
                • <strong>Password</strong> - Minimum 6 characters
              </li>
            </ul>
          </div>

          {/* Sample CSV Download */}
          <div className="mb-6">
            <button
              onClick={() => {
                const csvContent = `User Name,Employee ID,Email,Contact No,User Type,Password
John Doe,TFC-001,john.doe@example.com,1234567890,employee,password123
Jane Smith,TFC-002,jane.smith@example.com,0987654321,posp_agent,password123`;
                const blob = new Blob([csvContent], {
                  type: "text/csv;charset=utf-8;",
                });
                const link = document.createElement("a");
                const url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "sample_users_import.csv");
                link.style.visibility = "hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
              className="w-full px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <i className="fi flex fi-rr-download"></i>
              <span>Download Sample CSV</span>
            </button>
          </div>

          {/* Organization Selection */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Select Organization <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <select
              value={selectedImportOrgId}
              disabled={user?.isClient}
              onChange={(e) => setSelectedImportOrgId(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8] ${user?.isClient ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700'}`}
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              <option value="">Select an organization</option>
              {organizations
                .filter(org => !user?.isClient || org.id === user.organization_id)
                .map((org) => (
                <option key={org.id} value={org.id}>
                  {org.company_name}
                </option>
              ))}
            </select>
          </div>

          {/* File Upload */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium mb-2"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Upload CSV File <span style={{ color: "#EF4444" }}>*</span>
            </label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#4b33e8] transition-colors">
              {importing ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4b33e8] mb-3"></div>
                  <p
                    className="text-sm font-medium text-gray-700"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    Importing users...
                  </p>
                  <p
                    className="text-xs text-gray-500 mt-1"
                    style={{ fontFamily: "'Roboto', sans-serif" }}
                  >
                    Please wait while we process your CSV file
                  </p>
                </div>
              ) : (
                <>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        if (
                          file.type !== "text/csv" &&
                          !file.name.endsWith(".csv")
                        ) {
                          setImportError("Please upload a valid CSV file");
                          setImportFile(null);
                          return;
                        }
                        setImportFile(file);
                        setImportError("");
                        setImportSuccess("");
                      }
                    }}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label
                    htmlFor="csv-upload"
                    className="cursor-pointer flex flex-col items-center gap-2"
                  >
                    <i className="fi flex fi-rr-upload text-3xl text-gray-400"></i>
                    <div>
                      <span
                        className="text-sm font-medium text-[#4b33e8]"
                        style={{ fontFamily: "'Poppins', sans-serif" }}
                      >
                        Click to upload
                      </span>
                      <span
                        className="text-sm text-gray-500"
                        style={{ fontFamily: "'Roboto', sans-serif" }}
                      >
                        {" "}
                        or drag and drop
                      </span>
                    </div>
                    <p
                      className="text-xs text-gray-400"
                      style={{ fontFamily: "'Roboto', sans-serif" }}
                    >
                      CSV file only
                    </p>
                  </label>
                  {importFile && (
                    <div className="mt-3 p-2 bg-gray-50 rounded-lg flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <i className="fi flex fi-rr-file text-gray-600"></i>
                        <span
                          className="text-sm text-gray-700"
                          style={{ fontFamily: "'Roboto', sans-serif" }}
                        >
                          {importFile.name}
                        </span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          setImportFile(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = "";
                          }
                        }}
                        className="text-red-500 hover:text-red-700"
                      >
                        <i className="fi flex fi-rr-cross text-sm"></i>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-sm font-medium transition-colors"
              disabled={importing}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!importFile) {
                  setImportError("Please select a CSV file");
                  return;
                }

                if (!selectedImportOrgId) {
                  setImportError("Please select an organization");
                  return;
                }

                setImporting(true);
                setImportError("");
                setImportSuccess("");

                try {
                  const text = await importFile.text();
                  const lines = text
                    .split("\n")
                    .filter((line) => line.trim());

                  if (lines.length < 2) {
                    setImportError(
                      "CSV file must contain at least a header row and one data row"
                    );
                    setImporting(false);
                    return;
                  }

                  // Parse CSV
                  const headers = lines[0].split(",").map((h) => h.trim());
                  const requiredHeaders = [
                    "User Name",
                    "Employee ID",
                    "Email",
                    "Contact No",
                    "User Type",
                    "Password",
                  ];

                  // Check if all required headers are present
                  const missingHeaders = requiredHeaders.filter(
                    (h) => !headers.includes(h)
                  );
                  if (missingHeaders.length > 0) {
                    setImportError(
                      `Missing required columns: ${missingHeaders.join(", ")}`
                    );
                    setImporting(false);
                    return;
                  }

                  const users = [];
                  const errors = [];

                  for (let i = 1; i < lines.length; i++) {
                    const values = lines[i].split(",").map((v) => v.trim());
                    if (values.length !== headers.length) {
                      errors.push(`Row ${i + 1}: Column count mismatch`);
                      continue;
                    }

                    const user: any = {};
                    headers.forEach((header, index) => {
                      user[header] = values[index];
                    });

                    // Validate required fields
                    if (
                      !user["User Name"] ||
                      !user["Employee ID"] ||
                      !user["Email"] ||
                      !user["Contact No"] ||
                      !user["User Type"] ||
                      !user["Password"]
                    ) {
                      errors.push(`Row ${i + 1}: Missing required fields`);
                      continue;
                    }

                    // Validate email format
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    if (!emailRegex.test(user["Email"])) {
                      errors.push(`Row ${i + 1}: Invalid email format`);
                      continue;
                    }

                    // Validate contact number
                    if (!/^\d{10}$/.test(user["Contact No"])) {
                      errors.push(
                        `Row ${i + 1}: Contact number must be 10 digits`
                      );
                      continue;
                    }

                    // Validate user type
                    if (
                      !["employee", "posp_agent"].includes(
                        user["User Type"].toLowerCase()
                      )
                    ) {
                      errors.push(
                        `Row ${i + 1}: User Type must be "employee" or "posp_agent"`
                      );
                      continue;
                    }

                    // Validate password
                    if (user["Password"].length < 6) {
                      errors.push(
                        `Row ${i + 1}: Password must be at least 6 characters`
                      );
                      continue;
                    }

                    users.push({
                      user_name: user["User Name"],
                      employee_id: user["Employee ID"],
                      email: user["Email"],
                      contact_no: user["Contact No"],
                      user_type: user["User Type"].toLowerCase(),
                      password: user["Password"],
                    });
                  }

                  if (errors.length > 0) {
                    setImportError(`Validation errors:\n${errors.join("\n")}`);
                    setImporting(false);
                    return;
                  }

                  if (users.length === 0) {
                    setImportError("No valid users found in CSV file");
                    setImporting(false);
                    return;
                  }

                  // Import users one by one
                  const {
                    data: { session },
                  } = await supabase.auth.getSession();
                  if (!session) {
                    setImportError("You must be logged in to import users");
                    setImporting(false);
                    return;
                  }

                  let successCount = 0;
                  const importErrors: string[] = [];

                  // Process each user individually
                  for (let i = 0; i < users.length; i++) {
                    const user = users[i];

                    try {
                      const response = await fetch("/api/auth/import-user", {
                        method: "POST",
                        headers: {
                          "Content-Type": "application/json",
                          Authorization: `Bearer ${session.access_token}`,
                        },
                        body: JSON.stringify({
                          user_name: user.user_name,
                          employee_id: user.employee_id,
                          email: user.email,
                          contact_no: user.contact_no,
                          user_type: user.user_type,
                          password: user.password,
                          organization_id: selectedImportOrgId,
                        }),
                      });

                      const data = await response.json();

                      if (!response.ok) {
                        importErrors.push(
                          `Row ${i + 1} (${user.email}): ${
                            data.error || "Failed to import"
                          }`
                        );
                      } else {
                        successCount++;
                      }
                    } catch (err: any) {
                      importErrors.push(
                        `Row ${i + 1} (${user.email}): ${
                          err.message || "Network error"
                        }`
                      );
                    }
                  }

                  if (successCount === 0) {
                    setImportError(
                      `Failed to import any users.\n${importErrors.join("\n")}`
                    );
                    setImporting(false);
                    return;
                  }

                  const successMessage = `Successfully imported ${successCount} user(s).`;
                  const errorMessage =
                    importErrors.length > 0
                      ? `\n\nErrors:\n${importErrors.join("\n")}`
                      : "";
                  setImportSuccess(successMessage + errorMessage);
                  setImportFile(null);
                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }

                  // Refresh data
                  onSuccess();

                  // Close modal after 3 seconds if no errors, or keep it open if there are errors
                  if (importErrors.length === 0) {
                    setTimeout(() => {
                      handleClose();
                    }, 3000);
                  }
                } catch (err: any) {
                  console.error("Import error:", err);
                  setImportError(err.message || "Failed to import users");
                } finally {
                  setImporting(false);
                }
              }}
              disabled={importing || !importFile}
              className="px-6 py-2 bg-[#4b33e8] hover:bg-[#3d28c7] text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? "Importing..." : "Import Users"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
