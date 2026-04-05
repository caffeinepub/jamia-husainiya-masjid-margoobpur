import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Announcement {
    id: bigint;
    title: string;
    body: string;
    timestamp: Time;
}
export interface PrayerTime {
    name: string;
    time: string;
}
export type Time = bigint;
export interface CommitteeMember {
    id: bigint;
    name: string;
    role: string;
    phoneNumber: string;
}
export interface backendInterface {
    addAnnouncement(pin: string, title: string, body: string): Promise<boolean>;
    addCommitteeMember(pin: string, name: string, role: string, phoneNumber: string): Promise<boolean>;
    deleteAnnouncement(pin: string, id: bigint): Promise<boolean>;
    deleteCommitteeMember(pin: string, id: bigint): Promise<boolean>;
    editAnnouncement(pin: string, id: bigint, title: string, body: string): Promise<boolean>;
    editCommitteeMember(pin: string, id: bigint, name: string, role: string, phoneNumber: string): Promise<boolean>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getAnnouncementsSortedByTime(): Promise<Array<Announcement>>;
    getCommitteeMembers(): Promise<Array<CommitteeMember>>;
    getCommitteeMembersSortedByRole(): Promise<Array<CommitteeMember>>;
    getPrayerTimes(): Promise<Array<PrayerTime>>;
    getPrayerTimesSorted(): Promise<Array<PrayerTime>>;
    updateMultiplePrayerTimes(pin: string, times: Array<[string, string]>): Promise<boolean>;
    updatePrayerTime(pin: string, name: string, time: string): Promise<boolean>;
}
