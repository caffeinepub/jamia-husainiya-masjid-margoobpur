import { useCommitteeMembers } from "../hooks/useQueries";

export function PeopleScreen() {
  const { data: members = [], isLoading } = useCommitteeMembers();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="px-4 py-4" style={{ background: "#1a6b3a" }}>
        <div className="text-white font-bold text-base">👥 Masjid ke Log</div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
          Committee members aur staff
        </div>
      </div>

      <div className="p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-3" data-ocid="people.loading_state">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-xl animate-pulse"
                style={{ background: "#e8f5e9" }}
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center"
            style={{ background: "white" }}
            data-ocid="people.empty_state"
          >
            <span className="text-4xl">👤</span>
            <div className="font-bold" style={{ color: "#0f4a29" }}>
              Koi Member Nahi
            </div>
            <div className="text-sm" style={{ color: "#888" }}>
              Contact screen se admin PIN (786) se members add karein.
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {members.map((member, i) => (
              <div
                key={String(member.id)}
                className="rounded-2xl overflow-hidden shadow-card"
                style={{ background: "white", border: "1px solid #e8f5e9" }}
                data-ocid={`people.member.item.${i + 1}`}
              >
                <div className="flex items-center p-4 gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl flex-shrink-0"
                    style={{
                      background: `hsl(${(i * 47) % 360}, 50%, 30%)`,
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold" style={{ color: "#0f4a29" }}>
                      {member.name}
                    </div>
                    <div className="text-sm" style={{ color: "#888" }}>
                      {member.role}
                    </div>
                    <div className="text-xs mt-1" style={{ color: "#1a6b3a" }}>
                      📞 {member.phoneNumber}
                    </div>
                  </div>
                  <a
                    href={`tel:${member.phoneNumber}`}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                    style={{ background: "#e8f5e9" }}
                    data-ocid={`people.member_call.button.${i + 1}`}
                  >
                    📞
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
