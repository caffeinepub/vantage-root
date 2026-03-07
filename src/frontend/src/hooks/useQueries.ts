import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BalconySize,
  StylePreference,
  SunlightExposure,
} from "../backend.d";
import { useActor } from "./useActor";

export function useIsCallerAdmin() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["isCallerAdmin"],
    queryFn: async () => {
      if (!actor) return false;
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetAllConsultationRequests() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["consultationRequests"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllConsultationRequests();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetConsultationRequestCount() {
  const { actor, isFetching } = useActor();
  return useQuery({
    queryKey: ["consultationRequestCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getConsultationRequestCount();
    },
    enabled: !!actor && !isFetching,
  });
}

export interface ConsultationFormData {
  name: string;
  email: string;
  phone: string | null;
  balconySize: BalconySize;
  sunlightExposure: SunlightExposure;
  stylePreference: StylePreference;
  message: string;
}

export function useSubmitConsultationRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ConsultationFormData) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitConsultationRequest(
        data.name,
        data.email,
        data.phone,
        data.balconySize,
        data.sunlightExposure,
        data.stylePreference,
        data.message,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultationRequests"] });
      queryClient.invalidateQueries({ queryKey: ["consultationRequestCount"] });
    },
  });
}
