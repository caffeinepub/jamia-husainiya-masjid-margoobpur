import Time "mo:core/Time";
import Map "mo:core/Map";
import Text "mo:core/Text";
import List "mo:core/List";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";


// Adhere to safe persistent actor pattern MOR (Map-only Runtime) <https://internetcomputer.org/docs/current/motoko/main/core/actor-lifecycle#persistent-actors-patterns>

// Mark with-clause as first top-level element of actor <https://internetcomputer.org/docs/current/motoko/experimental-features/with-clause#with-clause-placement>

actor {
  let adminPin = "786";
  var nextAnnouncementId = 1;
  var nextCommitteeMemberId = 1;

  type PrayerTime = {
    name : Text; // e.g. "Fajr", "Dhuhr"
    time : Text; // e.g. "05:00 AM"
    enable : Bool;
  };

  type Announcement = {
    title : Text;
    message : Text;
    date : Text;
  };

  type CommitteeMember = {
    id : Nat;
    name : Text;
    role : Text;
    phoneNumber : Text;
  };

  let prayerTimes = Map.empty<Text, PrayerTime>();
  let announcements = Map.empty<Nat, Announcement>();
  let committeeMembers = Map.empty<Nat, CommitteeMember>();

  let defaultPrayers = List.empty<(Text, PrayerTime)>();

  // Initialize default prayer times
  func initializePrayerTimes() {
    prayerTimes.add("Fajr", { name = "Fajr"; time = "05:41"; enable = true });
    prayerTimes.add("Zuhr", { name = "Zuhr"; time = "1:30"; enable = true });
    prayerTimes.add("Asr", { name = "Asr"; time = "5:00"; enable = true });
    prayerTimes.add("Maghrib", { name = "Maghrib"; time = "6:45"; enable = true });
    prayerTimes.add("Isha", { name = "Isha"; time = "8:30"; enable = true });
    prayerTimes.add("KhutbaJuma", { name = "KhutbaJuma"; time = "1:30"; enable = true });
  };

  // Call it during deployment
  initializePrayerTimes();

  // Helper function to compare prayer times by name
  func comparePrayerTimesByName(a : PrayerTime, b : PrayerTime) : Order.Order {
    Text.compare(a.name, b.name);
  };

  // Helper function to check admin PIN
  func verifyAdmin(pin : Text) : Bool {
    if (pin == adminPin) {
      true;
    } else {
      false;
    };
  };

  // Prayer Times CRUD
  public query ({ caller }) func getPrayerTime(prayerName : Text) : async ?PrayerTime {
    prayerTimes.get(prayerName);
  };

  public query ({ caller }) func getAllPrayerTimes() : async [PrayerTime] {
    prayerTimes.values().toArray();
  };

  public query ({ caller }) func getSortedPrayerTimes() : async [PrayerTime] {
    prayerTimes.values().toArray().sort(comparePrayerTimesByName);
  };

  public shared ({ caller }) func updatePrayerTime(pin : Text, prayerTime : PrayerTime) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    prayerTimes.add(prayerTime.name, prayerTime);
    true;
  };

  public shared ({ caller }) func updateMultiplePrayerTimes(pin : Text, newTimes : [(Text, Text)]) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };

    for ((name, time) in newTimes.values()) {
      switch (prayerTimes.get(name)) {
        case (null) {};
        case (?existingTime) {
          prayerTimes.add(name, { existingTime with time });
        };
      };
    };
    true;
  };

  public shared ({ caller }) func togglePrayerTime(pin : Text, prayerName : Text, enable : Bool) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    switch (prayerTimes.get(prayerName)) {
      case (null) { false };
      case (?prayerTime) {
        prayerTimes.add(prayerName, { prayerTime with enable });
        true;
      };
    };
  };

  // Announcements CRUD
  public query ({ caller }) func getAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  public query ({ caller }) func getAnnouncement(id : Nat) : async ?Announcement {
    announcements.get(id);
  };

  public shared ({ caller }) func addAnnouncement(pin : Text, title : Text, message : Text, date : Text) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };

    let announcement = {
      title;
      message;
      date;
    };
    announcements.add(nextAnnouncementId, announcement);
    nextAnnouncementId += 1;
    true;
  };

  public shared ({ caller }) func deleteAnnouncement(pin : Text, id : Nat) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    let existed = announcements.containsKey(id);
    announcements.remove(id);
    existed;
  };

  // Committee Members CRUD
  public query ({ caller }) func getCommitteeMembers() : async [CommitteeMember] {
    committeeMembers.values().toArray();
  };

  public shared ({ caller }) func addCommitteeMember(pin : Text, name : Text, role : Text, phoneNumber : Text) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    let id = nextCommitteeMemberId;
    nextCommitteeMemberId += 1;
    let member = {
      id;
      name;
      role;
      phoneNumber;
    };
    committeeMembers.add(id, member);
    true;
  };

  public shared ({ caller }) func deleteCommitteeMember(pin : Text, id : Nat) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    let existed = committeeMembers.containsKey(id);
    committeeMembers.remove(id);
    existed;
  };
};
