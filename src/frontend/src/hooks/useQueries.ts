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
      return actor.getPrayerTimes();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdatePrayerTimes() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (times: Array<[string, string]>) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateMultiplePrayerTimes("786", times);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["prayerTimes"] });
      window.dispatchEvent(new Event("prayerTimesUpdated"));
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
      return actor.getAnnouncementsSortedByTime();
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
      title,
      body,
    }: {
      title: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addAnnouncement("786", title, body);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useDeleteAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteAnnouncement("786", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["announcements"] }),
  });
}

export function useEditAnnouncement() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      title,
      body,
    }: {
      id: bigint;
      title: string;
      body: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.editAnnouncement("786", id, title, body);
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
      name,
      role,
      phoneNumber,
    }: {
      name: string;
      role: string;
      phoneNumber: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCommitteeMember("786", name, role, phoneNumber);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["committeeMembers"] }),
  });
}

export function useDeleteCommitteeMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteCommitteeMember("786", id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["committeeMembers"] }),
  });
}

export function useEditCommitteeMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      name,
      role,
      phoneNumber,
    }: {
      id: bigint;
      name: string;
      role: string;
      phoneNumber: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.editCommitteeMember("786", id, name, role, phoneNumber);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["committeeMembers"] }),
  });
}
