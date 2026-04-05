import { useState } from "react";
import { AdminScreen } from "./screens/AdminScreen";
import { ContactScreen } from "./screens/ContactScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { MapScreen } from "./screens/MapScreen";
import { NamazScreen } from "./screens/NamazScreen";
import { NoticeScreen } from "./screens/NoticeScreen";
import { PeopleScreen } from "./screens/PeopleScreen";

export type Tab =
  | "home"
  | "namaz"
  | "notice"
  | "contact"
  | "map"
  | "people"
  | "admin";

function HomeSVG({ active }: { active: boolean }) {
  return (
    <svg
      role="img"
      aria-label="Home"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "#c9a84c" : "none"}
      stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"
        fill={active ? "rgba(201,168,76,0.2)" : "none"}
      />
      <path
        d="M9 21V12h6v9"
        stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
        fill="none"
      />
    </svg>
  );
}

function MosqueSVG({ active }: { active: boolean }) {
  const c = active ? "#c9a84c" : "rgba(255,255,255,0.6)";
  return (
    <svg
      role="img"
      aria-label="Namaz"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={c}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M12 2C10.5 4 9 5.5 9 7c0 1.1.9 2 2 2h2c1.1 0 2-.9 2-2 0-1.5-1.5-3-3-5z"
        fill={active ? "rgba(201,168,76,0.2)" : "none"}
      />
      <path d="M7 9h10v2H7z" />
      <path
        d="M5 11h14v10H5z"
        fill={active ? "rgba(201,168,76,0.1)" : "none"}
      />
      <path d="M9 21v-5h6v5" />
      <path d="M5 21h14" />
    </svg>
  );
}

function BellSVG({ active }: { active: boolean }) {
  return (
    <svg
      role="img"
      aria-label="Notice"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "rgba(201,168,76,0.2)" : "none"}
      stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" fill="none" />
    </svg>
  );
}

function PhoneSVG({ active }: { active: boolean }) {
  return (
    <svg
      role="img"
      aria-label="Contact"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill={active ? "rgba(201,168,76,0.2)" : "none"}
      stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.4 12.07a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.51 1.4h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.01a16 16 0 0 0 6.05 6.05l1.87-1.87a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MapPinSVG({ active }: { active: boolean }) {
  return (
    <svg
      role="img"
      aria-label="Map"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path
        d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"
        fill={active ? "rgba(201,168,76,0.2)" : "none"}
      />
      <circle
        cx="12"
        cy="10"
        r="3"
        fill={active ? "#c9a84c" : "none"}
        stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
      />
    </svg>
  );
}

function PeopleSVG({ active }: { active: boolean }) {
  return (
    <svg
      role="img"
      aria-label="People"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle
        cx="9"
        cy="7"
        r="4"
        fill={active ? "rgba(201,168,76,0.15)" : "none"}
      />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

function AdminSVG({ active }: { active: boolean }) {
  return (
    <svg
      role="img"
      aria-label="Admin"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke={active ? "#c9a84c" : "rgba(255,255,255,0.6)"}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle
        cx="12"
        cy="12"
        r="3"
        fill={active ? "rgba(201,168,76,0.2)" : "none"}
      />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}

const TABS: { id: Tab; label: string; Icon: React.FC<{ active: boolean }> }[] =
  [
    { id: "home", label: "Home", Icon: HomeSVG },
    { id: "namaz", label: "Namaz", Icon: MosqueSVG },
    { id: "notice", label: "Notice", Icon: BellSVG },
    { id: "contact", label: "Contact", Icon: PhoneSVG },
    { id: "map", label: "Map", Icon: MapPinSVG },
    { id: "people", label: "लोग", Icon: PeopleSVG },
    { id: "admin", label: "Admin", Icon: AdminSVG },
  ];

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "#d0e8d8" }}
    >
      <div
        className="w-full max-w-[430px] min-h-screen relative flex flex-col shadow-2xl overflow-hidden"
        style={{ background: "#f0f7f0" }}
      >
        {/* Scrollable content */}
        <main className="flex-1 overflow-y-auto pb-20">
          {activeTab === "home" && <HomeScreen onTabChange={setActiveTab} />}
          {activeTab === "namaz" && <NamazScreen />}
          {activeTab === "notice" && <NoticeScreen />}
          {activeTab === "contact" && <ContactScreen />}
          {activeTab === "map" && <MapScreen />}
          {activeTab === "people" && <PeopleScreen />}
          {activeTab === "admin" && <AdminScreen />}
        </main>

        {/* Bottom Navigation */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-20 flex"
          style={{
            background: "#0d3d1f",
            boxShadow: "0 -2px 16px rgba(0,0,0,0.25)",
            borderTop: "1px solid rgba(201,168,76,0.2)",
          }}
          data-ocid="nav.panel"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-2 relative transition-all"
                style={{
                  background: isActive
                    ? "rgba(201,168,76,0.12)"
                    : "transparent",
                }}
                data-ocid={`nav.${tab.id}.link`}
              >
                {/* Gold top indicator bar */}
                {isActive && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2"
                    style={{
                      background: "#c9a84c",
                      height: "2px",
                      width: "28px",
                      borderRadius: "0 0 4px 4px",
                    }}
                  />
                )}
                <tab.Icon active={isActive} />
                <span
                  className="text-[9px] mt-0.5 font-semibold"
                  style={{
                    color: isActive ? "#c9a84c" : "rgba(255,255,255,0.55)",
                  }}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
