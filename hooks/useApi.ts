// hooks/useApi.ts
import {
  useMutation,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryResult,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import {
  authService,
  boxService,
  infoService,
  trackingService,
} from "../api/services";
import type { PaginatedResponse } from "../types/common";
import type {
  AuthResponse,
  BoxAssignTrackingParams,
  BoxDetailDTO,
  BoxDTO,
  InfoDTO,
  OneCDTO,
  TrackingDTO,
  UserDTO
} from "../types/data";
import type { PaginationParams, TrackingSearchParam } from "../types/params";

// Query Keys
export const QUERY_KEYS = {
  USERS: "users",
  USER: "user",
  TRACKINGS: "trackings",
  TRACKING: "tracking",
  BOXES: "boxes",
  BOX: "box",
  ONE_C: "1C",
  USER_INFO: "userInfo",
} as const;

// AUTH HOOKS - matching your Vue.js pattern
export const useLogin = (): UseMutationResult<
  AuthResponse,
  AxiosError,
  UserDTO
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: UserDTO) => {
      const response = await authService.login(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      // Handle successful login
      console.log("Login successful:", data);
      // The cookie will be set automatically by the server
    },
    onError: (error) => {
      console.error("Login error:", error);
    },
  });
};

export const useInfo = (): UseQueryResult<InfoDTO, AxiosError> => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER_INFO],
    queryFn: async () => {
      const response = await infoService.getLocalUserInfo();
      return response.data;
    },
    enabled: false,
  });
};

// TRACKING HOOKS
export const useTrackings = (
  params?: TrackingSearchParam & PaginationParams
): UseQueryResult<PaginatedResponse<TrackingDTO[]>, AxiosError> => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRACKINGS, params],
    queryFn: async () => {
      const response = await trackingService.getTrackings(params);
      return response.data;
    },
  });
};

export const useTracking = (
  id?: number
): UseQueryResult<TrackingDTO, AxiosError> => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRACKING, id],
    queryFn: async () => {
      if (!id) throw new Error("Tracking ID is required");
      const response = await trackingService.getTrackingById(id);
      return response.data;
    },
    enabled: !!id,
  });
};

export const useTrackingByNumber = (
  trackingNumber?: string
): UseQueryResult<TrackingDTO, AxiosError> => {
  return useQuery({
    queryKey: [QUERY_KEYS.TRACKING, "number", trackingNumber],
    queryFn: async () => {
      if (!trackingNumber) throw new Error("Tracking number is required");
      const response = await trackingService.getTrackingByNumber(
        trackingNumber
      );
      return response.data;
    },
    enabled: !!trackingNumber,
  });
};

export const useCreateTracking = (): UseMutationResult<
  TrackingDTO,
  AxiosError,
  Partial<TrackingDTO>
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trackingData: Partial<TrackingDTO>) => {
      const response = await trackingService.createTracking(trackingData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TRACKINGS] });
    },
  });
};

// BOX HOOKS
export const useBoxes = (
  params?: TrackingSearchParam & PaginationParams
): UseQueryResult<PaginatedResponse<BoxDTO[]>, AxiosError> => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOXES, params],
    queryFn: async () => {
      const response = await boxService.getBoxes(params);
      return response.data;
    },
  });
};

export const useBox = (boxNo: string): UseQueryResult<BoxDTO, AxiosError> => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOX, boxNo],
    queryFn: async () => {
      if (!boxNo) throw new Error("Box ID is required");
      const response = await boxService.getBoxById(boxNo);
      return response.data;
    },
    enabled: false,
  });
};

export const useBoxAssignTracking = (): UseMutationResult<void, AxiosError, BoxAssignTrackingParams> => {
  return useMutation({
    mutationFn: async ({ boxId, trackingNumber, unassign = false }: BoxAssignTrackingParams) => {
      await boxService.assignTracking({ boxId, trackingNumber, unassign });
    },
  });
};

export const useBoxFinished = (): UseMutationResult<void, AxiosError, number> => {
  return useMutation({
    mutationFn: async (boxId: number) => {
      await boxService.activateBox(boxId.toString());
    },
  });
};

export const useGenerateOnce = (): UseMutationResult<OneCDTO, AxiosError, { data: BoxDetailDTO }> => {
  return useMutation({
    mutationFn: async ({ data }) => {
      const response = await boxService.generateOnce(data);
      return response.data;
    },
  });
};

export const useBoxOrTracking = (boxNo: string): UseQueryResult<BoxDetailDTO, AxiosError> => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOX, boxNo],
    queryFn: async () => {
      if (!boxNo) throw new Error("Box ID is required");
      const response = await boxService.getBoxOrTracking(boxNo);
      return response.data;
    },
    enabled: false,
  });
};
