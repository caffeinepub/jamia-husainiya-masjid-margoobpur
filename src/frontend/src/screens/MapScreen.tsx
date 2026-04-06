import { SimpleHeader } from "../components/SimpleHeader";

export function MapScreen() {
  const lat = 29.8629687;
  const lng = 77.9740235;
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng - 0.001},${lat - 0.001},${lng + 0.001},${lat + 0.001}&layer=mapnik&marker=${lat},${lng}`;

  return (
    <div className="flex flex-col">
      {/* Islamic Header */}
      <SimpleHeader subtitle="🗺️ Location / Jagah" />

      <div className="p-4 flex flex-col gap-4">
        {/* Masjid Info */}
        <div
          className="rounded-2xl overflow-hidden shadow-md"
          style={{
            background: "white",
            border: "1px solid #e8f5e9",
          }}
        >
          <div
            className="px-4 py-3"
            style={{
              background: "linear-gradient(90deg, #0d3d1f 0%, #1a6b3a 100%)",
            }}
          >
            <div className="font-bold text-sm text-white">
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
          className="rounded-2xl overflow-hidden shadow-md"
          style={{
            border: "1px solid #e8f5e9",
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
          className="flex items-center justify-center gap-2 py-4 rounded-2xl font-bold text-base shadow-md"
          style={{ background: "#1a6b3a", color: "white" }}
          data-ocid="map.directions.button"
        >
          🗺️ Google Maps par Directions lo
        </a>

        {/* How to reach */}
        <div
          className="rounded-2xl p-4 shadow-sm"
          style={{
            background: "white",
            border: "1px solid #e8f5e9",
          }}
        >
          <div className="font-bold text-sm mb-2" style={{ color: "#0d3d1f" }}>
            ℹ️ Kaise pahunchein
          </div>
          <div className="text-xs" style={{ color: "#555", lineHeight: 1.7 }}>
            Masjid Margoobpur village mein hai, Haridwar district ke paas.
            Google Maps mein &quot;Jamia Husainiya Masjid Margoobpur&quot;
            search karein ya oopar wala button dabayein.
          </div>
        </div>
      </div>
    </div>
  );
}
