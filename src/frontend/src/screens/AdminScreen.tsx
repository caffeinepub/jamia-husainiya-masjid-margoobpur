import { useEffect, useState } from "react";
import type { PrayerTime } from "../backend.d";
import {
  useAddCommitteeMember,
  useAddNotice,
  useCommitteeMembers,
  useDeleteCommitteeMember,
  useDeleteNotice,
  useNotices,
  usePrayerTimes,
  useUpdateNotice,
  useUpdatePrayerTime,
} from "../hooks/useQueries";
import { getDisplayName, isJumaPrayer } from "../utils/prayerUtils";

const ADMIN_PIN = "786";
type AdminTab = "prayers" | "notices" | "committee";

export function AdminScreen() {
  const [pin, setPin] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("prayers");

  function handleLogin() {
    if (pin === ADMIN_PIN) {
      setIsLoggedIn(true);
      setLoginError(false);
    } else setLoginError(true);
  }

  if (!isLoggedIn) {
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
            ⚙️ Admin Panel
          </h2>
        </div>
        <div style={{ padding: "32px 24px" }}>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "14px",
              color: "#1a7a3c",
              marginBottom: "12px",
            }}
          >
            Admin PIN dalo
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              placeholder="PIN enter karo"
              style={{
                flex: 1,
                padding: "10px 12px",
                border: `1px solid ${loginError ? "#c0392b" : "#c8e6c9"}`,
                borderRadius: "6px",
                fontSize: "14px",
              }}
              data-ocid="admin.pin.input"
            />
            <button
              type="button"
              onClick={handleLogin}
              style={{
                background: "#1a7a3c",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "10px 20px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              data-ocid="admin.login.button"
            >
              Login
            </button>
          </div>
          {loginError && (
            <div
              style={{ color: "#c0392b", fontSize: "12px", marginTop: "8px" }}
              data-ocid="admin.login.error_state"
            >
              PIN galat hai! Dobara koshish karo.
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: "#f0f9f0", minHeight: "100vh" }}>
      <div
        style={{
          background: "#1a7a3c",
          padding: "12px 16px",
          borderBottom: "2px solid #145e2e",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
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
          ⚙️ Admin Panel
        </h2>
        <button
          type="button"
          onClick={() => {
            setIsLoggedIn(false);
            setPin("");
          }}
          style={{
            background: "rgba(255,255,255,0.2)",
            color: "white",
            border: "none",
            borderRadius: "6px",
            padding: "5px 10px",
            fontSize: "12px",
            cursor: "pointer",
          }}
          data-ocid="admin.logout.button"
        >
          Logout
        </button>
      </div>

      <div
        style={{
          display: "flex",
          borderBottom: "2px solid #a5d6a7",
          background: "white",
        }}
        data-ocid="admin.tabs.panel"
      >
        {(["prayers", "notices", "committee"] as AdminTab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              flex: 1,
              padding: "10px 0",
              background: activeTab === tab ? "#e8f5e9" : "transparent",
              borderBottom: activeTab === tab ? "2px solid #1a7a3c" : "none",
              border: "none",
              color: activeTab === tab ? "#1a7a3c" : "#888",
              fontWeight: activeTab === tab ? "bold" : "normal",
              fontSize: "12px",
              cursor: "pointer",
            }}
            data-ocid={`admin.${tab}.tab`}
          >
            {tab === "prayers"
              ? "🕌 Namaz"
              : tab === "notices"
                ? "📢 Suchna"
                : "👥 Committee"}
          </button>
        ))}
      </div>

      <div style={{ padding: "16px" }}>
        {activeTab === "prayers" && <PrayerManagement adminPin={ADMIN_PIN} />}
        {activeTab === "notices" && <NoticeManagement adminPin={ADMIN_PIN} />}
        {activeTab === "committee" && (
          <CommitteeManagementPanel adminPin={ADMIN_PIN} />
        )}
      </div>
    </div>
  );
}

