import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Time "mo:core/Time";

module {
  type PrayerTime = {
    name : Text;
    time : Text;
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

  type Actor = {
    nextAnnouncementId : Nat;
    nextCommitteeMemberId : Nat;
    prayerTimes : Map.Map<Text, PrayerTime>;
    announcements : Map.Map<Nat, Announcement>;
    committeeMembers : Map.Map<Nat, CommitteeMember>;
  };

  public func run(_ : {}) : Actor {
    {
      nextAnnouncementId = 1;
      nextCommitteeMemberId = 1;
      prayerTimes = Map.empty<Text, PrayerTime>();
      announcements = Map.empty<Nat, Announcement>();
      committeeMembers = Map.empty<Nat, CommitteeMember>();
    };
  };
};
