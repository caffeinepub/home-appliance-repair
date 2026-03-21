import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApplianceType, BookingStatus, UserRole } from "../backend";
import { useActor } from "./useActor";

export { ApplianceType, BookingStatus, UserRole };

export function useUserRole() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["userRole"],
    queryFn: async () => {
      if (!actor) return UserRole.guest;
      return actor.getCallerUserRole();
    },
    enabled: !!actor && !isFetching,
    staleTime: 30_000,
  });
}

export function useMyBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["myBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getMyBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAllBookings() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["allBookings"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllBookings();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      appliance: ApplianceType;
      issueDescription: string;
      preferredDateTime: bigint;
      contactPhone: string;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.createBooking(data);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myBookings"] }),
  });
}

export function useCancelMyBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.cancelBooking(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["myBookings"] }),
  });
}

export function useUpdateStatus() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: { id: bigint; status: BookingStatus }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateStatus(id, status);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allBookings"] }),
  });
}

export function useAdminCancelBooking() {
  const { actor } = useActor();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.adminCancelBooking(id);
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["allBookings"] }),
  });
}
