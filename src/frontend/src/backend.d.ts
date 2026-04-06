import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Notice {
    id: bigint;
    title: string;
    body: string;
}
export interface PrayerTime {
    order: bigint;
    name: string;
    time: string;
    isJuma: boolean;
}
export interface CommitteeMember {
    id: bigint;
    name: string;
    role: string;
    phone: string;
}
export interface backendInterface {
    addCommitteeMember(pin: string, name: string, role: string, phone: string): Promise<bigint | null>;
    addNotice(pin: string, title: string, body: string): Promise<bigint | null>;
    deleteCommitteeMember(pin: string, id: bigint): Promise<boolean>;
    deleteNotice(pin: string, id: bigint): Promise<boolean>;
    getAllCommitteeMembers(): Promise<Array<CommitteeMember>>;
    getAllNotices(): Promise<Array<Notice>>;
    getAllPrayerTimes(): Promise<Array<PrayerTime>>;
    getCommitteeMember(id: bigint): Promise<CommitteeMember | null>;
    getNotice(id: bigint): Promise<Notice | null>;
    getPrayerTime(name: string): Promise<PrayerTime | null>;
    getPrayerTimesByName(): Promise<Array<PrayerTime>>;
    getPrayerTimesByOrder(): Promise<Array<PrayerTime>>;
    updateCommitteeMember(pin: string, id: bigint, name: string, role: string, phone: string): Promise<boolean>;
    updateMultiplePrayerTimes(pin: string, updates: Array<[string, string]>): Promise<boolean>;
    updateNotice(pin: string, id: bigint, title: string, body: string): Promise<boolean>;
    updatePrayerTime(pin: string, name: string, time: string, isJuma: boolean, order: bigint): Promise<boolean>;
    verifyAdminPin(pin: string): Promise<boolean>;
}
