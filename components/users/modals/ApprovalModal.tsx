import React from "react";
import { AllUser } from "../types";
import SettingsFormFields from "../../SettingsFormFields";
import { useUser } from "../../AppLayout";
import { DashboardLevel, getUserDashboardLevel } from "@/lib/dashboardUtils";


interface ApprovalModalProps {
  show: boolean;
  userData: AllUser | null;
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
  onClose: () => void;
  onConfirm: () => void;
}

export function ApprovalModal({
  show,
  userData,
  formData,
  setFormData,
  onClose,
  onConfirm,
}: ApprovalModalProps) {
  const { user: currentUser } = useUser();
  const currentLevel = getUserDashboardLevel(currentUser);
  
  if (!show || !userData) return null;

  const availableDesignations = currentLevel === DashboardLevel.LEVEL_1_ADMIN 
    ? [
        { value: 'agent', label: 'Agent' },
        { value: 'manager', label: 'Manager' },
        { value: 'team_leader', label: 'Team Leader' },
        { value: 'ceo', label: 'CEO' },
        { value: 'developer', label: 'Developer' },
        { value: 'faculty_staff', label: 'Faculty Staff' }
      ]
    : [
        { value: 'agent', label: 'Agent' },
        { value: 'team_leader', label: 'Team Leader' },
        { value: 'ceo', label: 'CEO' }
      ];

  return (
    <div
      className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0, 0, 0, 0.3)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative backdrop-blur-md"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors z-10"
        >
          <i className="fi flex fi-rr-cross text-gray-900"></i>
        </button>

        <div className="p-6">
          <div className="mb-6">
            <h2
              className="text-xl font-bold mb-2"
              style={{
                color: "#263238",
                fontFamily: "'Poppins', sans-serif",
              }}
            >
              Approve New User
            </h2>
            <p
              className="text-sm text-gray-900"
              style={{ fontFamily: "'Roboto', sans-serif" }}
            >
              Review and approve user registration. Set initial role and
              permissions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Approval Controls */}
            <div className="space-y-4">
              <h3
                className="text-sm font-semibold"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                Approval Settings
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    Role
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) =>
                      setFormData({ ...formData, role: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                    <option value="super_admin">Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    Department
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                  >
                    <option value="sales">Sales</option>
                    <option value="renewal">Renewal</option>
                    <option value="backend">Backend</option>
                    <option value="management">Management</option>
                    <option value="service">Service</option>
                    <option value="hr">HR</option>
                    <option value="it">IT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    Designation
                  </label>
                  <select
                    value={formData.designation}
                    onChange={(e) =>
                      setFormData({ ...formData, designation: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                  >
                    {availableDesignations.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>

                {currentLevel === DashboardLevel.LEVEL_1_ADMIN && (
                  <>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                        Client Status
                      </label>
                      <select
                        value={formData.is_client ? "true" : "false"}
                        onChange={(e) =>
                          setFormData({ ...formData, is_client: e.target.value === "true" })
                        }
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                      >
                        <option value="true">Client</option>
                        <option value="false">Personnel</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                        Caller Status
                      </label>
                      <select
                        value={formData.is_caller ? "true" : "false"}
                        onChange={(e) =>
                          setFormData({ ...formData, is_caller: e.target.value === "true" })
                        }
                        className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                      >
                        <option value="true">Caller</option>
                        <option value="false">Non-Caller</option>
                      </select>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    Work Type
                  </label>
                  <select
                    value={formData.work_type}
                    onChange={(e) =>
                      setFormData({ ...formData, work_type: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                  >
                    <option value="on_site">On Site</option>
                    <option value="remote">Remote</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase">
                    User Type
                  </label>
                  <select
                    value={formData.user_type}
                    onChange={(e) =>
                      setFormData({ ...formData, user_type: e.target.value })
                    }
                    className="w-full p-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#4b33e8]"
                    style={{ color: "#000000" }}
                  >
                    <option value="employee">Employee</option>
                    <option value="posp_agent">POSP Agent</option>
                  </select>
                </div>
              </div>
            </div>

            {/* User Application Form */}
            <div className="mb-6">
              <h3
                className="text-sm font-semibold mb-4"
                style={{
                  color: "#263238",
                  fontFamily: "'Poppins', sans-serif",
                }}
              >
                User Application Details
              </h3>
              <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-6 max-h-[400px] overflow-y-auto">
                {/* Basic Info */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-gray-900">
                    Basic Details
                  </h4>
                  <SettingsFormFields
                    formData={{
                      email: userData.email || "",
                      user_name: userData.user_name || "",
                      contact_no: userData.contact_no || "",
                      employee_id: userData.employee_id || "",
                      role: userData.role || "",
                      profile_pic_url: userData.profile_pic_url || "",
                    }}
                    handleInputChange={() => {}}
                    category="basic_info"
                    readOnly={true}
                  />
                </div>

                {/* Personal Info */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-gray-900">
                    Personal Information
                  </h4>
                  <SettingsFormFields
                    formData={{
                      father_name: userData.father_name || "",
                      gender: userData.gender || "",
                      date_of_birth: userData.date_of_birth || "",
                      blood_group: userData.blood_group || "",
                      alternate_contact: userData.alternate_contact || "",
                      emergency_contact_no: userData.emergency_contact_no || "",
                    }}
                    handleInputChange={() => {}}
                    category="personal_info"
                    readOnly={true}
                  />
                </div>

                {/* Employment Info */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-gray-900">
                    Employment Information
                  </h4>
                  <SettingsFormFields
                    formData={{
                      date_of_joining: userData.date_of_joining || "",
                      in_hand_salary: userData.in_hand_salary?.toString() || "",
                      work_type: userData.work_type || "",
                      user_type: userData.user_type || "",
                      department: userData.department || "",
                      designation: userData.designation || "",
                    }}
                    handleInputChange={() => {}}
                    category="employment_info"
                    readOnly={true}
                  />
                </div>

                {/* Address Info */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-gray-900">
                    Address Information
                  </h4>
                  <SettingsFormFields
                    formData={{
                      primary_address: userData.primary_address || "",
                      area_pincode: userData.area_pincode || "",
                    }}
                    handleInputChange={() => {}}
                    category="address_info"
                    readOnly={true}
                  />
                </div>

                {/* KYC Info */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-gray-900">
                    KYC Information
                  </h4>
                  <SettingsFormFields
                    formData={{
                      pan_number: userData.pan_number || "",
                      aadhar_card_no: userData.aadhar_card_no || "",
                    }}
                    handleInputChange={() => {}}
                    category="kyc_info"
                    readOnly={true}
                  />
                </div>

                {/* Bank Info */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-gray-900">
                    Bank Details
                  </h4>
                  <SettingsFormFields
                    formData={{
                      bank_name: userData.bank_name || "",
                      account_holder_name:
                        userData.account_holder_name || "",
                      account_number: userData.account_number || "",
                      ifsc_code: userData.ifsc_code || "",
                      branch_city: userData.branch_city || "",
                      branch_state: userData.branch_state || "",
                      branch_pincode: userData.branch_pincode || "",
                    }}
                    handleInputChange={() => {}}
                    category="bank_info"
                    readOnly={true}
                  />
                </div>

                {/* Documents */}
                <div>
                  <h4 className="text-xs font-semibold mb-3 text-gray-900">
                    Documents
                  </h4>
                  <SettingsFormFields
                    formData={{
                      profile_pic_url: userData.profile_pic_url || "",
                      pancard_url: userData.pancard_url || "",
                      aadhar_front_url: userData.aadhar_front_url || "",
                      aadhar_back_url: userData.aadhar_back_url || "",
                      qualification_marksheet_url:
                        userData.qualification_marksheet_url || "",
                      bank_passbook_url: userData.bank_passbook_url || "",
                    }}
                    handleInputChange={() => {}}
                    category="documents"
                    readOnly={true}
                  />
                </div>
              </div>
            </div>

            {/* Approve Button Row */}
            <div className="col-span-1 md:col-span-2 flex justify-end gap-3 pt-4 border-t border-gray-200 mt-auto">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Approve User
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
