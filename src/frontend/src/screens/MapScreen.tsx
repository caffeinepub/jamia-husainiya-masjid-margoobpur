export function MapScreen() {
  const lat = 29.8629687;
  const lng = 77.9740235;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.001},${lat - 0.001},${lng + 0.001},${lat + 0.001}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-4"
        style={{
          background: "linear-gradient(90deg, #0f4a29 0%, #1a6b3a 100%)",
        }}
      >
        <div className="text-white font-bold text-base">🗺️ Location / Jagah</div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
          Map dekhein aur directions lo
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Masjid Info */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "white",
            border: "1px solid #e8f5e9",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <div className="px-4 py-3" style={{ background: "#e8f5e9" }}>
            <div className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              🕌 Jamia Husainiya Masjid Margoobpur
            </div>
          </div>
          <div className="px-4 py-3">
            <div className="text-sm" style={{ color: "#555" }}>
              📍 Margoobpur Deedaheri, Haridwar, Uttarakhand — 247667
            </div>
            <div className="text-xs mt-1" style={{ color: "#888" }}>
              Coordinates: {lat}, {lng}
            </div>
          </div>
        </div>

        {/* Map embed */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            border: "1px solid #e8f5e9",
            boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
          }}
        >
          <iframe
            title="Jamia Husainiya Masjid Location"
            src={osmUrl}
            width="100%"
            height="300"
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
          🗺️ Google Maps par Directions lo
        </a>

        {/* How to reach */}
        <div
          className="rounded-2xl p-4"
          style={{
            background: "white",
            border: "1px solid #e8f5e9",
            boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          }}
        >
          <div className="font-bold text-sm mb-2" style={{ color: "#0f4a29" }}>
            ℹ️ Kaise pahunchein
          </div>
          <div className="text-xs" style={{ color: "#555", lineHeight: 1.7 }}>
            Masjid Margoobpur village mein hai, Haridwar district ke paas.
            Google Maps mein "Jamia Husainiya Masjid Margoobpur" search karein
            ya oopar wala button dabayein.
          </div>
        </div>
      </div>
    </div>
  );
}
