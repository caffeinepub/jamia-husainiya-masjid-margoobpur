import Time "mo:core/Time";
import Map "mo:core/Map";
import List "mo:core/List";
import Text "mo:core/Text";
import Iter "mo:core/Iter";
import Nat "mo:core/Nat";
import Order "mo:core/Order";
import Migration "migration";

// Adhere to safe persistent actor pattern MOR (Map-only Runtime) <https://internetcomputer.org/docs/current/motoko/main/core/actor-lifecycle#persistent-actors-patterns>
(with migration = Migration.run)
actor {
  let adminPin = "786";
  var nextAnnouncementId = 1;
  var nextCommitteeMemberId = 1;

  type PrayerTime = {
    name : Text; // e.g. "Fajr", "Dhuhr"
    time : Text; // e.g. "05:00 AM"
  };

  type Announcement = {
    id : Nat;
    title : Text;
    body : Text;
    timestamp : Time.Time;
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

  // Initialize default prayer times
  let defaultPrayers = List.empty<(Text, PrayerTime)>();
  defaultPrayers.add(("Fajr", { name = "Fajr"; time = "05:00 AM" }));
  defaultPrayers.add(("Dhuhr", { name = "Dhuhr"; time = "01:00 PM" }));
  defaultPrayers.add(("Asr", { name = "Asr"; time = "04:30 PM" }));
  defaultPrayers.add(("Maghrib", { name = "Maghrib"; time = "07:00 PM" }));
  defaultPrayers.add(("Isha", { name = "Isha"; time = "08:30 PM" }));

  for (p in defaultPrayers.values()) {
    prayerTimes.add(p.0, p.1);
  };

  // Helper function to check admin PIN
  func verifyAdmin(pin : Text) : Bool {
    if (pin == adminPin) {
      true;
    } else {
      false;
    };
  };

  /* Prayer Times */

  public query ({ caller }) func getPrayerTimes() : async [PrayerTime] {
    prayerTimes.values().toArray();
  };

  public shared ({ caller }) func updatePrayerTime(
    pin : Text,
    name : Text,
    time : Text,
  ) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    let newPrayerTime = { name; time };
    prayerTimes.add(name, newPrayerTime);
    true;
  };

  public shared ({ caller }) func updateMultiplePrayerTimes(
    pin : Text,
    times : [(Text, Text)],
  ) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    for ((name, time) in times.values()) {
      let newPrayerTime = { name; time };
      prayerTimes.add(name, newPrayerTime);
    };
    true;
  };

  /* Announcements */

  public query ({ caller }) func getAnnouncements() : async [Announcement] {
    announcements.values().toArray();
  };

  public shared ({ caller }) func addAnnouncement(
    pin : Text,
    title : Text,
    body : Text,
  ) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    let id = nextAnnouncementId;
    nextAnnouncementId += 1;
    let announcement = {
      id;
      title;
      body;
      timestamp = Time.now();
    };
    announcements.add(id, announcement);
    true;
  };

  public shared ({ caller }) func editAnnouncement(
    pin : Text,
    id : Nat,
    title : Text,
    body : Text,
  ) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    switch (announcements.get(id)) {
      case (null) { false };
      case (?announcement) {
        let updatedAnnouncement = {
          announcement with
          title;
          body;
          timestamp = Time.now();
        };
        announcements.add(id, updatedAnnouncement);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteAnnouncement(
    pin : Text,
    id : Nat,
  ) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    let existed = announcements.containsKey(id);
    announcements.remove(id);
    existed;
  };

  /* Committee Members */

  public query ({ caller }) func getCommitteeMembers() : async [CommitteeMember] {
    committeeMembers.values().toArray();
  };

  public shared ({ caller }) func addCommitteeMember(
    pin : Text,
    name : Text,
    role : Text,
    phoneNumber : Text,
  ) : async Bool {
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

  public shared ({ caller }) func editCommitteeMember(
    pin : Text,
    id : Nat,
    name : Text,
    role : Text,
    phoneNumber : Text,
  ) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    switch (committeeMembers.get(id)) {
      case (null) { false };
      case (?member) {
        let updatedMember = {
          id;
          name;
          role;
          phoneNumber;
        };
        committeeMembers.add(id, updatedMember);
        true;
      };
    };
  };

  public shared ({ caller }) func deleteCommitteeMember(
    pin : Text,
    id : Nat,
  ) : async Bool {
    if (not verifyAdmin(pin)) {
      return false;
    };
    let existed = committeeMembers.containsKey(id);
    committeeMembers.remove(id);
    existed;
  };

  /* Helper methods for in-place sorting after data retrieval */

  func comparePrayerTimes(a : PrayerTime, b : PrayerTime) : Order.Order {
    Text.compare(a.name, b.name);
  };

  func compareAnnouncementsByTime(a : Announcement, b : Announcement) : Order.Order {
    if (a.timestamp < b.timestamp) { return #greater };
    if (a.timestamp > b.timestamp) { return #less };
    #equal;
  };

  func compareMembersByRole(a : CommitteeMember, b : CommitteeMember) : Order.Order {
    Text.compare(a.role, b.role);
  };

  /* Sorted Query Methods */

  public query ({ caller }) func getPrayerTimesSorted() : async [PrayerTime] {
    prayerTimes.values().toArray().sort(comparePrayerTimes);
  };

  public query ({ caller }) func getAnnouncementsSortedByTime() : async [Announcement] {
    announcements.values().toArray().sort(compareAnnouncementsByTime);
  };

  public query ({ caller }) func getCommitteeMembersSortedByRole() : async [CommitteeMember] {
    committeeMembers.values().toArray().sort(compareMembersByRole);
  };
};
