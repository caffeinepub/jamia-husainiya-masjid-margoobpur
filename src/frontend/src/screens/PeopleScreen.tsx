import type { CommitteeMember } from "../backend.d";
import { useCommitteeMembers } from "../hooks/useQueries";

export function PeopleScreen() {
  const { data: members, isLoading } = useCommitteeMembers();

  return (
    <div className="px-4 py-5" data-ocid="people.page">
      <div className="mb-5">
        <h2 className="font-bold text-xl" style={{ color: "#1a6b3c" }}>
          मस्जिद कमेटी
        </h2>
        <p
          className="text-xs text-gray-500 mt-0.5"
          style={{ fontFamily: "serif" }}
        >
          أعضاء لجنة المسجد
        </p>
      </div>

      {/* Banner */}
      <div
        className="rounded-2xl p-4 mb-5 text-center relative overflow-hidden"
        style={{ background: "#1a6b3c" }}
      >
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg role="img" aria-label="decorative" width="100%" height="100%">
            <defs>
              <pattern
                id="ppat"
                x="0"
                y="0"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <polygon
                  points="15,1 18,10 28,10 20,16 23,26 15,20 7,26 10,16 2,10 12,10"
                  fill="white"
                  fillOpacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#ppat)" />
          </svg>
        </div>
        <p className="text-white font-bold text-base relative">👥 कमेटी सदस्य</p>
        <p className="text-xs relative mt-1" style={{ color: "#c9a84c" }}>
          जामिया हुसैनिया मस्जिद मरगूबपुर
        </p>
      </div>

      {isLoading ? (
        <div className="space-y-3" data-ocid="people.loading_state">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl p-4 shadow-card animate-pulse"
              style={{ background: "#e8f5ee", height: "80px" }}
            />
          ))}
        </div>
      ) : !members || members.length === 0 ? (
        <div
          className="bg-white rounded-2xl p-8 text-center shadow-card"
          data-ocid="people.empty_state"
        >
          <div className="text-4xl mb-3">👤</div>
          <p className="text-sm text-gray-500 leading-relaxed">
            अभी कोई committee member नहीं जोड़ा गया है।
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Admin panel से members जोड़ें।
          </p>
        </div>
      ) : (
        <div className="space-y-3" data-ocid="people.list">
          {(members as CommitteeMember[]).map((member, index) => (
            <div
              key={String(member.id)}
              className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4"
              data-ocid={`people.item.${index + 1}`}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold text-white flex-shrink-0"
                style={{ background: "#1a6b3c" }}
              >
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-800">{member.name}</p>
                {member.role && (
                  <span
                    className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-0.5"
                    style={{ background: "#e8f5ee", color: "#1a6b3c" }}
                  >
                    {member.role}
                  </span>
                )}
              </div>
              <a
                href={`tel:${member.phoneNumber}`}
                className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full"
                style={{ background: "#e8f5ee", color: "#1a6b3c" }}
                data-ocid={`people.call.button.${index + 1}`}
              >
                📞 {member.phoneNumber}
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
