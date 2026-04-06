export function MapScreen() {
  return (
    <div style={{ background: "#f0f9f0", minHeight: "100vh" }}>
      <div
        style={{
          background: "#1a7a3c",
          padding: "12px 16px",
          borderBottom: "2px solid #145e2e",
        }}
      >
        <h2
          style={{
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            margin: 0,
          }}
        >
          🗺️ Masjid ka Naksha
        </h2>
      </div>
      <div style={{ padding: "16px" }}>
        <div
          style={{
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid #a5d6a7",
            marginBottom: "14px",
          }}
          data-ocid="map.iframe.panel"
        >
          <iframe
            src="https://maps.google.com/maps?q=29.8629687,77.9740235&z=15&output=embed"
            width="100%"
            height="300"
            style={{ border: "none", display: "block" }}
            title="Jamia Husainiya Masjid Margoobpur"
            loading="lazy"
          />
        </div>
        <a
          href="https://www.google.com/maps?q=29.8629687,77.9740235"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            background: "#1a7a3c",
            color: "white",
            textAlign: "center",
            padding: "12px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px",
          }}
          data-ocid="map.directions.button"
        >
          🗺️ Google Maps par Directions len
        </a>
      </div>
    </div>
  );
}
