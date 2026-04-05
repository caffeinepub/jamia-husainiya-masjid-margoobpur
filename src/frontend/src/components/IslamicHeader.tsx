import type { ReactNode } from "react";

interface IslamicHeaderProps {
  subtitle?: string;
  rightElement?: ReactNode;
}

export function IslamicHeader({ subtitle, rightElement }: IslamicHeaderProps) {
  return (
    <header
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #0d3d1f 0%, #1a6b3a 50%, #0d3d1f 100%)",
      }}
    >
      {/* Star pattern overlay */}
      <div
        className="absolute inset-0 islamic-star-bg pointer-events-none"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative px-4 py-4 flex flex-col items-center gap-1">
        {/* Arabic Bismillah */}
        <div
          className="text-sm text-center leading-relaxed"
          style={{
            color: "#c9a84c",
            fontFamily: "serif",
            letterSpacing: "0.03em",
            direction: "rtl",
          }}
        >
          بسم الله الرحمن الرحيم
        </div>

        {/* Mosque name with crescents */}
        <div className="flex items-center justify-center gap-2 w-full">
          <span className="text-lg flex-shrink-0" style={{ color: "#c9a84c" }}>
            ☪
          </span>
          <h1
            className="text-white font-bold text-center leading-tight"
            style={{ fontSize: "13px", letterSpacing: "0.02em" }}
          >
            Jamia Husainiya Masjid Margoobpur
          </h1>
          <span className="text-lg flex-shrink-0" style={{ color: "#c9a84c" }}>
            ☪
          </span>
        </div>

        {/* Subtitle + right element row */}
        {(subtitle || rightElement) && (
          <div className="flex items-center justify-between w-full mt-1 px-1">
            {subtitle ? (
              <div
                className="text-xs font-semibold"
                style={{ color: "rgba(255,255,255,0.75)" }}
              >
                {subtitle}
              </div>
            ) : (
              <div />
            )}
            {rightElement && <div>{rightElement}</div>}
          </div>
        )}
      </div>
    </header>
  );
}
