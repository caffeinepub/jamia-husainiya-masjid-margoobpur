import { useState } from "react";
import { AdminScreen } from "./screens/AdminScreen";
import { ContactScreen } from "./screens/ContactScreen";
import { HomeScreen } from "./screens/HomeScreen";
import { MapScreen } from "./screens/MapScreen";
import { NamazScreen } from "./screens/NamazScreen";

export type Tab = "home" | "namaz" | "contact" | "map" | "admin";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("home");

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: "home", label: "Home", icon: "🏠" },
    { id: "namaz", label: "Namaz", icon: "🕌" },
    { id: "contact", label: "Contact", icon: "📞" },
    { id: "map", label: "Map", icon: "🗺️" },
    { id: "admin", label: "Admin", icon: "⚙️" },
  ];

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
          {activeTab === "contact" && <ContactScreen />}
          {activeTab === "map" && <MapScreen />}
          {activeTab === "admin" && <AdminScreen />}
        </main>

        {/* Bottom Navigation */}
        <nav
          className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-20 flex"
          style={{
            background: "#1a6b3a",
            boxShadow: "0 -2px 12px rgba(0,0,0,0.2)",
            borderTop: "2px solid #0d3d1f",
          }}
          data-ocid="nav.panel"
        >
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 flex flex-col items-center justify-center py-2"
                style={{
                  background: isActive ? "#0d3d1f" : "transparent",
                  borderTop: isActive
                    ? "3px solid #c9a84c"
                    : "3px solid transparent",
                }}
                data-ocid={`nav.${tab.id}.link`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span
                  className="text-[10px] mt-0.5 font-semibold"
                  style={{
                    color: isActive ? "#c9a84c" : "rgba(255,255,255,0.85)",
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
