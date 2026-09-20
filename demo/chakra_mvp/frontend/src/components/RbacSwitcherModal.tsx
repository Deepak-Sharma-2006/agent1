import React from "react";
import type { AuthUser } from "../types";
import { Shield, CheckCircle2, UserCheck, Key, X } from "lucide-react";

interface RbacSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: AuthUser[];
  currentUser: AuthUser;
  onSelectUser: (user: AuthUser) => void;
}

export const RbacSwitcherModal: React.FC<RbacSwitcherModalProps> = ({
  isOpen,
  onClose,
  users,
  currentUser,
  onSelectUser
}) => {
  if (!isOpen) return null;

  return (
    <div className="gov-modal-overlay" onClick={onClose}>
      <div className="gov-modal-container" style={{ maxWidth: "680px" }} onClick={(e) => e.stopPropagation()}>
        <div className="gov-modal-header">
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Shield size={18} color="#0F2942" />
            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0F2942" }}>
              MHA 5-Tier Operational Role-Based Access Control (RBAC)
            </h3>
          </div>
          <button
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
          >
            <X size={18} />
          </button>
        </div>

        <div className="gov-modal-body">
          <p style={{ fontSize: "12px", color: "#475569", marginBottom: "16px" }}>
            Project CHAKRA enforces strict multi-stakeholder operational segregation across Law Enforcement Agencies (LEAs), forensic certification bodies, and Virtual Asset Service Providers (VASPs). Select an authorized profile to simulate operational permissions:
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {users.map((user) => {
              const isSelected = user.user_id === currentUser.user_id;
              return (
                <div
                  key={user.key}
                  onClick={() => {
                    onSelectUser(user);
                    onClose();
                  }}
                  style={{
                    border: isSelected ? "2px solid #0F2942" : "1px solid #CBD5E1",
                    borderRadius: "8px",
                    padding: "12px 14px",
                    background: isSelected ? "#F8FAFC" : "#FFFFFF",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    transition: "all 0.15s ease"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: isSelected ? "#0F2942" : "#E2E8F0",
                        color: isSelected ? "#FFFFFF" : "#475569",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "700",
                        fontSize: "13px"
                      }}
                    >
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "13px", fontWeight: "700", color: "#0F172A" }}>
                          {user.name}
                        </span>
                        <span
                          style={{
                            fontSize: "10px",
                            fontWeight: "700",
                            padding: "2px 6px",
                            borderRadius: "4px",
                            background: "#EFF6FF",
                            color: "#1E40AF",
                            border: "1px solid #BFDBFE"
                          }}
                        >
                          {user.role}
                        </span>
                        {user.has_dsc_token && (
                          <span
                            title="Class-3 Digital Signature Certificate Present"
                            style={{
                              fontSize: "9.5px",
                              display: "flex",
                              alignItems: "center",
                              gap: "3px",
                              background: "#ECFDF5",
                              color: "#065F46",
                              padding: "1px 5px",
                              borderRadius: "3px",
                              border: "1px solid #A7F3D0"
                            }}
                          >
                            <Key size={10} /> DSC TOKEN
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: "11px", color: "#475569", marginTop: "2px" }}>
                        {user.designation} • <b>{user.station}</b> ({user.state_ut})
                      </div>
                      <div style={{ fontSize: "10px", color: "#64748B", fontFamily: "var(--font-mono)", marginTop: "1px" }}>
                        PEN/ID: {user.user_id} • {user.gov_email || "gov.in verified"}
                      </div>
                    </div>
                  </div>

                  {isSelected && (
                    <div style={{ color: "#059669", display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", fontWeight: "600" }}>
                      <CheckCircle2 size={16} /> ACTIVE
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="gov-modal-footer">
          <button className="gov-btn gov-btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
