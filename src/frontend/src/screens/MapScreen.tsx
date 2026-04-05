export function MapScreen() {
  const lat = 29.8629687;
  const lng = 77.9740235;

  return (
    <div className="px-4 py-5" data-ocid="map.page">
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          हमें ढूंढें
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          जामिया हुसैनिया मस्जिद मरगूबपुर
        </p>
      </div>

      {/* Map embed */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
        <div style={{ height: "340px" }}>
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=77.9730235,29.8619687,77.9750235,29.8639687&layer=mapnik&marker=${lat},${lng}`}
            width="100%"
            height="340"
            style={{ border: "0", display: "block" }}
            loading="lazy"
            title="जामिया हुसैनिया मस्जिद मरगूबपुर की स्थिति"
          />
        </div>
      </div>

      {/* Address card */}
      <div
        className="bg-white rounded-2xl p-4 shadow-card mb-4"
        data-ocid="map.address.card"
      >
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">📍</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1a6b3c" }}>
              जामिया हुसैनिया मस्जिद मरगूबपुर
            </p>
            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
              मरगूबपुर दीदहेरी,
              <br />
              हरिद्वार, उत्तराखंड — 247667
            </p>
          </div>
        </div>
      </div>

      {/* Directions button */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm shadow"
        style={{ background: "#1a6b3c" }}
        data-ocid="map.directions.button"
      >
        🗺️ Google Maps पर Directions लें
      </a>
    </div>
  );
}
