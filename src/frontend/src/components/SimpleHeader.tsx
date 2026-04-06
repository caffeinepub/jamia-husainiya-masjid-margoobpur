import type { ReactNode } from "react";

interface SimpleHeaderProps {
  subtitle?: string;
  rightElement?: ReactNode;
}

export function SimpleHeader({ subtitle, rightElement }: SimpleHeaderProps) {
  return (
    <header
      className="px-4 py-3"
      style={{ background: "#1a6b3a", borderBottom: "3px solid #0d3d1f" }}
    >
      {/* Arabic Bismillah */}
      <div
        className="text-sm text-center mb-1"
        style={{
          color: "#c9a84c",
          fontFamily: "serif",
          direction: "rtl",
        }}
      >
        بسم الله الرحمن الرحيم
      </div>
      {/* Mosque name with crescents */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 flex-1">
          <span className="text-2xl" style={{ color: "#c9a84c" }}>
            ☪
          </span>
          <h1 className="text-white font-bold" style={{ fontSize: "13px" }}>
            Jamia Husainiya Masjid Margoobpur
          </h1>
          <span className="text-2xl" style={{ color: "#c9a84c" }}>
            ☪
          </span>
        </div>
        {rightElement && <div>{rightElement}</div>}
      </div>
      {subtitle && (
        <div
          className="text-xs mt-1"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {subtitle}
        </div>
      )}
    </header>
  );
}
