import { IslamicHeader } from "../components/IslamicHeader";
import { useCommitteeMembers } from "../hooks/useQueries";

export function PeopleScreen() {
  const { data: members = [], isLoading } = useCommitteeMembers();

  return (
    <div className="flex flex-col">
      {/* Islamic Header */}
      <IslamicHeader subtitle="👥 Log / People" />

      <div className="p-4 flex flex-col gap-3">
        {isLoading ? (
          <div className="flex flex-col gap-3" data-ocid="people.loading_state">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-20 rounded-2xl animate-pulse"
                style={{ background: "#e8f5e9" }}
              />
            ))}
          </div>
        ) : members.length === 0 ? (
          <div
            className="rounded-2xl p-8 flex flex-col items-center gap-3 text-center shadow-sm"
            style={{ background: "white", border: "1px solid #e8f5e9" }}
            data-ocid="people.empty_state"
          >
            <span className="text-4xl">👤</span>
            <div className="font-bold" style={{ color: "#0d3d1f" }}>
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
                className="rounded-2xl overflow-hidden shadow-md"
                style={{
                  background: "white",
                  border: "1px solid #e8f5e9",
                }}
                data-ocid={`people.member.item.${i + 1}`}
              >
                <div className="flex items-center p-4 gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-white text-xl flex-shrink-0"
                    style={{
                      background: `hsl(${(i * 47 + 140) % 360}, 50%, 30%)`,
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold" style={{ color: "#0d3d1f" }}>
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
