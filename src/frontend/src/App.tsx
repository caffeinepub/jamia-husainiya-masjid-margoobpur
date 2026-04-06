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
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#c8e6c9",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          minHeight: "100vh",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          background: "#f0f9f0",
          boxShadow: "0 0 20px rgba(0,0,0,0.15)",
        }}
      >
        <main style={{ flex: 1, overflowY: "auto", paddingBottom: "64px" }}>
          {activeTab === "home" && <HomeScreen onTabChange={setActiveTab} />}
          {activeTab === "namaz" && <NamazScreen />}
          {activeTab === "contact" && <ContactScreen />}
          {activeTab === "map" && <MapScreen />}
          {activeTab === "admin" && <AdminScreen />}
        </main>

        <nav
          style={{
            position: "fixed",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "100%",
            maxWidth: "480px",
            zIndex: 20,
            display: "flex",
            background: "#1a7a3c",
            borderTop: "2px solid #145e2e",
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
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 0",
                  background: isActive ? "#145e2e" : "transparent",
                  borderTop: isActive
                    ? "3px solid #f5c518"
                    : "3px solid transparent",
                  border: "none",
                  cursor: "pointer",
                }}
                data-ocid={`nav.${tab.id}.link`}
              >
                <span style={{ fontSize: "20px" }}>{tab.icon}</span>
                <span
                  style={{
                    fontSize: "10px",
                    marginTop: "2px",
                    fontWeight: 600,
                    color: isActive ? "#f5c518" : "rgba(255,255,255,0.85)",
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
