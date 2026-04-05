import { useState } from "react";
import {
  useAddCommitteeMember,
  useCommitteeMembers,
  useDeleteCommitteeMember,
} from "../hooks/useQueries";

const ADMIN_PIN = "786";

export function ContactScreen() {
  const { data: members = [], isLoading } = useCommitteeMembers();
  const addMember = useAddCommitteeMember();
  const deleteMember = useDeleteCommitteeMember();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [pinInput, setPinInput] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [deletePin, setDeletePin] = useState("");
  const [deletingId, setDeletingId] = useState<bigint | null>(null);

  function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!pinVerified) {
      alert("Pehle PIN verify karo!");
      return;
    }
    if (!name.trim() || !role.trim() || !phone.trim()) {
      alert("Sab fields bharo!");
      return;
    }
    addMember.mutate(
      {
        pin: ADMIN_PIN,
        name: name.trim(),
        role: role.trim(),
        phoneNumber: phone.trim(),
      },
      {
        onSuccess: () => {
          setName("");
          setRole("");
          setPhone("");
          setShowAddForm(false);
          setPinVerified(false);
          setPinInput("");
        },
      },
    );
  }

  function handleDelete(id: bigint) {
    if (deletePin !== ADMIN_PIN) {
      setDeletingId(id);
      return;
    }
    deleteMember.mutate({ pin: ADMIN_PIN, id });
    setDeletingId(null);
    setDeletePin("");
  }

  function handleDeleteWithPin(id: bigint) {
    if (deletePin === ADMIN_PIN) {
      deleteMember.mutate({ pin: ADMIN_PIN, id });
      setDeletingId(null);
      setDeletePin("");
    } else {
      alert("PIN galat hai!");
    }
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div
        className="px-4 py-4"
        style={{
          background: "linear-gradient(90deg, #0f4a29 0%, #1a6b3a 100%)",
        }}
      >
        <div className="text-white font-bold text-base">
          📞 Contact / Sampark
        </div>
        <div className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>
          Masjid se contact karo
        </div>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Main contact card */}
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
          <div className="p-4 flex flex-col gap-3">
            <div className="text-sm" style={{ color: "#555" }}>
              📍 Margoobpur Deedaheri, Haridwar, Uttarakhand — 247667
            </div>
            <div className="text-sm font-semibold" style={{ color: "#0f4a29" }}>
              📞 089589 99299
            </div>
            <div className="flex gap-3">
              <a
                href="tel:08958999299"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={{ background: "#1a6b3a", color: "white" }}
                data-ocid="contact.call.button"
              >
                📞 Call karo
              </a>
              <a
                href="https://wa.me/918958999299"
                target="_blank"
                rel="noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm"
                style={{ background: "#25d366", color: "white" }}
                data-ocid="contact.whatsapp.button"
              >
                💬 WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* Committee Members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="font-bold text-sm" style={{ color: "#0f4a29" }}>
              👥 Masjid Committee
            </div>
            <button
              type="button"
              onClick={() => setShowAddForm(!showAddForm)}
              className="text-xs px-3 py-1.5 rounded-full font-semibold"
              style={{ background: "#1a6b3a", color: "white" }}
              data-ocid="contact.add_member.button"
            >
              + Member Add karo
            </button>
          </div>

          {/* Add Form */}
          {showAddForm && (
            <div
              className="rounded-xl overflow-hidden mb-3"
              style={{
                background: "white",
                border: "1px solid #e8f5e9",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              data-ocid="contact.add_member.modal"
            >
              <div className="px-4 py-2" style={{ background: "#e8f5e9" }}>
                <span
                  className="font-bold text-sm"
                  style={{ color: "#0f4a29" }}
                >
                  Naya Member Add karo
                </span>
              </div>
              <form
                onSubmit={handleAddSubmit}
                className="p-4 flex flex-col gap-3"
              >
                {!pinVerified ? (
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="contact-pin-input"
                      className="text-xs font-semibold"
                      style={{ color: "#555" }}
                    >
                      Admin PIN dalo (786)
                    </label>
                    <div className="flex gap-2">
                      <input
                        id="contact-pin-input"
                        type="password"
                        value={pinInput}
                        onChange={(e) => setPinInput(e.target.value)}
                        placeholder="PIN"
                        className="flex-1 px-3 py-2 rounded-lg border text-sm"
                        style={{ borderColor: "#c8e6c9" }}
                        data-ocid="contact.pin.input"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (pinInput === ADMIN_PIN) setPinVerified(true);
                          else alert("PIN galat hai!");
                        }}
                        className="px-4 py-2 rounded-lg text-sm font-semibold"
                        style={{ background: "#1a6b3a", color: "white" }}
                        data-ocid="contact.pin_verify.button"
                      >
                        Verify karo
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Name"
                      className="px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "#c8e6c9" }}
                      data-ocid="contact.member_name.input"
                    />
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Role (jaise: Imam, Secretary)"
                      className="px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "#c8e6c9" }}
                      data-ocid="contact.member_role.input"
                    />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Phone Number"
                      className="px-3 py-2 rounded-lg border text-sm"
                      style={{ borderColor: "#c8e6c9" }}
                      data-ocid="contact.member_phone.input"
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={addMember.isPending}
                        className="flex-1 py-2 rounded-lg font-semibold text-sm"
                        style={{ background: "#1a6b3a", color: "white" }}
                        data-ocid="contact.add_member.submit_button"
                      >
                        {addMember.isPending
                          ? "Save ho raha hai..."
                          : "Save karo"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setPinVerified(false);
                          setPinInput("");
                        }}
                        className="px-4 py-2 rounded-lg text-sm"
                        style={{ background: "#f5f5f5", color: "#555" }}
                        data-ocid="contact.add_member.cancel_button"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}
              </form>
            </div>
          )}

          {/* Delete PIN prompt */}
          {deletingId !== null && (
            <div
              className="rounded-xl p-4 mb-3"
              style={{
                background: "white",
                border: "1px solid #ffcdd2",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
              data-ocid="contact.delete_confirm.dialog"
            >
              <div
                className="text-sm font-semibold mb-2"
                style={{ color: "#c0392b" }}
              >
                Member delete karne ke liye Admin PIN dalo
              </div>
              <div className="flex gap-2">
                <input
                  type="password"
                  value={deletePin}
                  onChange={(e) => setDeletePin(e.target.value)}
                  placeholder="PIN"
                  className="flex-1 px-3 py-2 rounded-lg border text-sm"
                  style={{ borderColor: "#ffcdd2" }}
                  data-ocid="contact.delete_pin.input"
                />
                <button
                  type="button"
                  onClick={() =>
                    deletingId !== null && handleDeleteWithPin(deletingId)
                  }
                  className="px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "#c0392b", color: "white" }}
                  data-ocid="contact.delete.confirm_button"
                >
                  Delete karo
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeletingId(null);
                    setDeletePin("");
                  }}
                  className="px-3 py-2 rounded-lg text-sm"
                  style={{ background: "#f5f5f5", color: "#555" }}
                  data-ocid="contact.delete.cancel_button"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Members list */}
          {isLoading ? (
            <div
              className="flex flex-col gap-2"
              data-ocid="contact.loading_state"
            >
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-16 rounded-xl animate-pulse"
                  style={{ background: "#e8f5e9" }}
                />
              ))}
            </div>
          ) : members.length === 0 ? (
            <div
              className="rounded-xl p-6 text-center"
              style={{ background: "#f5f5f5" }}
              data-ocid="contact.members.empty_state"
            >
              <div className="text-sm" style={{ color: "#888" }}>
                Abhi koi member nahi. &quot;+ Member Add karo&quot; se add
                karein.
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {members.map((member, i) => (
                <div
                  key={String(member.id)}
                  className="rounded-xl overflow-hidden"
                  style={{
                    background: "white",
                    border: "1px solid #e8f5e9",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
                  }}
                  data-ocid={`contact.member.item.${i + 1}`}
                >
                  <div className="flex items-center px-4 py-3 gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                      style={{ background: "#1a6b3a" }}
                    >
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div
                        className="font-bold text-sm truncate"
                        style={{ color: "#0f4a29" }}
                      >
                        {member.name}
                      </div>
                      <div className="text-xs" style={{ color: "#888" }}>
                        {member.role}
                      </div>
                      <div
                        className="text-xs mt-0.5"
                        style={{ color: "#1a6b3a" }}
                      >
                        📞 {member.phoneNumber}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${member.phoneNumber}`}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ background: "#e8f5e9" }}
                        data-ocid={`contact.member_call.button.${i + 1}`}
                      >
                        📞
                      </a>
                      <button
                        type="button"
                        onClick={() => handleDelete(member.id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm"
                        style={{ background: "#ffebee" }}
                        data-ocid={`contact.member_delete.button.${i + 1}`}
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
