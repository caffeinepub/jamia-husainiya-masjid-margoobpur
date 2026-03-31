export function MapScreen() {
  const lat = 29.8629687;
  const lng = 77.9740235;

  return (
    <div className="px-4 py-5" data-ocid="map.page">
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          Find Us
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">
          Jamia Husainiya Masjid Margoobpur
        </p>
      </div>

      {/* Map embed */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden mb-4">
        <div className="relative" style={{ height: "340px" }}>
          <iframe
            src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d500!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjnCsDUxJzQ2LjciTiA3N8KwNTgnMjYuNSJF!5e0!3m2!1sen!2sin!4v1234567890`}
            width="100%"
            height="340"
            style={{ border: "0" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Jamia Husainiya Masjid Margoobpur Location"
          />
        </div>
      </div>

      {/* Address card */}
      <div className="bg-white rounded-2xl p-4 shadow-card mb-4">
        <div className="flex items-start gap-3">
          <span className="text-xl mt-0.5">📍</span>
          <div>
            <p className="font-semibold text-sm" style={{ color: "#1a6b3c" }}>
              Jamia Husainiya Masjid Margoobpur
            </p>
            <p className="text-sm text-gray-600 mt-0.5 leading-relaxed">
              Margoobpur Deedaheri,
              <br />
              Haridwar, Uttarakhand — 247667
            </p>
          </div>
        </div>
      </div>

      {/* Directions button */}
      <a
        href={`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white font-semibold text-sm"
        style={{ background: "#1a6b3c" }}
      >
        🗺️ Google Maps पर Directions लें
      </a>
    </div>
  );
}
