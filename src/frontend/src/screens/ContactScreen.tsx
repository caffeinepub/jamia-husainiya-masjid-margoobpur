import { useState } from "react";
import {
  useAddCommitteeMember,
  useCommitteeMembers,
  useDeleteCommitteeMember,
  useUpdateCommitteeMember,
} from "../hooks/useQueries";

const ADMIN_PIN = "786";

export function ContactScreen() {
  const { data: members = [], isLoading } = useCommitteeMembers();
  const addMember = useAddCommitteeMember();
  const deleteMember = useDeleteCommitteeMember();
  const updateMember = useUpdateCommitteeMember();

  const [showAddForm, setShowAddForm] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinVerified, setPinVerified] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const [deletingId, setDeletingId] = useState<bigint | null>(null);
  const [deletePin, setDeletePin] = useState("");

  const [editingMember, setEditingMember] = useState<{
    id: bigint;
    name: string;
    role: string;
    phone: string;
  } | null>(null);
  const [editPin, setEditPin] = useState("");
  const [editPinVerified, setEditPinVerified] = useState(false);

  const inputStyle = {
    padding: "8px 12px",
    border: "1px solid #c8e6c9",
    borderRadius: "6px",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  async function handleAddSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const result = await addMember.mutateAsync({
      pin: ADMIN_PIN,
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
    });
    if (result !== null) {
      setName("");
      setRole("");
      setPhone("");
      setShowAddForm(false);
      setPinVerified(false);
      setPinInput("");
    }
  }

  async function handleDeleteWithPin(id: bigint) {
    if (deletePin !== ADMIN_PIN) {
      alert("PIN galat hai!");
      return;
    }
    await deleteMember.mutateAsync({ pin: ADMIN_PIN, id });
    setDeletingId(null);
    setDeletePin("");
  }

  async function handleUpdateSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!editingMember) return;
    await updateMember.mutateAsync({
      pin: ADMIN_PIN,
      id: editingMember.id,
      name: editingMember.name,
      role: editingMember.role,
      phone: editingMember.phone,
    });
    setEditingMember(null);
    setEditPin("");
    setEditPinVerified(false);
  }

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
          📞 Sampark / Contact
        </h2>
      </div>

      <div style={{ padding: "16px" }}>
        <div
          style={{
            border: "1px solid #a5d6a7",
            borderRadius: "8px",
            padding: "14px",
            background: "white",
            marginBottom: "20px",
          }}
          data-ocid="contact.info.card"
        >
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: "#1a7a3c",
              marginBottom: "4px",
            }}
          >
            Jamia Husainiya Masjid Margoobpur
          </div>
          <div
            style={{ fontSize: "13px", color: "#555", marginBottom: "12px" }}
          >
            📞 089589 99299
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <a
              href="tel:08958999299"
              style={{
                flex: 1,
                background: "#1a7a3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "9px 0",
                fontSize: "13px",
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
              }}
              data-ocid="contact.call.button"
            >
              📞 Call karo
            </a>
            <a
              href="https://wa.me/918958999299"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                flex: 1,
                background: "#25D366",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "9px 0",
                fontSize: "13px",
                fontWeight: "bold",
                textAlign: "center",
                textDecoration: "none",
                display: "block",
              }}
              data-ocid="contact.whatsapp.button"
            >
              💬 WhatsApp
            </a>
          </div>
        </div>

        <div
          style={{
            fontWeight: "bold",
            fontSize: "15px",
            color: "#1a7a3c",
            marginBottom: "12px",
          }}
        >
          Masjid Committee
        </div>

        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? "#e8f5e9" : "#1a7a3c",
            color: showAddForm ? "#1a7a3c" : "white",
            border: showAddForm ? "1px solid #a5d6a7" : "none",
            borderRadius: "6px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: "bold",
            cursor: "pointer",
            marginBottom: "12px",
          }}
          data-ocid="contact.add_member.open_modal_button"
        >
          {showAddForm ? "✕ Cancel" : "+ Member Add karo"}
        </button>

        {showAddForm && (
          <form
            onSubmit={handleAddSubmit}
            style={{
              border: "1px solid #a5d6a7",
              borderRadius: "8px",
              padding: "12px",
              background: "white",
              marginBottom: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
            data-ocid="contact.add_member.modal"
          >
            {!pinVerified ? (
              <div>
                <div
                  style={{
                    fontSize: "12px",
                    color: "#555",
                    marginBottom: "6px",
                  }}
                >
                  Member add karne ke liye Admin PIN dalo
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <input
                    type="password"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    placeholder="PIN"
                    style={{ ...inputStyle, flex: 1 }}
                    data-ocid="contact.pin.input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (pinInput === ADMIN_PIN) setPinVerified(true);
                      else alert("PIN galat hai!");
                    }}
                    style={{
                      background: "#1a7a3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "8px 14px",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
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
                  style={inputStyle}
                  data-ocid="contact.member_name.input"
                />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role"
                  style={inputStyle}
                  data-ocid="contact.member_role.input"
                />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Phone Number"
                  style={inputStyle}
                  data-ocid="contact.member_phone.input"
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="submit"
                    disabled={addMember.isPending}
                    style={{
                      flex: 1,
                      background: "#1a7a3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "9px 0",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    data-ocid="contact.add_member.submit_button"
                  >
                    {addMember.isPending ? "Save ho raha hai..." : "Save karo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowAddForm(false);
                      setPinVerified(false);
                      setPinInput("");
                    }}
                    style={{
                      background: "#f5f5f5",
                      color: "#555",
                      border: "none",
                      borderRadius: "6px",
                      padding: "9px 14px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                    data-ocid="contact.add_member.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {deletingId !== null && (
          <div
            style={{
              border: "1px solid #ffcdd2",
              borderRadius: "8px",
              padding: "12px",
              background: "white",
              marginBottom: "12px",
            }}
            data-ocid="contact.delete_confirm.dialog"
          >
            <div
              style={{
                fontSize: "12px",
                color: "#c0392b",
                fontWeight: "bold",
                marginBottom: "8px",
              }}
            >
              Member delete karne ke liye Admin PIN dalo
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <input
                type="password"
                value={deletePin}
                onChange={(e) => setDeletePin(e.target.value)}
                placeholder="PIN"
                style={{ ...inputStyle, flex: 1, borderColor: "#ffcdd2" }}
                data-ocid="contact.delete_pin.input"
              />
              <button
                type="button"
                onClick={() =>
                  deletingId !== null && handleDeleteWithPin(deletingId)
                }
                style={{
                  background: "#c0392b",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 14px",
                  fontSize: "13px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
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
                style={{
                  background: "#f5f5f5",
                  color: "#555",
                  border: "none",
                  borderRadius: "6px",
                  padding: "8px 10px",
                  fontSize: "13px",
                  cursor: "pointer",
                }}
                data-ocid="contact.delete.cancel_button"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {editingMember && (
          <form
            onSubmit={handleUpdateSubmit}
            style={{
              border: "1px solid #a5d6a7",
              borderRadius: "8px",
              padding: "12px",
              background: "white",
              marginBottom: "14px",
              display: "flex",
              flexDirection: "column",
              gap: "8px",
            }}
            data-ocid="contact.edit_member.modal"
          >
            <div
              style={{ fontSize: "12px", fontWeight: "bold", color: "#1a7a3c" }}
            >
              Member Edit karo
            </div>
            {!editPinVerified ? (
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="password"
                  value={editPin}
                  onChange={(e) => setEditPin(e.target.value)}
                  placeholder="Admin PIN"
                  style={{ ...inputStyle, flex: 1 }}
                  data-ocid="contact.edit_pin.input"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (editPin === ADMIN_PIN) setEditPinVerified(true);
                    else alert("PIN galat hai!");
                  }}
                  style={{
                    background: "#1a7a3c",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    padding: "8px 14px",
                    fontSize: "13px",
                    cursor: "pointer",
                  }}
                  data-ocid="contact.edit_pin_verify.button"
                >
                  Verify
                </button>
              </div>
            ) : (
              <>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, name: e.target.value })
                  }
                  placeholder="Name"
                  style={inputStyle}
                  data-ocid="contact.edit_name.input"
                />
                <input
                  type="text"
                  value={editingMember.role}
                  onChange={(e) =>
                    setEditingMember({ ...editingMember, role: e.target.value })
                  }
                  placeholder="Role"
                  style={inputStyle}
                  data-ocid="contact.edit_role.input"
                />
                <input
                  type="tel"
                  value={editingMember.phone}
                  onChange={(e) =>
                    setEditingMember({
                      ...editingMember,
                      phone: e.target.value,
                    })
                  }
                  placeholder="Phone"
                  style={inputStyle}
                  data-ocid="contact.edit_phone.input"
                />
                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    type="submit"
                    disabled={updateMember.isPending}
                    style={{
                      flex: 1,
                      background: "#1a7a3c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      padding: "9px 0",
                      fontSize: "13px",
                      fontWeight: "bold",
                      cursor: "pointer",
                    }}
                    data-ocid="contact.edit_member.save_button"
                  >
                    {updateMember.isPending
                      ? "Save ho raha hai..."
                      : "Save karo"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMember(null);
                      setEditPin("");
                      setEditPinVerified(false);
                    }}
                    style={{
                      background: "#f5f5f5",
                      color: "#555",
                      border: "none",
                      borderRadius: "6px",
                      padding: "9px 14px",
                      fontSize: "13px",
                      cursor: "pointer",
                    }}
                    data-ocid="contact.edit_member.cancel_button"
                  >
                    Cancel
                  </button>
                </div>
              </>
            )}
          </form>
        )}

        {isLoading ? (
          <div
            style={{ color: "#888", fontSize: "13px" }}
            data-ocid="contact.loading_state"
          >
            Loading...
          </div>
        ) : members.length === 0 ? (
          <div
            style={{ color: "#888", fontSize: "13px" }}
            data-ocid="contact.members.empty_state"
          >
            Abhi koi member nahi.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {members.map((member, i) => (
              <div
                key={String(member.id)}
                style={{
                  border: "1px solid #c8e6c9",
                  borderRadius: "8px",
                  padding: "10px 12px",
                  background: "white",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
                data-ocid={`contact.member.item.${i + 1}`}
              >
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "50%",
                    background: "#1a7a3c",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                    fontSize: "14px",
                    flexShrink: 0,
                  }}
                >
                  {member.name.charAt(0).toUpperCase()}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                      fontSize: "13px",
                      color: "#1a7a3c",
                    }}
                  >
                    {member.name}
                  </div>
                  <div style={{ fontSize: "11px", color: "#888" }}>
                    {member.role}
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#145e2e",
                      marginTop: "2px",
                    }}
                  >
                    {member.phone}
                  </div>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    flexShrink: 0,
                  }}
                >
                  <a
                    href={`tel:${member.phone}`}
                    style={{
                      background: "#1a7a3c",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      textDecoration: "none",
                    }}
                    data-ocid={`contact.call.button.${i + 1}`}
                  >
                    📞 Call
                  </a>
                  <button
                    type="button"
                    onClick={() =>
                      setEditingMember({
                        id: member.id,
                        name: member.name,
                        role: member.role,
                        phone: member.phone,
                      })
                    }
                    style={{
                      background: "#e8f5e9",
                      color: "#1a7a3c",
                      border: "none",
                      borderRadius: "5px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                    data-ocid={`contact.member.edit_button.${i + 1}`}
                  >
                    ✏️ Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeletingId(member.id)}
                    style={{
                      background: "#ffebee",
                      color: "#c0392b",
                      border: "none",
                      borderRadius: "5px",
                      padding: "4px 8px",
                      fontSize: "11px",
                      cursor: "pointer",
                    }}
                    data-ocid={`contact.member.delete_button.${i + 1}`}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
