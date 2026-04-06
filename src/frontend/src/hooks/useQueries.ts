import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { CommitteeMember, Notice, PrayerTime } from "../backend.d";
import { useActor } from "./useActor";

export function usePrayerTimes() {
  const { actor, isFetching } = useActor();
  return useQuery<PrayerTime[]>({
    queryKey: ["prayerTimes"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPrayerTimesByOrder();
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
      name,
      time,
      isJuma,
      order,
    }: {
      pin: string;
      name: string;
      time: string;
      isJuma: boolean;
      order: bigint;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updatePrayerTime(pin, name, time, isJuma, order);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["prayerTimes"] }),
  });
}

export function useNotices() {
  const { actor, isFetching } = useActor();
  return useQuery<Notice[]>({
    queryKey: ["notices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllNotices();
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 2,
  });
}

export function useAddNotice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
      title,
      body,
    }: { pin: string; title: string; body: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addNotice(pin, title, body);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useUpdateNotice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
      id,
      title,
      body,
    }: { pin: string; id: bigint; title: string; body: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateNotice(pin, id, title, body);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useDeleteNotice() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ pin, id }: { pin: string; id: bigint }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.deleteNotice(pin, id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notices"] }),
  });
}

export function useCommitteeMembers() {
  const { actor, isFetching } = useActor();
  return useQuery<CommitteeMember[]>({
    queryKey: ["committeeMembers"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllCommitteeMembers();
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
      phone,
    }: { pin: string; name: string; role: string; phone: string }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.addCommitteeMember(pin, name, role, phone);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["committeeMembers"] }),
  });
}

export function useUpdateCommitteeMember() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      pin,
      id,
      name,
      role,
      phone,
    }: {
      pin: string;
      id: bigint;
      name: string;
      role: string;
      phone: string;
    }) => {
      if (!actor) throw new Error("Actor not ready");
      return actor.updateCommitteeMember(pin, id, name, role, phone);
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
