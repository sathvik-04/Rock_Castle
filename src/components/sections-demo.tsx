import React, { useState } from "react";
import { ProjectsMatrix } from "./projects-matrix/ProjectsMatrix";
import { WhatWeProduce } from "./what-we-produce/WhatWeProduce";
import { ClientStories } from "./client-stories/ClientStories";
import { RockCastleSections } from "./RockCastleSections";

export default function SectionsDemo() {
  const [activeTab, setActiveTab] = useState<"all" | "projects" | "produce" | "stories">("all");

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#0a0b0a", color: "#f4f0e6", margin: 0, padding: 0 }}>
      {/* Sticky preview controls bar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 100,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          backgroundColor: "rgba(10, 11, 10, 0.88)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(244, 240, 230, 0.12)",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: "12px",
        }}
      >
        <span style={{ color: "#00d084", fontWeight: 600, letterSpacing: "0.15em" }}>
          ROCK CASTLE COMPONENTS
        </span>

        <div style={{ display: "flex", gap: "8px" }}>
          {(["all", "projects", "produce", "stories"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? "#00d084" : "transparent",
                color: activeTab === tab ? "#0c0d0c" : "#f4f0e6",
                border: "1px solid " + (activeTab === tab ? "#00d084" : "rgba(244, 240, 230, 0.2)"),
                padding: "6px 14px",
                borderRadius: "3px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "11px",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                fontWeight: activeTab === tab ? 600 : 400,
                transition: "all 0.2s ease",
              }}
            >
              {tab === "all" ? "All 3 Sections" : tab}
            </button>
          ))}
        </div>
      </nav>

      {/* Render selected component(s) */}
      {activeTab === "all" && <RockCastleSections />}
      {activeTab === "projects" && <ProjectsMatrix />}
      {activeTab === "produce" && <WhatWeProduce />}
      {activeTab === "stories" && <ClientStories />}
    </div>
  );
}
