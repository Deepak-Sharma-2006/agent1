import React from "react";
import { X, Download, Printer, ExternalLink, FileText, Loader2, ShieldCheck } from "lucide-react";

interface DocumentPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentTitle: string;
  pdfBlobUrl: string | null;
  isLoading: boolean;
  onDownload: () => void;
  sahyogCaseId: string;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  isOpen,
  onClose,
  documentTitle,
  pdfBlobUrl,
  isLoading,
  onDownload,
  sahyogCaseId
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    if (pdfBlobUrl) {
      const printWindow = window.open(pdfBlobUrl);
      if (printWindow) {
        printWindow.focus();
        printWindow.print();
      }
    }
  };

  return (
    <div
      className="gov-modal-backdrop"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(15, 23, 42, 0.75)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        padding: "16px"
      }}
      onClick={onClose}
    >
      <div
        className="gov-modal-container"
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "960px",
          height: "90vh",
          maxHeight: "880px",
          display: "flex",
          flexDirection: "column",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
          border: "1px solid #CBD5E1",
          overflow: "hidden"
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            background: "#0F2942",
            color: "#FFFFFF",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #1E3A8A"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <FileText size={18} color="#F59E0B" />
            <div>
              <div style={{ fontSize: "14px", fontWeight: 800, letterSpacing: "0.3px" }}>
                {documentTitle}
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                Case Ref: {sahyogCaseId} • Official Law Enforcement Certified Document
              </div>
            </div>
          </div>

          {/* Action Toolbar */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: 700,
                color: "#10B981",
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.3)",
                padding: "3px 8px",
                borderRadius: "4px",
                display: "flex",
                alignItems: "center",
                gap: "4px"
              }}
            >
              <ShieldCheck size={12} /> RESTRICTED / OFFICIAL ONLY
            </span>

            {pdfBlobUrl && (
              <>
                <button
                  type="button"
                  onClick={handlePrint}
                  className="gov-btn gov-btn-outline"
                  style={{
                    fontSize: "11px",
                    padding: "4px 10px",
                    color: "#FFFFFF",
                    borderColor: "#334155",
                    background: "rgba(255,255,255,0.08)"
                  }}
                  title="Print Document"
                >
                  <Printer size={13} /> Print
                </button>
                <button
                  type="button"
                  onClick={onDownload}
                  className="gov-btn gov-btn-primary"
                  style={{
                    fontSize: "11px",
                    padding: "4px 12px",
                    background: "#F59E0B",
                    color: "#0F172A",
                    fontWeight: 700
                  }}
                  title="Download PDF File"
                >
                  <Download size={13} /> Download PDF
                </button>
              </>
            )}

            <button
              type="button"
              onClick={onClose}
              id="btn-close-pdf-preview"
              style={{
                background: "transparent",
                border: "none",
                color: "#94A3B8",
                cursor: "pointer",
                padding: "4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "4px"
              }}
              title="Close Preview"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Viewport Body */}
        <div style={{ flex: 1, backgroundColor: "#525659", position: "relative", overflow: "hidden" }}>
          {isLoading ? (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                color: "#FFFFFF",
                background: "#1E293B"
              }}
            >
              <Loader2 size={32} className="spin-loader" color="#F59E0B" />
              <div style={{ fontSize: "13px", fontWeight: 600 }}>
                Compiling Official Document Stream from ReportLab Engine...
              </div>
              <div style={{ fontSize: "11px", color: "#94A3B8" }}>
                Anchoring SHA-256 Merkle root and statutory officer DSC signatures...
              </div>
            </div>
          ) : pdfBlobUrl ? (
            <iframe
              src={pdfBlobUrl}
              id="pdf-preview-iframe"
              title={documentTitle}
              style={{
                width: "100%",
                height: "100%",
                border: "none"
              }}
            />
          ) : (
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                color: "#94A3B8"
              }}
            >
              <FileText size={36} />
              <div>Unable to stream document preview. Please use direct download.</div>
              <button
                type="button"
                className="gov-btn gov-btn-primary"
                onClick={onDownload}
                style={{ fontSize: "12px", marginTop: "8px" }}
              >
                <Download size={14} /> Download PDF Directly
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer Note */}
        <div
          style={{
            padding: "8px 16px",
            background: "#F8FAFC",
            borderTop: "1px solid #E2E8F0",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "11px",
            color: "#64748B"
          }}
        >
          <div>
            Admissible under <b>Section 63(4) BSA 2023</b> & <b>Section 94/106 BNSS 2023</b>. Generated by Project CHAKRA Node.
          </div>
          {pdfBlobUrl && (
            <a
              href={pdfBlobUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#1E40AF", display: "flex", alignItems: "center", gap: "4px", textDecoration: "none", fontWeight: 600 }}
            >
              Open in Separate Browser Tab <ExternalLink size={11} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
