import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BalconySize,
  Priority,
  StylePreference,
  SunlightExposure,
  VendorApplicationStatus,
} from "../backend.d";
import type { Status } from "../backend.d";
import { useActor } from "./useActor";

const SESSION_KEY = "plantly_admin_session";

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

export function useDeleteConsultationRequest() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteConsultationRequest(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultationRequests"] });
      queryClient.invalidateQueries({ queryKey: ["consultationRequestCount"] });
    },
  });
}

export function useUpdateRequestPriority() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      priority,
    }: { id: bigint; priority: Priority }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRequestPriority(id, priority);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultationRequests"] });
    },
  });
}

export function useUpdateRequestStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: bigint; status: Status }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateRequestStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["consultationRequests"] });
    },
  });
}

// ─── Vendor Application Hooks ────────────────────────────────────────────────

export function useGetAllVendorApplications() {
  const { actor, isFetching } = useActor();
  const isLoggedIn = !!localStorage.getItem(SESSION_KEY);
  return useQuery({
    queryKey: ["vendorApplications"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllVendorApplications();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });
}

export function useGetVendorApplicationCount() {
  const { actor, isFetching } = useActor();
  const isLoggedIn = !!localStorage.getItem(SESSION_KEY);
  return useQuery({
    queryKey: ["vendorApplicationCount"],
    queryFn: async () => {
      if (!actor) return BigInt(0);
      return actor.getVendorApplicationCount();
    },
    enabled: !!actor && !isFetching && isLoggedIn,
  });
}

export function useUpdateVendorApplicationStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: bigint;
      status: VendorApplicationStatus;
    }) => {
      if (!actor) throw new Error("Not connected");
      return actor.updateVendorApplicationStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorApplications"] });
    },
  });
}

export function useDeleteVendorApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) throw new Error("Not connected");
      return actor.deleteVendorApplication(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorApplications"] });
      queryClient.invalidateQueries({ queryKey: ["vendorApplicationCount"] });
    },
  });
}

export interface VendorApplicationFormData {
  businessName: string;
  businessType: string;
  yearsInBusiness: string;
  businessDescription: string;
  ownerName: string;
  email: string;
  phone: string;
  addressLine: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  productTypes: string;
  categories: string;
  approxProducts: string;
  gstNumber: string;
  offersShipping: boolean;
  offersLocalDelivery: boolean;
  serviceableAreas: string;
}

export function useSubmitVendorApplication() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: VendorApplicationFormData) => {
      if (!actor) throw new Error("Not connected");
      return actor.submitVendorApplication(
        data.businessName,
        data.businessType,
        data.yearsInBusiness,
        data.businessDescription,
        data.ownerName,
        data.email,
        data.phone,
        data.addressLine,
        data.city,
        data.state,
        data.country,
        data.pincode,
        data.productTypes,
        data.categories,
        data.approxProducts,
        data.gstNumber,
        data.offersShipping,
        data.offersLocalDelivery,
        data.serviceableAreas,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorApplications"] });
      queryClient.invalidateQueries({ queryKey: ["vendorApplicationCount"] });
    },
  });
}
