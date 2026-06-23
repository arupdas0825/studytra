import React from "react";
import { Compass } from "lucide-react";

export default function FullPageLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: '#04080f',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      zIndex: 9999
    }}>
      {/* Pulsing and spinning logo wrapper */}
      <div style={{
        width: 72,
        height: 72,
        borderRadius: 20,
        background: 'linear-gradient(135deg, #3b82f6 0%, #7c3aed 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 40px rgba(59, 130, 246, 0.4)',
        animation: 'loaderPulseAndSpin 2s infinite ease-in-out',
      }}>
        <Compass size={36} color="white" />
      </div>
      
      <span style={{
        color: '#94a3b8',
        fontSize: '0.9rem',
        fontWeight: 600,
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        animation: 'loaderTextPulse 1.5s infinite ease-in-out'
      }}>
        Studytra AI
      </span>

      <style>{`
        @keyframes loaderPulseAndSpin {
          0% { transform: scale(0.9) rotate(0deg); opacity: 0.8; }
          50% { transform: scale(1.1) rotate(180deg); opacity: 1; boxShadow: 0 0 60px rgba(124, 58, 237, 0.6); }
          100% { transform: scale(0.9) rotate(360deg); opacity: 0.8; }
        }
        @keyframes loaderTextPulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
