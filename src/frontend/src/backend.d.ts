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
    title: string;
    date: string;
    message: string;
}
export interface PrayerTime {
    name: string;
    time: string;
    enable: boolean;
}
export interface CommitteeMember {
    id: bigint;
    name: string;
    role: string;
    phoneNumber: string;
}
export interface backendInterface {
    addAnnouncement(pin: string, title: string, message: string, date: string): Promise<boolean>;
    addCommitteeMember(pin: string, name: string, role: string, phoneNumber: string): Promise<boolean>;
    deleteAnnouncement(pin: string, id: bigint): Promise<boolean>;
    deleteCommitteeMember(pin: string, id: bigint): Promise<boolean>;
    getAllPrayerTimes(): Promise<Array<PrayerTime>>;
    getAnnouncement(id: bigint): Promise<Announcement | null>;
    getAnnouncements(): Promise<Array<Announcement>>;
    getCommitteeMembers(): Promise<Array<CommitteeMember>>;
    getPrayerTime(prayerName: string): Promise<PrayerTime | null>;
    getSortedPrayerTimes(): Promise<Array<PrayerTime>>;
    togglePrayerTime(pin: string, prayerName: string, enable: boolean): Promise<boolean>;
    updateMultiplePrayerTimes(pin: string, newTimes: Array<[string, string]>): Promise<boolean>;
    updatePrayerTime(pin: string, prayerTime: PrayerTime): Promise<boolean>;
}