function PrayerManagement({ adminPin }: { adminPin: string }) {
  const { data: prayers = [], isLoading } = usePrayerTimes();
  const updatePrayer = useUpdatePrayerTime();
  const [editTimes, setEditTimes] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (prayers.length) {
      const initial: Record<string, string> = {};
      for (const p of prayers) initial[p.name] = p.time;
      setEditTimes(initial);
    }
  }, [prayers]);

  async function handleSave(prayer: PrayerTime) {
    const newTime = editTimes[prayer.name] || prayer.time;
    await updatePrayer.mutateAsync({
      pin: adminPin,
      name: prayer.name,
      time: newTime,
      isJuma: isJumaPrayer(prayer.name),
      order: prayer.order,
    });
    setSaved((prev) => ({ ...prev, [prayer.name]: true }));
    setTimeout(
      () => setSaved((prev) => ({ ...prev, [prayer.name]: false })),
      2000,
    );
  }

  if (isLoading)
    return <div style={{ color: "#888", fontSize: "13px" }}>Loading...</div>;

  return (
    <div>
      <div
        style={{
          fontWeight: "bold",
          fontSize: "14px",
          color: "#1a7a3c",
          marginBottom: "12px",
        }}
      >
        Namaz Timings Edit karo
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {prayers.map((prayer, i) => (
          <div
            key={String(prayer.order)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "8px",
              padding: "10px 12px",
              background: "white",
              border: "1px solid #c8e6c9",
              borderRadius: "6px",
            }}
            data-ocid={`admin.prayer.item.${i + 1}`}
          >
            <span
              style={{
                fontSize: "13px",
                fontWeight: "600",
                color: "#333",
                flex: 1,
              }}
            >
              {getDisplayName(prayer.name)}
              {isJumaPrayer(prayer.name) && (
                <span
                  style={{
                    background: "#f5c518",
                    color: "#1a7a3c",
                    fontSize: "9px",
                    fontWeight: "bold",
                    padding: "1px 5px",
                    borderRadius: "3px",
                    marginLeft: "6px",
                  }}
                >
                  Sirf Juma
                </span>
              )}
            </span>
            <input
              type="text"
              value={editTimes[prayer.name] || prayer.time}
              onChange={(e) =>
                setEditTimes((prev) => ({
                  ...prev,
                  [prayer.name]: e.target.value,
                }))
              }
              style={{
                width: "90px",
                padding: "6px 8px",
                border: "1px solid #a5d6a7",
                borderRadius: "5px",
                fontSize: "13px",
                textAlign: "center",
              }}
              data-ocid={`admin.prayer.time.input.${i + 1}`}
            />
            <button
              type="button"
              onClick={() => handleSave(prayer)}
              disabled={updatePrayer.isPending}
              style={{
                background: saved[prayer.name] ? "#388e3c" : "#1a7a3c",
                color: "white",
                border: "none",
                borderRadius: "5px",
                padding: "6px 12px",
                fontSize: "12px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
              data-ocid={`admin.prayer.save_button.${i + 1}`}
            >
              {saved[prayer.name] ? "✓ Saved" : "Save"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoticeManagement({ adminPin }: { adminPin: string }) {
  const { data: notices = [], isLoading } = useNotices();
  const addNotice = useAddNotice();
  const updateNotice = useUpdateNotice();
  const deleteNotice = useDeleteNotice();

  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingNotice, setEditingNotice] = useState<{
    id: bigint;
    title: string;
    body: string;
  } | null>(null);

  const inputStyle = {
    padding: "8px 10px",
    border: "1px solid #c8e6c9",
    borderRadius: "6px",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    const result = await addNotice.mutateAsync({
      pin: adminPin,
      title: title.trim(),
      body: body.trim(),
    });
    if (result !== null) {
      setTitle("");
      setBody("");
      setShowAddForm(false);
    }
  }

  async function handleUpdate(e: React.FormEvent) {
    e.preventDefault();
    if (!editingNotice?.title.trim()) return;
    await updateNotice.mutateAsync({
      pin: adminPin,
      id: editingNotice.id,
      title: editingNotice.title,
      body: editingNotice.body,
    });
    setEditingNotice(null);
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Yeh suchna delete karni hai?")) return;
    await deleteNotice.mutateAsync({ pin: adminPin, id });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1a7a3c" }}>
          Suchnaein Manage karo
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? "#f5f5f5" : "#1a7a3c",
            color: showAddForm ? "#555" : "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          data-ocid="admin.add_notice.open_modal_button"
        >
          {showAddForm ? "Cancel" : "+ Nai Suchna"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
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
          data-ocid="admin.add_notice.modal"
        >
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Suchna ka Title"
            style={inputStyle}
            data-ocid="admin.notice_title.input"
          />
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="Poori suchna yahan likho"
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            data-ocid="admin.notice_body.textarea"
          />
          <button
            type="submit"
            disabled={addNotice.isPending}
            style={{
              background: "#1a7a3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "9px 0",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            data-ocid="admin.notice.submit_button"
          >
            {addNotice.isPending ? "Save ho raha hai..." : "Suchna Add karo"}
          </button>
        </form>
      )}

      {editingNotice && (
        <form
          onSubmit={handleUpdate}
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
          data-ocid="admin.edit_notice.modal"
        >
          <div
            style={{ fontSize: "12px", fontWeight: "bold", color: "#1a7a3c" }}
          >
            Suchna Edit karo
          </div>
          <input
            type="text"
            value={editingNotice.title}
            onChange={(e) =>
              setEditingNotice({ ...editingNotice, title: e.target.value })
            }
            placeholder="Title"
            style={inputStyle}
            data-ocid="admin.edit_notice_title.input"
          />
          <textarea
            value={editingNotice.body}
            onChange={(e) =>
              setEditingNotice({ ...editingNotice, body: e.target.value })
            }
            rows={3}
            style={{ ...inputStyle, resize: "vertical" }}
            data-ocid="admin.edit_notice_body.textarea"
          />
          <div style={{ display: "flex", gap: "8px" }}>
            <button
              type="submit"
              disabled={updateNotice.isPending}
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
              data-ocid="admin.edit_notice.save_button"
            >
              {updateNotice.isPending ? "Save ho raha hai..." : "Save karo"}
            </button>
            <button
              type="button"
              onClick={() => setEditingNotice(null)}
              style={{
                background: "#f5f5f5",
                color: "#555",
                border: "none",
                borderRadius: "6px",
                padding: "9px 14px",
                fontSize: "13px",
                cursor: "pointer",
              }}
              data-ocid="admin.edit_notice.cancel_button"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {isLoading ? (
        <div
          style={{ color: "#888", fontSize: "13px" }}
          data-ocid="admin.notices.loading_state"
        >
          Loading...
        </div>
      ) : notices.length === 0 ? (
        <div
          style={{ color: "#888", fontSize: "13px" }}
          data-ocid="admin.notices.empty_state"
        >
          Koi suchna nahi.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {notices.map((notice, i) => (
            <div
              key={String(notice.id)}
              style={{
                border: "1px solid #c8e6c9",
                borderRadius: "6px",
                padding: "10px 12px",
                background: "white",
              }}
              data-ocid={`admin.notice.item.${i + 1}`}
            >
              <div
                style={{
                  fontWeight: "bold",
                  fontSize: "13px",
                  color: "#1a7a3c",
                  marginBottom: "3px",
                }}
              >
                {notice.title}
              </div>
              <div
                style={{ fontSize: "12px", color: "#555", marginBottom: "8px" }}
              >
                {notice.body}
              </div>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() =>
                    setEditingNotice({
                      id: notice.id,
                      title: notice.title,
                      body: notice.body,
                    })
                  }
                  style={{
                    background: "#e8f5e9",
                    color: "#1a7a3c",
                    border: "none",
                    borderRadius: "5px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                  data-ocid={`admin.notice.edit_button.${i + 1}`}
                >
                  ✏️ Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(notice.id)}
                  disabled={deleteNotice.isPending}
                  style={{
                    background: "#ffebee",
                    color: "#c0392b",
                    border: "none",
                    borderRadius: "5px",
                    padding: "4px 10px",
                    fontSize: "11px",
                    cursor: "pointer",
                  }}
                  data-ocid={`admin.notice.delete_button.${i + 1}`}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function CommitteeManagementPanel({ adminPin }: { adminPin: string }) {
  const { data: members = [], isLoading } = useCommitteeMembers();
  const addMember = useAddCommitteeMember();
  const deleteMemberMutation = useDeleteCommitteeMember();

  const [showAddForm, setShowAddForm] = useState(false);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");

  const inputStyle = {
    padding: "8px 10px",
    border: "1px solid #c8e6c9",
    borderRadius: "6px",
    fontSize: "13px",
    width: "100%",
    boxSizing: "border-box" as const,
  };

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const result = await addMember.mutateAsync({
      pin: adminPin,
      name: name.trim(),
      role: role.trim(),
      phone: phone.trim(),
    });
    if (result !== null) {
      setName("");
      setRole("");
      setPhone("");
      setShowAddForm(false);
    }
  }

  async function handleDelete(id: bigint) {
    if (!confirm("Yeh member delete karna hai?")) return;
    await deleteMemberMutation.mutateAsync({ pin: adminPin, id });
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div style={{ fontWeight: "bold", fontSize: "14px", color: "#1a7a3c" }}>
          Committee Manage karo
        </div>
        <button
          type="button"
          onClick={() => setShowAddForm(!showAddForm)}
          style={{
            background: showAddForm ? "#f5f5f5" : "#1a7a3c",
            color: showAddForm ? "#555" : "white",
            border: "none",
            borderRadius: "6px",
            padding: "6px 12px",
            fontSize: "12px",
            fontWeight: "bold",
            cursor: "pointer",
          }}
          data-ocid="admin.add_member.open_modal_button"
        >
          {showAddForm ? "Cancel" : "+ Naya Sadasy"}
        </button>
      </div>

      {showAddForm && (
        <form
          onSubmit={handleAdd}
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
          data-ocid="admin.add_member.modal"
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Naam"
            style={inputStyle}
            data-ocid="admin.member_name.input"
          />
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Role"
            style={inputStyle}
            data-ocid="admin.member_role.input"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
            style={inputStyle}
            data-ocid="admin.member_phone.input"
          />
          <button
            type="submit"
            disabled={addMember.isPending}
            style={{
              background: "#1a7a3c",
              color: "white",
              border: "none",
              borderRadius: "6px",
              padding: "9px 0",
              fontSize: "13px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
            data-ocid="admin.add_member.submit_button"
          >
            {addMember.isPending ? "Save ho raha hai..." : "Save karo"}
          </button>
        </form>
      )}

      {isLoading ? (
        <div
          style={{ color: "#888", fontSize: "13px" }}
          data-ocid="admin.committee.loading_state"
        >
          Loading...
        </div>
      ) : members.length === 0 ? (
        <div
          style={{ color: "#888", fontSize: "13px" }}
          data-ocid="admin.committee.empty_state"
        >
          Koi member nahi.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {members.map((member, i) => (
            <div
              key={String(member.id)}
              style={{
                border: "1px solid #c8e6c9",
                borderRadius: "6px",
                padding: "10px 12px",
                background: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "10px",
              }}
              data-ocid={`admin.member.item.${i + 1}`}
            >
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
                <div style={{ fontSize: "12px", color: "#555" }}>
                  {member.phone}
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(member.id)}
                disabled={deleteMemberMutation.isPending}
                style={{
                  background: "#ffebee",
                  color: "#c0392b",
                  border: "none",
                  borderRadius: "5px",
                  padding: "5px 10px",
                  fontSize: "11px",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
                data-ocid={`admin.member.delete_button.${i + 1}`}
              >
                🗑️ Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
