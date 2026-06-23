import React, { useEffect } from "react";
import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from "lucide-react";

const toastIcons = {
  success: <CheckCircle size={16} color="#34d399" />,
  error: <AlertOctagon size={16} color="#f87171" />,
  info: <Info size={16} color="#60a5fa" />,
  warning: <AlertTriangle size={16} color="#fbbf24" />
};

const toastColors = {
  success: { bg: "rgba(52, 211, 153, 0.08)", border: "rgba(52, 211, 153, 0.2)" },
  error: { bg: "rgba(248, 113, 113, 0.08)", border: "rgba(248, 113, 113, 0.2)" },
  info: { bg: "rgba(96, 165, 250, 0.08)", border: "rgba(96, 165, 250, 0.2)" },
  warning: { bg: "rgba(251, 191, 36, 0.08)", border: "rgba(251, 191, 36, 0.2)" }
};

export default function ToastItem({ toast, onRemove }) {
  const { id, message, type = "info", duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onRemove]);

  const styleColors = toastColors[type] || toastColors.info;

  return (
    <div 
      className="glass-card"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        padding: "14px 18px",
        borderRadius: 12,
        border: `1px solid ${styleColors.border}`,
        background: styleColors.bg,
        boxShadow: "0 8px 30px rgba(0,0,0,0.5)",
        minWidth: 280,
        maxWidth: 360,
        animation: "toastSlideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        pointerEvents: "auto",
        position: "relative",
      }}
    >
      <div style={{ flexShrink: 0 }}>
        {toastIcons[type] || toastIcons.info}
      </div>
      
      <div style={{ flex: 1, fontSize: "0.84rem", color: "#f1f5f9", fontWeight: 500, lineHeight: 1.4 }}>
        {message}
      </div>

      <button 
        onClick={() => onRemove(id)}
        style={{
          background: "none", border: "none", color: "#64748b",
          cursor: "pointer", display: "flex", alignItems: "center",
          padding: 2, transition: "color 0.2s"
        }}
        onMouseEnter={e => e.currentTarget.style.color = "#f1f5f9"}
        onMouseLeave={e => e.currentTarget.style.color = "#64748b"}
      >
        <X size={14} />
      </button>

      <style>{`
        @keyframes toastSlideIn {
          from { opacity: 0; transform: translateX(50px) translateY(0); }
          to { opacity: 1; transform: translateX(0) translateY(0); }
        }
      `}</style>
    </div>
  );
}
