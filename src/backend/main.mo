import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Migration "migration";

// Adhere to safe persistent actor pattern MOR (Map-only Runtime) <https://internetcomputer.org/docs/current/motoko/main/core/actor-lifecycle#persistent-actors-patterns>
// Mark with-clause as first top-level element of actor <https://internetcomputer.org/docs/current/motoko/experimental-features/with-clause#with-clause-placement>
(with migration = Migration.run)
actor {
  let adminPin = "786";
  var nextNoticeId = 1;
  var nextCommitteeMemberId = 1;

  type PrayerTime = {
    name : Text; // e.g. "Fajr", "Dhuhr"
    time : Text; // e.g. "05:00 AM"
    isJuma : Bool;
    order : Nat;
  };

  type Notice = {
    id : Nat;
    title : Text;
    body : Text;
  };

  type CommitteeMember = {
    id : Nat;
    name : Text;
    role : Text;
    phone : Text;
  };

  // Prayer times (name => PrayerTime)
  let prayerTimes = Map.empty<Text, PrayerTime>();
  // Notices (id => Notice)
  let notices = Map.empty<Nat, Notice>();
  // Committee members (id => CommitteeMember)
  let committeeMembers = Map.empty<Nat, CommitteeMember>();

  // Initialize default prayer times
  func initializeDefaultPrayerTimes() {
    let defaultTimes = [
      { name = "Fajr"; time = "5:41"; isJuma = false; order = 1 },
      { name = "Zuhr"; time = "1:30"; isJuma = false; order = 2 },
      { name = "Asr"; time = "5:00"; isJuma = false; order = 3 },
      { name = "Maghrib"; time = "6:45"; isJuma = false; order = 4 },
      { name = "Isha"; time = "8:30"; isJuma = false; order = 5 },
      { name = "KhutbaJuma"; time = "1:30"; isJuma = true; order = 6 },
    ];

    for (prayer in defaultTimes.values()) {
      prayerTimes.add(prayer.name, prayer);
    };
  };

  // Call initialization during canister deployment
  initializeDefaultPrayerTimes();

  // Helper function to compare prayer times by order
  func comparePrayerTimesByOrder(a : PrayerTime, b : PrayerTime) : Order.Order {
    Nat.compare(a.order, b.order);
  };

  // Helper function to compare prayer times by name
  func comparePrayerTimesByName(a : PrayerTime, b : PrayerTime) : Order.Order {
    Text.compare(a.name, b.name);
  };

  // Helper function to check admin PIN
  func verifyAdmin(pin : Text) : Bool {
    pin == adminPin;
  };

  // --- Prayer Times Management ---

  // Get all prayer times (sorted by order)
  public query ({ caller }) func getAllPrayerTimes() : async [PrayerTime] {
    prayerTimes.values().toArray();
  };

  public query ({ caller }) func getPrayerTimesByOrder() : async [PrayerTime] {
    let timesArray = prayerTimes.values().toArray();
    timesArray;
  };

  public query ({ caller }) func getPrayerTimesByName() : async [PrayerTime] {
    let timesArray = prayerTimes.values().toArray();
    timesArray;
  };

  // Get single prayer time by name
  public query ({ caller }) func getPrayerTime(name : Text) : async ?PrayerTime {
    prayerTimes.get(name);
  };

  // Admin functions to update prayer time
  public shared ({ caller }) func updatePrayerTime(pin : Text, name : Text, time : Text, isJuma : Bool, order : Nat) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };

    let newPrayerTime : PrayerTime = {
      name;
      time;
      isJuma;
      order;
    };

    prayerTimes.add(name, newPrayerTime);
    true;
  };

  // Bulk update prayer times
  public shared ({ caller }) func updateMultiplePrayerTimes(pin : Text, updates : [(Text, Text)]) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };

    for ((name, time) in updates.values()) {
      switch (prayerTimes.get(name)) {
        case (null) {};
        case (?existing) {
          let updated : PrayerTime = { existing with time };
          prayerTimes.add(name, updated);
        };
      };
    };
    true;
  };

  // --- Notices Management ---

  // Get all notices
  public query ({ caller }) func getAllNotices() : async [Notice] {
    notices.values().toArray();
  };

  // Get single notice by id
  public query ({ caller }) func getNotice(id : Nat) : async ?Notice {
    notices.get(id);
  };

  // Admin: add new notice
  public shared ({ caller }) func addNotice(pin : Text, title : Text, body : Text) : async ?Nat {
    if (not verifyAdmin(pin)) {
      return null;
    };

    let id = nextNoticeId;
    let newNotice : Notice = {
      id;
      title;
      body;
    };

    notices.add(id, newNotice);
    nextNoticeId += 1;
    ?id;
  };

  // Admin: update notice
  public shared ({ caller }) func updateNotice(pin : Text, id : Nat, title : Text, body : Text) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };

    switch (notices.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated : Notice = {
          id;
          title;
          body;
        };
        notices.add(id, updated);
        true;
      };
    };
  };

  // Admin: delete notice
  public shared ({ caller }) func deleteNotice(pin : Text, id : Nat) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    if (notices.containsKey(id)) {
      notices.remove(id);
      true;
    } else {
      false;
    };
  };

  // --- Committee Members Management ---

  // Get all committee members
  public query ({ caller }) func getAllCommitteeMembers() : async [CommitteeMember] {
    committeeMembers.values().toArray();
  };

  // Get single committee member by id
  public query ({ caller }) func getCommitteeMember(id : Nat) : async ?CommitteeMember {
    committeeMembers.get(id);
  };

  // Admin: add new committee member
  public shared ({ caller }) func addCommitteeMember(pin : Text, name : Text, role : Text, phone : Text) : async ?Nat {
    if (not verifyAdmin(pin)) {
      return null;
    };

    let id = nextCommitteeMemberId;
    let newMember : CommitteeMember = {
      id;
      name;
      role;
      phone;
    };

    committeeMembers.add(id, newMember);
    nextCommitteeMemberId += 1;
    ?id;
  };

  // Admin: update committee member
  public shared ({ caller }) func updateCommitteeMember(pin : Text, id : Nat, name : Text, role : Text, phone : Text) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };

    switch (committeeMembers.get(id)) {
      case (null) { false };
      case (?existing) {
        let updated : CommitteeMember = {
          id;
          name;
          role;
          phone;
        };
        committeeMembers.add(id, updated);
        true;
      };
    };
  };

  // Admin: delete committee member
  public shared ({ caller }) func deleteCommitteeMember(pin : Text, id : Nat) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    if (committeeMembers.containsKey(id)) {
      committeeMembers.remove(id);
      true;
    } else {
      false;
    };
  };

  // --- Authentication ---

  public shared ({ caller }) func verifyAdminPin(pin : Text) : async Bool {
    verifyAdmin(pin);
  };
};
