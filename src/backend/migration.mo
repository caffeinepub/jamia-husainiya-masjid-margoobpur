import Map "mo:core/Map";
import Nat "mo:core/Nat";
import List "mo:core/List";
import Text "mo:core/Text";

module {
  // Old Types (previous version)
  type OldPrayerTime = {
    name : Text;
    time : Text;
    enable : Bool;
  };

  type OldAnnouncement = {
    title : Text;
    message : Text;
    date : Text;
  };

  type OldCommitteeMember = {
    id : Nat;
    name : Text;
    role : Text;
    phoneNumber : Text;
  };

  type OldActor = {
    nextAnnouncementId : Nat;
    nextCommitteeMemberId : Nat;
    defaultPrayers : List.List<(Text, OldPrayerTime)>;
    prayerTimes : Map.Map<Text, OldPrayerTime>;
    committeeMembers : Map.Map<Nat, OldCommitteeMember>;
    announcements : Map.Map<Nat, OldAnnouncement>;
  };

  // New Types (current version)
  type NewPrayerTime = {
    name : Text;
    time : Text;
    isJuma : Bool;
    order : Nat;
  };

  type Notice = {
    id : Nat;
    title : Text;
    body : Text;
  };

  type NewCommitteeMember = {
    id : Nat;
    name : Text;
    role : Text;
    phone : Text;
  };

  type NewActor = {
    nextNoticeId : Nat;
    nextCommitteeMemberId : Nat;
    prayerTimes : Map.Map<Text, NewPrayerTime>;
    notices : Map.Map<Nat, Notice>;
    committeeMembers : Map.Map<Nat, NewCommitteeMember>;
  };

  public func run(old : OldActor) : NewActor {
    // Migrate Prayer Times to new format
    let migratedPrayerTimes = old.prayerTimes.map<Text, OldPrayerTime, NewPrayerTime>(
      func(_name, oldPrayerTime) {
        var isJuma : Bool = false;
        var order : Nat = 0;
        switch (oldPrayerTime.name) {
          case ("KhutbaJuma") {
            isJuma := true;
            order := 6;
          };
          case ("Fajr") { order := 1 };
          case ("Zuhr") { order := 2 };
          case ("Asr") { order := 3 };
          case ("Maghrib") { order := 4 };
          case ("Isha") { order := 5 };
          case (_) {};
        };

        {
          name = oldPrayerTime.name;
          time = oldPrayerTime.time;
          isJuma;
          order;
        };
      }
    );

    // Migrate Announcements to Notices
    let migratedNotices = old.announcements.map<Nat, OldAnnouncement, Notice>(
      func(_id, oldAnnouncement) {
        {
          id = _id;
          title = oldAnnouncement.title;
          body = oldAnnouncement.message;
        };
      }
    );

    // Migrate Committee Members to new format
    let migratedCommitteeMembers = old.committeeMembers.map<Nat, OldCommitteeMember, NewCommitteeMember>(
      func(_id, oldMember) {
        {
          id = oldMember.id;
          name = oldMember.name;
          role = oldMember.role;
          phone = oldMember.phoneNumber;
        };
      }
    );

    {
      nextNoticeId = old.nextAnnouncementId;
      nextCommitteeMemberId = old.nextCommitteeMemberId;
      prayerTimes = migratedPrayerTimes;
      notices = migratedNotices;
      committeeMembers = migratedCommitteeMembers;
    };
  };
};
