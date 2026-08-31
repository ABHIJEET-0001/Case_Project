interface LogoMarkProps {
  size?: number;
  subtle?: boolean;
}

export default function LogoMark({ size = 32, subtle = false }: LogoMarkProps) {
  const glow = subtle ? "rgba(20,184,166,0.14)" : "rgba(20,184,166,0.26)";

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${Math.max(8, Math.floor(size * 0.28))}px`,
        background: "linear-gradient(135deg, #14b8a6 0%, #0ea5e9 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.25), 0 8px 16px -10px ${glow}`,
      }}
      aria-hidden="true"
    >
      <svg width={Math.round(size * 0.54)} height={Math.round(size * 0.54)} viewBox="0 0 18 18" fill="none">
        <circle cx="7" cy="7" r="3.8" stroke="white" strokeWidth="1.9" />
        <path d="M10.5 10.5L15 15" stroke="white" strokeWidth="1.9" strokeLinecap="round" />
        <path d="M7 5V9M5 7H9" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}
