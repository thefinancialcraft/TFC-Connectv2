interface SettingsFormFieldsProps {
  formData: any;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  category: string;
}

export default function SettingsFormFields({ formData, handleInputChange, category }: SettingsFormFieldsProps) {
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
  ) => (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="text-sm font-medium leading-none"
        style={{ color: "#263238", fontFamily: "'Poppins', sans-serif" }}
      >
        {label} {required && <span style={{ color: "#EF4444" }}>*</span>}
      </label>
      {type === "textarea" ? (
        <textarea
          id={id}
          value={formData[id] || ""}
          onChange={handleInputChange}
          rows={rows || 3}
          placeholder={placeholder}
          className="flex w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: "#E0E0E0",
            backgroundColor: disabled ? "#F5F5F5" : "#FFFFFF",
            color: disabled ? "#787E9D" : "#263238",
            fontFamily: "'Roboto', sans-serif",
          }}
          onFocus={(e) => {
            if (!disabled) e.currentTarget.style.borderColor = "#4b33e8";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E0E0E0";
          }}
        />
      ) : type === "select" ? (
        <select
          id={id}
          value={formData[id] || ""}
          onChange={handleInputChange}
          disabled={disabled}
          className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: "#E0E0E0",
            backgroundColor: disabled ? "#F5F5F5" : "#FFFFFF",
            color: disabled ? "#787E9D" : "#263238",
            fontFamily: "'Roboto', sans-serif",
          }}
          onFocus={(e) => {
            if (!disabled) e.currentTarget.style.borderColor = "#4b33e8";
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
          value={formData[id] || ""}
          onChange={handleInputChange}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          className="flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          style={{
            borderColor: "#E0E0E0",
            backgroundColor: disabled ? "#F5F5F5" : "#FFFFFF",
            color: disabled ? "#787E9D" : "#263238",
            fontFamily: "'Roboto', sans-serif",
          }}
          onFocus={(e) => {
            if (!disabled) e.currentTarget.style.borderColor = "#4b33e8";
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = "#E0E0E0";
          }}
        />
      )}
    </div>
  );

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
    return (
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "#787E9D", fontFamily: "'Roboto', sans-serif" }}>
          Document uploads will be available soon.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {renderField("profile_pic_url", "Profile Picture URL", "url", false, true)}
          {renderField("pancard_url", "PAN Card URL", "url", false, true)}
          {renderField("aadhar_front_url", "Aadhar Front URL", "url", false, true)}
          {renderField("aadhar_back_url", "Aadhar Back URL", "url", false, true)}
          {renderField("qualification_marksheet_url", "Qualification Marksheet URL", "url", false, true)}
          {renderField("bank_passbook_url", "Bank Passbook URL", "url", false, true)}
        </div>
      </div>
    );
  }

  return null;
}

