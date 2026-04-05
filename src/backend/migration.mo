import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";

module {
  // --- Types for Old Actor ---

  type OldPrayerTime = {
    name : Text;
    time : Text;
  };

  type OldAnnouncement = {
    id : Nat;
    title : Text;
    body : Text;
    timestamp : Time.Time;
  };

  type OldCommitteeMember = {
    id : Nat;
    name : Text;
    role : Text;
    phoneNumber : Text;
  };

  type OldActor = {
    adminPin : Text;
    nextAnnouncementId : Nat;
    nextCommitteeMemberId : Nat;
    prayerTimes : Map.Map<Text, OldPrayerTime>;
    announcements : Map.Map<Nat, OldAnnouncement>;
    committeeMembers : Map.Map<Nat, OldCommitteeMember>;
    defaultPrayers : List.List<(Text, OldPrayerTime)>;
  };

  // --- Types for New Actor ---

  type NewPrayerTime = {
    name : Text;
    time : Text;
    enable : Bool;
  };

  type NewAnnouncement = {
    title : Text;
    message : Text;
    date : Text;
  };

  type NewCommitteeMember = {
    id : Nat;
    name : Text;
    role : Text;
    phoneNumber : Text;
  };

  type NewActor = {
    adminPin : Text;
    nextAnnouncementId : Nat;
    nextCommitteeMemberId : Nat;
    prayerTimes : Map.Map<Text, NewPrayerTime>;
    announcements : Map.Map<Nat, NewAnnouncement>;
    committeeMembers : Map.Map<Nat, NewCommitteeMember>;
  };

  // --- Migration Function ---

  public func run(old : OldActor) : NewActor {
    // Migrate prayer times with default enable = true
    let newPrayerTimes = old.prayerTimes.map<Text, OldPrayerTime, NewPrayerTime>(
      func(_name, oldTime) {
        {
          oldTime with
          enable = true;
        };
      }
    );

    // Migrate announcements, default date to empty string (should be updated by frontend)
    let newAnnouncements = old.announcements.map<Nat, OldAnnouncement, NewAnnouncement>(
      func(_id, oldAnn) {
        {
          title = oldAnn.title;
          message = oldAnn.body;
          date = ""; // No date in old version
        };
      }
    );

    // Committee members remain unchanged
    {
      old with
      prayerTimes = newPrayerTimes;
      announcements = newAnnouncements;
    };
  };
};
