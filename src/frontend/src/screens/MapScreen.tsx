export function MapScreen() {
  const lat = 29.8629687;
  const lng = 77.9740235;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.01},${lat - 0.01},${lng + 0.01},${lat + 0.01}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 py-4" style={{ background: "#1a6b3a" }}>
        <div className="text-white font-bold text-base">
          🗺️ Masjid ka Location
        </div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
          Map dekhein aur directions lo
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Map embed */}
        <div
          className="rounded-2xl overflow-hidden shadow-card"
          style={{ border: "1px solid #e8f5e9" }}
        >
          <iframe
            title="Masjid Location Map"
            src={osmUrl}
            width="100%"
            height="280"
            style={{ border: "none", display: "block" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Directions button */}
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-base"
          style={{ background: "#1a6b3a", color: "white" }}
          data-ocid="map.directions.button"
        >
          📍 Google Maps mein Directions lo
        </a>

        {/* Address info */}
        <div
          className="rounded-2xl p-4 shadow-card"
          style={{ background: "white", border: "1px solid #e8f5e9" }}
        >
          <div className="font-bold text-sm mb-2" style={{ color: "#0f4a29" }}>
            🕌 Masjid Address
          </div>
          <div className="text-sm" style={{ color: "#555" }}>
            Jamia Husainiya Masjid Margoobpur
          </div>
          <div className="text-sm" style={{ color: "#555" }}>
            Margoobpur Deedaheri
          </div>
          <div className="text-sm" style={{ color: "#555" }}>
            Haridwar, Uttarakhand — 247667
          </div>
          <div className="text-xs mt-2" style={{ color: "#888" }}>
            📌 Coordinates: {lat}, {lng}
          </div>
        </div>
      </div>
    </div>
  );
}
