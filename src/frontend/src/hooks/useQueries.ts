import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Announcement, CommitteeMember, PrayerTime } from "../backend.d";
import { useActor } from "./useActor";

// ---------- Prayer Times ----------
export function usePrayerTimes() {
  const { actor, isFetching } = useActor();
  return useQuery<PrayerTime[]>({
    queryKey: ["prayerTimes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPrayerTimes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePrayerTime() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
      prayerTime,
    }: { pin: string; prayerTime: PrayerTime }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePrayerTime(pin, prayerTime);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prayerTimes"] });
    },
  });
}

export function useUpdateMultiplePrayerTimes() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
      times,
    }: { pin: string; times: Array<[string, string]> }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateMultiplePrayerTimes(pin, times);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prayerTimes"] });
    },
  });
}

// ---------- Announcements ----------
export function useAnnouncements() {
  const { actor, isFetching } = useActor();
  return useQuery<Announcement[]>({
    queryKey: ["announcements"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAnnouncements();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
      title,
      message,
      date,
    }: {
      pin: string;
      title: string;
      message: string;
      date: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addAnnouncement(pin, title, message, date);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ pin, id }: { pin: string; id: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteAnnouncement(pin, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

// ---------- Committee Members ----------
export function useCommitteeMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<CommitteeMember[]>({
    queryKey: ["committeeMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCommitteeMembers();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAddCommitteeMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
      name,
      role,
      phoneNumber,
    }: {
      pin: string;
      name: string;
      role: string;
      phoneNumber: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCommitteeMember(pin, name, role, phoneNumber);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["committeeMembers"] }),
  });
}

export function useDeleteCommitteeMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ pin, id }: { pin: string; id: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCommitteeMember(pin, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["committeeMembers"] }),
  });
}
